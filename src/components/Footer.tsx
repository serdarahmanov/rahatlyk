'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';

const socialLinks = [
  {
    label: 'Facebook',
    href: '#',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: '#',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: '#',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20.05 12 20.05 12 20.05s6.88 0 8.59-.45a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
      </svg>
    ),
  },
];

export default function Footer() {
  const { t } = useLanguage();

  const quickLinks = [
    { href: '/', label: t.nav.home },
    { href: '/products', label: t.nav.products },
    { href: '/news', label: t.nav.news },
    { href: '/vacancies', label: t.nav.vacancies },
  ];

  const companyLinks = [
    { href: '/about', label: t.nav.about },
    { href: '/contact', label: t.nav.contact },
  ];

  return (
    <footer className="bg-brand-950 text-white">
      {/* ── Main footer body ── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-16 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Link href="/" className="inline-flex mb-4">
              <span
                className="text-2xl font-bold tracking-[0.2em] text-white"
                style={{ fontFamily: 'var(--font-heading), sans-serif' }}
              >
                RAHATLYK
              </span>
            </Link>
            <p className="text-brand-300 text-sm leading-relaxed max-w-xs mb-6">
              {t.footer.tagline}
            </p>
            {/* Social */}
            <div className="flex gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full bg-brand-900/70 hover:bg-brand-700 text-brand-300 hover:text-white transition-all duration-200 flex items-center justify-center"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-[11px] tracking-[0.15em] uppercase text-brand-400 mb-5">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-brand-200/80 hover:text-white text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company + Contact */}
          <div>
            <h4 className="font-semibold text-[11px] tracking-[0.15em] uppercase text-brand-400 mb-5">
              {t.footer.company}
            </h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-brand-200/80 hover:text-white text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="pt-4 space-y-1.5 border-t border-brand-900/60 mt-1">
                <p className="text-brand-200/70 text-sm">{t.contact.info.phoneValue}</p>
                <p className="text-brand-200/70 text-sm">{t.contact.info.emailValue}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-brand-900/60">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-brand-400/80 text-xs">{t.footer.rights}</p>
          <div className="flex gap-5">
            <a href="#" className="text-brand-400/70 hover:text-brand-200 text-xs transition-colors">
              {t.footer.privacy}
            </a>
            <a href="#" className="text-brand-400/70 hover:text-brand-200 text-xs transition-colors">
              {t.footer.terms}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
