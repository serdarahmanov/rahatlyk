'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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

  useEffect(() => {
    try {
      const saved = localStorage.getItem('RAHATLYK-locale') as Locale | null;
      if (saved && (['en', 'ru', 'tm'] as string[]).includes(saved)) {
        setLocaleState(saved);
      }
    } catch {
      // localStorage blocked (private mode, etc.)
    }
    setReady(true);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('RAHATLYK-locale', newLocale);
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
