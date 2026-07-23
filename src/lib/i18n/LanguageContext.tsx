'use client';

import { createContext, useContext, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { translations, Locale } from './translations';
import { replacePathLocale } from './locale';
import { startNavigationProgress } from '@/lib/navigationProgress';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: typeof translations['en'];
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({
  children,
  initialLocale,
}: {
  children: ReactNode;
  initialLocale: Locale;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const setLocale = async (newLocale: Locale) => {
    if (newLocale === initialLocale) return;
    startNavigationProgress();

    const search = typeof window === 'undefined' ? '' : window.location.search;
    if (typeof window === 'undefined') {
      router.push(`${replacePathLocale(pathname, newLocale)}${search}`);
      return;
    }

    try {
      const response = await fetch(
        `/api/localized-path?locale=${encodeURIComponent(newLocale)}&pathname=${encodeURIComponent(window.location.pathname)}`,
      );
      if (response.ok) {
        const data = await response.json() as { path?: string };
        if (data.path) {
          router.push(`${data.path}${search}`);
          return;
        }
      }
    } catch {
      // Fall back to prefix-only locale replacement.
    }

    router.push(`${replacePathLocale(pathname, newLocale)}${search}`);
  };

  return (
    <LanguageContext.Provider value={{
      locale: initialLocale,
      setLocale,
      t: translations[initialLocale],
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
