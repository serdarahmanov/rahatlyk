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

const outputPath = path.resolve('scripts/seed/data/current-public-content.json')

const mediaKeys = new Set([
  'image', 'images', 'video', 'coverImage', 'poster', 'mobilePoster', 'mobileImage',
  'mobileCoverImage', 'heroVideo', 'mobileHeroVideo', 'backgroundVideo',
  'fullViewportImage', 'leftImage', 'rightImage', 'centerImage', 'bottleImage',
  'mobileBottleImage', 'media', 'siteIcon', 'photo', 'photos', 'parallaxImages',
])

function stripMedia(value: unknown, key?: string): unknown {
  if (key && mediaKeys.has(key)) return undefined
  if (Array.isArray(value)) return value.map((item) => stripMedia(item)).filter((item) => item !== undefined)
  if (!value || typeof value !== 'object') return value

  const result: Record<string, unknown> = {}
  for (const [childKey, childValue] of Object.entries(value)) {
    if (['id', 'createdAt', 'updatedAt', 'globalType', '_status'].includes(childKey)) continue
    const stripped = stripMedia(childValue, childKey)
    if (stripped !== undefined) result[childKey] = stripped
  }
  return result
}

function relationshipSlug(value: unknown): unknown {
  if (!value || typeof value !== 'object') return value
  const record = value as Record<string, unknown>
  return typeof record.slug === 'string' ? record.slug : value
}

const collectionNames = [
  'product-categories', 'products', 'article-categories', 'articles',
  'vacancy-departments', 'vacancies',
] as const

const globalNames = [
  'site-metadata', 'contact-info', 'email-templates', 'navigation-labels', 'footer',
  'not-found-page', 'error-page', 'about-page', 'forms', 'about-hero',
  'about-who-we-are', 'about-our-story', 'about-numbers', 'about-final-section',
  'home-hero', 'horizontal-scroll', 'our-collection', 'home-story',
  'home-cta-banner', 'home-brand-statement', 'article-labels',
  'product-detail-labels', 'vacancy-labels',
] as const

const snapshot: { generatedAt: string; collections: Record<string, unknown[]>; globals: Record<string, unknown> } = {
  generatedAt: new Date().toISOString(),
  collections: {},
  globals: {},
}

for (const collection of collectionNames) {
  const result = await payload.find({ collection, limit: 1000, locale: 'all', depth: 1, overrideAccess: true })
  snapshot.collections[collection] = result.docs.map((doc: any) => {
    const cleaned = stripMedia(doc) as Record<string, unknown>
    if (collection === 'products') cleaned.category = relationshipSlug(doc.category)
    if (collection === 'articles') cleaned.category = relationshipSlug(doc.category)
    if (collection === 'vacancies') cleaned.department = relationshipSlug(doc.department)
    return cleaned
  })
}

for (const global of globalNames) {
  const result = await payload.findGlobal({ slug: global, locale: 'all', depth: 0, overrideAccess: true })
  snapshot.globals[global] = stripMedia(result)
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8')
console.log(`Wrote public text snapshot: ${outputPath}`)
