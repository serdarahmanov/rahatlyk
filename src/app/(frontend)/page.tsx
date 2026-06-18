import { cookies } from 'next/headers'
import HomeClient from './HomeClient'
import { getPayloadClient } from '@/lib/payload'
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

const EMPTY_HERO: HomeHeroData = { videoUrl: null, title: null, titleAccent: null, subtitle: null }

export default async function HomePage() {
  const locale = ((await cookies()).get('RAHATLYK-locale')?.value ?? 'en') as 'en' | 'tm' | 'ru'
  const payload = await getPayloadClient()

  const [linesResult, newsResult, hScrollRaw, storyRaw, ctaRaw, heroRaw] = await Promise.allSettled([
    payload.find({ collection: 'product-lines', depth: 1, locale, limit: 20, sort: 'order' }),
    payload.find({ collection: 'articles', depth: 1, locale, limit: 5, sort: '-date' }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload.findGlobal({ slug: 'horizontal-scroll' as any, locale, depth: 1 }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload.findGlobal({ slug: 'home-story' as any, locale, depth: 1 }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload.findGlobal({ slug: 'home-cta-banner' as any, locale, depth: 1 }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload.findGlobal({ slug: 'home-hero' as any, locale, depth: 1 }),
  ])

  const lines = linesResult.status === 'fulfilled'
    ? linesResult.value.docs.map(normalizeProductLine)
    : []

  const newsArticles = newsResult.status === 'fulfilled'
    ? newsResult.value.docs.map(normalizeArticle)
    : []

  const horizontalScroll = hScrollRaw.status === 'fulfilled'
    ? normalizeHorizontalScroll(hScrollRaw.value)
    : EMPTY_H_SCROLL

  const story = storyRaw.status === 'fulfilled'
    ? normalizeHomeStory(storyRaw.value)
    : EMPTY_STORY

  const ctaBanner = ctaRaw.status === 'fulfilled'
    ? normalizeHomeCtaBanner(ctaRaw.value)
    : EMPTY_CTA

  const hero = heroRaw.status === 'fulfilled'
    ? normalizeHomeHero(heroRaw.value)
    : EMPTY_HERO

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
