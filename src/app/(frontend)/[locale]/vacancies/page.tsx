import { notFound } from 'next/navigation'
import VacanciesClient from './VacanciesClient'
import { getValidLocale } from '@/lib/i18n/locale'
import { normalizeCategory, normalizeResult, normalizeVacancy } from '@/lib/payload-normalize'
import { getCachedVacanciesPage, getCachedVacancyDepartments } from '@/lib/payload/cachedQueries'

const PAGE_SIZE = 9

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
  const departmentsResult = await getCachedVacancyDepartments(locale)
  const departments = departmentsResult.docs.map(normalizeCategory)
  const activeDepartment = departmentsResult.docs.find(d => d.slug === departmentSlug)

  const result = await getCachedVacanciesPage(
    locale,
    page,
    departmentSlug !== 'all' && activeDepartment ? Number(activeDepartment.id) : undefined,
  )

  const docs = result.docs.map(normalizeVacancy)

  return (
    <VacanciesClient
      department={departmentSlug}
      departments={departments}
      result={normalizeResult(result, docs, PAGE_SIZE)}
    />
  )
}
