import path from 'path'
import { createRequire } from 'node:module'
import fs, { readFileSync } from 'fs'
import { getPayload } from 'payload'

const require = createRequire(import.meta.url)
const { loadEnvConfig } = require('@next/env') as typeof import('@next/env')

const VACANCY_IMAGES = [
  { titleEn: 'Marketing Manager', imageFile: 'vacancy image (1).png' },
  { titleEn: 'Brand & Content Designer', imageFile: 'vacancy image (2).png' },
  { titleEn: 'Senior Accountant', imageFile: 'vacancy image (3).png' },
  { titleEn: 'Financial Analyst', imageFile: 'vacancy image (4).png' },
  { titleEn: 'Regional Sales Representative', imageFile: 'vacancy image (5).png' },
  { titleEn: 'Key Account Manager', imageFile: 'vacancy image (6).png' },
  { titleEn: 'Logistics Coordinator', imageFile: 'vacancy image (7).png' },
  { titleEn: 'Warehouse & Distribution Supervisor', imageFile: 'vacancy image (8).png' },
]

const IMAGES_DIR = path.join(process.cwd(), 'public', 'vacancy images')

const MIME_BY_EXT: Record<string, string> = {
  '.avif': 'image/avif',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
}

function resolveOptimizedImage(imageFile: string) {
  const ext = path.extname(imageFile)
  const base = path.basename(imageFile, ext)
  const candidates = [
    path.join(IMAGES_DIR, `${base} copy.webp`),
    path.join(IMAGES_DIR, `${base}.webp`),
    path.join(IMAGES_DIR, 'web', `${base}.webp`),
    path.join(IMAGES_DIR, 'web', `${base} copy.webp`),
    path.join(IMAGES_DIR, imageFile),
  ]

  const filePath = candidates.find((candidate) => fs.existsSync(candidate)) ?? candidates[candidates.length - 1]
  const filename = path.basename(filePath)
  const mimetype = MIME_BY_EXT[path.extname(filename).toLowerCase()] ?? 'application/octet-stream'
  return { filePath, filename, mimetype }
}

async function getOrUploadImage(
  payload: Awaited<ReturnType<typeof getPayload>>,
  titleEn: string,
  imageFile: string,
) {
  const source = resolveOptimizedImage(imageFile)
  const existing = await payload.find({
    collection: 'media',
    limit: 1,
    where: { filename: { equals: source.filename } },
  })

  if (existing.docs[0]) {
    console.log(`  [media] already exists: ${source.filename}`)
    return existing.docs[0].id as number
  }

  const fileData = readFileSync(source.filePath)
  const media = await payload.create({
    collection: 'media',
    data: { alt: `${titleEn} - vacancy cover` },
    file: {
      data: fileData,
      mimetype: source.mimetype,
      name: source.filename,
      size: fileData.length,
    },
  })

  console.log(`  [media] uploaded: ${source.filename}`)
  return media.id as number
}

async function seedVacancyImages() {
  loadEnvConfig(process.cwd())
  const { default: config } = await import('../payload.config')
  const payload = await getPayload({ config })

  for (const { titleEn, imageFile } of VACANCY_IMAGES) {
    const result = await payload.find({
      collection: 'vacancies',
      locale: 'en',
      limit: 1,
      where: { title: { equals: titleEn } },
    })

    if (!result.docs[0]) {
      console.warn(`  [skip] vacancy not found: "${titleEn}"`)
      continue
    }

    const vacancy = result.docs[0]
    const mediaId = await getOrUploadImage(payload, titleEn, imageFile)

    await payload.update({
      collection: 'vacancies',
      id: vacancy.id as number,
      data: { image: mediaId },
    })

    console.log(`  [done] "${titleEn}" -> ${imageFile} (media #${mediaId})`)
  }

  console.log('Done.')
  process.exit(0)
}

seedVacancyImages().catch((err) => {
  console.error(err)
  process.exit(1)
})
