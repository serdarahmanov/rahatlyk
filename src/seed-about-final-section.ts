import fs from 'fs'
import { createRequire } from 'node:module'
import path from 'path'
import { getPayload } from 'payload'
import { ABOUT_FINAL_SECTION_CONTENT } from './lib/data/about-final-section-content'

const require = createRequire(import.meta.url)
const { loadEnvConfig } = require('@next/env') as typeof import('@next/env')

async function uploadImage(payload: Awaited<ReturnType<typeof getPayload>>) {
  const image = ABOUT_FINAL_SECTION_CONTENT.image
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
    throw new Error(`Final section image not found: ${imagePath}`)
  }

  const buffer = fs.readFileSync(imagePath)
  const uploaded = await payload.create({
    collection: 'media',
    data: { alt: image.alt },
    file: {
      data: buffer,
      mimetype: image.mimetype,
      name: image.filename,
      size: buffer.length,
    },
  })

  console.log(`  [media] uploaded: ${image.filename}`)
  return uploaded.id as number
}

async function seedAboutFinalSection() {
  loadEnvConfig(process.cwd())
  const { default: config } = await import('../payload.config')
  const payload = await getPayload({ config })

  console.log('Seeding About Final Section...')

  const image = await uploadImage(payload)

  for (const locale of ['en', 'tm', 'ru'] as const) {
    await payload.updateGlobal({
      slug: 'about-final-section',
      locale,
      data: {
        image,
        heading: ABOUT_FINAL_SECTION_CONTENT.heading[locale],
        body: ABOUT_FINAL_SECTION_CONTENT.body[locale],
      },
    })
    console.log(`  [global] updated locale: ${locale}`)
  }

  console.log('Done.')
  process.exit(0)
}

seedAboutFinalSection().catch((error) => {
  console.error(error)
  process.exit(1)
})
