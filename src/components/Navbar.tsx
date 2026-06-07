'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Locale } from '@/lib/i18n/translations';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { locale, setLocale, t } = useLanguage();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/', label: t.nav.home },
    { href: '/products', label: t.nav.products },
    { href: '/vacancies', label: t.nav.vacancies },
    { href: '/news', label: t.nav.news },
    { href: '/about', label: t.nav.about },
    { href: '/contact', label: t.nav.contact },
  ];

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || menuOpen
          ? 'bg-white/96 backdrop-blur-lg nav-scrolled'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* ── Logo ── */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <span
              className="text-xl lg:text-2xl font-bold tracking-[0.2em] text-brand-900"
              style={{ fontFamily: 'var(--font-heading), sans-serif' }}
            >
              RAHATLYK
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden lg:flex items-center gap-7" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-sm font-medium tracking-wide transition-colors duration-200 py-1 group ${
                  isActive(link.href)
                    ? 'text-brand-700'
                    : 'text-slate-600 hover:text-brand-700'
                }`}
              >
                {link.label}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-brand-600 rounded-full transition-all duration-300 ${
                    isActive(link.href) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* ── Right: Lang switcher + Hamburger ── */}
          <div className="flex items-center gap-3">
            {/* Language switcher */}
            <div className="flex items-center gap-1">
              {(['tm', 'ru', 'en'] as Locale[]).map((lang, i) => (
                <span key={lang} className="flex items-center gap-1">
                  {i > 0 && <span className="text-slate-200 text-[10px] select-none">·</span>}
                  <button
                    onClick={() => setLocale(lang)}
                    className={`text-[11px] uppercase tracking-wider transition-colors duration-200 ${
                      locale === lang
                        ? 'text-brand-700 font-semibold'
                        : 'text-slate-400 font-normal hover:text-slate-600'
                    }`}
                  >
                    {lang}
                  </button>
                </span>
              ))}
            </div>

            {/* Hamburger */}
            <button
              className="lg:hidden flex flex-col items-center justify-center w-9 h-9 gap-1.5 rounded hover:bg-brand-50 transition-colors"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <span
                className={`block w-5 h-0.5 bg-brand-900 rounded-full transition-all duration-300 ${
                  menuOpen ? 'rotate-45 translate-y-2' : ''
                }`}
              />
              <span
                className={`block w-5 h-0.5 bg-brand-900 rounded-full transition-all duration-300 ${
                  menuOpen ? 'opacity-0 scale-0' : ''
                }`}
              />
              <span
                className={`block w-5 h-0.5 bg-brand-900 rounded-full transition-all duration-300 ${
                  menuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-white/98 backdrop-blur-lg border-t border-brand-100 px-5 py-5">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center py-3 px-3 rounded-md text-base font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-brand-700 bg-brand-50'
                    : 'text-slate-700 hover:text-brand-700 hover:bg-brand-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
