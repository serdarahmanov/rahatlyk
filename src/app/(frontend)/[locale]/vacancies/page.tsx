import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import VacanciesClient from './VacanciesClient'
import { getValidLocale, defaultLocale } from '@/lib/i18n/locale'
import { buildLanguageAlternates } from '@/lib/i18n/metadata'
import { normalizeCategory, normalizeResult, normalizeVacancy } from '@/lib/payload-normalize'
import { getCachedVacanciesPage, getCachedVacancyDepartments, getCachedVacancyLabels } from '@/lib/payload/cachedQueries'
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

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = getValidLocale((await params).locale) ?? defaultLocale
  return {
    title: TITLES[locale] ?? TITLES[defaultLocale],
    description: DESCRIPTIONS[locale] ?? DESCRIPTIONS[defaultLocale],
    alternates: {
      canonical: `/${locale}/vacancies`,
      languages: buildLanguageAlternates('/vacancies'),
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
