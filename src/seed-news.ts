import path from 'path'
import fs, { readFileSync } from 'fs'
import { createRequire } from 'node:module'
import { getPayload } from 'payload'
import { ARTICLE_CATEGORIES, ARTICLES_SEED } from './lib/data/news-seed'

const MEDIA_DIR       = path.join(process.cwd(), 'media')
const NEWS_PHOTOS_DIR = path.join(process.cwd(), 'public', 'news', 'photos')
const require = createRequire(import.meta.url)
const { loadEnvConfig } = require('@next/env') as typeof import('@next/env')

const MIME_BY_EXT: Record<string, string> = {
  '.avif': 'image/avif',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
}

function resolveArticleImage(file: string, dir: 'media' | 'news-photos', fallbackMimeType: string) {
  const root = dir === 'media' ? MEDIA_DIR : NEWS_PHOTOS_DIR
  const originalPath = path.join(root, file)
  const ext = path.extname(file)
  const base = path.basename(file, ext)
  const parent = path.dirname(file)
  const candidates = dir === 'news-photos'
    ? [
        path.join(root, parent, 'web', `${base} copy.webp`),
        path.join(root, parent, 'web', `${base}.webp`),
        path.join(root, parent, `${base} copy.webp`),
        path.join(root, parent, `${base}.webp`),
        originalPath,
      ]
    : [
        path.join(root, `${base} copy.webp`),
        path.join(root, `${base}.webp`),
        path.join(root, `${base}.avif`),
        originalPath,
      ]

  const filePath = candidates.find((candidate) => fs.existsSync(candidate)) ?? originalPath
  const filename = path.basename(filePath)
  const mimeType = MIME_BY_EXT[path.extname(filename).toLowerCase()] ?? fallbackMimeType

  return { filePath, filename, mimeType }
}

const toRichText = (text: string) => ({
  root: {
    type: 'root',
    version: 1,
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    children: [{
      type: 'paragraph',
      version: 1,
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      children: [{
        type: 'text',
        version: 1,
        text,
        format: 0,
        detail: 0,
        mode: 'normal' as const,
        style: '',
      }],
    }],
  },
})

async function seedNews() {
  loadEnvConfig(process.cwd())
  const { default: config } = await import('../payload.config')
  const payload = await getPayload({ config })

  // ── 1. Article categories ───────────────────────────────────────────────────
  console.log('Seeding article categories...')

  const catIdBySlug: Record<string, number> = {}

  for (const cat of ARTICLE_CATEGORIES) {
    const existing = await payload.find({
      collection: 'article-categories',
      limit: 1,
      where: { slug: { equals: cat.slug } },
    })

    if (existing.docs[0]) {
      const id = existing.docs[0].id as number
      catIdBySlug[cat.slug] = id
      for (const locale of ['en', 'tm', 'ru'] as const) {
        await payload.update({
          collection: 'article-categories',
          id,
          locale,
          data: { label: cat.label[locale] },
        })
      }
      console.log(`  [category] updated: ${cat.slug}`)
    } else {
      const created = await payload.create({
        collection: 'article-categories',
        locale: 'en',
        data: { slug: cat.slug, label: cat.label.en },
      })
      const id = created.id as number
      catIdBySlug[cat.slug] = id
      for (const locale of ['tm', 'ru'] as const) {
        await payload.update({
          collection: 'article-categories',
          id,
          locale,
          data: { label: cat.label[locale] },
        })
      }
      console.log(`  [category] created: ${cat.slug}`)
    }
  }

  // ── 2. Articles ─────────────────────────────────────────────────────────────
  console.log('Seeding articles...')

  // Cache uploaded media by source key to avoid re-uploading on re-runs
  const mediaIdCache: Record<string, number> = {}

  const uploadImage = async (file: string, dir: 'media' | 'news-photos', mimeType: string): Promise<number> => {
    const source = resolveArticleImage(file, dir, mimeType)
    const cacheKey = `${dir}:${source.filename}`
    if (mediaIdCache[cacheKey]) return mediaIdCache[cacheKey]

    const existing = await payload.find({
      collection: 'media',
      limit: 1,
      where: { filename: { equals: source.filename } },
    })

    if (existing.docs[0]) {
      const id = existing.docs[0].id as number
      mediaIdCache[cacheKey] = id
      return id
    }

    const fileData = readFileSync(source.filePath)

    const media = await payload.create({
      collection: 'media',
      data: { alt: source.filename.replace(/\.[^.]+$/, '') },
      file: {
        data: fileData,
        mimetype: source.mimeType,
        name: source.filename,
        size: fileData.length,
      },
    })

    const id = media.id as number
    mediaIdCache[cacheKey] = id
    return id
  }

  for (const a of ARTICLES_SEED) {
    const catId = catIdBySlug[a.categorySlug]
    if (!catId) {
      console.warn(`  [skip] unknown category "${a.categorySlug}" for article: ${a.titleEn}`)
      continue
    }

    // Upload all images (idempotent within the same run via cache)
    const mediaIds = await Promise.all(
      a.images.map(img => uploadImage(img.file, img.dir, img.mimeType))
    )

    // Build locale body data with optional IDs for existing array rows
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bodyForLocale = (locale: 'en' | 'tm' | 'ru', doc: any) =>
      a.body.map((para, i) => ({
        ...(doc?.body?.[i]?.id ? { id: doc.body[i].id } : {}),
        text: toRichText(para[locale]),
      }))

    const existing = await payload.find({
      collection: 'articles',
      locale: 'en',
      limit: 1,
      where: { title: { equals: a.titleEn } },
    })

    if (existing.docs[0]) {
      const id = existing.docs[0].id as number
      const fullDoc = await payload.findByID({ collection: 'articles', id, locale: 'en' })

      for (const locale of ['en', 'tm', 'ru'] as const) {
        await payload.update({
          collection: 'articles',
          id,
          locale,
          data: {
            title: a.title[locale],
            body: bodyForLocale(locale, fullDoc),
            category:  catId,
            date:      a.date,
            featured:  a.featured,
            images:    mediaIds.map(id => ({ media: id })),
          },
        })
      }
      console.log(`  [article] updated: ${a.titleEn}`)
    } else {
      const created = await payload.create({
        collection: 'articles',
        locale: 'en',
        data: {
          title:    a.title.en,
          category: catId,
          date:     a.date,
          featured: a.featured,
          images:   mediaIds.map(id => ({ media: id })),
          body:     bodyForLocale('en', null),
        },
      })
      const id = created.id as number

      for (const locale of ['tm', 'ru'] as const) {
        await payload.update({
          collection: 'articles',
          id,
          locale,
          data: {
            title: a.title[locale],
            body:  bodyForLocale(locale, created),
          },
        })
      }
      console.log(`  [article] created: ${a.titleEn}`)
    }
  }

  console.log('Done.')
  process.exit(0)
}

seedNews().catch((err) => {
  console.error(err)
  process.exit(1)
})
