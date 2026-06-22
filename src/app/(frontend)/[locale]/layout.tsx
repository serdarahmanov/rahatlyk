import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter, Plus_Jakarta_Sans } from 'next/font/google';
import { notFound } from 'next/navigation';
import '../../globals.css';
import { LanguageProvider } from '@/lib/i18n/LanguageContext'
import { getValidLocale, supportedLocales } from '@/lib/i18n/locale';
import { ContactInfoProvider } from '@/lib/contact-info/ContactInfoContext';
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
  display: 'swap',
});

const jakartaSans = Plus_Jakarta_Sans({
  variable: '--font-heading',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  variable: '--font-accent',
  subsets: ['latin'],
  weight: ['300', '400'],
  style: ['italic'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'RAHATLYK — Premium Beverages',
  description:
    'Pure. Natural. Life. Premium beverages from the heart of Turkmenistan — drinking water, mineral water, juices and more.',
};

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

  return (
    <html lang={locale} className={`${inter.variable} ${jakartaSans.variable} ${cormorant.variable}`} data-scroll-behavior="smooth">
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
          <ContactInfoProvider>
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
