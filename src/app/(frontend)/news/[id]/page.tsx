import { notFound } from 'next/navigation'
import ArticleDetailClient from './ArticleDetailClient'
import { getPayloadClient } from '@/lib/payload'
import { normalizeArticle } from '@/lib/payload-normalize'

type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function ArticlePage({ params }: Props) {
  const { id } = await params
  const articleID = Number(id)

  if (!Number.isFinite(articleID)) {
    notFound()
  }

  const payload = await getPayloadClient()
  const articleResult = await payload.find({
    collection: 'articles',
    depth: 2,
    limit: 1,
    where: {
      id: {
        equals: articleID,
      },
    },
  })

  const article = articleResult.docs[0]

  if (!article) {
    notFound()
  }

  const normalizedArticle = normalizeArticle(article)
  const relatedResult = await payload.find({
    collection: 'articles',
    depth: 2,
    limit: 3,
    sort: '-date',
    where: {
      and: [
        {
          id: {
            not_equals: normalizedArticle.id,
          },
        },
        {
          category: {
            equals: Number(normalizedArticle.category.id),
          },
        },
      ],
    },
  })

  let more = relatedResult.docs.map(normalizeArticle)

  if (more.length < 3) {
    const fallbackResult = await payload.find({
      collection: 'articles',
      depth: 2,
      limit: 3 - more.length,
      sort: '-date',
      where: {
        and: [
          {
            id: {
              not_equals: normalizedArticle.id,
            },
          },
          {
            category: {
              not_equals: Number(normalizedArticle.category.id),
            },
          },
        ],
      },
    })

    more = [...more, ...fallbackResult.docs.map(normalizeArticle)]
  }

  return <ArticleDetailClient article={normalizedArticle} more={more} />
}
