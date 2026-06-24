'use client';

import { createContext, useContext, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { translations, Locale } from './translations';
import { replacePathLocale } from './locale';

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

  const setLocale = (newLocale: Locale) => {
    const search = typeof window === 'undefined' ? '' : window.location.search;
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
