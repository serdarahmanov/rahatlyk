import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getValidLocale, defaultLocale } from '@/lib/i18n/locale'
import { getCachedAboutData, getCachedSiteMetadata } from '@/lib/payload/cachedQueries'
import { buildCanonicalPath, buildLanguageAlternates } from '@/lib/i18n/metadata'
import AboutPageClient, { type AboutPageData } from './AboutPageClient'

const FALLBACK: AboutPageData = {
  hero: {
    coverImage: null,
    mobileCoverImage: null,
    videoUrl: null,
    mobileVideoUrl: null,
    title: 'The taste of comfort, made in Turkmenistan.',
    accentWordIndex: 4,
  },
  whoWeAre: {
    statement: {
      text: 'In Turkmen, rahatlyk means comfort — our name, our promise, and the measure of every bottle we make.',
      accentWordIndex: 3,
    },
    sectionTitle: 'Who we are',
    paragraphs: [
      'Rahatlyk is a Turkmen beverage company with a simple belief: drinks should be made close to home, to a standard families can trust. We purify, prepare and bottle everything ourselves — from first filtration to the final cap.',
      'What began with drinking water has grown into six collections: still and mineral waters, juices, energy drinks, herbal teas and soft drinks — each developed in-house and distributed across the country.',
      'We are building a direct connection with the people who drink what we make. Because comfort, to us, includes being within reach.',
    ],
    fullViewportImage: null,
    backgroundVideo: null,
  },
  story: {
    sectionLabel: 'Our story',
    title: 'One bottling line. Six collections. Every step, closer to the people we serve.',
    subtitle: 'Everything made in-house — from filtration to the final cap. Quality stays in our hands.',
    milestones: [
      {
        year: '2003',
        title: 'The first drop',
        body: 'Rahatlyk begins with one product and one goal: drinking water every family can rely on, bottled to a standard people can trust.',
        isCurrent: false,
      },
      {
        year: '2008',
        title: 'Minerals',
        body: 'Naturally balanced mineral water extends the line into everyday wellness and gives the brand a clearer production identity.',
        isCurrent: false,
      },
      {
        year: '2013',
        title: 'Colour',
        body: 'Juices and soft drinks launch, bringing fruit, sparkle and seasonal flavour into the same in-house production culture.',
        isCurrent: false,
      },
      {
        year: '2018',
        title: 'Energy & calm',
        body: 'Energy drinks for active days and herbal teas for slower evenings turn the collection into a full rhythm of daily refreshment.',
        isCurrent: false,
      },
      {
        year: 'Now',
        title: 'Today',
        body: 'A modern production family with six beverage collections, tighter quality control and a platform that brings Rahatlyk directly to customers.',
        isCurrent: true,
      },
    ],
  },
  numbers: {
    stats: [
      { value: 6,   suffix: '',  label: 'product collections, from water to herbal teas' },
      { value: 100, suffix: '%', label: 'produced and bottled inside Turkmenistan' },
      { value: 20,  suffix: '+', label: 'flavours and formats across all collections' },
      { value: 5,   suffix: '',  label: 'quality-control stages from source to bottle' },
    ],
    tagline: {
      text: 'Comfort,',
      accentText: 'bottled.',
    },
  },
  mosaic: {
    leftImage: null,
    centerImage: null,
    rightImage: null,
  },
  finalSection: {
    image: null,
    mobileImage: null,
    heading: 'Every drop, a promise kept.',
    body: 'From the first filtration to the final cap, Rahatlyk keeps quality in its own hands - every bottle, every time.',
  },
}

function resolveAboutHeroImage(coverImage: { filename?: string | null; url?: string | null } | null | undefined) {
  return coverImage?.url || null
}

type Props = {
  params: Promise<{ locale: string }>
}

const TITLES: Record<string, string> = {
  tm: 'Biz hakda',
  ru: 'О компании',
  en: 'About Us',
}

const DESCRIPTIONS: Record<string, string> = {
  tm: 'RAHATLYK hakda — taryhymyz, gymmatlyklarymyz we Türkmenistanyň premium içgi brendiniň topary.',
  ru: 'О компании RAHATLYK — наша история, ценности и команда за брендом премиальных напитков.',
  en: 'About RAHATLYK — our story, values and the team behind Turkmenistan\'s premium beverage brand.',
}

function resolveOgImage(value: unknown): string | null {
  return value && typeof value === 'object' && 'url' in value
    ? (value as { url: string }).url || null
    : null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = getValidLocale((await params).locale) ?? defaultLocale
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let siteMeta: any = null
  try { siteMeta = await getCachedSiteMetadata(locale) } catch { /* fallback */ }

  const title = siteMeta?.about?.title ?? TITLES[locale] ?? TITLES[defaultLocale]
  const description = siteMeta?.about?.description ?? DESCRIPTIONS[locale] ?? DESCRIPTIONS[defaultLocale]
  const ogImageUrl = resolveOgImage(siteMeta?.about?.ogImage)

  return {
    title,
    description,
    alternates: {
      canonical: buildCanonicalPath(locale, '/about'),
      languages: buildLanguageAlternates('/about'),
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: buildCanonicalPath(locale, '/about'),
      ...(ogImageUrl ? { images: [{ url: ogImageUrl }] } : {}),
    },
  }
}

