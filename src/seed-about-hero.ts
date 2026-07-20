import fs from 'fs'
import { createRequire } from 'node:module'
import path from 'path'
import { getPayload } from 'payload'
import { ABOUT_HERO_CONTENT } from './lib/data/about-hero-content'

const require = createRequire(import.meta.url)
const { loadEnvConfig } = require('@next/env') as typeof import('@next/env')

async function getOrUploadMedia(
  payload: Awaited<ReturnType<typeof getPayload>>,
  file: { filename: string; path: string; mimetype: string; alt: string },
) {
  const existing = await payload.find({
    collection: 'media',
    limit: 1,
    where: { filename: { equals: file.filename } },
  })

  if (existing.docs[0]) {
    console.log(`  [media] already exists: ${file.filename}`)
    return existing.docs[0].id as number
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
      name: file.filename,
      size: buffer.length,
    },
  })

  console.log(`  [media] uploaded: ${file.filename}`)
  return uploaded.id as number
}

async function seedAboutHero() {
  loadEnvConfig(process.cwd())
  const { default: config } = await import('../payload.config')
  const payload = await getPayload({ config })

  console.log('Seeding About Hero...')

  const desktopCoverId = await getOrUploadMedia(payload, ABOUT_HERO_CONTENT.desktopCover)
  const mobileCoverId = await getOrUploadMedia(payload, ABOUT_HERO_CONTENT.mobileCover)
  const desktopVideoId = await getOrUploadMedia(payload, ABOUT_HERO_CONTENT.desktopVideo)
  const mobileVideoId = await getOrUploadMedia(payload, ABOUT_HERO_CONTENT.mobileVideo)

  for (const locale of ['en', 'tm', 'ru'] as const) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (payload.updateGlobal as any)({
      slug: 'about-hero',
      locale,
      data: {
        title: ABOUT_HERO_CONTENT.title[locale],
        accentWordIndex: ABOUT_HERO_CONTENT.accentWordIndex[locale],
        coverImage: desktopCoverId,
        mobileCoverImage: mobileCoverId,
        heroVideo: desktopVideoId,
        mobileHeroVideo: mobileVideoId,
      },
    })
    console.log(`  [global] updated locale: ${locale}`)
  }

  console.log('Done.')
  process.exit(0)
}

seedAboutHero().catch((err) => {
  console.error(err)
  process.exit(1)
})
