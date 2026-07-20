import { unstable_cache } from 'next/cache'
import { getPayloadClient } from '@/lib/payload'
import type { Locale } from '@/lib/i18n/translations'
import {
  aboutTag,
  articleLabelsTag,
  CACHE_REVALIDATE_SECONDS,
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

function cachedQuery<T>(
  keyParts: string[],
  tags: string[],
  query: () => Promise<T>,
): Promise<T> {
  return unstable_cache(query, keyParts, {
    revalidate: CACHE_REVALIDATE_SECONDS,
    tags,
  })()
}

export function getCachedHomeData(locale: Locale) {
  return cachedQuery(
    ['payload', 'home', locale],
    [homeTag(locale)],
    async () => {
      const payload = await getPayloadClient()
      const [collection, articles, horizontalScroll, story, ctaBanner, hero, articleLabels] = await Promise.allSettled([
        payload.findGlobal({ slug: 'our-collection', locale, depth: 1 }),
        payload.find({ collection: 'articles', depth: 1, locale, limit: 5, sort: '-date' }),
        payload.findGlobal({ slug: 'horizontal-scroll', locale, depth: 1 }),
        payload.findGlobal({ slug: 'home-story', locale, depth: 1 }),
        payload.findGlobal({ slug: 'home-cta-banner', locale, depth: 1 }),
        payload.findGlobal({ slug: 'home-hero', locale, depth: 1 }),
        payload.findGlobal({ slug: 'article-labels', locale, depth: 0 }),
      ])

      const collectionItems = collection.status === 'fulfilled' && Array.isArray(collection.value?.items)
        ? [...collection.value.items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        : []

      return {
        lines: collectionItems,
        articles: articles.status === 'fulfilled' ? articles.value.docs : [],
        horizontalScroll: horizontalScroll.status === 'fulfilled' ? horizontalScroll.value : null,
        story: story.status === 'fulfilled' ? story.value : null,
        ctaBanner: ctaBanner.status === 'fulfilled' ? ctaBanner.value : null,
        hero: hero.status === 'fulfilled' ? hero.value : null,
        articleLabels: articleLabels.status === 'fulfilled' ? articleLabels.value : null,
      }
    },
  )
}

export function getCachedAboutData(locale: Locale) {
  return cachedQuery(
    ['payload', 'about', locale],
    [aboutTag(locale)],
    async () => {
      const payload = await getPayloadClient()
      const [hero, whoWeAre, story, numbers, finalSection] = await Promise.all([
        payload.findGlobal({ slug: 'about-hero', locale, depth: 1 }),
        payload.findGlobal({ slug: 'about-who-we-are', locale, depth: 1 }),
        payload.findGlobal({ slug: 'about-our-story', locale, depth: 1 }),
        payload.findGlobal({ slug: 'about-numbers', locale, depth: 1 }),
        payload.findGlobal({ slug: 'about-final-section', locale, depth: 1 }),
      ])

      return { hero, whoWeAre, story, numbers, finalSection }
    },
  )
}

export function getCachedContactData(locale: Locale) {
  return cachedQuery(
    ['payload', 'contact', locale],
    [contactTag(locale)],
    async () => {
      const payload = await getPayloadClient()
      const [page, forms] = await Promise.all([
        payload.findGlobal({ slug: 'about-page', locale, depth: 0 }),
        payload.findGlobal({ slug: 'forms', locale, depth: 0 }),
      ])
      return { page, forms }
    },
  )
}

export function getCachedProductCategories(locale: Locale) {
  return cachedQuery(
    ['payload', 'product-categories', locale],
    [productsTag(locale)],
    async () => {
      const payload = await getPayloadClient()
      return payload.find({
        collection: 'product-categories',
        locale,
        limit: 100,
        sort: 'label',
      })
    },
  )
}

export function getCachedProductLabels(locale: Locale) {
  return cachedQuery(
    ['payload', 'product-labels', locale],
    [productLabelsTag(locale)],
    async () => {
      const payload = await getPayloadClient()
      return payload.findGlobal({ slug: 'product-detail-labels', locale, depth: 0 })
    },
  )
}

export function getCachedProductsPage(
  locale: Locale,
  page: number,
  categoryID?: number,
) {
  const categoryKey = categoryID === undefined ? 'all' : String(categoryID)
  return cachedQuery(
    ['payload', 'products-page', locale, String(page), categoryKey],
    [productsTag(locale)],
    async () => {
      const payload = await getPayloadClient()
      return payload.find({
        collection: 'products',
        depth: 2,
        locale,
        limit: 12,
        page,
        sort: 'date',
        ...(categoryID === undefined
          ? {}
          : { where: { category: { equals: categoryID } } }),
      })
    },
  )
}

export function getCachedProductDetail(locale: Locale, slug: string) {
  return cachedQuery(
    ['payload', 'product-detail-by-slug', locale, slug],
    [productsTag(locale)],
    async () => {
      const payload = await getPayloadClient()

      const productResult = await payload.find({
        collection: 'products',
        depth: 2,
        locale,
        limit: 1,
        where: { slug: { equals: slug } },
      })
      const product = productResult.docs[0] ?? null

      if (!product) {
        return { product: null, labels: null, related: [], prevProduct: null, nextProduct: null }
      }

      const categoryID = typeof product.category === 'number'
        ? product.category
        : product.category.id

      const [labels, relatedResult, navigationResult] = await Promise.all([
        payload.findGlobal({ slug: 'product-detail-labels', locale, depth: 0 }),

        // Related: same category, only the fields needed to render a product card.
        payload.find({
          collection: 'products',
          depth: 2,
          locale,
          limit: 4,
          sort: 'date',
          where: { and: [{ id: { not_equals: product.id } }, { category: { equals: categoryID } }] },
          select: { id: true, slug: true, name: true, category: true, volumes: true, photos: true, video: true },
        }),

        // Use the same ordering as the products page. Deriving neighbors from
        // the ordered result also handles products that share the same date.
        payload.find({
          collection: 'products',
          depth: 0,
          locale,
          limit: 100,
          sort: 'date',
          select: { id: true, slug: true, name: true },
        }),
      ])

      const currentIndex = navigationResult.docs.findIndex((item) => item.id === product.id)
      const prevProduct = currentIndex > 0
        ? navigationResult.docs[currentIndex - 1]
        : null
      const nextProduct = currentIndex >= 0 && currentIndex < navigationResult.docs.length - 1
        ? navigationResult.docs[currentIndex + 1]
        : null

      return {
        product,
        labels,
        related: relatedResult.docs,
        prevProduct,
        nextProduct,
      }
    },
  )
}

export function getCachedArticleCategories(locale: Locale) {
  return cachedQuery(
    ['payload', 'article-categories', locale],
    [newsListTag(locale)],
    async () => {
      const payload = await getPayloadClient()
      return payload.find({
        collection: 'article-categories',
        locale,
        limit: 100,
        sort: 'label',
      })
    },
  )
}

export function getCachedArticleLabels(locale: Locale) {
  return cachedQuery(
    ['payload', 'article-labels', locale],
    [articleLabelsTag(locale)],
    async () => {
      const payload = await getPayloadClient()
      return payload.findGlobal({ slug: 'article-labels', locale, depth: 0 })
    },
  )
}

export function getCachedFeaturedArticles(locale: Locale) {
  return cachedQuery(
    ['payload', 'featured-articles', locale],
    [newsListTag(locale)],
    async () => {
      const payload = await getPayloadClient()
      return payload.find({
        collection: 'articles',
        depth: 1,
        locale,
        limit: 10,
        sort: '-date',
        where: { featured: { equals: true } },
      })
    },
  )
}

export function getCachedNewsPage(
  locale: Locale,
  page: number,
  categoryID?: number,
) {
  const categoryKey = categoryID === undefined ? 'all' : String(categoryID)
  return cachedQuery(
    ['payload', 'news-page', locale, String(page), categoryKey],
    [newsListTag(locale)],
    async () => {
      const payload = await getPayloadClient()
      return payload.find({
        collection: 'articles',
        depth: 1,
        locale,
        limit: 9,
        page,
        sort: '-date',
        where: {
          ...(categoryID === undefined ? {} : { category: { equals: categoryID } }),
          featured: { not_equals: true },
        },
        select: { id: true, title: true, category: true, date: true, featured: true, images: true },
      })
    },
  )
}

export function getCachedNewsDetail(locale: Locale, slug: string) {
  return cachedQuery(
    ['payload', 'news-detail-by-slug', locale, slug],
    [newsListTag(locale)],
    async () => {
      const payload = await getPayloadClient()
      const articleResult = await payload.find({
        collection: 'articles',
        depth: 2,
        locale,
        limit: 1,
        where: { slug: { equals: slug } },
      })
      const article = articleResult.docs[0] ?? null
      if (!article) return { article: null, related: [] }

      const categoryID = typeof article.category === 'number'
        ? article.category
        : article.category.id
      const [relatedResult, labels] = await Promise.all([
        payload.find({
        collection: 'articles',
        depth: 2,
        locale,
        limit: 3,
        sort: '-date',
        where: {
          and: [
            { id: { not_equals: article.id } },
            { category: { equals: categoryID } },
          ],
        },
        }),
        payload.findGlobal({ slug: 'article-labels', locale, depth: 0 }),
      ])

      let related = relatedResult.docs
      if (related.length < 3) {
        const fallbackResult = await payload.find({
          collection: 'articles',
          depth: 2,
          locale,
          limit: 3 - related.length,
          sort: '-date',
          where: {
            and: [
              { id: { not_equals: article.id } },
              { category: { not_equals: categoryID } },
            ],
          },
        })
        related = [...related, ...fallbackResult.docs]
      }

      return { article, related, labels }
    },
  )
}

export function getCachedVacancyLabels(locale: Locale) {
  return cachedQuery(
    ['payload', 'vacancy-labels', locale],
    [vacancyLabelsTag(locale)],
    async () => {
      const payload = await getPayloadClient()
      return payload.findGlobal({ slug: 'vacancy-labels', locale, depth: 0 })
    },
  )
}

export function getCachedVacancyDepartments(locale: Locale) {
  return cachedQuery(
    ['payload', 'vacancy-departments', locale],
    [vacanciesTag(locale)],
    async () => {
      const payload = await getPayloadClient()
      return payload.find({
        collection: 'vacancy-departments',
        locale,
        limit: 100,
        sort: 'label',
      })
    },
  )
}

export function getCachedVacanciesPage(
  locale: Locale,
  page: number,
  departmentID?: number,
) {
  const departmentKey = departmentID === undefined ? 'all' : String(departmentID)
  return cachedQuery(
    ['payload', 'vacancies-page', locale, String(page), departmentKey],
    [vacanciesTag(locale)],
    async () => {
      const payload = await getPayloadClient()
      return payload.find({
        collection: 'vacancies',
        depth: 2,
        locale,
        limit: 9,
        page,
        sort: '-postedDate',
        ...(departmentID === undefined
          ? {}
          : { where: { department: { equals: departmentID } } }),
      })
    },
  )
}

export function getCachedVacancyDetail(locale: Locale, id: number) {
  return cachedQuery(
    ['payload', 'vacancy-detail', locale, String(id)],
    [vacanciesTag(locale), vacancyTag(locale, id)],
    async () => {
      const payload = await getPayloadClient()
      const [vacancyResult, othersResult, forms, vacancyLabels] = await Promise.all([
        payload.find({
          collection: 'vacancies',
          depth: 2,
          locale,
          limit: 1,
          where: { id: { equals: id } },
        }),
        payload.find({
          collection: 'vacancies',
          depth: 2,
          locale,
          limit: 3,
          sort: '-postedDate',
          where: { id: { not_equals: id } },
        }),
        payload.findGlobal({ slug: 'forms', locale, depth: 0 }),
        payload.findGlobal({ slug: 'vacancy-labels', locale, depth: 0 }),
      ])
      return {
        vacancy: vacancyResult.docs[0] ?? null,
        others: othersResult.docs,
        forms,
        vacancyLabels,
      }
    },
  )
}

export function getCachedSiteMetadata(locale: Locale) {
  return cachedQuery(
    ['payload', 'site-metadata', locale],
    [siteMetadataTag(locale)],
    async () => {
      const payload = await getPayloadClient()
      return payload.findGlobal({ slug: 'site-metadata', locale, depth: 1 })
    },
  )
}

export function getCachedNavigationLabels(locale: Locale) {
  return cachedQuery(
    ['payload', 'navigation-labels', locale],
    [navigationLabelsTag(locale)],
    async () => {
      const payload = await getPayloadClient()
      return payload.findGlobal({ slug: 'navigation-labels' as never, locale, depth: 0 })
    },
  )
}

export function getCachedContactInfo() {
  return cachedQuery(
    ['payload', 'contact-info', 'all-locales'],
    [contactInfoTag()],
    async () => {
      const payload = await getPayloadClient()
      return payload.findGlobal({
        slug: 'contact-info',
        locale: 'all',
        depth: 1,
      })
    },
  )
}

async function getStaticIDs(
  collection: 'vacancies',
  locale: Locale,
) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection,
    locale,
    depth: 0,
    limit: 1000,
    pagination: false,
  })
  return result.docs.map((doc) => String(doc.id))
}

