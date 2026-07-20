import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'
import { supportedLocales, withLocale } from '@/lib/i18n/locale'
import {
  aboutTag,
  articleLabelsTag,
  contactInfoTag,
  contactTag,
  homeTag,
  newsListTag,
  navigationLabelsTag,
  productLabelsTag,
  productsTag,
  siteMetadataTag,
  vacanciesTag,
  vacancyLabelsTag,
  vacancyTag,
} from '@/lib/cache/cacheTags'
import { revalidateNext, type RevalidationTargets } from './revalidateNext'

type Entity = { id: string | number }

function publicPath(locale: (typeof supportedLocales)[number], path = '/') {
  return withLocale(locale, path)
}

const SITEMAP_PATH = '/sitemap.xml'

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
  paths: [publicPath(locale)],
  tags: [homeTag(locale)],
}))

export const revalidateAboutGlobal = globalHook((locale) => ({
  paths: [publicPath(locale, '/about')],
  tags: [aboutTag(locale)],
}))

export const revalidateContactGlobal = globalHook((locale) => ({
  paths: [publicPath(locale, '/contact')],
  tags: [contactTag(locale)],
}))

export const revalidateFormsGlobal = globalHook((locale) => ({
  paths: [
    publicPath(locale, '/contact'),
    publicPath(locale, '/vacancies/[id]'),
  ],
  tags: [contactTag(locale), vacanciesTag(locale)],
}))

export const revalidateProductLabelsGlobal = globalHook((locale) => ({
  paths: [publicPath(locale, '/products'), publicPath(locale, '/products/[slug]')],
  tags: [productLabelsTag(locale), productsTag(locale)],
}))

export const revalidateArticleLabelsGlobal = globalHook((locale) => ({
  paths: [publicPath(locale), publicPath(locale, '/news'), publicPath(locale, '/news/[slug]')],
  tags: [articleLabelsTag(locale), homeTag(locale), newsListTag(locale)],
}))

export const revalidateVacancyLabelsGlobal = globalHook((locale) => ({
  paths: [publicPath(locale, '/vacancies'), publicPath(locale, '/vacancies/[id]')],
  tags: [vacancyLabelsTag(locale), vacanciesTag(locale)],
}))

export const revalidateSiteMetadataGlobal = globalHook((locale) => ({
  paths: [
    publicPath(locale),
    publicPath(locale, '/about'),
    publicPath(locale, '/products'),
    publicPath(locale, '/products/[slug]'),
    publicPath(locale, '/news'),
    publicPath(locale, '/news/[slug]'),
    publicPath(locale, '/vacancies'),
    publicPath(locale, '/vacancies/[id]'),
    publicPath(locale, '/contact'),
  ],
  tags: [siteMetadataTag(locale)],
}))

