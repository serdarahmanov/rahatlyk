import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'
import config from '../payload.config'
import { PRODUCT_LINES } from './lib/data/product-lines'

async function seedProductLines() {
  const payload = await getPayload({ config })

  console.log('Seeding Our Collection (product lines)...')

  for (const line of PRODUCT_LINES) {
    // ── Upload image if not already in media ──────────────────────
    const existingMedia = await payload.find({
      collection: 'media',
      limit: 1,
      where: { filename: { equals: line.imageFile } },
    })

    let mediaId: number | undefined

    if (existingMedia.docs[0]) {
      mediaId = existingMedia.docs[0].id as number
      console.log(`  [media] already exists: ${line.imageFile}`)
    } else {
      const imagePath = path.resolve('public/our collection images', line.imageFile)
      if (fs.existsSync(imagePath)) {
        const buffer = fs.readFileSync(imagePath)
        const uploaded = await payload.create({
          collection: 'media',
          data: { alt: line.name.en },
          file: {
            data: buffer,
            mimetype: 'image/png',
            name: line.imageFile,
            size: buffer.length,
          },
        })
        mediaId = uploaded.id as number
        console.log(`  [media] uploaded: ${line.imageFile}`)
      } else {
        console.warn(`  [media] file not found, skipping image: ${imagePath}`)
      }
    }

    // ── Create or update product line ────────────────────────────
    const existingLine = await payload.find({
      collection: 'product-lines',
      limit: 1,
      where: { key: { equals: line.key } },
    })

    if (existingLine.docs[0]) {
      const id = existingLine.docs[0].id
      for (const locale of ['en', 'tm', 'ru'] as const) {
        await payload.update({
          collection: 'product-lines',
          id,
          locale,
          data: {
            name:        line.name[locale],
            description: line.description[locale],
            body:        line.body[locale],
            ...(locale === 'en' ? { image: mediaId, order: line.order } : {}),
          },
        })
      }
      console.log(`  [line] updated: ${line.key}`)
    } else {
      const created = await payload.create({
        collection: 'product-lines',
        locale: 'en',
        data: {
          key:         line.key,
          name:        line.name.en,
          description: line.description.en,
          body:        line.body.en,
          image:       mediaId,
          order:       line.order,
        },
      })
      for (const locale of ['tm', 'ru'] as const) {
        await payload.update({
          collection: 'product-lines',
          id: created.id,
          locale,
          data: {
            name:        line.name[locale],
            description: line.description[locale],
            body:        line.body[locale],
          },
        })
      }
      console.log(`  [line] created: ${line.key}`)
    }
  }

  console.log('Done.')
  process.exit(0)
}

seedProductLines().catch((err) => {
  console.error(err)
  process.exit(1)
})
