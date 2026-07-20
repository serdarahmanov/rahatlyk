import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { defaultLocale, getValidLocale, withLocale } from '@/lib/i18n/locale'
import type { Locale } from '@/lib/i18n/translations'

export const dynamic = 'force-dynamic'

type LocalizedCollection = 'products' | 'articles'

function json(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, {
    ...init,
    headers: {
      'cache-control': 'no-store',
      ...init?.headers,
    },
  })
}

function parseLocalizedPath(pathname: string): { locale: Locale; path: string; segments: string[] } {
  const segments = pathname.split('/').filter(Boolean)
  const firstSegmentLocale = getValidLocale(segments[0])
  const locale = firstSegmentLocale ?? defaultLocale
  const pathSegments = firstSegmentLocale ? segments.slice(1) : segments

  return {
    locale,
    path: `/${pathSegments.join('/')}`,
    segments: pathSegments,
  }
}

function localizePath(path: string, locale: Locale) {
  return withLocale(locale, path)
}

async function resolveDetailPath(
  collection: LocalizedCollection,
  basePath: '/products' | '/news',
  currentLocale: Locale,
  targetLocale: Locale,
  currentSlug: string,
) {
  const payload = await getPayloadClient()
  const currentResult = await payload.find({
    collection,
    locale: currentLocale,
    depth: 0,
    limit: 1,
    where: { slug: { equals: currentSlug } },
  })

  const currentDoc = currentResult.docs[0]
  if (!currentDoc) return null

  const targetDoc = await payload.findByID({
    collection,
    id: Number(currentDoc.id),
    locale: targetLocale,
    depth: 0,
    select: { slug: true },
  })

  return targetDoc.slug ? localizePath(`${basePath}/${targetDoc.slug}`, targetLocale) : null
}

export async function GET(request: NextRequest) {
  const targetLocale = getValidLocale(request.nextUrl.searchParams.get('locale'))
  const pathname = request.nextUrl.searchParams.get('pathname') || '/'

  if (!targetLocale) {
    return json({ error: 'Invalid locale' }, { status: 400 })
  }

  const { locale: currentLocale, path, segments } = parseLocalizedPath(pathname)
  const [section, slug] = segments

  try {
    if (section === 'products' && slug) {
      const localizedPath = await resolveDetailPath('products', '/products', currentLocale, targetLocale, slug)
      if (localizedPath) return json({ path: localizedPath })
    }

    if (section === 'news' && slug) {
      const localizedPath = await resolveDetailPath('articles', '/news', currentLocale, targetLocale, slug)
      if (localizedPath) return json({ path: localizedPath })
    }
  } catch {
    return json({ path: localizePath(path, targetLocale) })
  }

  return json({ path: localizePath(path, targetLocale) })
}
