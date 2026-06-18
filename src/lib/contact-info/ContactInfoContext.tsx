'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

type LocaleMap = { en?: string; tm?: string; ru?: string } | string | null | undefined

interface RawPhone {
  id?: string
  label?: string | null
  number?: string | null
}

interface RawContactInfo {
  email?: string | null
  phones?: RawPhone[] | null
  address?: LocaleMap
  workingHours?: LocaleMap
}

export interface PhoneEntry {
  label: string
  number: string
}

export interface ContactInfoData {
  email: string
  phones: PhoneEntry[]
  address: string
  workingHours: string
}

const defaultInfo: ContactInfoData = { email: '', phones: [], address: '', workingHours: '' }

const ContactInfoContext = createContext<ContactInfoData>(defaultInfo)

function resolveLocale(value: LocaleMap, locale: string): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  return (value as Record<string, string>)[locale] ?? value.en ?? ''
}

export function ContactInfoProvider({ children }: { children: ReactNode }) {
  const { locale } = useLanguage()
  const [raw, setRaw] = useState<RawContactInfo | null>(null)

  useEffect(() => {
    fetch('/api/contact-info')
      .then(r => r.json())
      .then((data: RawContactInfo) => setRaw(data))
      .catch(() => {})
  }, [])

  const value: ContactInfoData = {
    email: raw?.email ?? '',
    phones: (raw?.phones ?? [])
      .filter((p): p is RawPhone & { number: string } => Boolean(p.number))
      .map(p => ({ label: p.label ?? '', number: p.number })),
    address: resolveLocale(raw?.address, locale),
    workingHours: resolveLocale(raw?.workingHours, locale),
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
