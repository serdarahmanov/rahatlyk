'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { withLocale } from '@/lib/i18n/locale';
import { useErrorContent } from '@/lib/error-content/ErrorContentContext';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t, locale } = useLanguage();
  const cms = useErrorContent();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 pt-40 pb-24 text-center">
      <span className="text-[13px] font-medium uppercase tracking-[0.25em] text-[#0c3a52]/60 mb-4">
        {cms.label || t.error.label}
      </span>
      <h1
        className="text-3xl sm:text-4xl font-light text-black mb-4"
        style={{ fontFamily: 'var(--font-heading), sans-serif' }}
      >
        {cms.title || t.error.title}
      </h1>
      <p className="max-w-md text-sm sm:text-base text-black/60 leading-relaxed mb-8">
        {cms.message || t.error.message}
      </p>
      <div className="flex items-center gap-3">
        <button type="button" onClick={reset} className="btn-primary">
          {cms.retryLabel || t.error.retry}
        </button>
        <Link href={withLocale(locale)} prefetch={false} className="btn-outline">
          {cms.ctaLabel || t.error.cta}
        </Link>
      </div>
    </div>
  );
}
