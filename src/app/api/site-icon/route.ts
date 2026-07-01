import { NextRequest, NextResponse } from 'next/server'
import { getCachedContactInfo } from '@/lib/payload/cachedQueries'

export const runtime = 'nodejs'

function mediaUrl(value: unknown): string | null {
  return value && typeof value === 'object' && 'url' in value && typeof (value as Record<string, unknown>).url === 'string'
    ? (value as { url: string }).url
    : null
}

function siteIconUrl(value: unknown): string | null {
  return value && typeof value === 'object' && 'siteIcon' in value
    ? mediaUrl((value as { siteIcon?: unknown }).siteIcon)
    : null
}

export async function GET(request: NextRequest) {
  try {
    const contactInfo = await getCachedContactInfo()
    const iconUrl = siteIconUrl(contactInfo)

    if (iconUrl) {
      const response = NextResponse.redirect(new URL(iconUrl, request.url), 307)
      response.headers.set('Cache-Control', 'no-store')
      return response
    }
  } catch {
    // Fall through to a 404 if the Payload icon is unavailable.
  }

  return new NextResponse(null, {
    status: 404,
    headers: { 'Cache-Control': 'no-store' },
  })
}
