import { createRequire } from 'node:module'
import { getPayload } from 'payload'

const require = createRequire(import.meta.url)
const { loadEnvConfig } = require('@next/env') as typeof import('@next/env')

const LABELS = {
  en: {
    listingTitle: 'Premium Beverages',
    filterAllLabel: 'All',
    noProductsMessage: 'No products in this category.',
    paginationItemLabel: 'products',
    sizeLabel: 'Size',
    nutritionLabel: 'Nutrition',
    aboutLabel: 'About',
    relatedHeading: 'More in {category}',
    mineralLabel: 'Mineral',
    perLitreLabel: 'Per Litre',
  },
  tm: {
    listingTitle: 'Premium Içgiler',
    filterAllLabel: 'Hemmesi',
    noProductsMessage: 'Bu kategoriýada önüm ýok.',
    paginationItemLabel: 'önüm',
    sizeLabel: 'Göwrüm',
    nutritionLabel: 'Iýmit gymmaty',
    aboutLabel: 'Barada',
    relatedHeading: '{category} boýunça has köp',
    mineralLabel: 'Mineral',
    perLitreLabel: 'Litrde',
  },
  ru: {
    listingTitle: 'Премиальные Напитки',
    filterAllLabel: 'Все',
    noProductsMessage: 'В этой категории пока нет продуктов.',
    paginationItemLabel: 'продуктов',
    sizeLabel: 'Объём',
    nutritionLabel: 'Питательная ценность',
    aboutLabel: 'О продукте',
    relatedHeading: 'Ещё в категории {category}',
    mineralLabel: 'Минерал',
    perLitreLabel: 'На литр',
  },
} as const

async function seedProductDetailLabels() {
  loadEnvConfig(process.cwd())
  const { default: config } = await import('../payload.config')
  const payload = await getPayload({ config })

  console.log('Seeding Product Labels...')

  for (const locale of ['en', 'tm', 'ru'] as const) {
    await payload.updateGlobal({
      slug: 'product-detail-labels',
      locale,
      data: LABELS[locale],
    })
    console.log(`  [global] product-detail-labels updated for locale: ${locale}`)
  }

  console.log('Done.')
  process.exit(0)
}

seedProductDetailLabels().catch((err) => {
  console.error(err)
  process.exit(1)
})
