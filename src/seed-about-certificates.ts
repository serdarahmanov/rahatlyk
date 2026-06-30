import fs from 'fs'
import { createRequire } from 'node:module'
import path from 'path'
import { getPayload } from 'payload'
import { ABOUT_CERTIFICATES_CONTENT } from './lib/data/about-certificates-content'

const require = createRequire(import.meta.url)
const { loadEnvConfig } = require('@next/env') as typeof import('@next/env')

const CERT_IMAGES: Record<string, string> = {
  'ISO 9001':       'ISO 9001.png',
  'ISO 22000':      'ISO 22000.png',
  'HACCP':          'HACCP.png',
  'State Standard': 'state standart.png',
}

async function uploadCertImage(payload: Awaited<ReturnType<typeof getPayload>>, certName: string): Promise<number | null> {
  const filename = CERT_IMAGES[certName]
  if (!filename) return null

  const filePath = path.resolve('public/about/certificates', filename)
  if (!fs.existsSync(filePath)) {
    console.warn(`  [photo] not found, skipping: ${filePath}`)
    return null
  }

  const existing = await payload.find({
    collection: 'media',
    limit: 1,
    where: { filename: { equals: filename } },
  })

  if (existing.docs[0]) {
    console.log(`  [photo] exists: ${filename}`)
    return existing.docs[0].id as number
  }

  const buffer = fs.readFileSync(filePath)
  const uploaded = await payload.create({
    collection: 'media',
    data: { alt: certName },
    file: { data: buffer, mimetype: 'image/png', name: filename, size: buffer.length },
  })
  console.log(`  [photo] uploaded: ${filename}`)
  return uploaded.id as number
}

async function seedAboutCertificates() {
  loadEnvConfig(process.cwd())
  const { default: config } = await import('../payload.config')
  const payload = await getPayload({ config })

  console.log('Seeding About Certificates...')

  const data = ABOUT_CERTIFICATES_CONTENT

  // Upload images and collect their IDs
  const photoIds: (number | null)[] = []
  for (const cert of data.certificates) {
    const id = await uploadCertImage(payload, cert.name)
    photoIds.push(id)
  }

  // Seed the default locale first to create array items and get their IDs
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (payload.updateGlobal as any)({
    slug: 'about-certificates',
    locale: 'en',
    data: {
      intro: {
        headingText:   data.intro.headingText.en,
        headingAccent: data.intro.headingAccent.en,
        subtitle:      data.intro.subtitle.en,
      },
      seal: { text: data.sealText },
      certificates: data.certificates.map((c, i) => ({
        name:        c.name,
        tag:         c.tag.en,
        description: c.description.en,
        expiryDate:  c.expiryDate,
        ...(photoIds[i] != null ? { photo: photoIds[i] } : {}),
      })),
    },
  })
  console.log('  [global] updated locale: en')

  // Re-fetch to get stable array IDs
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fetched = await (payload.findGlobal as any)({ slug: 'about-certificates', locale: 'en', depth: 0 })
  const itemIds: (string | number)[] = (fetched?.certificates ?? []).map(
    (c: { id?: string | number }) => c.id,
  )

  for (const locale of ['tm', 'ru'] as const) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (payload.updateGlobal as any)({
      slug: 'about-certificates',
      locale,
      data: {
        intro: {
          headingText:   data.intro.headingText[locale],
          headingAccent: data.intro.headingAccent[locale],
          subtitle:      data.intro.subtitle[locale],
        },
        seal: { text: data.sealText },
        certificates: data.certificates.map((c, i) => ({
          ...(itemIds[i] !== undefined ? { id: itemIds[i] } : {}),
          name:        c.name,
          tag:         c.tag[locale],
          description: c.description[locale],
          expiryDate:  c.expiryDate,
          ...(photoIds[i] != null ? { photo: photoIds[i] } : {}),
        })),
      },
    })
    console.log(`  [global] updated locale: ${locale}`)
  }

  console.log('Done.')
  process.exit(0)
}

seedAboutCertificates().catch((err) => {
  console.error(err)
  process.exit(1)
})
