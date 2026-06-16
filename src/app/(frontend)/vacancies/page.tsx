import { cookies } from 'next/headers'
import VacanciesClient from './VacanciesClient'
import { getPayloadClient } from '@/lib/payload'
import { normalizeCategory, normalizeResult, normalizeVacancy } from '@/lib/payload-normalize'

const PAGE_SIZE = 9

type Props = {
  searchParams: Promise<{
    department?: string
    page?: string
  }>
}

export default async function VacanciesPage({ searchParams }: Props) {
  const params = await searchParams
  const departmentSlug = params.department ?? 'all'
  const page = Math.max(Number(params.page ?? '1') || 1, 1)
  const locale = ((await cookies()).get('RAHATLYK-locale')?.value ?? 'en') as 'en' | 'tm' | 'ru'
  const payload = await getPayloadClient()

  const departmentsResult = await payload.find({
    collection: 'vacancy-departments',
    locale,
    limit: 100,
    sort: 'label',
  })
  const departments = departmentsResult.docs.map(normalizeCategory)
  const activeDepartment = departmentsResult.docs.find(d => d.slug === departmentSlug)

  const result = await payload.find({
    collection: 'vacancies',
    depth: 2,
    locale,
    limit: PAGE_SIZE,
    page,
    sort: '-postedDate',
    ...(departmentSlug !== 'all' && activeDepartment
      ? { where: { department: { equals: activeDepartment.id } } }
      : {}),
  })

  const docs = result.docs.map(normalizeVacancy)

  return (
    <VacanciesClient
      department={departmentSlug}
      departments={departments}
      result={normalizeResult(result, docs, PAGE_SIZE)}
    />
  )
}
