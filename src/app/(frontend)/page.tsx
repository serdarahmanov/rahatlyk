import { cookies } from 'next/headers'
import HomeClient from './HomeClient'
import { getPayloadClient } from '@/lib/payload'
import { normalizeProductLine } from '@/lib/payload-normalize'

export default async function HomePage() {
  const locale = ((await cookies()).get('RAHATLYK-locale')?.value ?? 'en') as 'en' | 'tm' | 'ru'
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'product-lines',
    depth: 1,
    locale,
    limit: 20,
    sort: 'order',
  })

  const lines = result.docs.map(normalizeProductLine)

  return <HomeClient lines={lines} />
}
