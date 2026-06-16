import VacanciesClient from './VacanciesClient'
import { getPayloadClient } from '@/lib/payload'
import { normalizeResult, normalizeVacancy } from '@/lib/payload-normalize'

const PAGE_SIZE = 9

type Props = {
  searchParams: Promise<{
    department?: string
    page?: string
  }>
}

export default async function VacanciesPage({ searchParams }: Props) {
  const params = await searchParams
  const department = params.department ?? 'all'
  const page = Math.max(Number(params.page ?? '1') || 1, 1)
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'vacancies',
    depth: 2,
    limit: PAGE_SIZE,
    page,
    sort: '-postedDate',
    ...(department !== 'all'
      ? {
          where: {
            department: {
              equals: department,
            },
          },
        }
      : {}),
  })

  const docs = result.docs.map(normalizeVacancy)

  return (
    <VacanciesClient
      department={department}
      result={normalizeResult(result, docs, PAGE_SIZE)}
    />
  )
}