async function getStaticSlugs(
  collection: 'products' | 'articles',
  locale: Locale,
) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection,
    locale,
    depth: 0,
    limit: 1000,
    pagination: false,
    select: { slug: true },
  })
  return result.docs.flatMap((doc) => doc.slug ? [doc.slug] : [])
}

async function getLocalizedSlugMap(collection: 'products' | 'articles', id: number) {
  const payload = await getPayloadClient()
  const entries = await Promise.all(
    (['en', 'ru', 'tm'] as const).map(async (locale) => {
      const doc = await payload.findByID({
        collection,
        id,
        locale,
        depth: 0,
        select: { slug: true },
      })
      return [locale, doc.slug || null] as const
    }),
  )

  return Object.fromEntries(
    entries.flatMap(([locale, slug]) => slug ? [[locale, slug]] : []),
  ) as Partial<Record<Locale, string>>
}

async function getStaticLocalizedSlugMaps(collection: 'products' | 'articles') {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection,
    locale: 'en',
    depth: 0,
    limit: 1000,
    pagination: false,
  })

  return Promise.all(
    result.docs.map(async (doc) => ({
      id: Number(doc.id),
      slugs: await getLocalizedSlugMap(collection, Number(doc.id)),
    })),
  )
}

export const getCachedProductStaticSlugs = (locale: Locale) =>
  cachedQuery(
    ['payload', 'product-static-slugs', locale],
    [productsTag(locale)],
    () => getStaticSlugs('products', locale),
  )

