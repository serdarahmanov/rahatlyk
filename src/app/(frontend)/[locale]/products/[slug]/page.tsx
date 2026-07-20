import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProductDetailClient from './ProductDetailClient'
import { getValidLocale, supportedLocales, defaultLocale } from '@/lib/i18n/locale'
import { buildAbsoluteUrl, buildCanonicalPath, buildLocalizedLanguageAlternates } from '@/lib/i18n/metadata'
import { normalizeProduct } from '@/lib/payload-normalize'
import type { ProductDetailLabelsData } from '@/types/payload'
import { resolveProductLabels } from '@/lib/product-labels'
import {
  getCachedProductDetail,
  getCachedProductLocalizedSlugs,
  getCachedProductStaticSlugs,
} from '@/lib/payload/cachedQueries'

export async function generateStaticParams() {
  const params = await Promise.all(
    supportedLocales.map(async (locale) => {
      const slugs = await getCachedProductStaticSlugs(locale)
      return slugs.map((slug) => ({ locale, slug }))
    }),
  )
  return params.flat()
}

type Props = {
  params: Promise<{
    locale: string
    slug: string
  }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale: localeParam } = await params
  const locale = getValidLocale(localeParam) ?? defaultLocale
  if (!slug) return {}

  try {
    const cached = await getCachedProductDetail(locale, slug)
    const product = cached.product
    if (!product) return {}

    const name = product.name ?? ''
    const categoryName = typeof product.category === 'object' ? (product.category?.label ?? '') : ''
    const description = product.description
      ?? (categoryName ? `${name} — ${categoryName}.` : name)

    const localizedSlugs = await getCachedProductLocalizedSlugs(Number(product.id))
    const localizedPaths = Object.fromEntries(
      Object.entries(localizedSlugs).map(([entryLocale, entrySlug]) => [
        entryLocale,
        `/products/${entrySlug}`,
      ]),
    )

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
        canonical: buildCanonicalPath(locale, `/products/${product.slug}`),
        languages: buildLocalizedLanguageAlternates(localizedPaths),
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
  const { slug, locale: localeParam } = await params
  const locale = getValidLocale(localeParam)
  if (!locale) notFound()

  if (!slug) {
    notFound()
  }

  const cached = await getCachedProductDetail(locale, slug)
  const product = cached.product

  if (!product) {
    notFound()
  }

  const labelsRaw = cached.labels

  const labels: ProductDetailLabelsData = resolveProductLabels(locale, labelsRaw)

  const normalizedProduct = normalizeProduct(product)
  const related = cached.related.map(normalizeProduct)
  const prevProduct = cached.prevProduct
    ? { slug: cached.prevProduct.slug, name: cached.prevProduct.name ?? '' }
    : null
  const nextProduct = cached.nextProduct
    ? { slug: cached.nextProduct.slug, name: cached.nextProduct.name ?? '' }
    : null

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://rahatlyk.com'
  const productImage = normalizedProduct.photos[0]?.url
  const productUrl = buildAbsoluteUrl(siteUrl, buildCanonicalPath(locale, `/products/${normalizedProduct.slug}`))
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: normalizedProduct.name,
    description: normalizedProduct.description ?? normalizedProduct.longDescription ?? undefined,
    category: normalizedProduct.category.label || undefined,
    url: productUrl,
    ...(productImage ? { image: [buildAbsoluteUrl(siteUrl, productImage)] } : {}),
    brand: {
      '@type': 'Brand',
      name: 'Rahatlyk',
    },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: buildAbsoluteUrl(siteUrl, buildCanonicalPath(locale)) },
      { '@type': 'ListItem', position: 2, name: 'Products', item: buildAbsoluteUrl(siteUrl, buildCanonicalPath(locale, '/products')) },
      { '@type': 'ListItem', position: 3, name: normalizedProduct.name, item: productUrl },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProductDetailClient
        key={normalizedProduct.id}
        product={normalizedProduct}
        related={related}
        prevProduct={prevProduct}
        nextProduct={nextProduct}
        labels={labels}
      />
    </>
  )
}
