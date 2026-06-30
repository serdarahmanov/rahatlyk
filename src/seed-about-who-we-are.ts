import fs from 'fs'
import { createRequire } from 'node:module'
import path from 'path'
import { getPayload } from 'payload'
import { ABOUT_WHO_WE_ARE_CONTENT } from './lib/data/about-who-we-are-content'

const require = createRequire(import.meta.url)
const { loadEnvConfig } = require('@next/env') as typeof import('@next/env')

async function uploadMedia(
  payload: Awaited<ReturnType<typeof getPayload>>,
  filePath: string,
  filename: string,
  mimetype: string,
  alt: string,
) {
  const existing = await payload.find({
    collection: 'media',
    limit: 1,
    where: { filename: { equals: filename } },
  })

  if (existing.docs[0]) {
    console.log(`  [media] already exists: ${filename}`)
    return existing.docs[0].id as number
  }

  if (!fs.existsSync(filePath)) {
    throw new Error(`Media file not found: ${filePath}`)
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

async function seedAboutWhoWeAre() {
  loadEnvConfig(process.cwd())
  const { default: config } = await import('../payload.config')
  const payload = await getPayload({ config })

  console.log('Seeding About Who We Are...')

  const { fullViewportImageFile, fullViewportImageDir, fullViewportImageMimeType } = ABOUT_WHO_WE_ARE_CONTENT
  const imageId = await uploadMedia(
    payload,
    path.resolve(fullViewportImageDir, fullViewportImageFile),
    fullViewportImageFile,
    fullViewportImageMimeType,
    'Who We Are - full viewport background',
  )

  const videoId = await uploadMedia(
    payload,
    path.resolve(ABOUT_WHO_WE_ARE_CONTENT.backgroundVideoPath),
    ABOUT_WHO_WE_ARE_CONTENT.backgroundVideoFile,
    'video/mp4',
    'Who We Are - background video',
  )

  const { statement, whoWeAre } = ABOUT_WHO_WE_ARE_CONTENT

  for (const locale of ['en', 'tm', 'ru'] as const) {
    await (payload.updateGlobal as any)({
      slug: 'about-who-we-are',
      locale,
      data: {
        statement: {
          text: statement.text[locale],
          accentWordIndex: statement.accentWordIndex[locale],
        },
        whoWeAre: {
          sectionTitle: whoWeAre.sectionTitle[locale],
          paragraph1: whoWeAre.paragraph1[locale],
          paragraph2: whoWeAre.paragraph2[locale],
          paragraph3: whoWeAre.paragraph3[locale],
        },
        fullViewportImage: imageId,
        backgroundVideo: videoId,
      },
    })
    console.log(`  [global] updated locale: ${locale}`)
  }

  console.log('Done.')
  process.exit(0)
}

seedAboutWhoWeAre().catch((err) => {
  console.error(err)
  process.exit(1)
})
