import fs from 'fs'
import { createRequire } from 'node:module'
import path from 'path'
import { getPayload } from 'payload'
import { ABOUT_HERO_CONTENT } from './lib/data/about-hero-content'

const require = createRequire(import.meta.url)
const { loadEnvConfig } = require('@next/env') as typeof import('@next/env')

async function seedAboutHero() {
  loadEnvConfig(process.cwd())
  const { default: config } = await import('../payload.config')
  const payload = await getPayload({ config })

  console.log('Seeding About Hero...')

  // Upload cover image if not already in media
  const existing = await payload.find({
    collection: 'media',
    limit: 1,
    where: { filename: { equals: ABOUT_HERO_CONTENT.imageFile } },
  })

  let mediaId: number | undefined

  if (existing.docs[0]) {
    mediaId = existing.docs[0].id as number
    console.log(`  [media] already exists: ${ABOUT_HERO_CONTENT.imageFile}`)
  } else {
    const imgPath = path.resolve(ABOUT_HERO_CONTENT.imageDir, ABOUT_HERO_CONTENT.imageFile)
    if (fs.existsSync(imgPath)) {
      const buffer = fs.readFileSync(imgPath)
      const uploaded = await payload.create({
        collection: 'media',
        data: { alt: 'About page hero cover image' },
        file: {
          data: buffer,
          mimetype: 'image/webp',
          name: ABOUT_HERO_CONTENT.imageFile,
          size: buffer.length,
        },
      })
      mediaId = uploaded.id as number
      console.log(`  [media] uploaded: ${ABOUT_HERO_CONTENT.imageFile}`)
    } else {
      console.warn(`  [media] file not found: ${imgPath}`)
    }
  }

  for (const locale of ['en', 'tm', 'ru'] as const) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (payload.updateGlobal as any)({
      slug: 'about-hero',
      locale,
      data: {
        title: ABOUT_HERO_CONTENT.title[locale],
        accentWordIndex: ABOUT_HERO_CONTENT.accentWordIndex[locale],
        coverImage: mediaId,
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
