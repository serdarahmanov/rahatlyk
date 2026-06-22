import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function GET() {
  try {
    const payload = await getPayloadClient()
    const data = await payload.findGlobal({ slug: 'site-settings' })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ instagramUrl: '', youtubeUrl: '', facebookUrl: '' })
  }
}
