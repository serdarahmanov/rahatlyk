import fs from 'fs'
import { createRequire } from 'node:module'
import path from 'path'
import { getPayload } from 'payload'
import { PRODUCT_LINES } from './lib/data/product-lines'

const require = createRequire(import.meta.url)
const { loadEnvConfig } = require('@next/env') as typeof import('@next/env')

const MIME_BY_EXT: Record<string, string> = {
  '.avif': 'image/avif',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
}

function resolveCollectionImage(filename: string) {
  const dir = path.resolve('public/our collection images')
  const ext = path.extname(filename)
  const base = path.basename(filename, ext)
  const candidates = [
    path.join(dir, `${base} copy.webp`),
    path.join(dir, `${base}.webp`),
    path.join(dir, `${base}.avif`),
    path.join(dir, 'web', `${base} copy.webp`),
    path.join(dir, 'web', `${base}.webp`),
    path.join(dir, 'web', `${base}.avif`),
    path.join(dir, filename),
  ]
  const filePath = candidates.find((candidate) => fs.existsSync(candidate)) ?? candidates[candidates.length - 1]
  const resolvedFilename = path.basename(filePath)
  const mimetype = MIME_BY_EXT[path.extname(resolvedFilename).toLowerCase()] ?? 'application/octet-stream'

  return { filePath, filename: resolvedFilename, mimetype }
}

async function seedProductLines() {
  loadEnvConfig(process.cwd())
  process.env.PAYLOAD_MIGRATING = 'true'
  const { default: config } = await import('../payload.config')
  const payload = await getPayload({ config })

  console.log('Seeding Our Collection...')

  const mediaIds = new Map<string, number>()

  for (const line of PRODUCT_LINES) {
    const source = resolveCollectionImage(line.imageFile)
    const existingMedia = await payload.find({
      collection: 'media',
      limit: 1,
      where: { filename: { equals: source.filename } },
    })

    let mediaId: number | undefined

    if (existingMedia.docs[0]) {
      mediaId = existingMedia.docs[0].id as number
      console.log(`  [media] already exists: ${source.filename}`)
    } else {
      if (fs.existsSync(source.filePath)) {
        const buffer = fs.readFileSync(source.filePath)
        const uploaded = await payload.create({
          collection: 'media',
          data: { alt: line.name.en },
          file: {
            data: buffer,
            mimetype: source.mimetype,
            name: source.filename,
            size: buffer.length,
          },
        })
        mediaId = uploaded.id as number
        console.log(`  [media] uploaded: ${source.filename}`)
      } else {
        console.warn(`  [media] file not found, skipping image: ${source.filePath}`)
      }
    }

    if (mediaId != null) mediaIds.set(line.key, mediaId)
  }

  await payload.updateGlobal({
    slug: 'our-collection',
    locale: 'en',
    data: {
      items: PRODUCT_LINES.map((line) => ({
        key: line.key,
        name: line.name.en,
        description: line.description.en,
        body: line.body.en,
        ...(mediaIds.has(line.key) ? { image: mediaIds.get(line.key) } : {}),
        order: line.order,
      })),
    },
  })
  console.log('  [global] updated locale: en')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fetched: any = await payload.findGlobal({ slug: 'our-collection', locale: 'en', depth: 0 })
  const itemIds: Array<string | undefined> = (fetched?.items ?? []).map(
    (item: { id?: string | number | null }) => item.id == null ? undefined : String(item.id),
  )

  for (const locale of ['tm', 'ru'] as const) {
    await payload.updateGlobal({
      slug: 'our-collection',
      locale,
      data: {
        items: PRODUCT_LINES.map((line, index) => ({
          ...(itemIds[index] !== undefined ? { id: itemIds[index] } : {}),
          key: line.key,
          name: line.name[locale],
          description: line.description[locale],
          body: line.body[locale],
          ...(mediaIds.has(line.key) ? { image: mediaIds.get(line.key) } : {}),
          order: line.order,
        })),
      },
    })
    console.log(`  [global] updated locale: ${locale}`)
  }

  console.log('Done.')
  process.exit(0)
}

seedProductLines().catch((err) => {
  console.error(err)
  process.exit(1)
})
