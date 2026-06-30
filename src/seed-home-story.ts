import fs from 'fs'
import { createRequire } from 'node:module'
import path from 'path'
import { getPayload } from 'payload'
import { HOME_STORY_CONTENT } from './lib/data/home-story-content'

const require = createRequire(import.meta.url)
const { loadEnvConfig } = require('@next/env') as typeof import('@next/env')

const MIME_BY_EXT: Record<string, string> = {
  '.avif': 'image/avif',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
}

function resolvePublicImage(publicPath: string) {
  const normalizedPath = publicPath.replace(/^\//, '')
  const originalPath = path.resolve('public', normalizedPath)
  const ext = path.extname(originalPath)
  const basePath = originalPath.slice(0, -ext.length)
  const candidates = [
    `${basePath} copy.webp`,
    `${basePath}.webp`,
    `${basePath}.avif`,
    path.join(path.dirname(originalPath), 'web', `${path.basename(basePath)} copy.webp`),
    path.join(path.dirname(originalPath), 'web', `${path.basename(basePath)}.webp`),
    path.join(path.dirname(originalPath), 'web', `${path.basename(basePath)}.avif`),
    originalPath,
  ]
  const filePath = candidates.find((candidate) => fs.existsSync(candidate)) ?? originalPath
  const filename = path.basename(filePath)
  const mimetype = MIME_BY_EXT[path.extname(filename).toLowerCase()] ?? 'application/octet-stream'

  return { filePath, filename, mimetype }
}

async function uploadImage(payload: Awaited<ReturnType<typeof getPayload>>) {
  const source = resolvePublicImage(HOME_STORY_CONTENT.image)

  const existing = await payload.find({
    collection: 'media',
    limit: 1,
    where: { filename: { equals: source.filename } },
  })

  if (existing.docs[0]) {
    console.log(`  [media] already exists: ${source.filename}`)
    return existing.docs[0].id as number
  }

  if (!fs.existsSync(source.filePath)) {
    throw new Error(`Home story image not found: ${source.filePath}`)
  }

  const buffer = fs.readFileSync(source.filePath)
  const uploaded = await payload.create({
    collection: 'media',
    data: { alt: 'Home story background image' },
    file: {
      data: buffer,
      mimetype: source.mimetype,
      name: source.filename,
      size: buffer.length,
    },
  })

  console.log(`  [media] uploaded: ${source.filename}`)
  return uploaded.id as number
}

async function seedHomeStory() {
  loadEnvConfig(process.cwd())
  const { default: config } = await import('../payload.config')
  const payload = await getPayload({ config })

  console.log('Seeding Home Story...')

  const imageId = await uploadImage(payload)

  for (const locale of ['en', 'tm', 'ru'] as const) {
    await payload.updateGlobal({
      slug: 'home-story',
      locale,
      data: {
        tag: HOME_STORY_CONTENT.tag[locale],
        title: HOME_STORY_CONTENT.title[locale],
        text: HOME_STORY_CONTENT.text[locale],
        image: imageId,
      },
    })
    console.log(`  [global] updated locale: ${locale}`)
  }

  console.log('Done.')
  process.exit(0)
}

seedHomeStory().catch((error) => {
  console.error(error)
  process.exit(1)
})
