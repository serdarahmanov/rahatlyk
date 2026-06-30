import { translations, type Locale } from '@/lib/i18n/translations'
import type { ProductLabelsData } from '@/types/payload'

type ProductLabelsRaw = Partial<Record<keyof ProductLabelsData, string | null>> | null | undefined

export function getFallbackProductLabels(locale: Locale): ProductLabelsData {
  const t = translations[locale]
  return {
    listingTitle:        t.products.title,
    filterAllLabel:      t.products.filterAll,
    noProductsMessage:   t.vacancies.noCurrent,
    paginationItemLabel: 'products',
    sizeLabel:           'Size',
    nutritionLabel:      'Nutrition',
    aboutLabel:          'About',
    relatedHeading:      'More in {category}',
    mineralLabel:        'Mineral',
    perLitreLabel:       'Per Litre',
  }
}

export function resolveProductLabels(locale: Locale, raw: ProductLabelsRaw): ProductLabelsData {
  const fallback = getFallbackProductLabels(locale)
  return {
    listingTitle:        raw?.listingTitle        || fallback.listingTitle,
    filterAllLabel:      raw?.filterAllLabel      || fallback.filterAllLabel,
    noProductsMessage:   raw?.noProductsMessage   || fallback.noProductsMessage,
    paginationItemLabel: raw?.paginationItemLabel || fallback.paginationItemLabel,
    sizeLabel:           raw?.sizeLabel           || fallback.sizeLabel,
    nutritionLabel:      raw?.nutritionLabel      || fallback.nutritionLabel,
    aboutLabel:          raw?.aboutLabel          || fallback.aboutLabel,
    relatedHeading:      raw?.relatedHeading      || fallback.relatedHeading,
    mineralLabel:        raw?.mineralLabel        || fallback.mineralLabel,
    perLitreLabel:       raw?.perLitreLabel       || fallback.perLitreLabel,
  }
}
