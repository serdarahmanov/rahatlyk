import path from 'path'
import { readFileSync } from 'fs'
import { getPayload } from 'payload'
import config from '../payload.config'
import { ARTICLE_CATEGORIES, ARTICLES_SEED } from './lib/data/news-seed'

const MEDIA_DIR = path.join(process.cwd(), 'media')

async function seedNews() {
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

  // Cache uploaded media by filename to avoid re-uploading on re-runs
  const mediaIdCache: Record<string, number> = {}

  const uploadImage = async (imageFile: string, mimeType: string): Promise<number> => {
    if (mediaIdCache[imageFile]) return mediaIdCache[imageFile]

    const filePath = path.join(MEDIA_DIR, imageFile)
    const fileData = readFileSync(filePath)

    const media = await payload.create({
      collection: 'media',
      data: { alt: imageFile.replace(/\.[^.]+$/, '') },
      file: {
        data: fileData,
        mimetype: mimeType,
        name: imageFile,
        size: fileData.length,
      },
    })

    const id = media.id as number
    mediaIdCache[imageFile] = id
    return id
  }

  for (const a of ARTICLES_SEED) {
    const catId = catIdBySlug[a.categorySlug]
    if (!catId) {
      console.warn(`  [skip] unknown category "${a.categorySlug}" for article: ${a.titleEn}`)
      continue
    }

    // Upload image (idempotent within the same run via cache)
    const mediaId = await uploadImage(a.imageFile, a.mimeType)

    // Build locale body data with optional IDs for existing array rows
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bodyForLocale = (locale: 'en' | 'tm' | 'ru', doc: any) =>
      a.body.map((para, i) => ({
        ...(doc?.body?.[i]?.id ? { id: doc.body[i].id } : {}),
        text: para[locale],
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
            ...(locale === 'en' ? {
              category:  catId,
              date:      a.date,
              featured:  a.featured,
              images:    [{ media: mediaId }],
            } : {}),
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
          images:   [{ media: mediaId }],
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
