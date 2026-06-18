import type { Article, Media, Product, ProductLine, Vacancy } from '../../payload-types'
import type {
  HorizontalScrollData,
  HomeCtaBannerData,
  HomeHeroData,
  HomeStoryData,
  PayloadArticle,
  PayloadCategory,
  PayloadProduct,
  PayloadProductLine,
  PayloadResult,
  PayloadVacancy,
} from '@/types/payload'

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

export const normalizeProductLine = (raw: ProductLine): PayloadProductLine => ({
  id: String(raw.id),
  key: raw.key,
  name: raw.name,
  description: raw.description,
  body: raw.body ?? '',
  imageUrl: mediaURL(raw.image as number | Media | null | undefined) ?? null,
  order: raw.order ?? 0,
})

export const normalizeCategory = (
  raw: number | { id: number; slug: string; label: string },
): PayloadCategory => {
  if (typeof raw === 'object') {
    return { id: String(raw.id), slug: raw.slug, label: raw.label }
  }
  return { id: String(raw), slug: '', label: '' }
}

export const normalizeArticle = (article: Article): PayloadArticle => ({
  ...article,
  body: textRows(article.body),
  category: normalizeCategory(article.category),
  emoji: article.emoji ?? null,
  featured: Boolean(article.featured),
  images: urlRows(article.images),
})

export const normalizeProduct = (product: Product): PayloadProduct => ({
  ...product,
  category: normalizeCategory(product.category),
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
  videoUrl: mediaURL(product.video as number | Media | null | undefined) ?? null,
  volumes: (product.volumes ?? []).map((item, index) => ({
    id: itemID(item.id, index),
    value: item.value,
  })),
})

export const normalizeVacancy = (vacancy: Vacancy): PayloadVacancy => ({
  ...vacancy,
  benefits: textRows(vacancy.benefits),
  department: normalizeCategory(vacancy.department),
  imageUrl: mediaURL(vacancy.image as number | Media | null | undefined) ?? null,
  location: vacancy.location ?? null,
  niceToHave: textRows(vacancy.niceToHave),
  overview: vacancy.overview ?? null,
  requirements: textRows(vacancy.requirements),
  responsibilities: textRows(vacancy.responsibilities),
  salary: vacancy.salary ?? null,
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rawStr = (val: unknown): string | null => (typeof val === 'string' && val ? val : null)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rawMediaUrl = (val: unknown): string | null =>
  val && typeof val === 'object' && 'url' in val && typeof (val as Record<string, unknown>).url === 'string'
    ? (val as { url: string }).url
    : null

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const normalizeHorizontalScroll = (raw: any): HorizontalScrollData => {
  const b1 = raw?.box1 ?? {}
  const b2 = raw?.box2 ?? {}
  const b3 = raw?.box3 ?? {}
  const b4 = raw?.box4 ?? {}
  const b5 = raw?.box5 ?? {}
  const b6 = raw?.box6 ?? {}
  return {
    box1ImageUrl:    rawMediaUrl(b1.image),
    box2ImageUrl:    rawMediaUrl(b2.image),
    box2Tag:         rawStr(b2.tag),
    box2Headline:    rawStr(b2.headline),
    box3ImageUrl:    rawMediaUrl(b3.image),
    box4Text:        rawStr(b4.text),
    box4ButtonLabel: rawStr(b4.buttonLabel),
    box4ButtonHref:  rawStr(b4.buttonHref),
    box5VideoUrl:      rawMediaUrl(b5.video),
    box5CoverImageUrl: rawMediaUrl(b5.coverImage),
    box5Tag:           rawStr(b5.tag),
    box5Headline:    rawStr(b5.headline),
    box6ImageUrl:    rawMediaUrl(b6.image),
    box6Tag:         rawStr(b6.tag),
    box6Headline:    rawStr(b6.headline),
    box6ButtonLabel: rawStr(b6.buttonLabel),
    box6ButtonHref:  rawStr(b6.buttonHref),
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const normalizeHomeStory = (raw: any): HomeStoryData => ({
  imageUrl: rawMediaUrl(raw?.image),
  tag:      rawStr(raw?.tag),
  title:    rawStr(raw?.title),
  text:     rawStr(raw?.text),
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const normalizeHomeHero = (raw: any): HomeHeroData => ({
  videoUrl:    rawMediaUrl(raw?.video),
  title:       rawStr(raw?.title),
  titleAccent: rawStr(raw?.titleAccent),
  subtitle:    rawStr(raw?.subtitle),
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const normalizeHomeCtaBanner = (raw: any): HomeCtaBannerData => ({
  title:    rawStr(raw?.title),
  subtitle: rawStr(raw?.subtitle),
  ctaLabel: rawStr(raw?.ctaLabel),
  ctaHref:  rawStr(raw?.ctaHref),
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
