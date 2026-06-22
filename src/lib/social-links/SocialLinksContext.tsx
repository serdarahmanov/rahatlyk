'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export interface SocialLinks {
  instagramUrl: string
  youtubeUrl: string
  facebookUrl: string
}

const defaultLinks: SocialLinks = { instagramUrl: '', youtubeUrl: '', facebookUrl: '' }

const SocialLinksContext = createContext<SocialLinks>(defaultLinks)

export function SocialLinksProvider({ children }: { children: ReactNode }) {
  const [links, setLinks] = useState<SocialLinks>(defaultLinks)

  useEffect(() => {
    fetch('/api/site-settings')
      .then(r => r.json())
      .then((data: Partial<SocialLinks>) => {
        setLinks({
          instagramUrl: data.instagramUrl ?? '',
          youtubeUrl:   data.youtubeUrl   ?? '',
          facebookUrl:  data.facebookUrl  ?? '',
        })
      })
      .catch(() => {})
  }, [])

  return (
    <SocialLinksContext.Provider value={links}>
      {children}
    </SocialLinksContext.Provider>
  )
}

export function useSocialLinks() {
  return useContext(SocialLinksContext)
}
