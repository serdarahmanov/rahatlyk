import { notFound } from 'next/navigation'
import ProductsClient from './ProductsClient'
import { getValidLocale } from '@/lib/i18n/locale'
import { normalizeCategory, normalizeProduct, normalizeResult } from '@/lib/payload-normalize'
import { getCachedProductCategories, getCachedProductsPage } from '@/lib/payload/cachedQueries'

const PAGE_SIZE = 12

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{
    category?: string
    page?: string
  }>
}

export default async function ProductsPage({ params, searchParams }: Props) {
  const locale = getValidLocale((await params).locale)
  if (!locale) notFound()

  const query = await searchParams
  const categorySlug = query.category ?? 'all'
  const page = Math.max(Number(query.page ?? '1') || 1, 1)
  const categoriesResult = await getCachedProductCategories(locale)
  const categories = categoriesResult.docs.map(normalizeCategory)
  const activeCategory = categoriesResult.docs.find(c => c.slug === categorySlug)

  const result = await getCachedProductsPage(
    locale,
    page,
    categorySlug !== 'all' && activeCategory ? Number(activeCategory.id) : undefined,
  )

  const docs = result.docs.map(normalizeProduct)

  return (
    <ProductsClient
      categories={categories}
      category={categorySlug}
      result={normalizeResult(result, docs, PAGE_SIZE)}
    />
  )
}
