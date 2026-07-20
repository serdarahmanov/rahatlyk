import { notFound } from 'next/navigation'
import HomeClient from './HomeClient'
import { getValidLocale } from '@/lib/i18n/locale'
import { getCachedHomeData } from '@/lib/payload/cachedQueries'
import {
  normalizeHomeCtaBanner,
  normalizeHomeHero,
  normalizeHorizontalScroll,
  normalizeProductLine,
} from '@/lib/payload-normalize'
import type { HorizontalScrollData, HomeCtaBannerData, HomeHeroData } from '@/types/payload'

const EMPTY_H_SCROLL: HorizontalScrollData = {
  box1ImageUrl: null,
  box2ImageUrl: null, box2Tag: null, box2Headline: null,
  box3ImageUrl: null, box4Text: null, box4ButtonLabel: null, box4ButtonHref: null,
  box5VideoUrl: null, box5CoverImageUrl: null, box5Tag: null, box5Headline: null,
  box6ImageUrl: null, box6Tag: null, box6Headline: null, box6ButtonLabel: null, box6ButtonHref: null,
}

const EMPTY_CTA: HomeCtaBannerData = { imageUrl: null, mobileImageUrl: null, title: null, subtitle: null, ctaLabel: null, ctaHref: null }

const EMPTY_HERO: HomeHeroData = {
  posterUrl: null,
  mobilePosterUrl: null,
  parallaxImages: [],
  bottleImageUrl: null,
  mobileBottleImageUrl: null,
  title: null,
  titleAccent: null,
  subtitle: null,
}

type Props = {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: Props) {
  const locale = getValidLocale((await params).locale)
  if (!locale) notFound()

  const data = await getCachedHomeData(locale)
  const lines = data.lines.map(normalizeProductLine)
  const horizontalScroll = data.horizontalScroll
    ? normalizeHorizontalScroll(data.horizontalScroll)
    : EMPTY_H_SCROLL
  const ctaBanner = data.ctaBanner ? normalizeHomeCtaBanner(data.ctaBanner) : EMPTY_CTA
  const hero = data.hero ? normalizeHomeHero(data.hero) : EMPTY_HERO

  return (
    <HomeClient
      lines={lines}
      horizontalScroll={horizontalScroll}
      ctaBanner={ctaBanner}
      hero={hero}
    />
  )
}
