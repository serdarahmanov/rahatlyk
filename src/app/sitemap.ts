import type { MetadataRoute } from 'next'
import { supportedLocales, defaultLocale } from '@/lib/i18n/locale'
import {
  getCachedProductStaticIDs,
  getCachedNewsStaticIDs,
  getCachedVacancyStaticIDs,
} from '@/lib/payload/cachedQueries'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://rahatlyk.com'

type ChangeFreq = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'

function makeEntry(
  path: string,
  changeFrequency: ChangeFreq = 'monthly',
  priority = 0.7,
): MetadataRoute.Sitemap[number] {
  return {
    url: `${BASE_URL}/${defaultLocale}${path}`,
    changeFrequency,
    priority,
    alternates: {
      languages: Object.fromEntries(
        supportedLocales.map((locale) => [
          locale === 'tm' ? 'tk' : locale,
          `${BASE_URL}/${locale}${path}`,
        ]),
      ),
    },
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    makeEntry('',           'weekly',  1.0),
    makeEntry('/about',     'monthly', 0.7),
    makeEntry('/contact',   'monthly', 0.6),
    makeEntry('/products',  'weekly',  0.8),
    makeEntry('/news',      'daily',   0.8),
    makeEntry('/vacancies', 'weekly',  0.7),
  ]

  // Fetch IDs from a single locale — IDs are shared across locales
  const locale = defaultLocale
  const [productIDs, newsIDs, vacancyIDs] = await Promise.allSettled([
    getCachedProductStaticIDs(locale),
    getCachedNewsStaticIDs(locale),
    getCachedVacancyStaticIDs(locale),
  ])

  if (productIDs.status === 'fulfilled') {
    for (const id of productIDs.value) {
      entries.push(makeEntry(`/products/${id}`, 'monthly', 0.6))
    }
  }

  if (newsIDs.status === 'fulfilled') {
    for (const id of newsIDs.value) {
      entries.push(makeEntry(`/news/${id}`, 'monthly', 0.6))
    }
  }

  if (vacancyIDs.status === 'fulfilled') {
    for (const id of vacancyIDs.value) {
      entries.push(makeEntry(`/vacancies/${id}`, 'weekly', 0.5))
    }
  }

  return entries
}