export default async function AboutPage({ params }: Props) {
  const locale = getValidLocale((await params).locale)
  if (!locale) notFound()

  let data: AboutPageData = FALLBACK
  try {
    const cached = await getCachedAboutData(locale)
    // The generated Payload types retain relationship ID unions even at depth 1.
    // These values are normalized defensively below, as they were before caching.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const heroRaw: any = cached.hero
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whoWeAreRaw: any = cached.whoWeAre
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const storyRaw: any = cached.story
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const numbersRaw: any = cached.numbers
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const finalSectionRaw: any = cached.finalSection

    data = {
      hero: {
        coverImage:      resolveAboutHeroImage(heroRaw?.coverImage),
        mobileCoverImage: heroRaw?.mobileCoverImage?.url || null,
        videoUrl:        heroRaw?.heroVideo?.url         || null,
        mobileVideoUrl:  heroRaw?.mobileHeroVideo?.url   || null,
        title:           heroRaw?.title                 || FALLBACK.hero.title,
        accentWordIndex: heroRaw?.accentWordIndex       ?? FALLBACK.hero.accentWordIndex,
      },
      whoWeAre: {
        statement: {
          text:           whoWeAreRaw?.statement?.text           || FALLBACK.whoWeAre.statement.text,
          accentWordIndex: whoWeAreRaw?.statement?.accentWordIndex ?? FALLBACK.whoWeAre.statement.accentWordIndex,
        },
        sectionTitle:      whoWeAreRaw?.whoWeAre?.sectionTitle   || FALLBACK.whoWeAre.sectionTitle,
        paragraphs: [
          whoWeAreRaw?.whoWeAre?.paragraph1 || FALLBACK.whoWeAre.paragraphs[0],
          whoWeAreRaw?.whoWeAre?.paragraph2 || FALLBACK.whoWeAre.paragraphs[1],
          whoWeAreRaw?.whoWeAre?.paragraph3 || FALLBACK.whoWeAre.paragraphs[2],
        ].filter(Boolean) as string[],
        fullViewportImage: whoWeAreRaw?.fullViewportImage?.url   || FALLBACK.whoWeAre.fullViewportImage,
        backgroundVideo:   whoWeAreRaw?.backgroundVideo?.url     || FALLBACK.whoWeAre.backgroundVideo,
      },
      story: {
        sectionLabel: storyRaw?.sectionLabel || FALLBACK.story.sectionLabel,
        title:        storyRaw?.title        || FALLBACK.story.title,
        subtitle:     storyRaw?.subtitle     || FALLBACK.story.subtitle,
        milestones: Array.isArray(storyRaw?.milestones) && storyRaw.milestones.length
          ? storyRaw.milestones.map((m: { year: string; title: string; body: string; isCurrent?: boolean }) => ({
              year:      m.year,
              title:     m.title,
              body:      m.body,
              isCurrent: m.isCurrent ?? false,
            }))
          : FALLBACK.story.milestones,
      },
      numbers: {
        stats: Array.isArray(numbersRaw?.stats) && numbersRaw.stats.length
          ? numbersRaw.stats.map((s: { value: number; suffix?: string; label: string }) => ({
              value:  s.value,
              suffix: s.suffix || '',
              label:  s.label,
            }))
          : FALLBACK.numbers.stats,
        tagline: {
          text:       numbersRaw?.tagline?.text       || FALLBACK.numbers.tagline.text,
          accentText: numbersRaw?.tagline?.accentText || FALLBACK.numbers.tagline.accentText,
        },
      },
      mosaic: {
        leftImage:   storyRaw?.leftImage?.url   || FALLBACK.mosaic.leftImage,
        centerImage: storyRaw?.centerImage?.url || FALLBACK.mosaic.centerImage,
        rightImage:  storyRaw?.rightImage?.url  || FALLBACK.mosaic.rightImage,
      },
      finalSection: {
        image:       finalSectionRaw?.image?.url       || FALLBACK.finalSection.image,
        mobileImage: finalSectionRaw?.mobileImage?.url || null,
        heading:     finalSectionRaw?.heading          || FALLBACK.finalSection.heading,
        body:        finalSectionRaw?.body             || FALLBACK.finalSection.body,
      },
    }

  } catch {
    // data stays as FALLBACK
  }

  return <AboutPageClient data={data} />
}
