import type {
  Article as GeneratedArticle,
  Product as GeneratedProduct,
  Vacancy as GeneratedVacancy,
} from '../../payload-types'

type ArrayItem<T> = T & { id: string }

export type PayloadArticle = Omit<GeneratedArticle, 'body' | 'emoji' | 'featured' | 'images'> & {
  body: ArrayItem<{ text: string }>[]
  emoji: string | null
  featured: boolean
  images: ArrayItem<{ url: string }>[]
}

export type PayloadProduct = Omit<
  GeneratedProduct,
  'description' | 'features' | 'longDescription' | 'nutrition' | 'photos' | 'tagline' | 'volumes'
> & {
  description: string | null
  features: ArrayItem<{ text: string }>[]
  longDescription: string | null
  nutrition: ArrayItem<{ label: string; value: string }>[]
  photos: ArrayItem<{ url: string }>[]
  tagline: string | null
  volumes: ArrayItem<{ value: string }>[]
}

export type PayloadVacancy = Omit<
  GeneratedVacancy,
  'benefits' | 'location' | 'niceToHave' | 'overview' | 'requirements' | 'responsibilities' | 'salary'
> & {
  benefits: ArrayItem<{ text: string }>[]
  location: string | null
  niceToHave: ArrayItem<{ text: string }>[]
  overview: string | null
  requirements: ArrayItem<{ text: string }>[]
  responsibilities: ArrayItem<{ text: string }>[]
  salary: string | null
}

export type PayloadResult<T> = {
  docs:        T[]
  totalDocs:   number
  totalPages:  number
  page:        number
  limit:       number
  hasNextPage: boolean
  hasPrevPage: boolean
  nextPage:    number | null
  prevPage:    number | null
}
