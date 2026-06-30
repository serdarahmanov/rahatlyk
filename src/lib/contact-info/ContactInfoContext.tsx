'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

type LocaleMap = { en?: string; tm?: string; ru?: string } | string | null | undefined

interface RawPhone {
  id?: string
  label?: string | null
  number?: string | null
}

export interface RawContactInfo {
  sectionLabel?: LocaleMap
  email?: string | null
  phones?: RawPhone[] | null
  address?: LocaleMap
  workingHours?: LocaleMap
  socialLinks?: {
    instagramUrl?: string | null
    youtubeUrl?: string | null
    facebookUrl?: string | null
  } | null
}

export interface PhoneEntry {
  label: string
  number: string
}

export interface ContactInfoData {
  sectionLabel: string
  email: string
  phones: PhoneEntry[]
  address: string
  workingHours: string
  socialLinks: {
    instagramUrl: string
    youtubeUrl: string
    facebookUrl: string
  }
}

const defaultInfo: ContactInfoData = {
  sectionLabel: 'Contact Information',
  email: '',
  phones: [],
  address: '',
  workingHours: '',
  socialLinks: { instagramUrl: '', youtubeUrl: '', facebookUrl: '' },
}

const ContactInfoContext = createContext<ContactInfoData>(defaultInfo)

function resolveLocale(value: LocaleMap, locale: string): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  return (value as Record<string, string>)[locale] ?? value.en ?? ''
}

export function ContactInfoProvider({
  children,
  initialContactInfo = null,
}: {
  children: ReactNode
  initialContactInfo?: RawContactInfo | null
}) {
  const { locale } = useLanguage()
  const [raw, setRaw] = useState<RawContactInfo | null>(initialContactInfo)

  useEffect(() => {
    if (initialContactInfo) return

    fetch('/api/contact-info')
      .then(r => r.json())
      .then((data: RawContactInfo) => setRaw(data))
      .catch(() => {})
  }, [initialContactInfo])

  const value: ContactInfoData = {
    sectionLabel: resolveLocale(raw?.sectionLabel, locale) || 'Contact Information',
    email: raw?.email ?? '',
    phones: (raw?.phones ?? [])
      .filter((p): p is RawPhone & { number: string } => Boolean(p.number))
      .map(p => ({ label: p.label ?? '', number: p.number })),
    address: resolveLocale(raw?.address, locale),
    workingHours: resolveLocale(raw?.workingHours, locale),
    socialLinks: {
      instagramUrl: raw?.socialLinks?.instagramUrl ?? '',
      youtubeUrl: raw?.socialLinks?.youtubeUrl ?? '',
      facebookUrl: raw?.socialLinks?.facebookUrl ?? '',
    },
  }

  return (
    <ContactInfoContext.Provider value={value}>
      {children}
    </ContactInfoContext.Provider>
  )
}

export function useContactInfo() {
  return useContext(ContactInfoContext)
}
