import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import '../../globals.css';
import { LanguageProvider } from '@/lib/i18n/LanguageContext'
import { getValidLocale, supportedLocales, defaultLocale } from '@/lib/i18n/locale';
import { getCachedContactInfo } from '@/lib/payload/cachedQueries';
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
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  variable: '--font-accent',
  subsets: ['latin'],
  weight: ['400'],
  style: ['italic'],
  display: 'swap',
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const locale = getValidLocale((await params).locale) ?? defaultLocale
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://rahatlyk.com'
  const title = SITE_TITLES[locale] ?? SITE_TITLES[defaultLocale]
  const description = SITE_DESCRIPTIONS[locale] ?? SITE_DESCRIPTIONS[defaultLocale]

  // Fetch site icon managed in Payload → Contact Info → Site Icon
  let iconUrl: string | null = null
  try {
    const contactInfo = await getCachedContactInfo()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const icon = (contactInfo as any).siteIcon
    if (icon && typeof icon === 'object' && typeof icon.url === 'string') {
      iconUrl = icon.url
    }
  } catch {
    // fall back to static favicon.ico
  }

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
        icon: iconUrl,
        shortcut: iconUrl,
        apple: iconUrl,
      },
    } : {}),
    openGraph: {
      siteName: 'RAHATLYK',
      locale: OG_LOCALES[locale] ?? OG_LOCALES[defaultLocale],
      type: 'website',
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
  try {
    contactInfo = JSON.parse(JSON.stringify(await getCachedContactInfo())) as RawContactInfo
  } catch {
    contactInfo = null
  }

  return (
    <html lang={locale} className={`${inter.variable} ${cormorant.variable}`} data-scroll-behavior="smooth">
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
