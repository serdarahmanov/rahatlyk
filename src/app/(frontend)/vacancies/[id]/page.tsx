import { notFound } from 'next/navigation'
import VacancyDetailClient from './VacancyDetailClient'
import { getPayloadClient } from '@/lib/payload'
import { normalizeVacancy } from '@/lib/payload-normalize'

type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function VacancyDetailPage({ params }: Props) {
  const { id } = await params
  const vacancyID = Number(id)

  if (!Number.isFinite(vacancyID)) {
    notFound()
  }

  const payload = await getPayloadClient()
  const vacancyResult = await payload.find({
    collection: 'vacancies',
    depth: 2,
    limit: 1,
    where: {
      id: {
        equals: vacancyID,
      },
    },
  })

  const vacancy = vacancyResult.docs[0]

  if (!vacancy) {
    notFound()
  }

  const othersResult = await payload.find({
    collection: 'vacancies',
    depth: 2,
    limit: 3,
    sort: '-postedDate',
    where: {
      id: {
        not_equals: vacancyID,
      },
    },
  })

  return (
    <VacancyDetailClient
      vacancy={normalizeVacancy(vacancy)}
      others={othersResult.docs.map(normalizeVacancy)}
    />
  )
}
