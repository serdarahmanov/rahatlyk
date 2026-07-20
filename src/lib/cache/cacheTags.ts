import type { Locale } from '@/lib/i18n/translations'

export const CACHE_REVALIDATE_SECONDS = 345600

export function localeTag(tag: string, locale: Locale) {
  return `${tag}:${locale}`
}

export const homeTag = (locale: Locale) => localeTag('home', locale)
export const aboutTag = (locale: Locale) => localeTag('about', locale)
export const contactTag = (locale: Locale) => localeTag('contact', locale)
export const productsTag = (locale: Locale) => localeTag('products', locale)
export const productTag = (locale: Locale, id: string | number) => `product:${locale}:${id}`
export const newsListTag = (locale: Locale) => localeTag('news', locale)
export const newsItemTag = (locale: Locale, id: string | number) => `news-item:${locale}:${id}`
export const vacanciesTag = (locale: Locale) => localeTag('vacancies', locale)
export const vacancyTag = (locale: Locale, id: string | number) => `vacancy:${locale}:${id}`
export const contactInfoTag = () => 'contact-info'
export const navigationLabelsTag = (locale: Locale) => localeTag('navigation-labels', locale)

export const productLabelsTag = (locale: Locale) => localeTag('product-labels', locale)
export const articleLabelsTag = (locale: Locale) => localeTag('article-labels', locale)
export const vacancyLabelsTag = (locale: Locale) => localeTag('vacancy-labels', locale)
export const siteMetadataTag = (locale: Locale) => localeTag('site-metadata', locale)
