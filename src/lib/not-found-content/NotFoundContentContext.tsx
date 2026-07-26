'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

type LocaleMap = { en?: string | null; ru?: string | null; tm?: string | null } | null | undefined

export interface RawNotFoundContent {
  title?: LocaleMap
  message?: LocaleMap
  ctaLabel?: LocaleMap
}

export interface NotFoundContentData {
  title: string | null
  message: string | null
  ctaLabel: string | null
}

const NotFoundContentContext = createContext<RawNotFoundContent | null>(null)

function resolveLocale(value: LocaleMap, locale: string): string | null {
  const resolved = value?.[locale as keyof NonNullable<LocaleMap>]
  return resolved && resolved.trim() ? resolved : null
}

export function NotFoundContentProvider({
  children,
  raw,
}: {
  children: ReactNode
  raw: RawNotFoundContent | null
}) {
  return (
    <NotFoundContentContext.Provider value={raw}>
      {children}
    </NotFoundContentContext.Provider>
  )
}

export function useNotFoundContent(): NotFoundContentData {
  const raw = useContext(NotFoundContentContext)
  const { locale } = useLanguage()
  return {
    title: resolveLocale(raw?.title, locale),
    message: resolveLocale(raw?.message, locale),
    ctaLabel: resolveLocale(raw?.ctaLabel, locale),
  }
}
