import { createRequire } from 'node:module'
import { getPayload } from 'payload'

const require = createRequire(import.meta.url)
const { loadEnvConfig } = require('@next/env') as typeof import('@next/env')

const LABELS = {
  en: {
    homeSectionTag: 'Latest News',
    pageTitle: 'News & Updates',
    filterAllLabel: 'All',
    featuredLabel: 'Featured',
    readArticleLabel: 'Read article',
    backToNewsLabel: 'View All News',
    moreArticlesHeading: 'More Articles',
    noArticlesMessage: 'No articles in this category.',
  },
  tm: {
    homeSectionTag: 'Soňky habarlar',
    pageTitle: 'Habarlar we Täzelikler',
    filterAllLabel: 'Hemmesi',
    featuredLabel: 'Öňe çykarylan',
    readArticleLabel: 'Makalany oka',
    backToNewsLabel: 'Ähli habarlary görüň',
    moreArticlesHeading: 'Has köp makala',
    noArticlesMessage: 'Bu kategoriýada makala ýok.',
  },
  ru: {
    homeSectionTag: 'Последние новости',
    pageTitle: 'Новости и Обновления',
    filterAllLabel: 'Все',
    featuredLabel: 'Главное',
    readArticleLabel: 'Читать статью',
    backToNewsLabel: 'Все новости',
    moreArticlesHeading: 'Ещё статьи',
    noArticlesMessage: 'В этой категории пока нет статей.',
  },
} as const

async function seedArticleLabels() {
  loadEnvConfig(process.cwd())
  const { default: config } = await import('../payload.config')
  const payload = await getPayload({ config })

  console.log('Seeding Article Labels...')

  for (const locale of ['en', 'tm', 'ru'] as const) {
    await payload.updateGlobal({
      slug: 'article-labels',
      locale,
      data: LABELS[locale],
    })
    console.log(`  [global] article-labels updated for locale: ${locale}`)
  }

  console.log('Done.')
  process.exit(0)
}

seedArticleLabels().catch((err) => {
  console.error(err)
  process.exit(1)
})
