import { getPayload } from 'payload'
import config from '../payload.config'
import { ABOUT_CONTENT } from './lib/data/about-content'

async function seedAbout() {
  const payload = await getPayload({ config })

  console.log('Seeding Contact Hero...')

  for (const locale of ['en', 'tm', 'ru'] as const) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (payload.updateGlobal as any)({
      slug: 'about-page',
      locale,
      data: {
        hero: {
          title:       ABOUT_CONTENT.hero.title[locale],
          description: ABOUT_CONTENT.hero.description[locale],
        },
      },
    })
    console.log(`  [global] about-page updated for locale: ${locale}`)
  }

  console.log('Done.')
  process.exit(0)
}

seedAbout().catch((err) => {
  console.error(err)
  process.exit(1)
})
