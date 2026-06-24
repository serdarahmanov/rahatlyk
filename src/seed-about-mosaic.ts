import fs from 'fs'
import { createRequire } from 'node:module'
import path from 'path'
import { getPayload } from 'payload'
import { ABOUT_MOSAIC_CONTENT } from './lib/data/about-mosaic-content'

const require = createRequire(import.meta.url)
const { loadEnvConfig } = require('@next/env') as typeof import('@next/env')

async function uploadImage(
  payload: Awaited<ReturnType<typeof getPayload>>,
  image: { filename: string; path: string; alt: string },
) {
  const existing = await payload.find({
    collection: 'media',
    limit: 1,
    where: { filename: { equals: image.filename } },
  })

  if (existing.docs[0]) {
    console.log(`  [media] already exists: ${image.filename}`)
    return existing.docs[0].id as number
  }

  const imagePath = path.resolve(image.path)
  if (!fs.existsSync(imagePath)) {
    throw new Error(`Mosaic image not found: ${imagePath}`)
  }

  const buffer = fs.readFileSync(imagePath)
  const uploaded = await payload.create({
    collection: 'media',
    data: { alt: image.alt },
    file: {
      data: buffer,
      mimetype: 'image/png',
      name: image.filename,
      size: buffer.length,
    },
  })

  console.log(`  [media] uploaded: ${image.filename}`)
  return uploaded.id as number
}

async function seedAboutMosaic() {
  loadEnvConfig(process.cwd())
  const { default: config } = await import('../payload.config')
  const payload = await getPayload({ config })

  console.log('Seeding About Mosaic...')

  const [leftImage, rightImage] = await Promise.all([
    uploadImage(payload, ABOUT_MOSAIC_CONTENT.leftImage),
    uploadImage(payload, ABOUT_MOSAIC_CONTENT.rightImage),
  ])

  await payload.updateGlobal({
    slug: 'about-mosaic',
    data: { leftImage, rightImage },
  })

  console.log('  [global] updated: about-mosaic')
  console.log('Done.')
  process.exit(0)
}

seedAboutMosaic().catch((error) => {
  console.error(error)
  process.exit(1)
})
