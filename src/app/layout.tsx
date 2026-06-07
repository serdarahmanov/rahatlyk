import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const jakartaSans = Plus_Jakarta_Sans({
  variable: '--font-heading',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'RAHATLYK — Premium Beverages',
  description:
    'Pure. Natural. Life. Premium beverages from the heart of Turkmenistan — drinking water, mineral water, juices and more.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${jakartaSans.variable}`} data-scroll-behavior="smooth">
      <body
        className="min-h-screen bg-white overflow-x-hidden"
        style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
      >
        <LanguageProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
