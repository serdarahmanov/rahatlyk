import { NextResponse } from 'next/server'
import { getCachedContactInfo } from '@/lib/payload/cachedQueries'

export async function GET() {
  try {
    const data = await getCachedContactInfo()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ email: '', phones: [], address: {}, workingHours: {} })
  }
}
