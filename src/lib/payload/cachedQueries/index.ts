import { unstable_cache } from 'next/cache'
import { getPayloadClient } from '@/lib/payload'
import type { Locale } from '@/lib/i18n/translations'
import {
  aboutTag,
  CACHE_REVALIDATE_SECONDS,
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
      const [lines, articles, horizontalScroll, story, ctaBanner, hero] = await Promise.allSettled([
        payload.find({ collection: 'product-lines', depth: 1, locale, limit: 20, sort: 'order' }),
        payload.find({ collection: 'articles', depth: 1, locale, limit: 5, sort: '-date' }),
        payload.findGlobal({ slug: 'horizontal-scroll', locale, depth: 1 }),
        payload.findGlobal({ slug: 'home-story', locale, depth: 1 }),
        payload.findGlobal({ slug: 'home-cta-banner', locale, depth: 1 }),
        payload.findGlobal({ slug: 'home-hero', locale, depth: 1 }),
      ])

      return {
        lines: lines.status === 'fulfilled' ? lines.value.docs : [],
        articles: articles.status === 'fulfilled' ? articles.value.docs : [],
        horizontalScroll: horizontalScroll.status === 'fulfilled' ? horizontalScroll.value : null,
        story: story.status === 'fulfilled' ? story.value : null,
        ctaBanner: ctaBanner.status === 'fulfilled' ? ctaBanner.value : null,
        hero: hero.status === 'fulfilled' ? hero.value : null,
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
      const [hero, whoWeAre, story, numbers, mosaic, certificates] = await Promise.all([
        payload.findGlobal({ slug: 'about-hero', locale, depth: 1 }),
        payload.findGlobal({ slug: 'about-who-we-are', locale, depth: 1 }),
        payload.findGlobal({ slug: 'about-our-story', locale, depth: 1 }),
        payload.findGlobal({ slug: 'about-numbers', locale, depth: 1 }),
        payload.findGlobal({ slug: 'about-mosaic', locale, depth: 1 }),
        payload.findGlobal({ slug: 'about-certificates', locale, depth: 1 }),
      ])

      return { hero, whoWeAre, story, numbers, mosaic, certificates }
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

export function getCachedProductDetail(locale: Locale, id: number) {
  return cachedQuery(
    ['payload', 'product-detail-v2', locale, String(id)],
    [productsTag(locale), productTag(locale, id)],
    async () => {
      const payload = await getPayloadClient()

      const productResult = await payload.find({
        collection: 'products',
        depth: 2,
        locale,
        limit: 1,
        where: { id: { equals: id } },
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
          where: { and: [{ id: { not_equals: id } }, { category: { equals: categoryID } }] },
          select: { id: true, name: true, category: true, volumes: true, photos: true, video: true },
        }),

        // Use the same ordering as the products page. Deriving neighbors from
        // the ordered result also handles products that share the same date.
        payload.find({
          collection: 'products',
          depth: 0,
          locale,
          limit: 100,
          sort: 'date',
          select: { id: true, name: true },
        }),
      ])

      const currentIndex = navigationResult.docs.findIndex((item) => item.id === id)
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

export function getCachedNewsDetail(locale: Locale, id: number) {
  return cachedQuery(
    ['payload', 'news-detail', locale, String(id)],
    [newsListTag(locale), newsItemTag(locale, id)],
    async () => {
      const payload = await getPayloadClient()
      const articleResult = await payload.find({
        collection: 'articles',
        depth: 2,
        locale,
        limit: 1,
        where: { id: { equals: id } },
      })
      const article = articleResult.docs[0] ?? null
      if (!article) return { article: null, related: [] }

      const categoryID = typeof article.category === 'number'
        ? article.category
        : article.category.id
      const relatedResult = await payload.find({
        collection: 'articles',
        depth: 2,
        locale,
        limit: 3,
        sort: '-date',
        where: {
          and: [
            { id: { not_equals: id } },
            { category: { equals: categoryID } },
          ],
        },
      })

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
              { id: { not_equals: id } },
              { category: { not_equals: categoryID } },
            ],
          },
        })
        related = [...related, ...fallbackResult.docs]
      }

      return { article, related }
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
      const [vacancyResult, othersResult, forms] = await Promise.all([
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
      ])
      return {
        vacancy: vacancyResult.docs[0] ?? null,
        others: othersResult.docs,
        forms,
      }
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
      })
    },
  )
}

export function getCachedSiteSettings() {
  return cachedQuery(
    ['payload', 'site-settings'],
    [siteSettingsTag()],
    async () => {
      const payload = await getPayloadClient()
      return payload.findGlobal({ slug: 'site-settings' })
    },
  )
}

async function getStaticIDs(
  collection: 'products' | 'articles' | 'vacancies',
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

export const getCachedProductStaticIDs = (locale: Locale) =>
  cachedQuery(
    ['payload', 'product-static-ids', locale],
    [productsTag(locale)],
    () => getStaticIDs('products', locale),
  )

export const getCachedNewsStaticIDs = (locale: Locale) =>
  cachedQuery(
    ['payload', 'news-static-ids', locale],
    [newsListTag(locale)],
    () => getStaticIDs('articles', locale),
  )

export const getCachedVacancyStaticIDs = (locale: Locale) =>
  cachedQuery(
    ['payload', 'vacancy-static-ids', locale],
    [vacanciesTag(locale)],
    () => getStaticIDs('vacancies', locale),
  )
