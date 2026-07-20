import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import VacanciesClient from './VacanciesClient'
import { getValidLocale, defaultLocale } from '@/lib/i18n/locale'
import { buildCanonicalPath, buildLanguageAlternates } from '@/lib/i18n/metadata'
import { normalizeCategory, normalizeResult, normalizeVacancy } from '@/lib/payload-normalize'
import { getCachedVacanciesPage, getCachedVacancyDepartments, getCachedVacancyLabels, getCachedSiteMetadata } from '@/lib/payload/cachedQueries'
import { resolveVacancyLabels } from '@/lib/vacancy-labels'

const PAGE_SIZE = 9

const TITLES: Record<string, string> = {
  tm: 'Boş iş orunlary',
  ru: 'Вакансии',
  en: 'Careers',
}

const DESCRIPTIONS: Record<string, string> = {
  tm: 'RAHATLYK-da karýeraňyzy guruň. Önümçilik, satuw, marketing, logistika we beýleki ugurlarda açyk iş orunlaryny görüň.',
  ru: 'Постройте карьеру в RAHATLYK. Откройте вакансии в производстве, продажах, маркетинге, логистике и других отделах.',
  en: 'Build your career at RAHATLYK. Browse open positions in production, sales, marketing, logistics and more.',
}

function resolveOgImage(value: unknown): string | null {
  return value && typeof value === 'object' && 'url' in value
    ? (value as { url: string }).url || null
    : null
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ department?: string; page?: string }>
}): Promise<Metadata> {
  const locale = getValidLocale((await params).locale) ?? defaultLocale
  const query = await searchParams
  const hasIndexableQuery = (query.department && query.department !== 'all') || (query.page && query.page !== '1')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let siteMeta: any = null
  try { siteMeta = await getCachedSiteMetadata(locale) } catch { /* fallback */ }

  const title = siteMeta?.vacancies?.title ?? TITLES[locale] ?? TITLES[defaultLocale]
  const description = siteMeta?.vacancies?.description ?? DESCRIPTIONS[locale] ?? DESCRIPTIONS[defaultLocale]
  const ogImageUrl = resolveOgImage(siteMeta?.vacancies?.ogImage)

  return {
    title,
    description,
    alternates: {
      canonical: buildCanonicalPath(locale, '/vacancies'),
      languages: buildLanguageAlternates('/vacancies'),
    },
    ...(hasIndexableQuery ? {
      robots: {
        index: false,
        follow: true,
        googleBot: { index: false, follow: true },
      },
    } : {}),
    openGraph: {
      title,
      description,
      type: 'website',
      url: buildCanonicalPath(locale, '/vacancies'),
      ...(ogImageUrl ? { images: [{ url: ogImageUrl }] } : {}),
    },
  }
}

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{
    department?: string
    page?: string
  }>
}

export default async function VacanciesPage({ params, searchParams }: Props) {
  const locale = getValidLocale((await params).locale)
  if (!locale) notFound()

  const query = await searchParams
  const departmentSlug = query.department ?? 'all'
  const page = Math.max(Number(query.page ?? '1') || 1, 1)

  const [departmentsResult, rawLabels] = await Promise.all([
    getCachedVacancyDepartments(locale),
    getCachedVacancyLabels(locale),
  ])

  const departments = departmentsResult.docs.map(normalizeCategory)
  const activeDepartment = departmentsResult.docs.find(d => d.slug === departmentSlug)

  const result = await getCachedVacanciesPage(
    locale,
    page,
    departmentSlug !== 'all' && activeDepartment ? Number(activeDepartment.id) : undefined,
  )

  const docs = result.docs.map(normalizeVacancy)
  const labels = resolveVacancyLabels(locale, rawLabels)

  return (
    <VacanciesClient
      department={departmentSlug}
      departments={departments}
      result={normalizeResult(result, docs, PAGE_SIZE)}
      labels={labels}
    />
  )
}
