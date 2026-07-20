import { createRequire } from 'node:module'
import { getPayload } from 'payload'
import { translations, type Locale } from './lib/i18n/translations'

const require = createRequire(import.meta.url)
const { loadEnvConfig } = require('@next/env') as typeof import('@next/env')

const LABELS: Record<Locale, {
  home: string
  products: string
  about: string
  news: string
  vacancies: string
  contact: string
}> = {
  en: {
    home:      translations.en.nav.home,
    products:  'Products',
    about:     'About Us',
    news:      'News',
    vacancies: 'Vacancies',
    contact:   'Contact Us',
  },
  ru: {
    home:      translations.ru.nav.home,
    products:  translations.ru.nav.products,
    about:     translations.ru.nav.about,
    news:      translations.ru.nav.news,
    vacancies: translations.ru.nav.vacancies,
    contact:   translations.ru.nav.contact,
  },
  tm: {
    home:      translations.tm.nav.home,
    products:  translations.tm.nav.products,
    about:     translations.tm.nav.about,
    news:      translations.tm.nav.news,
    vacancies: translations.tm.nav.vacancies,
    contact:   translations.tm.nav.contact,
  },
}

async function seedNavigationLabels() {
  loadEnvConfig(process.cwd())
  const { default: config } = await import('../payload.config')
  const payload = await getPayload({ config })

  console.log('Seeding Navigation Labels...')

  for (const locale of ['en', 'ru', 'tm'] as const) {
    await payload.updateGlobal({
      slug: 'navigation-labels',
      locale,
      data: LABELS[locale],
    })
    console.log(`  [global] navigation-labels updated for locale: ${locale}`)
  }

  console.log('Done.')
  process.exit(0)
}

seedNavigationLabels().catch((error) => {
  console.error(error)
  process.exit(1)
})
