import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ArticleDetailClient from './ArticleDetailClient'
import { getValidLocale, supportedLocales, defaultLocale } from '@/lib/i18n/locale'
import { buildLanguageAlternates } from '@/lib/i18n/metadata'
import { normalizeArticle } from '@/lib/payload-normalize'
import { getCachedNewsDetail, getCachedNewsStaticIDs } from '@/lib/payload/cachedQueries'
import { resolveArticleLabels } from '@/lib/article-labels'

export async function generateStaticParams() {
  const params = await Promise.all(
    supportedLocales.map(async (locale) => {
      const ids = await getCachedNewsStaticIDs(locale)
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
  const articleID = Number(id)
  if (!Number.isFinite(articleID)) return {}

  try {
    const cached = await getCachedNewsDetail(locale, articleID)
    const article = cached.article
    if (!article) return {}

    const title = article.title ?? ''
    const firstImage = article.images?.[0]
    const imageUrl = firstImage
      ? (typeof firstImage.media === 'object' && firstImage.media?.url
          ? firstImage.media.url
          : firstImage.url ?? null)
      : null

    return {
      title,
      alternates: {
        canonical: `/${locale}/news/${id}`,
        languages: buildLanguageAlternates(`/news/${id}`),
      },
      openGraph: {
        title,
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
  const { id, locale: localeParam } = await params
  const locale = getValidLocale(localeParam)
  if (!locale) notFound()

  const articleID = Number(id)

  if (!Number.isFinite(articleID)) {
    notFound()
  }

  const cached = await getCachedNewsDetail(locale, articleID)
  const article = cached.article

  if (!article) {
    notFound()
  }

  const normalizedArticle = normalizeArticle(article)
  const more = cached.related.map(normalizeArticle)
  const labels = resolveArticleLabels(locale, cached.labels)

  return <ArticleDetailClient key={normalizedArticle.id} article={normalizedArticle} more={more} labels={labels} />
}
