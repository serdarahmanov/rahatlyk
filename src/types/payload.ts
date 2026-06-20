import type {
  Article as GeneratedArticle,
  Product as GeneratedProduct,
  Vacancy as GeneratedVacancy,
} from '../../payload-types'

type ArrayItem<T> = T & { id: string }

export type PayloadCategory = {
  id: string
  slug: string
  label: string
}

export type PayloadProductLine = {
  id: string
  key: string
  name: string
  description: string
  body: string
  imageUrl: string | null
  order: number
}

export type PayloadArticle = Omit<GeneratedArticle, 'body' | 'category' | 'emoji' | 'featured' | 'images'> & {
  body: ArrayItem<{ text: unknown }>[]
  category: PayloadCategory
  emoji: string | null
  featured: boolean
  images: ArrayItem<{ url: string }>[]
}

export type PayloadProduct = Omit<
  GeneratedProduct,
  'category' | 'description' | 'features' | 'longDescription' | 'nutrition' | 'photos' | 'tagline' | 'volumes' | 'video'
> & {
  category: PayloadCategory
  description: string | null
  longDescription: string | null
  nutrition: ArrayItem<{ label: string; value: string }>[]
  photos: ArrayItem<{ url: string }>[]
  tagline: string | null
  videoUrl: string | null
  volumes: ArrayItem<{ value: string }>[]
}

export type PayloadVacancy = Omit<
  GeneratedVacancy,
  'benefits' | 'department' | 'image' | 'location' | 'niceToHave' | 'overview' | 'requirements' | 'responsibilities' | 'salary'
> & {
  benefits: ArrayItem<{ text: string }>[]
  department: PayloadCategory
  imageUrl: string | null
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

export type HorizontalScrollData = {
  box1ImageUrl:    string | null
  box2ImageUrl:    string | null
  box2Tag:         string | null
  box2Headline:    string | null
  box3ImageUrl:    string | null
  box4Text:        string | null
  box4ButtonLabel: string | null
  box4ButtonHref:  string | null
  box5VideoUrl:      string | null
  box5CoverImageUrl: string | null
  box5Tag:           string | null
  box5Headline:      string | null
  box6ImageUrl:    string | null
  box6Tag:         string | null
  box6Headline:    string | null
  box6ButtonLabel: string | null
  box6ButtonHref:  string | null
}

export type HomeStoryData = {
  imageUrl: string | null
  tag:      string | null
  title:    string | null
  text:     string | null
}

export type HomeCtaBannerData = {
  title:    string | null
  subtitle: string | null
  ctaLabel: string | null
  ctaHref:  string | null
}

export type HomeHeroData = {
  videoUrl:    string | null
  posterUrl:   string | null
  title:       string | null
  titleAccent: string | null
  subtitle:    string | null
}

export type ProductDetailLabelsData = {
  sizeLabel:      string | null
  nutritionLabel: string | null
  aboutLabel:     string | null
  mineralLabel:   string | null
  perLitreLabel:  string | null
}
