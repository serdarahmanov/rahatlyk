import { NextResponse } from 'next/server'
import { getCachedContactInfo } from '@/lib/payload/cachedQueries'

export async function GET() {
  try {
    const data = await getCachedContactInfo()
    return NextResponse.json(data?.socialLinks ?? { instagramUrl: '', youtubeUrl: '', facebookUrl: '' })
  } catch {
    return NextResponse.json({ instagramUrl: '', youtubeUrl: '', facebookUrl: '' })
  }
}
