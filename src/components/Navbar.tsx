'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useContactInfo } from '@/lib/contact-info/ContactInfoContext';
import { useSocialLinks } from '@/lib/social-links/SocialLinksContext';
import { FacebookIcon, InstagramIcon, YoutubeIcon } from '@/lib/social-icons';
import { Locale } from '@/lib/i18n/translations';
import { withLocale } from '@/lib/i18n/locale';

export interface NavigationLabels {
  home?: string | null;
  products?: string | null;
  news?: string | null;
  vacancies?: string | null;
  about?: string | null;
  contact?: string | null;
}

function navLabel(labels: NavigationLabels | null | undefined, key: keyof NavigationLabels, fallback: string) {
  const value = labels?.[key];
  return typeof value === 'string' && value.trim() ? value : fallback;
}

// Module-level flag — persists across route changes, resets on full page reload
export default function Navbar({ labels }: { labels?: NavigationLabels | null }) {
  const pathname = usePathname();
  const relativePath = pathname.replace(/^\/(en|ru|tm)(?=\/|$)/, '') || '/';
  const [scrolled,       setScrolled]       = useState(false);
  const [scrolledUp,     setScrolledUp]     = useState(true);
  const [menuOpen,       setMenuOpen]       = useState(false);
  const [langOpen,       setLangOpen]       = useState(false);
  // introComplete drives header opacity — owned entirely by React so
  // no external imperative writes can desync virtual DOM vs real DOM
  const prevScrollY = useRef(0);
  const langRef = useRef<HTMLDivElement>(null);
  const { locale, setLocale, t } = useLanguage();
  const contactInfo = useContactInfo();
  const social = useSocialLinks();

  useEffect(() => {
    let ticking = false;

    const syncScrollState = () => {
      ticking = false;
      const y = window.scrollY;
      setScrolled(y > 1);
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

    // Coalesce to one state check per animation frame — native scroll events
    // can fire far more often than the screen repaints, and every call here
    // touches a `position: fixed` header with a backdrop blur.
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(syncScrollState);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    syncScrollState();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Reveal header when PageIntro finishes (first page load only)
  // Reset nav state on every route change
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setMenuOpen(false);
      setScrolledUp(true); // always start visible on a new page
    });
    return () => cancelAnimationFrame(id);
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

  // About keeps white header text over its dark hero; home now has a white hero.
  const isHeroPage = relativePath === '/' || relativePath === '/about';
  const isDarkHero = relativePath === '/about' && !scrolled;
  const showHeaderPanel = scrolled;
  // Any page not-scrolled → transparent bg (image shows through)

  const navLinks = [
    { href: withLocale(locale, '/products'),  label: navLabel(labels, 'products', t.nav.products) },
    { href: withLocale(locale, '/about'),     label: navLabel(labels, 'about', t.nav.about) },
    { href: withLocale(locale, '/news'),      label: navLabel(labels, 'news', t.nav.news) },
    { href: withLocale(locale, '/vacancies'), label: navLabel(labels, 'vacancies', t.nav.vacancies) },
    { href: withLocale(locale, '/contact'),   label: navLabel(labels, 'contact', t.nav.contact) },
  ];

  const isActive = (href: string) =>
    href === withLocale(locale) ? pathname === href : pathname.startsWith(href);

  return (
    <>
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={isHeroPage ? {
        opacity:    1,
        transform:  !scrolledUp ? 'translateY(-100%)' : 'translateY(0)',
        // transition must already be in the DOM before transform changes — React owns
        // it so there's no external write that can desync the virtual DOM
        transition: 'transform 0.3s ease-in-out',
      } : {
        opacity: 1,
      }}
    >

      {/* Background panel — slides down from above instead of fading in */}
      <div
        className="absolute inset-0 z-0 border-b bg-[#fafaf8]/85 backdrop-blur-[12px]"
        style={{
          opacity: showHeaderPanel ? 1 : 0,
          transform: showHeaderPanel ? 'translateY(0)' : 'translateY(-100%)',
          borderColor: showHeaderPanel ? 'rgba(0,0,0,0.14)' : 'rgba(0,0,0,0)',
          transition: 'opacity 420ms ease, transform 700ms cubic-bezier(0.22,1,0.36,1), border-color 420ms ease',
        }}
      />

      <div className="relative z-10 max-w-screen-2xl mx-auto px-6 pt-[env(safe-area-inset-top)] sm:px-10 lg:px-16">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* ── Logo ── */}
          <Link href={withLocale(locale)} prefetch={false} className="flex items-center flex-shrink-0" onClick={() => window.dispatchEvent(new CustomEvent('scroll-to-top'))}>
            <span
              className={`text-xl lg:text-2xl font-medium tracking-[0.2em] transition-colors duration-300 ${
                isDarkHero ? 'text-white' : 'text-black'
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
            aria-label="Main navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch={false}
                className={`relative text-sm font-normal tracking-wide py-1 group ${
                  isDarkHero ? 'text-white' : 'text-black'
                }`}
              >
                {link.label}
                <span
                  className={`absolute bottom-0 left-0 h-px rounded-full transition-all duration-300 ${
                    isDarkHero ? 'bg-white' : 'bg-black'
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
                  isDarkHero ? 'text-white' : 'text-black'
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
                        isDarkHero ? 'text-white/70 hover:text-white' : 'text-black/50 hover:text-black'
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
                isDarkHero ? 'hover:bg-white/10' : 'hover:bg-black/10'
              }`}
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <span
                className={`block w-5 h-0.5 rounded-full transition-all duration-300 ${
                  isDarkHero ? 'bg-white' : 'bg-black'
                } ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}
              />
              <span
                className={`block w-5 h-0.5 rounded-full transition-all duration-300 ${
                  isDarkHero ? 'bg-white' : 'bg-black'
                } ${menuOpen ? 'opacity-0 scale-0' : ''}`}
              />
              <span
                className={`block w-5 h-0.5 rounded-full transition-all duration-300 ${
                  isDarkHero ? 'bg-white' : 'bg-black'
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
          href={withLocale(locale)}
          prefetch={false}
          onClick={() => { setMenuOpen(false); window.dispatchEvent(new CustomEvent('scroll-to-top')); }}
          className="absolute top-0 left-6 sm:left-10 h-16 flex items-center text-xl font-medium tracking-[0.2em] text-black"
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
        <div className="flex-1 flex flex-col justify-center px-8 pb-10">
          {/* All nav links — same size */}
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch={false}
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
          {social.instagramUrl && (
            <a href={social.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-black/60 hover:text-black transition-colors duration-200">
              <InstagramIcon size={20} />
            </a>
          )}
          {social.youtubeUrl && (
            <a href={social.youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-black/60 hover:text-black transition-colors duration-200">
              <YoutubeIcon size={20} />
            </a>
          )}
          {social.facebookUrl && (
            <a href={social.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-black/60 hover:text-black transition-colors duration-200">
              <FacebookIcon size={20} />
            </a>
          )}
          {contactInfo.email && (
            <a href={`mailto:${contactInfo.email}`} aria-label="Email" className="text-black/60 hover:text-black transition-colors duration-200">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="M2 7l10 7 10-7"/>
              </svg>
            </a>
          )}
        </div>

    </div>
    </>
  );
}
