import { notFound } from 'next/navigation'
import { getValidLocale } from '@/lib/i18n/locale'
import { getCachedAboutData } from '@/lib/payload/cachedQueries'
import AboutPageClient, { type AboutPageData } from './AboutPageClient'

const FALLBACK: AboutPageData = {
  hero: {
    coverImage: '/story/photo-8.jpg',
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
    fullViewportImage: '/story/photo-2.jpg',
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
  certs: {
    heading: {
      text: 'Our standards,',
      accentText: 'on the record.',
    },
    subtitle: 'Independently audited standards — issued, renewed and verified behind every bottle.',
    sealText: 'RAHATLYK  ·  CERTIFIED QUALITY  ·  EST. 2003  ·',
    certificates: [
      {
        name: 'ISO 9001',
        tag: 'Quality management',
        description: 'Quality management systems — audited across every production line, from filtration to the final cap.',
        expiryDate: 'Issued 2019 · Valid',
        photo: null,
      },
      {
        name: 'ISO 22000',
        tag: 'Food safety',
        description: 'Food safety management — covering sourcing, preparation, bottling and storage of all six collections.',
        expiryDate: 'Issued 2020 · Valid',
        photo: null,
      },
      {
        name: 'HACCP',
        tag: 'Hazard control',
        description: 'Hazard analysis & critical control points — applied at five quality stages from source to bottle.',
        expiryDate: 'Issued 2021 · Valid',
        photo: null,
      },
      {
        name: 'State Standard',
        tag: 'Turkmenistan',
        description: 'National conformity certification for beverages produced and distributed within Turkmenistan.',
        expiryDate: 'Issued 2022 · Valid',
        photo: null,
      },
    ],
  },
}

type Props = {
  params: Promise<{ locale: string }>
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
    const certsRaw: any = cached.certificates

    data = {
      hero: {
        coverImage:      heroRaw?.coverImage?.url       || FALLBACK.hero.coverImage,
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
      certs: {
        heading: {
          text:       certsRaw?.intro?.headingText   || FALLBACK.certs.heading.text,
          accentText: certsRaw?.intro?.headingAccent || FALLBACK.certs.heading.accentText,
        },
        subtitle: certsRaw?.intro?.subtitle || FALLBACK.certs.subtitle,
        sealText: certsRaw?.seal?.text      || FALLBACK.certs.sealText,
        certificates: Array.isArray(certsRaw?.certificates) && certsRaw.certificates.length
          ? certsRaw.certificates.map((c: {
              name: string;
              tag: string;
              description: string;
              expiryDate: string;
              photo?: { url?: string } | null;
            }) => ({
              name:        c.name,
              tag:         c.tag,
              description: c.description,
              expiryDate:  c.expiryDate,
              photo:       c.photo?.url || null,
            }))
          : FALLBACK.certs.certificates,
      },
    }

  } catch {
    // data stays as FALLBACK
  }

  return <AboutPageClient data={data} />
}
