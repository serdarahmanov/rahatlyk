import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'
import config from '../payload.config'
import { HERO_CONTENT } from './lib/data/hero-content'

async function seedHero() {
  const payload = await getPayload({ config })

  console.log('Seeding Hero Section...')

  // ── Upload video if not already in media ────────────────────────
  const existingMedia = await payload.find({
    collection: 'media',
    limit: 1,
    where: { filename: { equals: HERO_CONTENT.videoFile } },
  })

  let mediaId: number | undefined

  if (existingMedia.docs[0]) {
    mediaId = existingMedia.docs[0].id as number
    console.log(`  [media] already exists: ${HERO_CONTENT.videoFile}`)
  } else {
    const videoPath = path.resolve('public/hero section', HERO_CONTENT.videoFile)
    if (fs.existsSync(videoPath)) {
      const buffer = fs.readFileSync(videoPath)
      const uploaded = await payload.create({
        collection: 'media',
        data: { alt: 'Hero section background video' },
        file: {
          data: buffer,
          mimetype: 'video/mp4',
          name: HERO_CONTENT.videoFile,
          size: buffer.length,
        },
      })
      mediaId = uploaded.id as number
      console.log(`  [media] uploaded: ${HERO_CONTENT.videoFile}`)
    } else {
      console.warn(`  [media] file not found: ${videoPath}`)
    }
  }

  // ── Update global for each locale ───────────────────────────────
  for (const locale of ['en', 'tm', 'ru'] as const) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (payload.updateGlobal as any)({
      slug: 'home-hero',
      locale,
      data: {
        title:       HERO_CONTENT.title[locale],
        titleAccent: HERO_CONTENT.titleAccent[locale],
        subtitle:    HERO_CONTENT.subtitle[locale],
        ...(locale === 'en' ? { video: mediaId } : {}),
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