export const revalidateContactInfoGlobal = globalHook((locale) => ({
  paths: [
    publicPath(locale),
    publicPath(locale, '/about'),
    publicPath(locale, '/contact'),
    publicPath(locale, '/products'),
    publicPath(locale, '/products/[slug]'),
    publicPath(locale, '/news'),
    publicPath(locale, '/news/[slug]'),
    publicPath(locale, '/vacancies'),
    publicPath(locale, '/vacancies/[id]'),
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

export const revalidateNavigationLabelsGlobal = globalHook((locale) => ({
  paths: [
    publicPath(locale),
    publicPath(locale, '/about'),
    publicPath(locale, '/contact'),
    publicPath(locale, '/products'),
    publicPath(locale, '/products/[slug]'),
    publicPath(locale, '/news'),
    publicPath(locale, '/news/[slug]'),
    publicPath(locale, '/vacancies'),
    publicPath(locale, '/vacancies/[id]'),
  ],
  tags: [navigationLabelsTag(locale)],
}))

export const revalidateProductChange: CollectionAfterChangeHook<Entity> = async ({ doc, operation }) => {
  await revalidateNext(forAllLocales((locale) => {
    const tags = [productsTag(locale)]
    const paths = [publicPath(locale, '/products'), SITEMAP_PATH]

    // On create the detail page doesn't exist in cache yet — skip it.
    // On update the specific product data and its ISR page are stale.
    if (operation === 'update') {
      paths.push(publicPath(locale, '/products/[slug]'))
    }

    return { tags, paths }
  }))
  return doc
}

export const revalidateProductDelete: CollectionAfterDeleteHook<Entity> = async () => {
  await revalidateNext(forAllLocales((locale) => ({
    tags: [productsTag(locale)],
    // Detail path revalidated so Next.js serves 404 immediately instead of stale ISR.
    paths: [publicPath(locale, '/products'), publicPath(locale, '/products/[slug]'), SITEMAP_PATH],
  })))
}

export const revalidateArticleChange: CollectionAfterChangeHook<Entity> = async ({ doc, operation }) => {
  await revalidateNext(forAllLocales((locale) => {
    const tags = [homeTag(locale), newsListTag(locale)]
    const paths = [publicPath(locale), publicPath(locale, '/news'), SITEMAP_PATH]

    // On create the detail page doesn't exist in cache yet — skip it.
    // On update the cached detail data is stale and the ISR page must refresh.
    if (operation === 'update') {
      paths.push(publicPath(locale, '/news/[slug]'))
    }

    return { tags, paths }
  }))
  return doc
}

export const revalidateArticleDelete: CollectionAfterDeleteHook<Entity> = async () => {
  await revalidateNext(forAllLocales((locale) => ({
    tags: [homeTag(locale), newsListTag(locale)],
    // Detail path revalidated so Next.js serves 404 immediately instead of stale ISR.
    paths: [publicPath(locale), publicPath(locale, '/news'), publicPath(locale, '/news/[slug]'), SITEMAP_PATH],
  })))
}

export const revalidateVacancyChange: CollectionAfterChangeHook<Entity> = async ({ doc, operation }) => {
  await revalidateNext(forAllLocales((locale) => {
    const tags = [vacanciesTag(locale)]
    const paths = [publicPath(locale, '/vacancies')]

    // On create the detail page doesn't exist in cache yet — skip it.
    // On update the specific vacancy data and its ISR page are stale.
    if (operation === 'update') {
      tags.push(vacancyTag(locale, doc.id))
      paths.push(publicPath(locale, `/vacancies/${doc.id}`))
    }

    return { tags, paths }
  }))
  return doc
}

export const revalidateVacancyDelete: CollectionAfterDeleteHook<Entity> = async ({ doc }) => {
  await revalidateNext(forAllLocales((locale) => ({
    tags: [vacanciesTag(locale), vacancyTag(locale, doc.id)],
    // Detail path revalidated so Next.js serves 404 immediately instead of stale ISR.
    paths: [publicPath(locale, '/vacancies'), publicPath(locale, `/vacancies/${doc.id}`)],
  })))
}

export const revalidateProductCategoriesChange = collectionChangeHook((locale) => ({
  paths: [publicPath(locale, '/products'), publicPath(locale, '/products/[slug]'), SITEMAP_PATH],
  tags: [productsTag(locale)],
}))
export const revalidateProductCategoriesDelete = collectionDeleteHook((locale) => ({
  paths: [publicPath(locale, '/products'), publicPath(locale, '/products/[slug]'), SITEMAP_PATH],
  tags: [productsTag(locale)],
}))

export const revalidateArticleCategoriesChange = collectionChangeHook((locale) => ({
  paths: [publicPath(locale), publicPath(locale, '/news'), publicPath(locale, '/news/[slug]'), SITEMAP_PATH],
  tags: [homeTag(locale), newsListTag(locale)],
}))
export const revalidateArticleCategoriesDelete = collectionDeleteHook((locale) => ({
  paths: [publicPath(locale), publicPath(locale, '/news'), publicPath(locale, '/news/[slug]'), SITEMAP_PATH],
  tags: [homeTag(locale), newsListTag(locale)],
}))

export const revalidateVacancyDepartmentsChange = collectionChangeHook((locale) => ({
  paths: [publicPath(locale, '/vacancies'), publicPath(locale, '/vacancies/[id]')],
  tags: [vacanciesTag(locale)],
}))
export const revalidateVacancyDepartmentsDelete = collectionDeleteHook((locale) => ({
  paths: [publicPath(locale, '/vacancies'), publicPath(locale, '/vacancies/[id]')],
  tags: [vacanciesTag(locale)],
}))

export const revalidateMediaChange = collectionChangeHook((locale) => ({
  paths: [
    publicPath(locale),
    publicPath(locale, '/about'),
    publicPath(locale, '/contact'),
    publicPath(locale, '/products'),
    publicPath(locale, '/products/[slug]'),
    publicPath(locale, '/news'),
    publicPath(locale, '/news/[slug]'),
    publicPath(locale, '/vacancies'),
    publicPath(locale, '/vacancies/[id]'),
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
    publicPath(locale),
    publicPath(locale, '/about'),
    publicPath(locale, '/contact'),
    publicPath(locale, '/products'),
    publicPath(locale, '/products/[slug]'),
    publicPath(locale, '/news'),
    publicPath(locale, '/news/[slug]'),
    publicPath(locale, '/vacancies'),
    publicPath(locale, '/vacancies/[id]'),
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
