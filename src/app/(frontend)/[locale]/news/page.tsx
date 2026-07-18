import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import NewsClient from './NewsClient'
import { getValidLocale, defaultLocale } from '@/lib/i18n/locale'
import { buildLanguageAlternates } from '@/lib/i18n/metadata'
import { normalizeArticle, normalizeCategory, normalizeResult } from '@/lib/payload-normalize'
import {
  getCachedArticleLabels,
  getCachedArticleCategories,
  getCachedFeaturedArticles,
  getCachedNewsPage,
  getCachedSiteMetadata,
} from '@/lib/payload/cachedQueries'
import { resolveArticleLabels } from '@/lib/article-labels'

const PAGE_SIZE = 9

const TITLES: Record<string, string> = {
  tm: 'Habarlar',
  ru: 'Новости',
  en: 'News',
}

const DESCRIPTIONS: Record<string, string> = {
  tm: 'RAHATLYK-dan iň soňky habarlar — önüm çykarylyşlary, kompaniýa täzelikleri we beýlekiler.',
  ru: 'Последние новости RAHATLYK — запуски продуктов, новости компании и другое.',
  en: 'Latest news and updates from RAHATLYK — product launches, company news and more.',
}

function resolveOgImage(value: unknown): string | null {
  return value && typeof value === 'object' && 'url' in value
    ? (value as { url: string }).url || null
    : null
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = getValidLocale((await params).locale) ?? defaultLocale
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let siteMeta: any = null
  try { siteMeta = await getCachedSiteMetadata(locale) } catch { /* fallback */ }

  const title = siteMeta?.news?.title ?? TITLES[locale] ?? TITLES[defaultLocale]
  const description = siteMeta?.news?.description ?? DESCRIPTIONS[locale] ?? DESCRIPTIONS[defaultLocale]
  const ogImageUrl = resolveOgImage(siteMeta?.news?.ogImage)

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/news`,
      languages: buildLanguageAlternates('/news'),
    },
    ...(ogImageUrl ? { openGraph: { images: [{ url: ogImageUrl }] } } : {}),
  }
}

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
  const unfilteredNewsPromise = categorySlug === 'all'
    ? getCachedNewsPage(locale, page)
    : null
  const [categoriesResult, featuredResult, labelsRaw] = await Promise.all([
    getCachedArticleCategories(locale),
    getCachedFeaturedArticles(locale),
    getCachedArticleLabels(locale),
  ])
  const categories = categoriesResult.docs.map(normalizeCategory)
  const activeCategory = categoriesResult.docs.find(c => c.slug === categorySlug)

  const featured = featuredResult.docs.map(normalizeArticle)

  const result = unfilteredNewsPromise
    ? await unfilteredNewsPromise
    : await getCachedNewsPage(
        locale,
        page,
        activeCategory ? Number(activeCategory.id) : undefined,
      )

  const docs = result.docs.map(normalizeArticle)
  const labels = resolveArticleLabels(locale, labelsRaw)

  return (
    <NewsClient
      categories={categories}
      category={categorySlug}
      featured={featured}
      result={normalizeResult(result, docs, PAGE_SIZE)}
      labels={labels}
    />
  )
}
