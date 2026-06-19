import { getPayload } from 'payload'
import config from '../payload.config'
import { ABOUT_CERTIFICATES_CONTENT } from './lib/data/about-certificates-content'

async function seedAboutCertificates() {
  const payload = await getPayload({ config })

  console.log('Seeding About Certificates...')

  const data = ABOUT_CERTIFICATES_CONTENT

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
      certificates: data.certificates.map((c) => ({
        name:        c.name,
        tag:         c.tag.en,
        description: c.description.en,
        expiryDate:  c.expiryDate,
        // photo left null — upload actual certificate images via admin
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
