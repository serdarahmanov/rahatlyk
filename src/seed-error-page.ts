import { createRequire } from 'node:module'
import { getPayload } from 'payload'

const require = createRequire(import.meta.url)
const { loadEnvConfig } = require('@next/env') as typeof import('@next/env')

const CONTENT = {
  en: {
    label: 'Error',
    title: 'Something Went Wrong',
    message: "We're sorry — something unexpected happened on our end. Please try again, or head back to the home page.",
    retryLabel: 'Try Again',
    ctaLabel: 'Back to Home',
  },
  ru: {
    label: 'Ошибка',
    title: 'Что-то пошло не так',
    message: 'Извините — на нашей стороне произошла непредвиденная ошибка. Пожалуйста, попробуйте снова или вернитесь на главную страницу.',
    retryLabel: 'Попробовать снова',
    ctaLabel: 'На главную',
  },
  tm: {
    label: 'Näsazlyk',
    title: 'Näsazlyk Ýüze Çykdy',
    message: 'Bagyşlaň — bizde garaşylmadyk näsazlyk ýüze çykdy. Gaýtadan synanyşyň ýa-da baş sahypa dolanyň.',
    retryLabel: 'Gaýtadan synanyş',
    ctaLabel: 'Baş sahypa',
  },
} as const

async function seedErrorPage() {
  loadEnvConfig(process.cwd())
  const { default: config } = await import('../payload.config')
  const payload = await getPayload({ config })

  console.log('Seeding Error Page...')

  for (const locale of ['en', 'ru', 'tm'] as const) {
    await payload.updateGlobal({
      slug: 'error-page',
      locale,
      data: CONTENT[locale],
    } as never)
    console.log(`  [global] error-page updated for locale: ${locale}`)
  }

  console.log('Done.')
  process.exit(0)
}

seedErrorPage().catch((err) => {
  console.error(err)
  process.exit(1)
})
