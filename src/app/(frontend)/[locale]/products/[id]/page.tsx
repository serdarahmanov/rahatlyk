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

  const normalizedProduct = normalizeProduct(product)
  const related = cached.related.map(normalizeProduct)
  const prevProduct = cached.prevProduct
    ? { id: cached.prevProduct.id, name: cached.prevProduct.name ?? '' }
    : null
  const nextProduct = cached.nextProduct
    ? { id: cached.nextProduct.id, name: cached.nextProduct.name ?? '' }
    : null

  return (
    <ProductDetailClient
      key={normalizedProduct.id}
      product={normalizedProduct}
      related={related}
      prevProduct={prevProduct}
      nextProduct={nextProduct}
      labels={labels}
    />
  )
}
