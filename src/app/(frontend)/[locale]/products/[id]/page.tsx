import { notFound } from 'next/navigation'
import ProductDetailClient from './ProductDetailClient'
import { getValidLocale, supportedLocales } from '@/lib/i18n/locale'
import { normalizeProduct } from '@/lib/payload-normalize'
import type { ProductDetailLabelsData } from '@/types/payload'
import {
  getCachedProductDetail,
  getCachedProductStaticIDs,
} from '@/lib/payload/cachedQueries'

export async function generateStaticParams() {
  const params = await Promise.all(
    supportedLocales.map(async (locale) => {
      const ids = await getCachedProductStaticIDs(locale)
      return ids.map((id) => ({ locale, id }))
    }),
  )
  return params.flat()
}

type Props = {
  params: Promise<{
    locale: string
    id: string
  }>
}

export default async function ProductDetailPage({ params }: Props) {
  const { id, locale: localeParam } = await params
  const locale = getValidLocale(localeParam)
  if (!locale) notFound()

  const productID = Number(id)

  if (!Number.isFinite(productID)) {
    notFound()
  }

  const cached = await getCachedProductDetail(locale, productID)
  const product = cached.product

  if (!product) {
    notFound()
  }

  const labelsRaw = cached.labels

  const labels: ProductDetailLabelsData = {
    sizeLabel:      labelsRaw?.sizeLabel      ?? 'Size',
    nutritionLabel: labelsRaw?.nutritionLabel ?? 'Nutrition',
    aboutLabel:     labelsRaw?.aboutLabel     ?? 'About',
    mineralLabel:   labelsRaw?.mineralLabel   ?? 'Mineral',
    perLitreLabel:  labelsRaw?.perLitreLabel  ?? 'Per Litre',
  }

  const products = cached.allProducts.map(normalizeProduct)
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
      labels={labels}
    />
  )
}
