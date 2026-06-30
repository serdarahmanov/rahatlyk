import fs from 'fs'
import { createRequire } from 'node:module'
import path from 'path'
import { getPayload } from 'payload'
import { HOME_CTA_CONTENT } from './lib/data/home-cta-content'

const require = createRequire(import.meta.url)
const { loadEnvConfig } = require('@next/env') as typeof import('@next/env')

async function seedHomeCtaBanner() {
  loadEnvConfig(process.cwd())
  const { default: config } = await import('../payload.config')
  const payload = await getPayload({ config })

  console.log('Seeding Home CTA Banner...')

  const existingMedia = await payload.find({
    collection: 'media',
    limit: 1,
    where: { filename: { equals: HOME_CTA_CONTENT.imageFile } },
  })

  let mediaId: number | undefined

  if (existingMedia.docs[0]) {
    mediaId = existingMedia.docs[0].id as number
    console.log(`  [media] already exists: ${HOME_CTA_CONTENT.imageFile}`)
  } else {
    const imagePath = path.resolve(HOME_CTA_CONTENT.imagePath)

    if (!fs.existsSync(imagePath)) {
      throw new Error(`CTA image file not found: ${imagePath}`)
    }

    const buffer = fs.readFileSync(imagePath)
    const uploaded = await payload.create({
      collection: 'media',
      data: { alt: 'Home CTA background image' },
      file: {
        data: buffer,
        mimetype: HOME_CTA_CONTENT.imageMimetype,
        name: HOME_CTA_CONTENT.imageFile,
        size: buffer.length,
      },
    })

    mediaId = uploaded.id as number
    console.log(`  [media] uploaded: ${HOME_CTA_CONTENT.imageFile}`)
  }

  for (const locale of ['en', 'tm', 'ru'] as const) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (payload.updateGlobal as any)({
      slug: 'home-cta-banner',
      locale,
      data: {
        title: HOME_CTA_CONTENT.title[locale],
        subtitle: HOME_CTA_CONTENT.subtitle[locale],
        ctaLabel: HOME_CTA_CONTENT.ctaLabel[locale],
        ctaHref: HOME_CTA_CONTENT.ctaHref,
        image: mediaId,
      },
    })
    console.log(`  [global] updated locale: ${locale}`)
  }

  console.log('Done.')
  process.exit(0)
}

seedHomeCtaBanner().catch((error) => {
  console.error(error)
  process.exit(1)
})
