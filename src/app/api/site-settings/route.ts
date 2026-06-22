import { NextResponse } from 'next/server'
import { getCachedSiteSettings } from '@/lib/payload/cachedQueries'

export async function GET() {
  try {
    const data = await getCachedSiteSettings()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ instagramUrl: '', youtubeUrl: '', facebookUrl: '' })
  }
}
