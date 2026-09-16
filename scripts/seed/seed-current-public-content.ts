/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'node:fs'
import crypto from 'node:crypto'
import path from 'node:path'
import { createRequire } from 'node:module'
import { getPayload } from 'payload'

const require = createRequire(import.meta.url)
const { loadEnvConfig } = require('@next/env') as typeof import('@next/env')
loadEnvConfig(process.cwd())
process.env.PAYLOAD_SEED_MODE = 'true'

const { default: config } = await import('../../payload.config')
const payload = await getPayload({ config })

type Locale = 'en' | 'tm' | 'ru'
const locales: Locale[] = ['en', 'tm', 'ru']
const snapshotPath = path.resolve('scripts/seed/data/current-public-content.json')
const snapshot = JSON.parse(fs.readFileSync(snapshotPath, 'utf8')) as {
  media?: Array<{ filename: string; path: string; mimetype: string; alt: string }>
  collections: Record<string, any[]>
  globals: Record<string, any>
}

const projectRoot = path.resolve('.')
const mediaRoot = path.resolve(projectRoot, 'media')
const mediaIDs = new Map<string, number | string>()

function escapedRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function resolveMedia(value: unknown): unknown {
  if (Array.isArray(value)) return value.map((item) => resolveMedia(item))
  if (!value || typeof value !== 'object') return value

  const record = value as Record<string, unknown>
  if (typeof record.__seedMedia === 'string') {
    const id = mediaIDs.get(record.__seedMedia)
    if (id === undefined) throw new Error(`Media was not imported: ${record.__seedMedia}`)
    return id
  }

  const result: Record<string, unknown> = {}
  for (const [key, child] of Object.entries(record)) result[key] = resolveMedia(child)
  return result
}

async function importMedia() {
  for (const media of snapshot.media ?? []) {
    const filePath = path.resolve(projectRoot, media.path)
    const mediaRootPrefix = `${mediaRoot}${path.sep}`
    if (!filePath.startsWith(mediaRootPrefix) && filePath !== mediaRoot) {
      throw new Error(`Media path is outside the media directory: ${media.path}`)
    }
    if (!fs.existsSync(filePath)) throw new Error(`Media file does not exist: ${filePath}`)

    const data = fs.readFileSync(filePath)
    const sourceHash = crypto.createHash('sha256').update(data).digest('hex')
    const existing = await payload.find({
      collection: 'media',
      limit: 1000,
      overrideAccess: true,
    })

    const extension = path.extname(media.filename)
    const stem = media.filename.slice(0, -extension.length)
    const payloadRenamedFilename = new RegExp(`^${escapedRegExp(stem)}-\\d+${escapedRegExp(extension)}$`, 'i')
    const matchingMedia = existing.docs.find((doc: any) => {
      if (media.alt && doc.alt === media.alt) return true
      if (doc.filename === media.filename || payloadRenamedFilename.test(doc.filename)) return true
      const storedPath = path.resolve(mediaRoot, doc.filename)
      if (!fs.existsSync(storedPath)) return false
      const storedHash = crypto.createHash('sha256').update(fs.readFileSync(storedPath)).digest('hex')
      return storedHash === sourceHash
    })
    if (matchingMedia) {
      mediaIDs.set(media.filename, matchingMedia.id)
      console.log(`[reused] media by content: ${media.filename} -> ${matchingMedia.filename}`)
      continue
    }

    const created = await payload.create({
      collection: 'media',
      data: { alt: media.alt || media.filename },
      filePath,
      overrideAccess: true,
    })
    const normalized = await payload.update({
      collection: 'media',
      id: created.id,
      data: { alt: media.alt || media.filename },
      filePath,
      overwriteExistingFiles: true,
      overrideAccess: true,
    })
    mediaIDs.set(media.filename, normalized.id)
    console.log(`[created] media: ${media.filename}`)
  }
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
  const base = resolveMedia(localize(rawDoc, 'en')) as Record<string, any>
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
      const data = resolveMedia(localize(rawDoc, locale)) as Record<string, any>
      if (relationKey && typeof data[relationKey] === 'string') data[relationKey] = relationMaps[relationKey]?.get(data[relationKey])
      await payload.update({ collection: collection as any, id, locale, data, overrideAccess: true })
    }
    console.log(`[updated] ${collection}: ${base.slug ?? base.title ?? base.name}`)
    return
  }

  const created = await payload.create({ collection: collection as any, locale: 'en', data: base, overrideAccess: true })
  for (const locale of locales.slice(1)) {
    const data = resolveMedia(localize(rawDoc, locale)) as Record<string, any>
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
      const localized = localize(rawGlobal, locale)
      await payload.updateGlobal({ slug: slug as any, locale, data: resolveMedia(localized) as any, overrideAccess: true })
    }
    console.log(`[updated] global: ${slug}`)
  }

  console.log('Current public text/content and referenced media imported.')
}

async function run() {
  try {
    if (process.env.SEED_TARGET !== 'local') {
      throw new Error('Refusing to seed. Set SEED_TARGET=local when targeting a local or disposable database.')
    }
    await importMedia()
    await main()
  } finally {
    const pool = payload.db?.pool
    try {
      await payload.destroy()
    } finally {
      void pool?.end().catch(() => undefined)
    }
  }
}

run().then(() => process.exit(0)).catch((error) => {
  console.error(error)
  process.exit(1)
})
