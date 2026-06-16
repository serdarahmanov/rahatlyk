import { notFound } from 'next/navigation'
import ProductDetailClient from './ProductDetailClient'
import { getPayloadClient } from '@/lib/payload'
import { normalizeProduct } from '@/lib/payload-normalize'

type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params
  const productID = Number(id)

  if (!Number.isFinite(productID)) {
    notFound()
  }

  const payload = await getPayloadClient()
  const productResult = await payload.find({
    collection: 'products',
    depth: 2,
    limit: 1,
    where: {
      id: {
        equals: productID,
      },
    },
  })

  const product = productResult.docs[0]

  if (!product) {
    notFound()
  }

  const allResult = await payload.find({
    collection: 'products',
    depth: 2,
    limit: 100,
    sort: 'date',
  })

  const products = allResult.docs.map(normalizeProduct)
  const normalizedProduct = normalizeProduct(product)
  const currentIndex = products.findIndex((p) => p.id === normalizedProduct.id)
  const related = products
    .filter((p) => p.category === normalizedProduct.category && p.id !== normalizedProduct.id)
    .slice(0, 4)

  return (
    <ProductDetailClient
      product={normalizedProduct}
      related={related}
      prevProduct={currentIndex > 0 ? products[currentIndex - 1] : null}
      nextProduct={currentIndex >= 0 && currentIndex < products.length - 1 ? products[currentIndex + 1] : null}
    />
  )
}