export const getCachedProductLocalizedSlugs = (id: number) =>
  cachedQuery(
    ['payload', 'product-localized-slugs', String(id)],
    (['en', 'ru', 'tm'] as const).map(productsTag),
    () => getLocalizedSlugMap('products', id),
  )

export const getCachedProductStaticLocalizedSlugMaps = () =>
  cachedQuery(
    ['payload', 'product-static-localized-slug-maps'],
    (['en', 'ru', 'tm'] as const).map(productsTag),
    () => getStaticLocalizedSlugMaps('products'),
  )

export const getCachedNewsStaticSlugs = (locale: Locale) =>
  cachedQuery(
    ['payload', 'news-static-slugs', locale],
    [newsListTag(locale)],
    () => getStaticSlugs('articles', locale),
  )

export const getCachedNewsLocalizedSlugs = (id: number) =>
  cachedQuery(
    ['payload', 'news-localized-slugs', String(id)],
    (['en', 'ru', 'tm'] as const).map(newsListTag),
    () => getLocalizedSlugMap('articles', id),
  )

export const getCachedNewsStaticLocalizedSlugMaps = () =>
  cachedQuery(
    ['payload', 'news-static-localized-slug-maps'],
    (['en', 'ru', 'tm'] as const).map(newsListTag),
    () => getStaticLocalizedSlugMaps('articles'),
  )

export const getCachedVacancyStaticIDs = (locale: Locale) =>
  cachedQuery(
    ['payload', 'vacancy-static-ids', locale],
    [vacanciesTag(locale)],
    () => getStaticIDs('vacancies', locale),
  )
