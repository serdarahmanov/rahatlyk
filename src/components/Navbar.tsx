'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Locale } from '@/lib/i18n/translations';

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const { locale, setLocale, t, ready } = useLanguage();
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

  // Home page not-scrolled → transparent + white text
  const isHomeHero = pathname === '/' && !scrolled && !menuOpen;
  // Any page not-scrolled → transparent bg (image shows through)
  const isTransparent = !scrolled && !menuOpen;

  const navLinks = [
    { href: '/',          label: t.nav.home },
    { href: '/products',  label: t.nav.products },
    { href: '/vacancies', label: t.nav.vacancies },
    { href: '/news',      label: t.nav.news },
    { href: '/about',     label: t.nav.about },
    { href: '/contact',   label: t.nav.contact },
  ];

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || menuOpen
          ? 'bg-cyan-50/90 backdrop-blur-md nav-scrolled'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center flex-shrink-0" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span
              className={`text-xl lg:text-2xl font-bold tracking-[0.2em] transition-colors duration-300 ${
                isHomeHero ? 'text-white' : isTransparent ? 'text-black' : 'text-brand-900'
              }`}
              style={{ fontFamily: 'var(--font-heading), sans-serif' }}
            >
              RAHATLYK
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav
            className="hidden lg:flex items-center gap-7"
            style={{ opacity: ready ? 1 : 0, transition: 'opacity 0.15s ease' }}
            aria-label="Main navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-sm font-medium tracking-wide transition-colors duration-300 py-1 group ${
                  isHomeHero
                    ? isActive(link.href)
                      ? 'text-white'
                      : 'text-white/70 hover:text-white'
                    : isTransparent
                      ? isActive(link.href)
                        ? 'text-black'
                        : 'text-black/70 hover:text-black'
                      : isActive(link.href)
                        ? 'text-brand-700'
                        : 'text-brand-600 hover:text-brand-950'
                }`}
              >
                {link.label}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 rounded-full transition-all duration-300 ${
                    isHomeHero ? 'bg-white' : isTransparent ? 'bg-black' : 'bg-brand-600'
                  } ${
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
                  {i > 0 && (
                    <span className={`text-[10px] select-none ${isHomeHero ? 'text-white/30' : isTransparent ? 'text-black/30' : 'text-slate-200'}`}>
                      ·
                    </span>
                  )}
                  <button
                    onClick={() => setLocale(lang)}
                    className={`text-[11px] uppercase tracking-wider transition-colors duration-300 ${
                      isHomeHero
                        ? locale === lang
                          ? 'text-white font-semibold'
                          : 'text-white/50 font-normal hover:text-white/80'
                        : isTransparent
                          ? locale === lang
                            ? 'text-black font-semibold'
                            : 'text-black/50 font-normal hover:text-black/80'
                          : locale === lang
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
              className={`lg:hidden flex flex-col items-center justify-center w-9 h-9 gap-1.5 rounded transition-colors ${
                isHomeHero ? 'hover:bg-white/10' : isTransparent ? 'hover:bg-black/10' : 'hover:bg-brand-50'
              }`}
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <span
                className={`block w-5 h-0.5 rounded-full transition-all duration-300 ${
                  isHomeHero ? 'bg-white' : isTransparent ? 'bg-black' : 'bg-brand-900'
                } ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}
              />
              <span
                className={`block w-5 h-0.5 rounded-full transition-all duration-300 ${
                  isHomeHero ? 'bg-white' : isTransparent ? 'bg-black' : 'bg-brand-900'
                } ${menuOpen ? 'opacity-0 scale-0' : ''}`}
              />
              <span
                className={`block w-5 h-0.5 rounded-full transition-all duration-300 ${
                  isHomeHero ? 'bg-white' : isTransparent ? 'bg-black' : 'bg-brand-900'
                } ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}
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
        <div className="bg-cyan-50/95 backdrop-blur-lg border-t border-cyan-200/50 px-5 py-5">
          <nav
            className="flex flex-col gap-1"
            style={{ opacity: ready ? 1 : 0, transition: 'opacity 0.15s ease' }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center py-3 px-3 rounded-md text-base font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-brand-900 bg-brand-100'
                    : 'text-brand-700 hover:text-brand-950 hover:bg-brand-100'
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
