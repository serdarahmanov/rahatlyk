import type { Locale } from './i18n/translations';

const LOCALE_MAP: Record<Locale, string> = {
  en: 'en-GB',
  ru: 'ru-RU',
  tm: 'tk-TM',
};

export function formatDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(LOCALE_MAP[locale], {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso));
}
