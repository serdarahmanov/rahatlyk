'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useContactInfo } from '@/lib/contact-info/ContactInfoContext';
import { useSocialLinks } from '@/lib/social-links/SocialLinksContext';
import { FacebookIcon, InstagramIcon, YoutubeIcon } from '@/lib/social-icons';
import { withLocale } from '@/lib/i18n/locale';
import type { NavigationLabels } from './Navbar';

function navLabel(labels: NavigationLabels | null | undefined, key: keyof NavigationLabels, fallback: string) {
  const value = labels?.[key];
  return typeof value === 'string' && value.trim() ? value : fallback;
}

export default function Footer({ labels }: { labels?: NavigationLabels | null }) {
  const { locale, t } = useLanguage();
  const contactInfo = useContactInfo();
  const social = useSocialLinks();

  const socialLinks = [
    { label: 'Facebook',  href: social.facebookUrl,  icon: <FacebookIcon />  },
    { label: 'Instagram', href: social.instagramUrl, icon: <InstagramIcon /> },
    { label: 'YouTube',   href: social.youtubeUrl,   icon: <YoutubeIcon />   },
  ].filter(s => s.href);

  const quickLinks = [
    { href: withLocale(locale),               label: navLabel(labels, 'home', t.nav.home) },
    { href: withLocale(locale, '/products'),  label: navLabel(labels, 'products', t.nav.products) },
    { href: withLocale(locale, '/news'),      label: navLabel(labels, 'news', t.nav.news) },
    { href: withLocale(locale, '/vacancies'), label: navLabel(labels, 'vacancies', t.nav.vacancies) },
  ];

  const companyLinks = [
    { href: withLocale(locale, '/about'),   label: navLabel(labels, 'about', t.nav.about) },
    { href: withLocale(locale, '/contact'), label: navLabel(labels, 'contact', t.nav.contact) },
  ];

  return (
    <footer className="bg-gradient-to-b from-cyan-50 to-white">

      {/* ── Main body ── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-16 pb-12">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* ── Brand column ── */}
          <div className="col-span-2 lg:col-span-2">
            <Link href={withLocale(locale)} prefetch={false} className="inline-flex mb-5">
              <span
                className="text-2xl font-medium tracking-[0.2em] text-black"
                style={{ fontFamily: 'var(--font-heading), sans-serif' }}
              >
                RAHATLYK
              </span>
            </Link>
            <p className="text-black text-sm leading-relaxed max-w-xs mb-7">
              {t.footer.tagline}
            </p>

            {/* Social icons */}
            {socialLinks.length > 0 && (
              <div className="flex gap-2">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-9 w-9 items-center justify-center rounded-md bg-black/[0.06] text-gray-700 transition-all duration-200 hover:bg-black/[0.11]"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* ── Quick links ── */}
          <div>
            <h4 className="font-medium text-[10px] tracking-[0.2em] uppercase text-black mb-5">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    prefetch={false}
                    className="text-black hover:text-black/70 text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Company + contact ── */}
          <div>
            <h4 className="font-medium text-[10px] tracking-[0.2em] uppercase text-black mb-5">
              {t.footer.company}
            </h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    prefetch={false}
                    className="text-black hover:text-black/70 text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="pt-4 space-y-1.5 border-t border-cyan-200 mt-1">
                {contactInfo.phones.map(p => (
                  <p key={p.number} className="text-black text-sm">{p.number}</p>
                ))}
                {contactInfo.email && (
                  <p className="text-black text-sm">{contactInfo.email}</p>
                )}
              </li>
            </ul>
          </div>

        </div>
        {/* ── Copyright row ── */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-black text-xs">{t.footer.rights}</p>
        </div>
      </div>

    </footer>
  );
}
