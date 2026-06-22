import { notFound } from 'next/navigation'
import NewsClient from './NewsClient'
import { getValidLocale } from '@/lib/i18n/locale'
import { normalizeArticle, normalizeCategory, normalizeResult } from '@/lib/payload-normalize'
import {
  getCachedArticleCategories,
  getCachedFeaturedArticles,
  getCachedNewsPage,
} from '@/lib/payload/cachedQueries'

const PAGE_SIZE = 9

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{
    category?: string
    page?: string
  }>
}

export default async function NewsPage({ params, searchParams }: Props) {
  const locale = getValidLocale((await params).locale)
  if (!locale) notFound()

  const query = await searchParams
  const categorySlug = query.category ?? 'all'
  const page = Math.max(Number(query.page ?? '1') || 1, 1)
  const categoriesResult = await getCachedArticleCategories(locale)
  const categories = categoriesResult.docs.map(normalizeCategory)
  const activeCategory = categoriesResult.docs.find(c => c.slug === categorySlug)

  const featuredResult = await getCachedFeaturedArticles(locale)

  const featured = featuredResult.docs.map(normalizeArticle)

  const result = await getCachedNewsPage(
    locale,
    page,
    categorySlug !== 'all' && activeCategory ? Number(activeCategory.id) : undefined,
  )

  const docs = result.docs.map(normalizeArticle)

  return (
    <NewsClient
      categories={categories}
      category={categorySlug}
      featured={featured}
      result={normalizeResult(result, docs, PAGE_SIZE)}
    />
  )
}
