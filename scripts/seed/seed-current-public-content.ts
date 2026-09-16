/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { getPayload } from 'payload'

const require = createRequire(import.meta.url)
const { loadEnvConfig } = require('@next/env') as typeof import('@next/env')
loadEnvConfig(process.cwd())

const { default: config } = await import('../../payload.config')
const payload = await getPayload({ config })

if (process.env.SEED_TARGET !== 'local') {
  throw new Error('Refusing to seed. Set SEED_TARGET=local when targeting a local or disposable database.')
}

type Locale = 'en' | 'tm' | 'ru'
const locales: Locale[] = ['en', 'tm', 'ru']
const snapshotPath = path.resolve('scripts/seed/data/current-public-content.json')
const snapshot = JSON.parse(fs.readFileSync(snapshotPath, 'utf8')) as {
  collections: Record<string, any[]>
  globals: Record<string, any>
}

function localize(value: unknown, locale: Locale): unknown {
  if (Array.isArray(value)) return value.map((item) => localize(item, locale))
  if (!value || typeof value !== 'object') return value

  const record = value as Record<string, unknown>
  const localizedKeys = ['en', 'tm', 'ru']
  if (localizedKeys.some((key) => key in record)) {
    const selected = record[locale] ?? record.en ?? record.tm ?? record.ru
    return localize(selected, locale)
  }

  const result: Record<string, unknown> = {}
  for (const [key, child] of Object.entries(record)) result[key] = localize(child, locale)
  return result
}

async function findBySlug(collection: string, slug: string | undefined) {
  if (!slug) return null
  const result = await payload.find({
    collection: collection as any,
    locale: 'en',
    limit: 1,
    where: { slug: { equals: slug } },
    overrideAccess: true,
  })
  return result.docs[0] ?? null
}

async function upsertLocalizedCollection(collection: string, rawDoc: any, relationMaps: Record<string, Map<string, number>>) {
  const base = localize(rawDoc, 'en') as Record<string, any>
  const existing = base.slug
    ? await findBySlug(collection, base.slug)
    : (await payload.find({
        collection: collection as any,
        locale: 'en',
        limit: 1,
        where: { title: { equals: base.title } },
        overrideAccess: true,
      })).docs[0] ?? null
  const relationKey = collection === 'products' ? 'category' : collection === 'articles' ? 'category' : collection === 'vacancies' ? 'department' : null
  if (relationKey && typeof base[relationKey] === 'string') {
    base[relationKey] = relationMaps[relationKey]?.get(base[relationKey])
  }

  const id = existing?.id
  if (id) {
    for (const locale of locales) {
      const data = localize(rawDoc, locale) as Record<string, any>
      if (relationKey && typeof data[relationKey] === 'string') data[relationKey] = relationMaps[relationKey]?.get(data[relationKey])
      await payload.update({ collection: collection as any, id, locale, data, overrideAccess: true })
    }
    console.log(`[updated] ${collection}: ${base.slug ?? base.title ?? base.name}`)
    return
  }

  const created = await payload.create({ collection: collection as any, locale: 'en', data: base, overrideAccess: true })
  for (const locale of locales.slice(1)) {
    const data = localize(rawDoc, locale) as Record<string, any>
    if (relationKey && typeof data[relationKey] === 'string') data[relationKey] = relationMaps[relationKey]?.get(data[relationKey])
    await payload.update({ collection: collection as any, id: created.id, locale, data, overrideAccess: true })
  }
  console.log(`[created] ${collection}: ${base.slug ?? base.title ?? base.name}`)
}

async function upsertTaxonomy(collection: string, docs: any[]) {
  const map = new Map<string, number>()
  for (const rawDoc of docs) {
    const base = localize(rawDoc, 'en') as Record<string, any>
    const existing = await findBySlug(collection, base.slug)
    const id = existing?.id ?? (await payload.create({ collection: collection as any, locale: 'en', data: base, overrideAccess: true })).id
    for (const locale of locales) {
      const data = localize(rawDoc, locale) as Record<string, any>
      await payload.update({ collection: collection as any, id, locale, data, overrideAccess: true })
    }
    map.set(base.slug, id as number)
  }
  return map
}

async function main() {
  const relationMaps = {
    category: await upsertTaxonomy('product-categories', snapshot.collections['product-categories'] ?? []),
    department: await upsertTaxonomy('vacancy-departments', snapshot.collections['vacancy-departments'] ?? []),
  }
  const articleCategoryMap = await upsertTaxonomy('article-categories', snapshot.collections['article-categories'] ?? [])
  relationMaps.category = relationMaps.category

  for (const doc of snapshot.collections.products ?? []) await upsertLocalizedCollection('products', doc, relationMaps)
  for (const doc of snapshot.collections.articles ?? []) {
    const relations = { category: articleCategoryMap }
    await upsertLocalizedCollection('articles', doc, relations)
  }
  for (const doc of snapshot.collections.vacancies ?? []) await upsertLocalizedCollection('vacancies', doc, relationMaps)

  for (const [slug, rawGlobal] of Object.entries(snapshot.globals)) {
    for (const locale of locales) {
      await payload.updateGlobal({ slug: slug as any, locale, data: localize(rawGlobal, locale) as any, overrideAccess: true })
    }
    console.log(`[updated] global: ${slug}`)
  }

  console.log('Current public text/content imported. Media was intentionally skipped.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
