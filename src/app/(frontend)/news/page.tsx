import { cookies } from 'next/headers'
import NewsClient from './NewsClient'
import { getPayloadClient } from '@/lib/payload'
import { normalizeArticle, normalizeCategory, normalizeResult } from '@/lib/payload-normalize'

const PAGE_SIZE = 9

type Props = {
  searchParams: Promise<{
    category?: string
    page?: string
  }>
}

export default async function NewsPage({ searchParams }: Props) {
  const params = await searchParams
  const categorySlug = params.category ?? 'all'
  const page = Math.max(Number(params.page ?? '1') || 1, 1)
  const locale = ((await cookies()).get('RAHATLYK-locale')?.value ?? 'en') as 'en' | 'tm' | 'ru'
  const payload = await getPayloadClient()

  const categoriesResult = await payload.find({
    collection: 'article-categories',
    locale,
    limit: 100,
    sort: 'label',
  })
  const categories = categoriesResult.docs.map(normalizeCategory)
  const activeCategory = categoriesResult.docs.find(c => c.slug === categorySlug)

  const featuredResult = await payload.find({
    collection: 'articles',
    depth: 2,
    locale,
    limit: 10,
    sort: '-date',
    where: {
      featured: {
        equals: true,
      },
    },
  })

  const featured = featuredResult.docs.map(normalizeArticle)

  const result = await payload.find({
    collection: 'articles',
    depth: 2,
    locale,
    limit: PAGE_SIZE,
    page,
    sort: '-date',
    where: {
      ...(categorySlug !== 'all' && activeCategory
        ? { category: { equals: activeCategory.id } }
        : {}),
      featured: {
        not_equals: true,
      },
    },
  })

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
