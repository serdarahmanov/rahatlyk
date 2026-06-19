import { getPayload } from 'payload'
import config from '../payload.config'

const LABELS = {
  sizeLabel: {
    en: 'Size',
    tm: 'Göwrüm',
    ru: 'Объём',
  },
  nutritionLabel: {
    en: 'Nutrition',
    tm: 'Iýmit gymmaty',
    ru: 'Питательная ценность',
  },
  aboutLabel: {
    en: 'About',
    tm: 'Barada',
    ru: 'О продукте',
  },
  mineralLabel: {
    en: 'Mineral',
    tm: 'Mineral',
    ru: 'Минерал',
  },
  perLitreLabel: {
    en: 'Per Litre',
    tm: 'Litrde',
    ru: 'На литр',
  },
}

async function seedProductDetailLabels() {
  const payload = await getPayload({ config })

  console.log('Seeding Product Detail Labels...')

  for (const locale of ['en', 'tm', 'ru'] as const) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (payload.updateGlobal as any)({
      slug: 'product-detail-labels',
      locale,
      data: {
        sizeLabel:      LABELS.sizeLabel[locale],
        nutritionLabel: LABELS.nutritionLabel[locale],
        aboutLabel:     LABELS.aboutLabel[locale],
        mineralLabel:   LABELS.mineralLabel[locale],
        perLitreLabel:  LABELS.perLitreLabel[locale],
      },
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
