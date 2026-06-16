import ProductsClient from './ProductsClient'
import { getPayloadClient } from '@/lib/payload'
import { normalizeProduct, normalizeResult } from '@/lib/payload-normalize'

const PAGE_SIZE = 12

type Props = {
  searchParams: Promise<{
    category?: string
    page?: string
  }>
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams
  const category = params.category ?? 'all'
  const page = Math.max(Number(params.page ?? '1') || 1, 1)
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'products',
    depth: 2,
    limit: PAGE_SIZE,
    page,
    sort: 'date',
    ...(category !== 'all'
      ? {
          where: {
            category: {
              equals: category,
            },
          },
        }
      : {}),
  })

  const docs = result.docs.map(normalizeProduct)

  return (
    <ProductsClient
      category={category}
      result={normalizeResult(result, docs, PAGE_SIZE)}
    />
  )
}
