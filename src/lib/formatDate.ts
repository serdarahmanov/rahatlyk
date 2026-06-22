import type { Locale } from './i18n/translations';

const LOCALE_MAP: Record<Locale, string> = {
  en: 'en-GB',
  ru: 'ru-RU',
  tm: 'en-GB',
};

const TM_MONTHS = [
  'Ýanwar', 'Fewral', 'Mart', 'Aprel', 'Maý', 'Iýun',
  'Iýul', 'Awgust', 'Sentýabr', 'Oktýabr', 'Noýabr', 'Dekabr',
];

export function formatDate(iso: string, locale: Locale): string {
  const date = new Date(iso);
  if (locale === 'tm') {
    return `${date.getDate()} ${TM_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
  }
  return new Intl.DateTimeFormat(LOCALE_MAP[locale], {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}
