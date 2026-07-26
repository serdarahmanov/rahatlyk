import { createRequire } from 'node:module'
import { getPayload } from 'payload'

const require = createRequire(import.meta.url)
const { loadEnvConfig } = require('@next/env') as typeof import('@next/env')

const CONTENT = {
  en: {
    title: 'Page Not Found',
    message: "We couldn't find the page you were looking for. It may have been moved, or the link might be outdated.",
    ctaLabel: 'Back to Home',
  },
  ru: {
    title: 'Страница не найдена',
    message: 'Мы не смогли найти страницу, которую вы искали. Возможно, она была перемещена, или ссылка устарела.',
    ctaLabel: 'На главную',
  },
  tm: {
    title: 'Sahypa Tapylmady',
    message: 'Gözlän sahypaňyzy tapyp bilmedik. Ol üýtgedilen bolmagy ýa-da salgysy köne bolmagy mümkin.',
    ctaLabel: 'Baş sahypa',
  },
} as const

async function seedNotFoundPage() {
  loadEnvConfig(process.cwd())
  const { default: config } = await import('../payload.config')
  const payload = await getPayload({ config })

  console.log('Seeding Not Found (404) Page...')

  for (const locale of ['en', 'ru', 'tm'] as const) {
    await payload.updateGlobal({
      slug: 'not-found-page',
      locale,
      data: CONTENT[locale],
    })
    console.log(`  [global] not-found-page updated for locale: ${locale}`)
  }

  console.log('Done.')
  process.exit(0)
}

seedNotFoundPage().catch((err) => {
  console.error(err)
  process.exit(1)
})
