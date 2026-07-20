import fs from 'fs'
import { createRequire } from 'node:module'
import path from 'path'
import { getPayload } from 'payload'
import { PRODUCT_CATEGORIES, PRODUCTS_SEED } from './lib/data/products-payload'

const require = createRequire(import.meta.url)
const { loadEnvConfig } = require('@next/env') as typeof import('@next/env')

const MIME_BY_EXT: Record<string, string> = {
  '.avif': 'image/avif',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.mp4': 'video/mp4',
  '.png': 'image/png',
  '.webp': 'image/webp',
}

const PRODUCTS_DIR = path.resolve('public/products')
const PRODUCTS_WEBP_DIR = path.join(PRODUCTS_DIR, 'webp')

function normalizedBase(filename: string) {
  return path.basename(filename, path.extname(filename)).replace(/\s+/g, ' ').trim().toLowerCase()
}

function findWebpImage(filename: string) {
  if (!fs.existsSync(PRODUCTS_WEBP_DIR)) return null

  const wantedBase = normalizedBase(filename)
  const directPath = path.join(PRODUCTS_WEBP_DIR, `${path.basename(filename, path.extname(filename))}.webp`)
  if (fs.existsSync(directPath)) return directPath

  const match = fs
    .readdirSync(PRODUCTS_WEBP_DIR)
    .find((candidate) => path.extname(candidate).toLowerCase() === '.webp' && normalizedBase(candidate) === wantedBase)

  return match ? path.join(PRODUCTS_WEBP_DIR, match) : null
}

function mediaSource(folder: string, filename: string, fallbackMimeType?: string) {
  const dir = path.join(PRODUCTS_DIR, folder)
  const ext = path.extname(filename)
  const base = path.basename(filename, ext)
  const webpImage = ext.toLowerCase() === '.mp4' ? null : findWebpImage(filename)
  const optimizedExtensions = ext.toLowerCase() === '.mp4' ? ['.mp4'] : ['.webp', '.avif']
  const optimizedCandidates = optimizedExtensions.flatMap((optimizedExt) => [
    ...(webpImage ? [webpImage] : []),
    path.join(dir, `${base} copy${optimizedExt}`),
    path.join(dir, `${base}-optimized${optimizedExt}`),
    path.join(dir, `${base}${optimizedExt}`),
    path.join(dir, 'web', `${base} copy${optimizedExt}`),
    path.join(dir, 'web', `${base}-optimized${optimizedExt}`),
    path.join(dir, 'web', `${base}${optimizedExt}`),
  ])
  const candidates = [...optimizedCandidates, path.join(dir, filename)]
  const filePath = candidates.find((candidate) => fs.existsSync(candidate)) ?? candidates[candidates.length - 1]
  const resolvedFilename = path.basename(filePath)
  const mimetype = MIME_BY_EXT[path.extname(resolvedFilename).toLowerCase()] ?? fallbackMimeType ?? 'application/octet-stream'

  return { filePath, filename: resolvedFilename, mimetype }
}

