'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Locale } from '@/lib/i18n/translations';

// Module-level flag — persists across route changes, resets on full page reload
let pageIntroComplete = false;
if (typeof window !== 'undefined') {
  window.addEventListener('page-intro-complete', () => { pageIntroComplete = true; }, { once: true });
}

export default function Navbar() {
  const [scrolled,       setScrolled]       = useState(false);
  const [scrolledUp,     setScrolledUp]     = useState(true);
  const [menuOpen,       setMenuOpen]       = useState(false);
  const [langOpen,       setLangOpen]       = useState(false);
  // introComplete drives header opacity — owned entirely by React so
  // no external imperative writes can desync virtual DOM vs real DOM
  const [introComplete,  setIntroComplete]  = useState(
    () => (typeof window !== 'undefined' ? pageIntroComplete : false)
  );
  const prevScrollY = useRef(0);
  const langRef = useRef<HTMLDivElement>(null);
  const { locale, setLocale, t, ready } = useLanguage();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 30);
      // Direction: treat near-top as "up" so header never hides at page top
      if (y < 80) {
        setScrolledUp(true);
      } else if (y > prevScrollY.current) {
        setScrolledUp(false); // scrolling down
      } else {
        setScrolledUp(true);  // scrolling up
      }
      prevScrollY.current = y;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Reveal header when PageIntro finishes (first page load only)
  useEffect(() => {
    if (pageIntroComplete) return; // already done — no listener needed
    const onDone = () => setIntroComplete(true);
    window.addEventListener('page-intro-complete', onDone, { once: true });
    return () => window.removeEventListener('page-intro-complete', onDone);
  }, []);

  // Reset nav state on every route change
  useEffect(() => {
    setMenuOpen(false);
    setScrolledUp(true); // always start visible on a new page
  }, [pathname]);


  // Close lang dropdown when clicking outside
  useEffect(() => {
    if (!langOpen) return;
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [langOpen]);

  // Home / About page not-scrolled → transparent + white text (both have dark hero images)
  const isHomeHero = (pathname === '/' || pathname === '/about') && !scrolled;
  // Any page not-scrolled → transparent bg (image shows through)
  const isTransparent = !scrolled;

  const navLinks = [
    { href: '/products',  label: t.nav.products },
    { href: '/vacancies', label: t.nav.vacancies },
    { href: '/news',      label: t.nav.news },
    { href: '/about',     label: t.nav.about },
    { href: '/contact',   label: t.nav.contact },
  ];

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={pathname === '/about' ? {
        opacity:    introComplete ? 1 : 0,
        transform:  !scrolledUp ? 'translateY(-100%)' : 'translateY(0)',
        // transition must already be in the DOM before transform changes — React owns
        // it so there's no external write that can desync the virtual DOM
        transition: introComplete ? 'transform 0.3s ease-in-out' : 'none',
      } : {
        opacity: introComplete ? 1 : 0,
      }}
    >

      {/* Background panel — slides down from above instead of fading in */}
      <div
        className={`absolute inset-0 z-0 bg-cyan-50/90 backdrop-blur-md transition-transform duration-300 ease-out ${
          scrolled && pathname !== '/about' ? 'translate-y-0' : '-translate-y-full'
        }`}
      />

      <div className="relative z-10 max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center flex-shrink-0" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span
              className={`text-xl lg:text-2xl font-semibold tracking-[0.2em] transition-colors duration-300 ${
                isHomeHero ? 'text-white' : isTransparent ? 'text-black' : 'text-brand-900'
              }`}
              style={{ fontFamily: 'var(--font-heading), sans-serif' }}
            >
              RAHATLYK
            </span>
          </Link>

          {/* ── Right group: Nav + Lang switcher + Hamburger ── */}
          <div className="flex items-center gap-28">

          {/* ── Desktop Nav ── */}
          <nav
            className="hidden lg:flex items-center gap-12"
            style={{ opacity: ready ? 1 : 0, transition: 'opacity 0.15s ease' }}
            aria-label="Main navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-sm font-normal tracking-wide py-1 group ${
                  isHomeHero ? 'text-white' : 'text-black'
                }`}
              >
                {link.label}
                <span
                  className={`absolute bottom-0 left-0 h-px rounded-full transition-all duration-300 ${
                    isHomeHero ? 'bg-white' : 'bg-black'
                  } ${
                    isActive(link.href) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* ── Lang switcher + Hamburger ── */}
          <div className="flex items-center gap-3">

            {/* Language switcher — dropdown (all sizes) */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen((o) => !o)}
                className={`flex items-center gap-1 text-sm tracking-wide font-normal transition-colors duration-300 ${
                  isHomeHero ? 'text-white' : 'text-black'
                }`}
              >
                {locale.charAt(0).toUpperCase() + locale.slice(1)}
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={`transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`}>
                  <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {langOpen && (
                <div
                  className="absolute right-0 top-full mt-2 flex flex-col gap-3 rounded overflow-hidden px-2 py-1.5"
                  style={{ backdropFilter: 'blur(32px) saturate(1.4)', WebkitBackdropFilter: 'blur(32px) saturate(1.4)', background: 'rgba(240,240,240,0.35)' }}
                >
                  {(['tm', 'ru', 'en'] as Locale[]).filter((l) => l !== locale).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => { setLocale(lang); setLangOpen(false); }}
                      className={`text-base tracking-wide font-normal transition-opacity duration-150 text-left ${
                        isHomeHero ? 'text-white/70 hover:text-white' : 'text-black/50 hover:text-black'
                      }`}
                    >
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </button>
                  ))}
                </div>
              )}
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
          </div>{/* end right group */}
        </div>
      </div>

    </header>

    {/* ── Mobile Menu — full-screen overlay, outside <header> ── */}
    <div
      className={`fixed inset-0 z-[60] lg:hidden flex flex-col transition-opacity duration-300 ${
        menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      style={{ backdropFilter: 'blur(32px) saturate(1.4)', WebkitBackdropFilter: 'blur(32px) saturate(1.4)', background: 'rgba(255,255,255,0.55)' }}
    >
        {/* Logo — absolutely positioned to match header exactly */}
        <Link
          href="/"
          onClick={() => { setMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="absolute top-0 left-6 sm:left-10 h-16 flex items-center text-xl font-semibold tracking-[0.2em] text-black"
          style={{ fontFamily: 'var(--font-heading), sans-serif' }}
        >
          RAHATLYK
        </Link>

        {/* Close button — absolutely positioned to match hamburger exactly */}
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute top-0 right-6 sm:right-10 h-16 flex items-center justify-center w-9 text-black/60 hover:text-black transition-colors"
          aria-label="Close menu"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M3 3L15 15M15 3L3 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Nav links */}
        <div className="flex-1 flex flex-col justify-center px-8 pb-10"
          style={{ opacity: ready ? 1 : 0, transition: 'opacity 0.15s ease' }}
        >
          {/* All nav links — same size */}
          <div className="flex flex-col gap-1">
            {[
              { href: '/products',  label: t.nav.products },
              { href: '/news',      label: t.nav.news },
              { href: '/vacancies', label: t.nav.vacancies },
              { href: '/about',     label: t.nav.about },
              { href: '/contact',   label: t.nav.contact },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`text-[2.2rem] font-light leading-snug tracking-tight transition-colors ${
                  isActive(link.href) ? 'text-black' : 'text-black/40 hover:text-black'
                }`}
                style={{ fontFamily: 'var(--font-heading), sans-serif' }}
              >
                {link.label}
              </Link>
            ))}
          </div>

        </div>

        {/* Bottom — social icons */}
        <div className="absolute bottom-20 left-8 flex items-center gap-5">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-black/60 hover:text-black transition-colors duration-200"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
            </svg>
          </a>
          <a
            href="mailto:info@rahatlyk.com"
            aria-label="Email"
            className="text-black/60 hover:text-black transition-colors duration-200"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="M2 7l10 7 10-7"/>
            </svg>
          </a>
        </div>

    </div>
    </>
  );
}
