import NewsClient from './NewsClient'
import { getPayloadClient } from '@/lib/payload'
import { normalizeArticle, normalizeResult } from '@/lib/payload-normalize'

const PAGE_SIZE = 9

type Props = {
  searchParams: Promise<{
    category?: string
    page?: string
  }>
}

export default async function NewsPage({ searchParams }: Props) {
  const params = await searchParams
  const category = params.category ?? 'all'
  const page = Math.max(Number(params.page ?? '1') || 1, 1)
  const payload = await getPayloadClient()

  const featuredResult = await payload.find({
    collection: 'articles',
    depth: 2,
    limit: 1,
    sort: '-date',
    where: {
      featured: {
        equals: true,
      },
    },
  })

  const featured = featuredResult.docs[0] ? normalizeArticle(featuredResult.docs[0]) : null

  const result = await payload.find({
    collection: 'articles',
    depth: 2,
    limit: PAGE_SIZE,
    page,
    sort: '-date',
    where: {
      ...(category !== 'all'
        ? {
            category: {
              equals: category,
            },
          }
        : {}),
      featured: {
        not_equals: true,
      },
    },
  })

  const docs = result.docs.map(normalizeArticle)

  return (
    <NewsClient
      category={category}
      featured={featured}
      result={normalizeResult(result, docs, PAGE_SIZE)}
    />
  )
}
