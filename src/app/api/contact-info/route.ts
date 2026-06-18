import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function GET() {
  try {
    const payload = await getPayloadClient()
    const data = await payload.findGlobal({
      slug: 'contact-info',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      locale: 'all' as any,
    })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ email: '', phones: [], address: {}, workingHours: {} })
  }
}
