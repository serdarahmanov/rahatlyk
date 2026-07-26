import { createRequire } from 'node:module'
import { getPayload } from 'payload'

const require = createRequire(import.meta.url)
const { loadEnvConfig } = require('@next/env') as typeof import('@next/env')

const FOOTER = {
  en: {
    tagline:         'Premium beverages from the heart of Turkmenistan',
    quickLinksLabel: 'Quick Links',
    companyLabel:    'Company',
    rights:          '© 2025 RAHATLYK. All rights reserved.',
  },
  ru: {
    tagline:         'Премиальные напитки из сердца Туркменистана',
    quickLinksLabel: 'Быстрые ссылки',
    companyLabel:    'Компания',
    rights:          '© 2025 RAHATLYK. Все права защищены.',
  },
  tm: {
    tagline:         'Türkmenistanyň kalbyndan premium içgiler',
    quickLinksLabel: 'Çalt Baglanyşyklar',
    companyLabel:    'Kompaniýa',
    rights:          '© 2025 RAHATLYK. Ähli hukuklar goralandyr.',
  },
} as const

async function seedFooter() {
  loadEnvConfig(process.cwd())
  const { default: config } = await import('../payload.config')
  const payload = await getPayload({ config })

  console.log('Seeding Footer...')

  for (const locale of ['en', 'ru', 'tm'] as const) {
    await payload.updateGlobal({
      slug: 'footer',
      locale,
      data: FOOTER[locale],
    })
    console.log(`  [global] footer updated for locale: ${locale}`)
  }

  console.log('Done.')
  process.exit(0)
}

seedFooter().catch((err) => {
  console.error(err)
  process.exit(1)
})
