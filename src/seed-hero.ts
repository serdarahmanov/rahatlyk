import fs from 'fs'
import { createRequire } from 'node:module'
import path from 'path'
import { getPayload } from 'payload'
import { HERO_CONTENT } from './lib/data/hero-content'

const require = createRequire(import.meta.url)
const { loadEnvConfig } = require('@next/env') as typeof import('@next/env')

function resolveHeroVideo(filename: string) {
  const dir = path.resolve('public/hero section')
  const ext = path.extname(filename)
  const base = path.basename(filename, ext)
  const candidates = [
    path.join(dir, filename),
    path.join(dir, `${base}-optimized${ext}`),
    path.join(dir, `${base}-1500w${ext}`),
  ]

  return candidates.find((candidate) => fs.existsSync(candidate)) ?? candidates[0]
}

function resolveHeroImage(filename: string) {
  return path.resolve('public/hero section', filename)
}

async function uploadMediaIfNeeded(
  payload: Awaited<ReturnType<typeof getPayload>>,
  filePath: string,
  fallbackFilename: string,
  mimetype: string,
  alt: string,
) {
  const filename = path.basename(filePath || fallbackFilename)
  const existingMedia = await payload.find({
    collection: 'media',
    limit: 1,
    where: { filename: { equals: filename } },
  })

  if (existingMedia.docs[0]) {
    console.log(`  [media] already exists: ${filename}`)
    return existingMedia.docs[0].id as number
  }

  if (!fs.existsSync(filePath)) {
    console.warn(`  [media] file not found: ${filePath}`)
    return undefined
  }

  const buffer = fs.readFileSync(filePath)
  const uploaded = await payload.create({
    collection: 'media',
    data: { alt },
    file: {
      data: buffer,
      mimetype,
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
    const videoPath = resolveHeroVideo(HERO_CONTENT.videoFile)
    if (fs.existsSync(videoPath)) {
      const filename = path.basename(videoPath)
      const buffer = fs.readFileSync(videoPath)
      const uploaded = await payload.create({
        collection: 'media',
        data: { alt: 'Hero section background video' },
        file: {
          data: buffer,
          mimetype: 'video/mp4',
          name: filename,
          size: buffer.length,
        },
      })
      mediaId = uploaded.id as number
      console.log(`  [media] uploaded: ${filename}`)
    } else {
      console.warn(`  [media] file not found: ${videoPath}`)
    }
  }

  // ── Update global for each locale ───────────────────────────────
  const coverImageId = await uploadMediaIfNeeded(
    payload,
    resolveHeroImage(HERO_CONTENT.coverImageFile),
    HERO_CONTENT.coverImageFile,
    'image/webp',
    'Snow-covered mountain range hero cover',
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
        video:       mediaId,
        poster:      coverImageId,
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
