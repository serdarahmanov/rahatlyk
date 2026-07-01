import { NextRequest, NextResponse } from 'next/server'
import { defaultLocale } from './lib/i18n/locale'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/favicon.ico') {
    const destination = request.nextUrl.clone()
    destination.pathname = '/api/site-icon'
    return NextResponse.rewrite(destination)
  }

  const legacyPublicPrefixes = ['/about', '/contact', '/products', '/news', '/vacancies']
  const isLegacyPublicPath = legacyPublicPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )

  if (pathname !== '/' && !isLegacyPublicPath) {
    return NextResponse.next()
  }

  const destination = request.nextUrl.clone()

  destination.pathname = pathname === '/'
    ? `/${defaultLocale}`
    : `/${defaultLocale}${pathname}`

  return NextResponse.redirect(destination)
}

export const config = {
  matcher: [
    '/favicon.ico',
    '/((?!admin(?:/|$)|api(?:/|$)|_next(?:/|$)|media(?:/|$)|images(?:/|$)|fonts(?:/|$)|.*\\.[^/]+$).*)',
  ],
}
