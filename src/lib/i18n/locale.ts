import type { Locale } from './translations'

export const supportedLocales = ['en', 'ru', 'tm'] as const satisfies readonly Locale[]
export const defaultLocale: Locale = 'tm'

export function validateLocale(value: string | null | undefined): value is Locale {
  return supportedLocales.includes(value as Locale)
}

export function getValidLocale(value: string | null | undefined): Locale | null {
  return validateLocale(value) ? value : null
}

export function withLocale(locale: Locale, path = '/'): string {
  const normalizedPath = path === '/' ? '' : `/${path.replace(/^\/+/, '')}`
  return `/${locale}${normalizedPath}`
}

export function replacePathLocale(pathname: string, locale: Locale): string {
  const segments = pathname.split('/')
  if (validateLocale(segments[1])) {
    segments[1] = locale
    return segments.join('/') || `/${locale}`
  }

  return withLocale(locale, pathname)
}

export function localizePublicHref(locale: Locale, href: string): string {
  if (
    !href.startsWith('/') ||
    href.startsWith('//') ||
    validateLocale(href.split('/')[1])
  ) {
    return href
  }

  return withLocale(locale, href)
}
