import { notFound } from 'next/navigation'
import ArticleDetailClient from './ArticleDetailClient'
import { getValidLocale, supportedLocales } from '@/lib/i18n/locale'
import { normalizeArticle } from '@/lib/payload-normalize'
import { getCachedNewsDetail, getCachedNewsStaticIDs } from '@/lib/payload/cachedQueries'

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

  return <ArticleDetailClient key={normalizedArticle.id} article={normalizedArticle} more={more} />
}
