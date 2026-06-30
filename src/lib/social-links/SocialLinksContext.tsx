'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useContactInfo } from '@/lib/contact-info/ContactInfoContext'

export interface SocialLinks {
  instagramUrl: string
  youtubeUrl: string
  facebookUrl: string
}

const defaultLinks: SocialLinks = { instagramUrl: '', youtubeUrl: '', facebookUrl: '' }

const SocialLinksContext = createContext<SocialLinks>(defaultLinks)

export function SocialLinksProvider({ children }: { children: ReactNode }) {
  const contactInfo = useContactInfo()

  return (
    <SocialLinksContext.Provider value={contactInfo.socialLinks}>
      {children}
    </SocialLinksContext.Provider>
  )
}

export function useSocialLinks() {
  return useContext(SocialLinksContext)
}
