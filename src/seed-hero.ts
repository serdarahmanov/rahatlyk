import fs from 'fs'
import { createRequire } from 'node:module'
import path from 'path'
import { getPayload } from 'payload'
import { HERO_CONTENT } from './lib/data/hero-content'

const require = createRequire(import.meta.url)
const { loadEnvConfig } = require('@next/env') as typeof import('@next/env')

async function uploadMediaIfNeeded(
  payload: Awaited<ReturnType<typeof getPayload>>,
  file: { filename: string; path: string; mimetype: string; alt: string },
) {
  const filename = file.filename
  const existingMedia = await payload.find({
    collection: 'media',
    limit: 1,
    where: { filename: { equals: filename } },
  })

  if (existingMedia.docs[0]) {
    console.log(`  [media] already exists: ${filename}`)
    return existingMedia.docs[0].id as number
  }

  const filePath = path.resolve(file.path)
  if (!fs.existsSync(filePath)) {
    console.warn(`  [media] file not found: ${filePath}`)
    return undefined
  }

  const buffer = fs.readFileSync(filePath)
  const uploaded = await payload.create({
    collection: 'media',
    data: { alt: file.alt },
    file: {
      data: buffer,
      mimetype: file.mimetype,
      name: filename,
      size: buffer.length,
    },
  })

  console.log(`  [media] uploaded: ${filename}`)
  return uploaded.id as number
}

async function seedHero() {
  loadEnvConfig(process.cwd())
  const { default: config } = await import('../payload.config')
  const payload = await getPayload({ config })

  console.log('Seeding Hero Section...')

  const desktopPosterId = await uploadMediaIfNeeded(payload, HERO_CONTENT.desktopPoster)
  const mobilePosterId = await uploadMediaIfNeeded(payload, HERO_CONTENT.mobilePoster)
  const bottleImageId = await uploadMediaIfNeeded(payload, HERO_CONTENT.bottleImage)
  const mobileBottleImageId = await uploadMediaIfNeeded(payload, HERO_CONTENT.mobileBottleImage)
  const parallaxImages = await Promise.all(
    HERO_CONTENT.parallaxImages.map(async (image) => ({
      fileName: image.fileName,
      image: await uploadMediaIfNeeded(payload, image),
    })),
  )

  for (const locale of ['en', 'tm', 'ru'] as const) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (payload.updateGlobal as any)({
      slug: 'home-hero',
      locale,
      data: {
        title:       HERO_CONTENT.title[locale],
        titleAccent: HERO_CONTENT.titleAccent[locale],
        subtitle:    HERO_CONTENT.subtitle[locale],
        ctaLabel:    HERO_CONTENT.ctaLabel[locale],
        ctaHref:     HERO_CONTENT.ctaHref,
        poster:      desktopPosterId,
        mobilePoster: mobilePosterId,
        parallaxImages: parallaxImages.filter((image) => image.image),
        bottleImage: bottleImageId,
        mobileBottleImage: mobileBottleImageId,
      },
    })
    console.log(`  [global] updated locale: ${locale}`)
  }

  console.log('Done.')
  process.exit(0)
}

seedHero().catch((err) => {
  console.error(err)
  process.exit(1)
})
