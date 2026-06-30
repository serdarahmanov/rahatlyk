import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'
import { supportedLocales } from '@/lib/i18n/locale'
import {
  aboutTag,
  articleLabelsTag,
  contactInfoTag,
  contactTag,
  homeTag,
  newsItemTag,
  newsListTag,
  productLabelsTag,
  productTag,
  productsTag,
  vacanciesTag,
  vacancyLabelsTag,
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
  paths: [`/${locale}/products`, `/${locale}/products/[id]`],
  tags: [productLabelsTag(locale), productsTag(locale)],
}))

export const revalidateArticleLabelsGlobal = globalHook((locale) => ({
  paths: [`/${locale}`, `/${locale}/news`, `/${locale}/news/[id]`],
  tags: [articleLabelsTag(locale), homeTag(locale), newsListTag(locale)],
}))

export const revalidateVacancyLabelsGlobal = globalHook((locale) => ({
  paths: [`/${locale}/vacancies`, `/${locale}/vacancies/[id]`],
  tags: [vacancyLabelsTag(locale), vacanciesTag(locale)],
}))

export const revalidateContactInfoGlobal = globalHook((locale) => ({
  paths: [
    `/${locale}`,
    `/${locale}/about`,
    `/${locale}/contact`,
    `/${locale}/products`,
    `/${locale}/products/[id]`,
    `/${locale}/news`,
    `/${locale}/news/[id]`,
    `/${locale}/vacancies`,
    `/${locale}/vacancies/[id]`,
  ],
  tags: [
    contactInfoTag(),
    homeTag(locale),
    aboutTag(locale),
    contactTag(locale),
    productsTag(locale),
    newsListTag(locale),
    vacanciesTag(locale),
  ],
}))

export const revalidateProductChange: CollectionAfterChangeHook<Entity> = async ({ doc, operation }) => {
  await revalidateNext(forAllLocales((locale) => {
    const tags = [productsTag(locale)]
    const paths = [`/${locale}/products`]

    // On create the detail page doesn't exist in cache yet — skip it.
    // On update the specific product data and its ISR page are stale.
    if (operation === 'update') {
      tags.push(productTag(locale, doc.id))
      paths.push(`/${locale}/products/${doc.id}`)
    }

    return { tags, paths }
  }))
  return doc
}

export const revalidateProductDelete: CollectionAfterDeleteHook<Entity> = async ({ doc }) => {
  await revalidateNext(forAllLocales((locale) => ({
    tags: [productsTag(locale), productTag(locale, doc.id)],
    // Detail path revalidated so Next.js serves 404 immediately instead of stale ISR.
    paths: [`/${locale}/products`, `/${locale}/products/${doc.id}`],
  })))
}

export const revalidateArticleChange: CollectionAfterChangeHook<Entity> = async ({ doc, operation }) => {
  await revalidateNext(forAllLocales((locale) => {
    const tags = [homeTag(locale), newsListTag(locale)]
    const paths = [`/${locale}`, `/${locale}/news`]

    // On create the detail page doesn't exist in cache yet — skip it.
    // On update the cached detail data is stale and the ISR page must refresh.
    if (operation === 'update') {
      tags.push(newsItemTag(locale, doc.id))
      paths.push(`/${locale}/news/${doc.id}`)
    }

    return { tags, paths }
  }))
  return doc
}

export const revalidateArticleDelete: CollectionAfterDeleteHook<Entity> = async ({ doc }) => {
  await revalidateNext(forAllLocales((locale) => ({
    tags: [homeTag(locale), newsListTag(locale), newsItemTag(locale, doc.id)],
    // Detail path revalidated so Next.js serves 404 immediately instead of stale ISR.
    paths: [`/${locale}`, `/${locale}/news`, `/${locale}/news/${doc.id}`],
  })))
}

export const revalidateVacancyChange: CollectionAfterChangeHook<Entity> = async ({ doc, operation }) => {
  await revalidateNext(forAllLocales((locale) => {
    const tags = [vacanciesTag(locale)]
    const paths = [`/${locale}/vacancies`]

    // On create the detail page doesn't exist in cache yet — skip it.
    // On update the specific vacancy data and its ISR page are stale.
    if (operation === 'update') {
      tags.push(vacancyTag(locale, doc.id))
      paths.push(`/${locale}/vacancies/${doc.id}`)
    }

    return { tags, paths }
  }))
  return doc
}

export const revalidateVacancyDelete: CollectionAfterDeleteHook<Entity> = async ({ doc }) => {
  await revalidateNext(forAllLocales((locale) => ({
    tags: [vacanciesTag(locale), vacancyTag(locale, doc.id)],
    // Detail path revalidated so Next.js serves 404 immediately instead of stale ISR.
    paths: [`/${locale}/vacancies`, `/${locale}/vacancies/${doc.id}`],
  })))
}

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
    `/${locale}/contact`,
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
    contactTag(locale),
    contactInfoTag(),
    productsTag(locale),
    newsListTag(locale),
    vacanciesTag(locale),
  ],
}))
export const revalidateMediaDelete = collectionDeleteHook((locale) => ({
  paths: [
    `/${locale}`,
    `/${locale}/about`,
    `/${locale}/contact`,
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
    contactTag(locale),
    contactInfoTag(),
    productsTag(locale),
    newsListTag(locale),
    vacanciesTag(locale),
  ],
}))
