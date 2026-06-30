import fs from 'fs'
import { createRequire } from 'node:module'
import path from 'path'
import { getPayload } from 'payload'
import { HORIZONTAL_SCROLL_CONTENT } from './lib/data/horizontal-scroll-content'

const require = createRequire(import.meta.url)
const { loadEnvConfig } = require('@next/env') as typeof import('@next/env')

const MIME_BY_EXT: Record<string, string> = {
  '.avif': 'image/avif',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.mp4': 'video/mp4',
  '.png': 'image/png',
  '.webp': 'image/webp',
}

type MediaSource = {
  path: string
  mimetype: string
  alt: string
}

function resolvePublicMedia(source: MediaSource) {
  const normalizedPath = source.path.replace(/^\//, '')
  const originalPath = path.resolve('public', normalizedPath)
  const ext = path.extname(originalPath)
  const basePath = originalPath.slice(0, -ext.length)
  const optimizedExtensions = ext.toLowerCase() === '.mp4' ? ['.mp4'] : ['.webp', '.avif']
  const optimizedCandidates = optimizedExtensions.flatMap((optimizedExt) => [
    `${basePath} copy${optimizedExt}`,
    `${basePath}-optimized${optimizedExt}`,
    `${basePath}${optimizedExt}`,
    path.join(path.dirname(originalPath), 'web', `${path.basename(basePath)} copy${optimizedExt}`),
    path.join(path.dirname(originalPath), 'web', `${path.basename(basePath)}-optimized${optimizedExt}`),
    path.join(path.dirname(originalPath), 'web', `${path.basename(basePath)}${optimizedExt}`),
  ])
  const candidates = [...optimizedCandidates, originalPath]
  const filePath = candidates.find((candidate) => fs.existsSync(candidate)) ?? originalPath
  const filename = path.basename(filePath)
  const mimetype = MIME_BY_EXT[path.extname(filename).toLowerCase()] ?? source.mimetype

  return { filePath, filename, mimetype }
}

async function uploadMedia(payload: Awaited<ReturnType<typeof getPayload>>, source: MediaSource) {
  const resolved = resolvePublicMedia(source)

  const existing = await payload.find({
    collection: 'media',
    limit: 1,
    where: { filename: { equals: resolved.filename } },
  })

  if (existing.docs[0]) {
    console.log(`  [media] already exists: ${resolved.filename}`)
    return existing.docs[0].id as number
  }

  if (!fs.existsSync(resolved.filePath)) {
    throw new Error(`Horizontal scroll media not found: ${resolved.filePath}`)
  }

  const buffer = fs.readFileSync(resolved.filePath)
  const uploaded = await payload.create({
    collection: 'media',
    data: { alt: source.alt },
    file: {
      data: buffer,
      mimetype: resolved.mimetype,
      name: resolved.filename,
      size: buffer.length,
    },
  })

  console.log(`  [media] uploaded: ${resolved.filename}`)
  return uploaded.id as number
}

async function seedHorizontalScroll() {
  loadEnvConfig(process.cwd())
  const { default: config } = await import('../payload.config')
  const payload = await getPayload({ config })

  console.log('Seeding Horizontal Scroll...')

  const box1Image = await uploadMedia(payload, HORIZONTAL_SCROLL_CONTENT.box1.image)
  const box3Image = await uploadMedia(payload, HORIZONTAL_SCROLL_CONTENT.box3.image)
  const box5Video = await uploadMedia(payload, HORIZONTAL_SCROLL_CONTENT.box5.video)
  const box5CoverImage = await uploadMedia(payload, HORIZONTAL_SCROLL_CONTENT.box5.coverImage)

  for (const locale of ['en', 'tm', 'ru'] as const) {
    await payload.updateGlobal({
      slug: 'horizontal-scroll',
      locale,
      data: {
        box1: {
          image: box1Image,
        },
        box2: {
          tag: HORIZONTAL_SCROLL_CONTENT.box2.tag[locale],
          headline: HORIZONTAL_SCROLL_CONTENT.box2.headline[locale],
        },
        box3: {
          image: box3Image,
        },
        box4: {
          text: HORIZONTAL_SCROLL_CONTENT.box4.text[locale],
          buttonLabel: HORIZONTAL_SCROLL_CONTENT.box4.buttonLabel[locale],
          buttonHref: HORIZONTAL_SCROLL_CONTENT.box4.buttonHref,
        },
        box5: {
          video: box5Video,
          coverImage: box5CoverImage,
          tag: HORIZONTAL_SCROLL_CONTENT.box5.tag[locale],
          headline: HORIZONTAL_SCROLL_CONTENT.box5.headline[locale],
        },
        box6: {
          tag: HORIZONTAL_SCROLL_CONTENT.box6.tag[locale],
          headline: HORIZONTAL_SCROLL_CONTENT.box6.headline[locale],
          buttonLabel: HORIZONTAL_SCROLL_CONTENT.box6.buttonLabel[locale],
          buttonHref: HORIZONTAL_SCROLL_CONTENT.box6.buttonHref,
        },
      },
    })
    console.log(`  [global] updated locale: ${locale}`)
  }

  console.log('Done.')
  process.exit(0)
}

seedHorizontalScroll().catch((error) => {
  console.error(error)
  process.exit(1)
})
