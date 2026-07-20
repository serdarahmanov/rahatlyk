import fs from 'fs'
import { createRequire } from 'node:module'
import path from 'path'
import { getPayload } from 'payload'
import { ABOUT_MOSAIC_CONTENT } from './lib/data/about-mosaic-content'
import { ABOUT_OUR_STORY_CONTENT } from './lib/data/about-our-story-content'

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

async function seedAboutOurStory() {
  loadEnvConfig(process.cwd())
  const { default: config } = await import('../payload.config')
  const payload = await getPayload({ config })

  console.log('Seeding About Our Story...')

  const data = ABOUT_OUR_STORY_CONTENT
  const [leftImage, centerImage, rightImage] = await Promise.all([
    uploadImage(payload, ABOUT_MOSAIC_CONTENT.leftImage),
    uploadImage(payload, ABOUT_MOSAIC_CONTENT.centerImage),
    uploadImage(payload, ABOUT_MOSAIC_CONTENT.rightImage),
  ])

  // Seed the default locale first — this creates the array items and their IDs
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const created = await (payload.updateGlobal as any)({
    slug: 'about-our-story',
    locale: 'en',
    data: {
      sectionLabel: data.sectionLabel.en,
      title: data.title.en,
      subtitle: data.subtitle.en,
      leftImage,
      centerImage,
      rightImage,
      milestones: data.milestones.map((m) => ({
        year: m.year,
        title: m.title.en,
        body: m.body.en,
        isCurrent: m.isCurrent,
      })),
    },
  })
  console.log('  [global] updated locale: en')

  // Re-fetch to get the stable IDs Payload assigned to each array item
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fetched = await (payload.findGlobal as any)({ slug: 'about-our-story', locale: 'en', depth: 0 })
  const itemIds: (string | number)[] = (fetched?.milestones ?? []).map(
    (m: { id?: string | number }) => m.id,
  )

  // Update remaining locales using the same item IDs so Payload updates in place
  for (const locale of ['tm', 'ru'] as const) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (payload.updateGlobal as any)({
      slug: 'about-our-story',
      locale,
      data: {
        sectionLabel: data.sectionLabel[locale],
        title: data.title[locale],
        subtitle: data.subtitle[locale],
        leftImage,
        centerImage,
        rightImage,
        milestones: data.milestones.map((m, i) => ({
          ...(itemIds[i] !== undefined ? { id: itemIds[i] } : {}),
          year: m.year,
          title: m.title[locale],
          body: m.body[locale],
          isCurrent: m.isCurrent,
        })),
      },
    })
    console.log(`  [global] updated locale: ${locale}`)
  }

  void created // suppress unused warning

  console.log('Done.')
  process.exit(0)
}

seedAboutOurStory().catch((err) => {
  console.error(err)
  process.exit(1)
})
