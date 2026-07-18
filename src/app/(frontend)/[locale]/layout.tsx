import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import '../../globals.css';
import { LanguageProvider } from '@/lib/i18n/LanguageContext'
import { getValidLocale, supportedLocales, defaultLocale } from '@/lib/i18n/locale';
import { getCachedContactInfo, getCachedSiteMetadata } from '@/lib/payload/cachedQueries';
import { ContactInfoProvider, type RawContactInfo } from '@/lib/contact-info/ContactInfoContext';
import { SocialLinksProvider } from '@/lib/social-links/SocialLinksContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NavigationProgress from '@/components/NavigationProgress'
import PageIntro from '@/components/PageIntro';
import ScrollReset from '@/components/ScrollReset';
import SmoothScroll from '@/components/SmoothScroll';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  weight: ['400', '500'],
  display: 'block',
});

const SITE_TITLES: Record<string, string> = {
  tm: 'RAHATLYK — Premium Içgiler',
  ru: 'RAHATLYK — Премиальные Напитки',
  en: 'RAHATLYK — Premium Beverages',
}

const SITE_DESCRIPTIONS: Record<string, string> = {
  tm: 'Arassa. Tebigy. Durmuş. Türkmenistanyň arassa tebigy çeşmelerinden öndürilen premium içgiler — içme suwy, mineral suw, şireler we ş.m.',
  ru: 'Чистый. Натуральный. Жизнь. Премиальные напитки из чистейших природных источников Туркменистана — питьевая вода, минеральная вода, соки и другое.',
  en: 'Pure. Natural. Life. Premium beverages from the heart of Turkmenistan — drinking water, mineral water, juices and more.',
}

const OG_LOCALES: Record<string, string> = { tm: 'tk_TM', ru: 'ru_RU', en: 'en_US' }

function mediaUrl(value: unknown): string | null {
  return value && typeof value === 'object' && 'url' in value && typeof (value as Record<string, unknown>).url === 'string'
    ? (value as { url: string }).url
    : null
}

function siteIconUrl(value: unknown): string | null {
  return value && typeof value === 'object' && 'siteIcon' in value
    ? mediaUrl((value as { siteIcon?: unknown }).siteIcon)
    : null
}

function resolveOgImage(value: unknown): string | null {
  return value && typeof value === 'object' && 'url' in value
    ? (value as { url: string }).url || null
    : null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const locale = getValidLocale((await params).locale) ?? defaultLocale
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://rahatlyk.com'

  let iconUrl: string | null = null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let siteMeta: any = null
  try {
    const [contactInfo, siteMetaRaw] = await Promise.all([
      getCachedContactInfo(),
      getCachedSiteMetadata(locale),
    ])
    iconUrl = siteIconUrl(contactInfo)
    siteMeta = siteMetaRaw
  } catch {
    // fall back to static/hardcoded values
  }

  const title = siteMeta?.home?.title ?? SITE_TITLES[locale] ?? SITE_TITLES[defaultLocale]
  const description = siteMeta?.home?.description ?? SITE_DESCRIPTIONS[locale] ?? SITE_DESCRIPTIONS[defaultLocale]
  const homeOgImageUrl = resolveOgImage(siteMeta?.home?.ogImage)

  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: `%s — RAHATLYK` },
    description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: '/en',
        ru: '/ru',
        tk: '/tm',
        'x-default': `/${defaultLocale}`,
      },
    },
    ...(iconUrl ? {
      icons: {
        icon: [{ url: '/api/site-icon', sizes: 'any' }],
        shortcut: '/favicon.ico',
        apple: '/api/site-icon',
      },
    } : {}),
    openGraph: {
      siteName: 'RAHATLYK',
      locale: OG_LOCALES[locale] ?? OG_LOCALES[defaultLocale],
      type: 'website',
      ...(homeOgImageUrl ? { images: [{ url: homeOgImageUrl }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  }
}

export const revalidate = 345600;

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const locale = getValidLocale((await params).locale);
  if (!locale) notFound();

  let contactInfo: RawContactInfo | null = null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let layoutSiteMeta: any = null
  try {
    const [contactInfoRaw, siteMetaRaw] = await Promise.all([
      getCachedContactInfo(),
      getCachedSiteMetadata(locale),
    ])
    contactInfo = JSON.parse(JSON.stringify(contactInfoRaw)) as RawContactInfo
    layoutSiteMeta = siteMetaRaw
  } catch {
    contactInfo = null
  }
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://rahatlyk.com'
  const logoUrl = siteIconUrl(contactInfo)
  const orgName: string = layoutSiteMeta?.organizationJsonLd?.name || 'RAHATLYK'
  const siteName: string = layoutSiteMeta?.websiteJsonLd?.name || 'RAHATLYK'
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: orgName,
    url: siteUrl,
    ...(logoUrl ? { logo: new URL('/api/site-icon', siteUrl).toString() } : {}),
  }

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteUrl,
  }

  return (
    <html lang={locale} className={inter.variable} data-scroll-behavior="smooth">
      {/* Hide only the hero text before JS runs — the background image is
          visible immediately (good LCP). The animation reveals hero text once
          the correct locale + word-masks are in place. */}
      <head><style dangerouslySetInnerHTML={{ __html:
        /* Hide hero text until locale is ready (avoids locale flash).
           Hide the navbar and intro items from the very first SSR paint so
           nothing flickers before the curtain animation takes over. */
        '#hero-content{opacity:0}.intro-item{transform:translateY(110%)}'
      }} /></head>
      <body
        className="min-h-screen bg-white overflow-x-hidden"
        style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <LanguageProvider initialLocale={locale}>
          <ContactInfoProvider initialContactInfo={contactInfo}>
          <SocialLinksProvider>
            <ScrollReset />
            <SmoothScroll />
            <NavigationProgress />
            <PageIntro />
            <Navbar />
            <main>{children}</main>
            <Footer />
          </SocialLinksProvider>
          </ContactInfoProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
