import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'
import config from '../payload.config'
import { PRODUCT_CATEGORIES, PRODUCTS_SEED } from './lib/data/products-payload'

async function seedProducts() {
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
      const filePath = path.resolve('public/products', photo.folder, photo.filename)

      if (!fs.existsSync(filePath)) {
        console.warn(`  [photo] not found, skipping: ${filePath}`)
        continue
      }

      const existing = await payload.find({
        collection: 'media',
        limit: 1,
        where: { filename: { equals: photo.filename } },
      })

      if (existing.docs[0]) {
        photoIds.push(existing.docs[0].id as number)
        console.log(`  [photo] exists: ${photo.filename}`)
      } else {
        const buffer = fs.readFileSync(filePath)
        const uploaded = await payload.create({
          collection: 'media',
          data: { alt: product.name.en },
          file: { data: buffer, mimetype: photo.mimetype, name: photo.filename, size: buffer.length },
        })
        photoIds.push(uploaded.id as number)
        console.log(`  [photo] uploaded: ${photo.filename}`)
      }
    }

    // ── Upload video ───────────────────────────────────────────────
    let videoId: number | undefined

    if (product.video) {
      const videoPath = path.resolve('public/products', product.video.folder, product.video.filename)

      if (!fs.existsSync(videoPath)) {
        console.warn(`  [video] not found, skipping: ${videoPath}`)
      } else {
        const existingVideo = await payload.find({
          collection: 'media',
          limit: 1,
          where: { filename: { equals: product.video.filename } },
        })

        if (existingVideo.docs[0]) {
          videoId = existingVideo.docs[0].id as number
          console.log(`  [video] exists: ${product.video.filename}`)
        } else {
          const buffer = fs.readFileSync(videoPath)
          const uploaded = await payload.create({
            collection: 'media',
            data: { alt: `${product.name.en} — product video` },
            file: { data: buffer, mimetype: 'video/mp4', name: product.video.filename, size: buffer.length },
          })
          videoId = uploaded.id as number
          console.log(`  [video] uploaded: ${product.video.filename}`)
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
      where: { name: { equals: product.nameEn } },
    })

    if (existing.docs[0]) {
      const id = existing.docs[0].id
      for (const locale of ['en', 'tm', 'ru'] as const) {
        await payload.update({
          collection: 'products',
          id,
          locale,
          data: {
            name:            product.name[locale],
            tagline:         product.tagline[locale],
            description:     product.description[locale],
            longDescription: product.longDescription[locale],
            features:        product.features[locale].map((text) => ({ text })),
            ...(locale === 'en' ? {
              date:      product.date,
              category:  categoryId,
              nutrition: product.nutrition,
              volumes:   product.volumes.map((value) => ({ value })),
              photos,
              video:     videoId,
            } : {}),
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
          tagline:         product.tagline.en,
          date:            product.date,
          category:        categoryId,
          description:     product.description.en,
          longDescription: product.longDescription.en,
          features:        product.features.en.map((text) => ({ text })),
          nutrition:       product.nutrition,
          volumes:         product.volumes.map((value) => ({ value })),
          photos,
          video:           videoId,
        },
      })
      for (const locale of ['tm', 'ru'] as const) {
        await payload.update({
          collection: 'products',
          id: created.id,
          locale,
          data: {
            name:            product.name[locale],
            tagline:         product.tagline[locale],
            description:     product.description[locale],
            longDescription: product.longDescription[locale],
            features:        product.features[locale].map((text) => ({ text })),
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
