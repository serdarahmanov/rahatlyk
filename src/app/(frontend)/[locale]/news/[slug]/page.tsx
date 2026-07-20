import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ArticleDetailClient from './ArticleDetailClient'
import { getValidLocale, supportedLocales, defaultLocale } from '@/lib/i18n/locale'
import {
  buildAbsoluteUrl,
  buildCanonicalPath,
  buildLocalizedLanguageAlternates,
  extractLexicalText,
  truncateDescription,
} from '@/lib/i18n/metadata'
import { normalizeArticle } from '@/lib/payload-normalize'
import { getCachedNewsDetail, getCachedNewsLocalizedSlugs, getCachedNewsStaticSlugs } from '@/lib/payload/cachedQueries'
import { resolveArticleLabels } from '@/lib/article-labels'

export async function generateStaticParams() {
  const params = await Promise.all(
    supportedLocales.map(async (locale) => {
      const slugs = await getCachedNewsStaticSlugs(locale)
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
    const cached = await getCachedNewsDetail(locale, slug)
    const article = cached.article
    if (!article) return {}

    const title = article.title ?? ''
    const description = truncateDescription(extractLexicalText(article.body?.[0]?.text))
    const localizedSlugs = await getCachedNewsLocalizedSlugs(Number(article.id))
    const localizedPaths = Object.fromEntries(
      Object.entries(localizedSlugs).map(([entryLocale, entrySlug]) => [
        entryLocale,
        `/news/${entrySlug}`,
      ]),
    )
    const firstImage = article.images?.[0]
    const imageUrl = firstImage
      ? (typeof firstImage.media === 'object' && firstImage.media?.url
          ? firstImage.media.url
          : firstImage.url ?? null)
      : null

    return {
      title,
      ...(description ? { description } : {}),
      alternates: {
        canonical: buildCanonicalPath(locale, `/news/${article.slug}`),
        languages: buildLocalizedLanguageAlternates(localizedPaths),
      },
      openGraph: {
        title,
        ...(description ? { description } : {}),
        type: 'article',
        ...(article.date ? { publishedTime: article.date } : {}),
        ...(imageUrl ? { images: [{ url: imageUrl }] } : {}),
      },
    }
  } catch {
    return {}
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug, locale: localeParam } = await params
  const locale = getValidLocale(localeParam)
  if (!locale) notFound()

  if (!slug) {
    notFound()
  }

  const cached = await getCachedNewsDetail(locale, slug)
  const article = cached.article

  if (!article) {
    notFound()
  }

  const normalizedArticle = normalizeArticle(article)
  const more = cached.related.map(normalizeArticle)
  const labels = resolveArticleLabels(locale, cached.labels)

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://rahatlyk.com'
  const articleUrl = buildAbsoluteUrl(siteUrl, buildCanonicalPath(locale, `/news/${normalizedArticle.slug}`))
  const articleImage = normalizedArticle.images[0]?.url
  const description = truncateDescription(extractLexicalText(normalizedArticle.body[0]?.text))
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: normalizedArticle.title,
    ...(description ? { description } : {}),
    datePublished: normalizedArticle.date,
    dateModified: normalizedArticle.updatedAt ?? normalizedArticle.date,
    mainEntityOfPage: articleUrl,
    url: articleUrl,
    ...(articleImage ? { image: [buildAbsoluteUrl(siteUrl, articleImage)] } : {}),
    author: {
      '@type': 'Organization',
      name: 'Rahatlyk',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Rahatlyk',
    },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: buildAbsoluteUrl(siteUrl, buildCanonicalPath(locale)) },
      { '@type': 'ListItem', position: 2, name: 'News', item: buildAbsoluteUrl(siteUrl, buildCanonicalPath(locale, '/news')) },
      { '@type': 'ListItem', position: 3, name: normalizedArticle.title, item: articleUrl },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ArticleDetailClient key={normalizedArticle.id} article={normalizedArticle} more={more} labels={labels} />
    </>
  )
}
