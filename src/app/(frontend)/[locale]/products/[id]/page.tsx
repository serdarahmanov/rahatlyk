import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProductDetailClient from './ProductDetailClient'
import { getValidLocale, supportedLocales, defaultLocale } from '@/lib/i18n/locale'
import { buildLanguageAlternates } from '@/lib/i18n/metadata'
import { normalizeProduct } from '@/lib/payload-normalize'
import type { ProductDetailLabelsData } from '@/types/payload'
import { resolveProductLabels } from '@/lib/product-labels'
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale: localeParam } = await params
  const locale = getValidLocale(localeParam) ?? defaultLocale
  const productID = Number(id)
  if (!Number.isFinite(productID)) return {}

  try {
    const cached = await getCachedProductDetail(locale, productID)
    const product = cached.product
    if (!product) return {}

    const name = product.name ?? ''
    const categoryName = typeof product.category === 'object' ? (product.category?.label ?? '') : ''
    const description = product.description
      ?? (categoryName ? `${name} — ${categoryName}.` : name)

    const firstPhoto = product.photos?.[0]
    const imageUrl = firstPhoto
      ? (typeof firstPhoto.media === 'object' && firstPhoto.media?.url
          ? firstPhoto.media.url
          : firstPhoto.url ?? null)
      : null

    return {
      title: name,
      description,
      alternates: {
        canonical: `/${locale}/products/${id}`,
        languages: buildLanguageAlternates(`/products/${id}`),
      },
      openGraph: {
        title: name,
        description,
        type: 'website',
        ...(imageUrl ? { images: [{ url: imageUrl }] } : {}),
      },
    }
  } catch {
    return {}
  }
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

  const labels: ProductDetailLabelsData = resolveProductLabels(locale, labelsRaw)

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