async function seedProducts() {
  loadEnvConfig(process.cwd())
  const { default: config } = await import('../payload.config')
  const payload = await getPayload({ config })

  // ── 1 · Product categories ────────────────────────────────────────
  console.log('Seeding product categories...')
  const categoryIds: Record<string, number> = {}

  for (const cat of PRODUCT_CATEGORIES) {
    const existing = await payload.find({
      collection: 'product-categories',
      limit: 1,
      where: { slug: { equals: cat.slug } },
    })

    if (existing.docs[0]) {
      const id = existing.docs[0].id as number
      categoryIds[cat.slug] = id
      for (const locale of ['en', 'tm', 'ru'] as const) {
        await payload.update({ collection: 'product-categories', id, locale, data: { label: cat.label[locale] } })
      }
      console.log(`  [category] updated: ${cat.slug}`)
    } else {
      const created = await payload.create({
        collection: 'product-categories',
        locale: 'en',
        data: { slug: cat.slug, label: cat.label.en },
      })
      for (const locale of ['tm', 'ru'] as const) {
        await payload.update({ collection: 'product-categories', id: created.id, locale, data: { label: cat.label[locale] } })
      }
      categoryIds[cat.slug] = created.id as number
      console.log(`  [category] created: ${cat.slug}`)
    }
  }

  // ── 2 · Products ──────────────────────────────────────────────────
  console.log('\nSeeding products...')

  for (const product of PRODUCTS_SEED) {
    // ── Upload photos ──────────────────────────────────────────────
    const photoIds: number[] = []

    for (const photo of product.photos) {
      const source = mediaSource(photo.folder, photo.filename, photo.mimetype)

      if (!fs.existsSync(source.filePath)) {
        console.warn(`  [photo] not found, skipping: ${source.filePath}`)
        continue
      }

      const existing = await payload.find({
        collection: 'media',
        limit: 1,
        where: { filename: { equals: source.filename } },
      })

      if (existing.docs[0]) {
        photoIds.push(existing.docs[0].id as number)
        console.log(`  [photo] exists: ${source.filename}`)
      } else {
        const buffer = fs.readFileSync(source.filePath)
        const uploaded = await payload.create({
          collection: 'media',
          data: { alt: product.name.en },
          file: { data: buffer, mimetype: source.mimetype, name: source.filename, size: buffer.length },
        })
        photoIds.push(uploaded.id as number)
        console.log(`  [photo] uploaded: ${source.filename}`)
      }
    }

    // ── Upload video ───────────────────────────────────────────────
    let videoId: number | undefined

    if (product.video) {
      const source = mediaSource(product.video.folder, product.video.filename, 'video/mp4')

      if (!fs.existsSync(source.filePath)) {
        console.warn(`  [video] not found, skipping: ${source.filePath}`)
      } else {
        const existingVideo = await payload.find({
          collection: 'media',
          limit: 1,
          where: { filename: { equals: source.filename } },
        })

        if (existingVideo.docs[0]) {
          videoId = existingVideo.docs[0].id as number
          console.log(`  [video] exists: ${source.filename}`)
        } else {
          const buffer = fs.readFileSync(source.filePath)
          const uploaded = await payload.create({
            collection: 'media',
            data: { alt: `${product.name.en} — product video` },
            file: { data: buffer, mimetype: source.mimetype, name: source.filename, size: buffer.length },
          })
          videoId = uploaded.id as number
          console.log(`  [video] uploaded: ${source.filename}`)
        }
      }
    }

    const categoryId = categoryIds[product.category]
    const photos = photoIds.map((id) => ({ media: id }))

    // ── Create or update product ───────────────────────────────────
    const existing = await payload.find({
      collection: 'products',
      limit: 1,
      locale: 'en',
      where: {
        or: [
          { slug: { equals: product.slug.en } },
          { name: { equals: product.nameEn } },
        ],
      },
    })

    if (existing.docs[0]) {
      const id = existing.docs[0].id

      // Seed EN first so nutrition item IDs exist in the DB
      await payload.update({
        collection: 'products',
        id,
        locale: 'en',
        data: {
          name:            product.name.en,
          slug:            product.slug.en,
          tagline:         product.tagline.en,
          description:     product.description.en,
          longDescription: product.longDescription.en,
          nutrition:       product.nutrition.map((n) => ({ label: n.label.en, value: n.value.en })),
          date:            product.date,
          category:        categoryId,
          volumes:         product.volumes.map((value) => ({ value })),
          photos,
          video:           videoId,
        },
      })

      // Fetch EN to get the stable nutrition item IDs
      const fresh = await payload.findByID({ collection: 'products', id, locale: 'en', depth: 0 })
      const nutritionIds = (fresh.nutrition ?? []).map((n: any) => n.id)

      for (const locale of ['tm', 'ru'] as const) {
        await payload.update({
          collection: 'products',
          id,
          locale,
          data: {
            name:            product.name[locale],
            slug:            product.slug[locale],
            tagline:         product.tagline[locale],
            description:     product.description[locale],
            longDescription: product.longDescription[locale],
            date:            product.date,
            category:        categoryId,
            volumes:         product.volumes.map((value) => ({ value })),
            photos,
            video:           videoId,
            nutrition:       product.nutrition.map((n, i) => ({
              id:    nutritionIds[i],
              label: n.label[locale],
              value: n.value[locale],
            })),
          },
        })
      }
      console.log(`  [product] updated: ${product.nameEn}`)
    } else {
      const created = await payload.create({
        collection: 'products',
        locale: 'en',
        data: {
          name:            product.name.en,
          slug:            product.slug.en,
          tagline:         product.tagline.en,
          date:            product.date,
          category:        categoryId,
          description:     product.description.en,
          longDescription: product.longDescription.en,
          nutrition:       product.nutrition.map((n) => ({ label: n.label.en, value: n.value.en })),
          volumes:         product.volumes.map((value) => ({ value })),
          photos,
          video:           videoId,
        },
      })

      // Fetch to get the stable nutrition item IDs assigned by Payload
      const fresh = await payload.findByID({ collection: 'products', id: created.id, locale: 'en', depth: 0 })
      const nutritionIds = (fresh.nutrition ?? []).map((n: any) => n.id)

      for (const locale of ['tm', 'ru'] as const) {
        await payload.update({
          collection: 'products',
          id: created.id,
          locale,
          data: {
            name:            product.name[locale],
            slug:            product.slug[locale],
            tagline:         product.tagline[locale],
            description:     product.description[locale],
            longDescription: product.longDescription[locale],
            date:            product.date,
            category:        categoryId,
            volumes:         product.volumes.map((value) => ({ value })),
            photos,
            video:           videoId,
            nutrition:       product.nutrition.map((n, i) => ({
              id:    nutritionIds[i],
              label: n.label[locale],
              value: n.value[locale],
            })),
          },
        })
      }
      console.log(`  [product] created: ${product.nameEn}`)
    }
  }

  console.log('\nDone.')
  process.exit(0)
}

seedProducts().catch((err) => {
  console.error(err)
  process.exit(1)
})
