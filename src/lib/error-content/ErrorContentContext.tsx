'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

type LocaleMap = { en?: string | null; ru?: string | null; tm?: string | null } | null | undefined

export interface RawErrorContent {
  label?: LocaleMap
  title?: LocaleMap
  message?: LocaleMap
  retryLabel?: LocaleMap
  ctaLabel?: LocaleMap
}

export interface ErrorContentData {
  label: string | null
  title: string | null
  message: string | null
  retryLabel: string | null
  ctaLabel: string | null
}

const ErrorContentContext = createContext<RawErrorContent | null>(null)

function resolveLocale(value: LocaleMap, locale: string): string | null {
  const resolved = value?.[locale as keyof NonNullable<LocaleMap>]
  return resolved && resolved.trim() ? resolved : null
}

export function ErrorContentProvider({
  children,
  raw,
}: {
  children: ReactNode
  raw: RawErrorContent | null
}) {
  return (
    <ErrorContentContext.Provider value={raw}>
      {children}
    </ErrorContentContext.Provider>
  )
}

export function useErrorContent(): ErrorContentData {
  const raw = useContext(ErrorContentContext)
  const { locale } = useLanguage()
  return {
    label: resolveLocale(raw?.label, locale),
    title: resolveLocale(raw?.title, locale),
    message: resolveLocale(raw?.message, locale),
    retryLabel: resolveLocale(raw?.retryLabel, locale),
    ctaLabel: resolveLocale(raw?.ctaLabel, locale),
  }
}
