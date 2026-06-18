import { cookies } from 'next/headers'
import ProductsClient from './ProductsClient'
import { getPayloadClient } from '@/lib/payload'
import { normalizeCategory, normalizeProduct, normalizeResult } from '@/lib/payload-normalize'

const PAGE_SIZE = 12

type Props = {
  searchParams: Promise<{
    category?: string
    page?: string
  }>
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams
  const categorySlug = params.category ?? 'all'
  const page = Math.max(Number(params.page ?? '1') || 1, 1)
  const locale = ((await cookies()).get('RAHATLYK-locale')?.value ?? 'en') as 'en' | 'tm' | 'ru'
  const payload = await getPayloadClient()

  const categoriesResult = await payload.find({
    collection: 'product-categories',
    locale,
    limit: 100,
    sort: 'label',
  })
  const categories = categoriesResult.docs.map(normalizeCategory)
  const activeCategory = categoriesResult.docs.find(c => c.slug === categorySlug)

  const result = await payload.find({
    collection: 'products',
    depth: 2,
    locale,
    limit: PAGE_SIZE,
    page,
    sort: 'date',
    ...(categorySlug !== 'all' && activeCategory
      ? { where: { category: { equals: activeCategory.id } } }
      : {}),
  })

  const docs = result.docs.map(normalizeProduct)

  return (
    <ProductsClient
      categories={categories}
      category={categorySlug}
      result={normalizeResult(result, docs, PAGE_SIZE)}
    />
  )
}
