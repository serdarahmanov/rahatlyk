import type { MetadataRoute } from 'next'
import { supportedLocales, withLocale } from '@/lib/i18n/locale'
import { buildLocalizedLanguageAlternates, type LocalizedPathMap } from '@/lib/i18n/metadata'
import {
  getCachedProductStaticLocalizedSlugMaps,
  getCachedNewsStaticLocalizedSlugMaps,
} from '@/lib/payload/cachedQueries'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://rahatlyk.com'

type ChangeFreq = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'

function makeEntry(
  path: string,
  changeFrequency: ChangeFreq = 'monthly',
  priority = 0.7,
): MetadataRoute.Sitemap {
  const normalizedPath = path || '/'
  const paths = Object.fromEntries(
    supportedLocales.map((locale) => [locale, normalizedPath]),
  ) as LocalizedPathMap

  return makeLocalizedEntries(paths, changeFrequency, priority)
}

function makeLocalizedEntries(
  paths: LocalizedPathMap,
  changeFrequency: ChangeFreq = 'monthly',
  priority = 0.6,
): MetadataRoute.Sitemap {
  const alternates = buildLocalizedLanguageAlternates(paths)

  return supportedLocales.flatMap((locale) => {
    const path = paths[locale]
    if (!path) return []

    return [{
      url: `${BASE_URL}${withLocale(locale, path)}`,
      changeFrequency,
      priority,
      alternates: {
        languages: Object.fromEntries(
          Object.entries(alternates).map(([language, alternatePath]) => [
            language,
            `${BASE_URL}${alternatePath}`,
          ]),
        ),
      },
    }]
  })
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    ...makeEntry('',           'weekly',  1.0),
    ...makeEntry('/about',     'monthly', 0.7),
    ...makeEntry('/contact',   'monthly', 0.6),
    ...makeEntry('/products',  'weekly',  0.8),
    ...makeEntry('/news',      'daily',   0.8),
    ...makeEntry('/vacancies', 'weekly',  0.7),
  ]

  const [productSlugMaps, newsSlugMaps] = await Promise.allSettled([
    getCachedProductStaticLocalizedSlugMaps(),
    getCachedNewsStaticLocalizedSlugMaps(),
  ])

  if (productSlugMaps.status === 'fulfilled') {
    for (const item of productSlugMaps.value) {
      entries.push(...makeLocalizedEntries({
        en: item.slugs.en ? `/products/${item.slugs.en}` : undefined,
        ru: item.slugs.ru ? `/products/${item.slugs.ru}` : undefined,
        tm: item.slugs.tm ? `/products/${item.slugs.tm}` : undefined,
      }, 'monthly', 0.6))
    }
  }

  if (newsSlugMaps.status === 'fulfilled') {
    for (const item of newsSlugMaps.value) {
      entries.push(...makeLocalizedEntries({
        en: item.slugs.en ? `/news/${item.slugs.en}` : undefined,
        ru: item.slugs.ru ? `/news/${item.slugs.ru}` : undefined,
        tm: item.slugs.tm ? `/news/${item.slugs.tm}` : undefined,
      }, 'monthly', 0.6))
    }
  }

  return entries
}
