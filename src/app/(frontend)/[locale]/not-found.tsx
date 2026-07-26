'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { withLocale } from '@/lib/i18n/locale';
import { useNotFoundContent } from '@/lib/not-found-content/NotFoundContentContext';

export default function NotFound() {
  const { t, locale } = useLanguage();
  const cms = useNotFoundContent();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 pt-40 pb-24 text-center">
      <span className="text-[13px] font-medium uppercase tracking-[0.25em] text-[#0c3a52]/60 mb-4">
        404
      </span>
      <h1
        className="text-3xl sm:text-4xl font-light text-black mb-4"
        style={{ fontFamily: 'var(--font-heading), sans-serif' }}
      >
        {cms.title || t.notFound.title}
      </h1>
      <p className="max-w-md text-sm sm:text-base text-black/60 leading-relaxed mb-8">
        {cms.message || t.notFound.message}
      </p>
      <Link href={withLocale(locale)} prefetch={false} className="btn-primary">
        {cms.ctaLabel || t.notFound.cta}
      </Link>
    </div>
  );
}
