import { NextRequest, NextResponse } from 'next/server'
import { defaultLocale, supportedLocales } from './lib/i18n/locale'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/favicon.ico') {
    const destination = request.nextUrl.clone()
    destination.pathname = '/api/site-icon'
    return NextResponse.rewrite(destination)
  }

  if (pathname === `/${defaultLocale}` || pathname.startsWith(`/${defaultLocale}/`)) {
    return new NextResponse('Not Found', { status: 404 })
  }

  // Paths already carrying an explicit non-default locale prefix (/en, /ru)
  // are real routes — pass them straight through to Next's own router.
  const hasExplicitLocalePrefix = supportedLocales.some(
    (locale) => locale !== defaultLocale && (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)),
  )
  if (hasExplicitLocalePrefix) {
    return NextResponse.next()
  }

  // Everything else — including paths with no matching route at all — gets
  // the default-locale prefix attached (URL bar stays the same), so it
  // reaches the [locale] segment and its catch-all/not-found handling
  // instead of bypassing it and hitting Next's bare, unstyled 404.
  const destination = request.nextUrl.clone()
  destination.pathname = pathname === '/' ? `/${defaultLocale}` : `/${defaultLocale}${pathname}`
  return NextResponse.rewrite(destination)
}

export const config = {
  matcher: [
    '/favicon.ico',
    '/((?!admin(?:/|$)|api(?:/|$)|_next(?:/|$)|media(?:/|$)|images(?:/|$)|fonts(?:/|$)|.*\\.[^/]+$).*)',
  ],
}
