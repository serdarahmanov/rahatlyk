import { getPayload } from 'payload'
import config from '../payload.config'
import { ABOUT_OUR_STORY_CONTENT } from './lib/data/about-our-story-content'

async function seedAboutOurStory() {
  const payload = await getPayload({ config })

  console.log('Seeding About Our Story...')

  const data = ABOUT_OUR_STORY_CONTENT

  // Seed the default locale first — this creates the array items and their IDs
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const created = await (payload.updateGlobal as any)({
    slug: 'about-our-story',
    locale: 'en',
    data: {
      sectionLabel: data.sectionLabel.en,
      title: data.title.en,
      subtitle: data.subtitle.en,
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
