import { supportedLocales, defaultLocale } from './locale'

export function buildLanguageAlternates(path: string): Record<string, string> {
  const result: Record<string, string> = {
    'x-default': `/${defaultLocale}${path}`,
  }
  for (const locale of supportedLocales) {
    // Our routing uses /tm, but the BCP-47 language tag for Turkmen is "tk"
    result[locale === 'tm' ? 'tk' : locale] = `/${locale}${path}`
  }
  return result
}
