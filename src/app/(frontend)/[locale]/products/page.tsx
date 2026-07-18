import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProductsClient from './ProductsClient'
import { getValidLocale, defaultLocale } from '@/lib/i18n/locale'
import { buildLanguageAlternates } from '@/lib/i18n/metadata'
import { normalizeCategory, normalizeProduct, normalizeResult } from '@/lib/payload-normalize'
import { getCachedProductCategories, getCachedProductLabels, getCachedProductsPage, getCachedSiteMetadata } from '@/lib/payload/cachedQueries'
import { resolveProductLabels } from '@/lib/product-labels'

const PAGE_SIZE = 12

const TITLES: Record<string, string> = {
  tm: 'Önümler',
  ru: 'Продукты',
  en: 'Products',
}

const DESCRIPTIONS: Record<string, string> = {
  tm: 'RAHATLYK önümleriniň doly toplumyny açyň — içimlik suw, mineral suw, şireler, energetik içgiler, otly çaý we beýlekiler.',
  ru: 'Откройте весь ассортимент RAHATLYK — питьевая вода, минеральная вода, соки, энергетики, травяной чай и другое.',
  en: 'Explore the full RAHATLYK range — drinking water, mineral water, juices, energy drinks, herbal tea and more.',
}

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{
    category?: string
    page?: string
  }>
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

  const title = siteMeta?.products?.title ?? TITLES[locale] ?? TITLES[defaultLocale]
  const description = siteMeta?.products?.description ?? DESCRIPTIONS[locale] ?? DESCRIPTIONS[defaultLocale]
  const ogImageUrl = resolveOgImage(siteMeta?.products?.ogImage)

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/products`,
      languages: buildLanguageAlternates('/products'),
    },
    ...(ogImageUrl ? { openGraph: { images: [{ url: ogImageUrl }] } } : {}),
  }
}

export default async function ProductsPage({ params, searchParams }: Props) {
  const locale = getValidLocale((await params).locale)
  if (!locale) notFound()

  const query = await searchParams
  const categorySlug = query.category ?? 'all'
  const page = Math.max(Number(query.page ?? '1') || 1, 1)
  const [categoriesResult, labelsRaw] = await Promise.all([
    getCachedProductCategories(locale),
    getCachedProductLabels(locale),
  ])
  const categories = categoriesResult.docs.map(normalizeCategory)
  const activeCategory = categoriesResult.docs.find(c => c.slug === categorySlug)

  const result = await getCachedProductsPage(
    locale,
    page,
    categorySlug !== 'all' && activeCategory ? Number(activeCategory.id) : undefined,
  )

  const docs = result.docs.map(normalizeProduct)
  const labels = resolveProductLabels(locale, labelsRaw)

  return (
    <ProductsClient
      categories={categories}
      category={categorySlug}
      result={normalizeResult(result, docs, PAGE_SIZE)}
      labels={labels}
    />
  )
}
