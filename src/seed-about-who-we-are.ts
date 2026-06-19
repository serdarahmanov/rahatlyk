import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'
import config from '../payload.config'
import { ABOUT_WHO_WE_ARE_CONTENT } from './lib/data/about-who-we-are-content'

async function seedAboutWhoWeAre() {
  const payload = await getPayload({ config })

  console.log('Seeding About Who We Are...')

  // Upload full viewport image if not already in media
  const { fullViewportImageFile, fullViewportImageDir } = ABOUT_WHO_WE_ARE_CONTENT
  const existing = await payload.find({
    collection: 'media',
    limit: 1,
    where: { filename: { equals: fullViewportImageFile } },
  })

  let mediaId: number | undefined

  if (existing.docs[0]) {
    mediaId = existing.docs[0].id as number
    console.log(`  [media] already exists: ${fullViewportImageFile}`)
  } else {
    const imgPath = path.resolve(fullViewportImageDir, fullViewportImageFile)
    if (fs.existsSync(imgPath)) {
      const buffer = fs.readFileSync(imgPath)
      const uploaded = await payload.create({
        collection: 'media',
        data: { alt: 'Who We Are — full viewport background' },
        file: {
          data: buffer,
          mimetype: 'image/jpeg',
          name: fullViewportImageFile,
          size: buffer.length,
        },
      })
      mediaId = uploaded.id as number
      console.log(`  [media] uploaded: ${fullViewportImageFile}`)
    } else {
      console.warn(`  [media] file not found: ${imgPath}`)
    }
  }

  const { statement, whoWeAre } = ABOUT_WHO_WE_ARE_CONTENT

  for (const locale of ['en', 'tm', 'ru'] as const) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        ...(locale === 'en' ? { fullViewportImage: mediaId } : {}),
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
