'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useContactInfo } from '@/lib/contact-info/ContactInfoContext';

const socialLinks = [
  {
    label: 'Facebook',
    href: '#',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: '#',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20.05 12 20.05 12 20.05s6.88 0 8.59-.45a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
      </svg>
    ),
  },
];

export default function Footer() {
  const { t } = useLanguage();
  const contactInfo = useContactInfo();
  const pathname = usePathname();

  if (pathname === '/about') return null;

  const quickLinks = [
    { href: '/',          label: t.nav.home      },
    { href: '/products',  label: t.nav.products  },
    { href: '/news',      label: t.nav.news       },
    { href: '/vacancies', label: t.nav.vacancies  },
  ];

  const companyLinks = [
    { href: '/about',   label: t.nav.about   },
    { href: '/contact', label: t.nav.contact },
  ];

  return (
    <footer className="bg-gradient-to-b from-cyan-50 to-white">

      {/* ── Main body ── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-16 pb-12">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* ── Brand column ── */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="inline-flex mb-5">
              <span
                className="text-2xl font-semibold tracking-[0.2em] text-black"
                style={{ fontFamily: 'var(--font-heading), sans-serif' }}
              >
                RAHATLYK
              </span>
            </Link>
            <p className="text-black text-sm leading-relaxed max-w-xs mb-7">
              {t.footer.tagline}
            </p>

            {/* Social icons */}
            <div className="flex gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-md bg-black/[0.06] text-gray-700 transition-all duration-200 hover:bg-black/[0.11]"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── Quick links ── */}
          <div>
            <h4 className="font-extrabold text-[10px] tracking-[0.2em] uppercase text-black mb-5">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
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
            <h4 className="font-extrabold text-[10px] tracking-[0.2em] uppercase text-black mb-5">
              {t.footer.company}
            </h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
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
