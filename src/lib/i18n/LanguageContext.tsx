'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { translations, Locale } from './translations';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: typeof translations['en'];
  /** true once localStorage has been read and the correct locale applied */
  ready: boolean;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Start with 'en' so server and initial client renders match (no hydration error).
  // The useEffect reads localStorage and updates to the saved locale after hydration.
  const [locale, setLocaleState] = useState<Locale>('en');
  const [ready, setReady]        = useState(false);
  const router = useRouter();

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      try {
        const saved = localStorage.getItem('RAHATLYK-locale') as Locale | null;
        if (saved && (['en', 'ru', 'tm'] as string[]).includes(saved)) {
          setLocaleState(saved);
          document.cookie = `RAHATLYK-locale=${saved}; path=/; max-age=31536000; SameSite=Lax`;
        }
      } catch {
        // localStorage blocked (private mode, etc.)
      }
      setReady(true);
    });

    return () => cancelAnimationFrame(id);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('RAHATLYK-locale', newLocale);
    document.cookie = `RAHATLYK-locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh();
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t: translations[locale], ready }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
