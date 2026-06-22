import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'
import { supportedLocales } from '@/lib/i18n/locale'
import {
  aboutTag,
  contactInfoTag,
  contactTag,
  homeTag,
  newsItemTag,
  newsListTag,
  productTag,
  productsTag,
  siteSettingsTag,
  vacanciesTag,
  vacancyTag,
} from '@/lib/cache/cacheTags'
import { revalidateNext, type RevalidationTargets } from './revalidateNext'

type Entity = { id: string | number }

function forAllLocales(
  build: (locale: (typeof supportedLocales)[number]) => RevalidationTargets,
): RevalidationTargets {
  const paths = new Set<string>()
  const tags = new Set<string>()
  for (const locale of supportedLocales) {
    const targets = build(locale)
    targets.paths?.forEach((path) => paths.add(path))
    targets.tags?.forEach((tag) => tags.add(tag))
  }
  return { paths: [...paths], tags: [...tags] }
}

function globalHook(
  build: (locale: (typeof supportedLocales)[number]) => RevalidationTargets,
): GlobalAfterChangeHook {
  return async ({ doc }) => {
    await revalidateNext(forAllLocales(build))
    return doc
  }
}

function collectionChangeHook(
  build: (locale: (typeof supportedLocales)[number], doc: Entity) => RevalidationTargets,
): CollectionAfterChangeHook<Entity> {
  return async ({ doc }) => {
    await revalidateNext(forAllLocales((locale) => build(locale, doc)))
    return doc
  }
}

function collectionDeleteHook(
  build: (locale: (typeof supportedLocales)[number], doc: Entity) => RevalidationTargets,
): CollectionAfterDeleteHook<Entity> {
  return async ({ doc }) => {
    await revalidateNext(forAllLocales((locale) => build(locale, doc)))
    return doc
  }
}

export const revalidateHomeGlobal = globalHook((locale) => ({
  paths: [`/${locale}`],
  tags: [homeTag(locale)],
}))

export const revalidateAboutGlobal = globalHook((locale) => ({
  paths: [`/${locale}/about`],
  tags: [aboutTag(locale)],
}))

export const revalidateContactGlobal = globalHook((locale) => ({
  paths: [`/${locale}/contact`],
  tags: [contactTag(locale)],
}))

export const revalidateFormsGlobal = globalHook((locale) => ({
  paths: [
    `/${locale}/contact`,
    `/${locale}/vacancies/[id]`,
  ],
  tags: [contactTag(locale), vacanciesTag(locale)],
}))

export const revalidateProductLabelsGlobal = globalHook((locale) => ({
  paths: [`/${locale}/products/[id]`],
  tags: [productsTag(locale)],
}))

export const revalidateContactInfoGlobal = globalHook(() => ({
  tags: [contactInfoTag()],
}))

export const revalidateSiteSettingsGlobal = globalHook(() => ({
  tags: [siteSettingsTag()],
}))

const productTargets = (locale: (typeof supportedLocales)[number], doc: Entity) => ({
  paths: [`/${locale}/products`, `/${locale}/products/${doc.id}`],
  tags: [productsTag(locale), productTag(locale, doc.id)],
})
export const revalidateProductChange = collectionChangeHook(productTargets)
export const revalidateProductDelete = collectionDeleteHook(productTargets)

const newsTargets = (locale: (typeof supportedLocales)[number], doc: Entity) => ({
  paths: [`/${locale}`, `/${locale}/news`, `/${locale}/news/${doc.id}`],
  tags: [homeTag(locale), newsListTag(locale), newsItemTag(locale, doc.id)],
})
export const revalidateArticleChange = collectionChangeHook(newsTargets)
export const revalidateArticleDelete = collectionDeleteHook(newsTargets)

const vacancyTargets = (locale: (typeof supportedLocales)[number], doc: Entity) => ({
  paths: [`/${locale}/vacancies`, `/${locale}/vacancies/${doc.id}`],
  tags: [vacanciesTag(locale), vacancyTag(locale, doc.id)],
})
export const revalidateVacancyChange = collectionChangeHook(vacancyTargets)
export const revalidateVacancyDelete = collectionDeleteHook(vacancyTargets)

export const revalidateProductLinesChange = collectionChangeHook((locale) => ({
  paths: [`/${locale}`],
  tags: [homeTag(locale)],
}))
export const revalidateProductLinesDelete = collectionDeleteHook((locale) => ({
  paths: [`/${locale}`],
  tags: [homeTag(locale)],
}))

export const revalidateProductCategoriesChange = collectionChangeHook((locale) => ({
  paths: [`/${locale}/products`, `/${locale}/products/[id]`],
  tags: [productsTag(locale)],
}))
export const revalidateProductCategoriesDelete = collectionDeleteHook((locale) => ({
  paths: [`/${locale}/products`, `/${locale}/products/[id]`],
  tags: [productsTag(locale)],
}))

export const revalidateArticleCategoriesChange = collectionChangeHook((locale) => ({
  paths: [`/${locale}`, `/${locale}/news`, `/${locale}/news/[id]`],
  tags: [homeTag(locale), newsListTag(locale)],
}))
export const revalidateArticleCategoriesDelete = collectionDeleteHook((locale) => ({
  paths: [`/${locale}`, `/${locale}/news`, `/${locale}/news/[id]`],
  tags: [homeTag(locale), newsListTag(locale)],
}))

export const revalidateVacancyDepartmentsChange = collectionChangeHook((locale) => ({
  paths: [`/${locale}/vacancies`, `/${locale}/vacancies/[id]`],
  tags: [vacanciesTag(locale)],
}))
export const revalidateVacancyDepartmentsDelete = collectionDeleteHook((locale) => ({
  paths: [`/${locale}/vacancies`, `/${locale}/vacancies/[id]`],
  tags: [vacanciesTag(locale)],
}))

export const revalidateMediaChange = collectionChangeHook((locale) => ({
  paths: [
    `/${locale}`,
    `/${locale}/about`,
    `/${locale}/products`,
    `/${locale}/products/[id]`,
    `/${locale}/news`,
    `/${locale}/news/[id]`,
    `/${locale}/vacancies`,
    `/${locale}/vacancies/[id]`,
  ],
  tags: [
    homeTag(locale),
    aboutTag(locale),
    productsTag(locale),
    newsListTag(locale),
    vacanciesTag(locale),
  ],
}))
export const revalidateMediaDelete = collectionDeleteHook((locale) => ({
  paths: [
    `/${locale}`,
    `/${locale}/about`,
    `/${locale}/products`,
    `/${locale}/products/[id]`,
    `/${locale}/news`,
    `/${locale}/news/[id]`,
    `/${locale}/vacancies`,
    `/${locale}/vacancies/[id]`,
  ],
  tags: [
    homeTag(locale),
    aboutTag(locale),
    productsTag(locale),
    newsListTag(locale),
    vacanciesTag(locale),
  ],
}))
