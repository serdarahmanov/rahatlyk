import { supportedLocales, withLocale } from './locale'
import type { Locale } from './translations'

export type LocalizedPathMap = Partial<Record<Locale, string>>

export function buildCanonicalPath(locale: Locale, path = '/'): string {
  return withLocale(locale, path)
}

export function buildLanguageAlternates(path: string): Record<string, string> {
  const result: Record<string, string> = {
    'x-default': withLocale('tm', path),
  }
  for (const locale of supportedLocales) {
    // The public BCP-47 language tag for Turkmen is "tk".
    result[locale === 'tm' ? 'tk' : locale] = withLocale(locale, path)
  }
  return result
}

export function buildLocalizedLanguageAlternates(paths: LocalizedPathMap): Record<string, string> {
  const defaultPath = paths.tm ?? paths.en ?? paths.ru ?? '/'
  const result: Record<string, string> = {
    'x-default': withLocale('tm', defaultPath),
  }

  for (const locale of supportedLocales) {
    const path = paths[locale]
    if (path) {
      result[locale === 'tm' ? 'tk' : locale] = withLocale(locale, path)
    }
  }

  return result
}

export function buildAbsoluteUrl(siteUrl: string, pathOrUrl: string): string {
  return new URL(pathOrUrl, siteUrl).toString()
}

export function truncateDescription(value: string, maxLength = 155): string {
  const normalized = value.replace(/\s+/g, ' ').trim()
  if (normalized.length <= maxLength) return normalized
  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`
}

export function extractLexicalText(value: unknown): string {
  if (!value || typeof value !== 'object') return ''
  if ('text' in value && typeof (value as { text?: unknown }).text === 'string') {
    return (value as { text: string }).text
  }

  const children = 'children' in value ? (value as { children?: unknown }).children : null
  if (!Array.isArray(children)) return ''

  return children.map(extractLexicalText).filter(Boolean).join(' ')
}
