/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { getPayload } from 'payload'

const require = createRequire(import.meta.url)
const { loadEnvConfig } = require('@next/env') as typeof import('@next/env')
loadEnvConfig(process.cwd())
process.env.PAYLOAD_SEED_MODE = 'true'

const { default: config } = await import('../../payload.config')
const payload = await getPayload({ config })

try {
const outputPath = path.resolve('scripts/seed/data/current-public-content.json')

type MediaSeed = {
  filename: string
  path: string
  mimetype: string
  alt: string
}

const projectRoot = path.resolve('.')
const mediaRoot = path.resolve(projectRoot, 'media')
const mediaSeeds = new Map<string, MediaSeed>()

function mediaReference(value: Record<string, unknown>): Record<string, string> {
  const filename = value.filename
  if (typeof filename !== 'string' || !filename) throw new Error('Media document has no filename')

  const filePath = path.resolve(mediaRoot, filename)
  const relativePath = path.relative(projectRoot, filePath).replaceAll('\\', '/')
  const mediaRootPrefix = `${mediaRoot}${path.sep}`
  if (!filePath.startsWith(mediaRootPrefix) && filePath !== mediaRoot) {
    throw new Error(`Media file is outside the media directory: ${filename}`)
  }
  if (!fs.existsSync(filePath)) {
    throw new Error(`Referenced media file does not exist: ${filePath}`)
  }

  mediaSeeds.set(filename, {
    filename,
    path: relativePath,
    mimetype: typeof value.mimeType === 'string' ? value.mimeType : 'application/octet-stream',
    alt: typeof value.alt === 'string' ? value.alt : filename,
  })

  return { __seedMedia: filename }
}

function isMediaDocument(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const record = value as Record<string, unknown>
  return (
    typeof record.filename === 'string' &&
    ('mimeType' in record || 'url' in record)
  )
}

function stripMedia(value: unknown, preserveArrayRowIDs = false): unknown {
  // Array row IDs must survive the export. Payload uses the same row identity
  // across locales for non-localized arrays containing localized sub-fields
  // (for example article body rows and about-number stats). Removing them
  // causes each locale import to replace the previous locale's child rows.
  if (Array.isArray(value)) return value.map((item) => stripMedia(item, true))
  if (!value || typeof value !== 'object') return value
  if (isMediaDocument(value)) return mediaReference(value)

  const result: Record<string, unknown> = {}
  for (const [childKey, childValue] of Object.entries(value)) {
    if (!preserveArrayRowIDs && ['id', 'createdAt', 'updatedAt', 'globalType', '_status'].includes(childKey)) continue
    if (isMediaDocument(childValue)) {
      result[childKey] = mediaReference(childValue as Record<string, unknown>)
    } else {
      result[childKey] = stripMedia(childValue)
    }
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

const snapshot: {
  generatedAt: string
  media: MediaSeed[]
  collections: Record<string, unknown[]>
  globals: Record<string, unknown>
} = {
  generatedAt: new Date().toISOString(),
  media: [],
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
  const result = await payload.findGlobal({ slug: global, locale: 'all', depth: 1, overrideAccess: true })
  snapshot.globals[global] = stripMedia(result)
}

snapshot.media = [...mediaSeeds.values()].sort((a, b) => a.filename.localeCompare(b.filename))

fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8')
console.log(`Wrote public text snapshot: ${outputPath}`)
} finally {
  const pool = payload.db?.pool
  try {
    await payload.destroy()
  } finally {
    void pool?.end().catch(() => undefined)
  }
}

process.exit(0)
