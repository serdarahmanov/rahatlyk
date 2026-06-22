import { notFound } from 'next/navigation'
import HomeClient from './HomeClient'
import { getValidLocale } from '@/lib/i18n/locale'
import { getCachedHomeData } from '@/lib/payload/cachedQueries'
import {
  normalizeArticle,
  normalizeHomeCtaBanner,
  normalizeHomeHero,
  normalizeHomeStory,
  normalizeHorizontalScroll,
  normalizeProductLine,
} from '@/lib/payload-normalize'
import type { HorizontalScrollData, HomeStoryData, HomeCtaBannerData, HomeHeroData } from '@/types/payload'

const EMPTY_H_SCROLL: HorizontalScrollData = {
  box1ImageUrl: null,
  box2ImageUrl: null, box2Tag: null, box2Headline: null,
  box3ImageUrl: null, box4Text: null, box4ButtonLabel: null, box4ButtonHref: null,
  box5VideoUrl: null, box5CoverImageUrl: null, box5Tag: null, box5Headline: null,
  box6ImageUrl: null, box6Tag: null, box6Headline: null, box6ButtonLabel: null, box6ButtonHref: null,
}

const EMPTY_STORY: HomeStoryData = { imageUrl: null, tag: null, title: null, text: null }

const EMPTY_CTA: HomeCtaBannerData = { title: null, subtitle: null, ctaLabel: null, ctaHref: null }

const EMPTY_HERO: HomeHeroData = { videoUrl: null, posterUrl: null, title: null, titleAccent: null, subtitle: null }

type Props = {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: Props) {
  const locale = getValidLocale((await params).locale)
  if (!locale) notFound()

  const data = await getCachedHomeData(locale)
  const lines = data.lines.map(normalizeProductLine)
  const newsArticles = data.articles.map(normalizeArticle)
  const horizontalScroll = data.horizontalScroll
    ? normalizeHorizontalScroll(data.horizontalScroll)
    : EMPTY_H_SCROLL
  const story = data.story ? normalizeHomeStory(data.story) : EMPTY_STORY
  const ctaBanner = data.ctaBanner ? normalizeHomeCtaBanner(data.ctaBanner) : EMPTY_CTA
  const hero = data.hero ? normalizeHomeHero(data.hero) : EMPTY_HERO

  return (
    <HomeClient
      lines={lines}
      horizontalScroll={horizontalScroll}
      story={story}
      newsArticles={newsArticles}
      ctaBanner={ctaBanner}
      hero={hero}
    />
  )
}
