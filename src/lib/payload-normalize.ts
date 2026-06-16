import type { Article, Media, Product, Vacancy } from '../../payload-types'
import type { PayloadArticle, PayloadProduct, PayloadResult, PayloadVacancy } from '@/types/payload'

type RawPayloadResult<T> = {
  docs: T[]
  totalDocs?: number
  totalPages?: number
  page?: number | null
  limit?: number
  hasNextPage?: boolean
  hasPrevPage?: boolean
  nextPage?: number | null
  prevPage?: number | null
}

const itemID = (id: string | null | undefined, index: number) => id ?? String(index)

const textRows = (items: { text: string; id?: string | null }[] | null | undefined) =>
  (items ?? []).map((item, index) => ({
    id: itemID(item.id, index),
    text: item.text,
  }))

const mediaURL = (media: number | Media | null | undefined) =>
  typeof media === 'object' && media ? media.url : undefined

const urlRows = (items: { media?: number | Media | null; url?: string | null; id?: string | null }[] | null | undefined) =>
  (items ?? []).flatMap((item, index) => {
    const url = mediaURL(item.media) ?? item.url
    return url ? [{ id: itemID(item.id, index), url }] : []
  })

export const normalizeArticle = (article: Article): PayloadArticle => ({
  ...article,
  body: textRows(article.body),
  emoji: article.emoji ?? null,
  featured: Boolean(article.featured),
  images: urlRows(article.images),
})

export const normalizeProduct = (product: Product): PayloadProduct => ({
  ...product,
  description: product.description ?? null,
  features: textRows(product.features),
  longDescription: product.longDescription ?? null,
  nutrition: (product.nutrition ?? []).map((item, index) => ({
    id: itemID(item.id, index),
    label: item.label,
    value: item.value,
  })),
  photos: urlRows(product.photos),
  tagline: product.tagline ?? null,
  volumes: (product.volumes ?? []).map((item, index) => ({
    id: itemID(item.id, index),
    value: item.value,
  })),
})

export const normalizeVacancy = (vacancy: Vacancy): PayloadVacancy => ({
  ...vacancy,
  benefits: textRows(vacancy.benefits),
  location: vacancy.location ?? null,
  niceToHave: textRows(vacancy.niceToHave),
  overview: vacancy.overview ?? null,
  requirements: textRows(vacancy.requirements),
  responsibilities: textRows(vacancy.responsibilities),
  salary: vacancy.salary ?? null,
})

export function normalizeResult<TInput, TOutput>(
  result: RawPayloadResult<TInput>,
  docs: TOutput[],
  fallbackLimit: number,
): PayloadResult<TOutput> {
  const page = result.page ?? 1
  const totalDocs = result.totalDocs ?? docs.length
  const limit = result.limit ?? fallbackLimit
  const totalPages = result.totalPages ?? Math.ceil(totalDocs / limit)

  return {
    docs,
    totalDocs,
    totalPages,
    page,
    limit,
    hasNextPage: result.hasNextPage ?? page < totalPages,
    hasPrevPage: result.hasPrevPage ?? page > 1,
    nextPage: result.nextPage ?? (page < totalPages ? page + 1 : null),
    prevPage: result.prevPage ?? (page > 1 ? page - 1 : null),
  }
}
