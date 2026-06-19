import { getPayload } from 'payload'
import config from '../payload.config'
import { ABOUT_NUMBERS_CONTENT } from './lib/data/about-numbers-content'

async function seedAboutNumbers() {
  const payload = await getPayload({ config })

  console.log('Seeding About Numbers...')

  const data = ABOUT_NUMBERS_CONTENT

  // Seed the default locale first to create array items and get their IDs
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (payload.updateGlobal as any)({
    slug: 'about-numbers',
    locale: 'en',
    data: {
      stats: data.stats.map((s) => ({
        value: s.value,
        suffix: s.suffix,
        label: s.label.en,
      })),
      tagline: {
        text:       data.tagline.text.en,
        accentText: data.tagline.accentText.en,
      },
    },
  })
  console.log('  [global] updated locale: en')

  // Re-fetch to get stable array IDs
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fetched = await (payload.findGlobal as any)({ slug: 'about-numbers', locale: 'en', depth: 0 })
  const itemIds: (string | number)[] = (fetched?.stats ?? []).map(
    (s: { id?: string | number }) => s.id,
  )

  for (const locale of ['tm', 'ru'] as const) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (payload.updateGlobal as any)({
      slug: 'about-numbers',
      locale,
      data: {
        stats: data.stats.map((s, i) => ({
          ...(itemIds[i] !== undefined ? { id: itemIds[i] } : {}),
          value: s.value,
          suffix: s.suffix,
          label: s.label[locale],
        })),
        tagline: {
          text:       data.tagline.text[locale],
          accentText: data.tagline.accentText[locale],
        },
      },
    })
    console.log(`  [global] updated locale: ${locale}`)
  }

  console.log('Done.')
  process.exit(0)
}

seedAboutNumbers().catch((err) => {
  console.error(err)
  process.exit(1)
})
