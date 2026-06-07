'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { VACANCIES, Dept } from '@/lib/data/vacancies';

/* ── Minimal stroke SVG icons — currentColor, weight 1.5 ─────── */
const DEPT_ICONS: Record<Dept, React.ReactNode> = {
  Production: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
      <path d="M12 10v4M8.5 14H4a2 2 0 0 0-2 2v4h20v-4a2 2 0 0 0-2-2h-4.5" />
      <path d="M9 20v-3h6v3" />
    </svg>
  ),
  Sales: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  ),
  Marketing: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11l19-9-9 19-2-8-8-2z" />
    </svg>
  ),
  Logistics: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" rx="1" />
      <path d="M16 8h4l3 3v5h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  ),
  Finance: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      <line x1="12" y1="12" x2="12" y2="16" />
      <line x1="10" y1="14" x2="14" y2="14" />
    </svg>
  ),
  'Customer Service': (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" />
      <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  ),
  Quality: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
};

const DEPT_CONFIG: Record<Dept, { badge: string; iconBg: string; iconColor: string; accentBg: string }> = {
  Production:         { badge: 'bg-brand-100 text-brand-800',     iconBg: 'bg-brand-100',   iconColor: 'text-brand-700',   accentBg: 'bg-brand-600'   },
  Sales:              { badge: 'bg-emerald-100 text-emerald-700', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-700', accentBg: 'bg-emerald-500' },
  Marketing:          { badge: 'bg-violet-100 text-violet-700',   iconBg: 'bg-violet-100',  iconColor: 'text-violet-700',  accentBg: 'bg-violet-500'  },
  Logistics:          { badge: 'bg-amber-100 text-amber-700',     iconBg: 'bg-amber-100',   iconColor: 'text-amber-700',   accentBg: 'bg-amber-500'   },
  Finance:            { badge: 'bg-blue-100 text-blue-700',       iconBg: 'bg-blue-100',    iconColor: 'text-blue-700',    accentBg: 'bg-blue-500'    },
  'Customer Service': { badge: 'bg-pink-100 text-pink-700',       iconBg: 'bg-pink-100',    iconColor: 'text-pink-700',    accentBg: 'bg-pink-500'    },
  Quality:            { badge: 'bg-teal-100 text-teal-700',       iconBg: 'bg-teal-100',    iconColor: 'text-teal-700',    accentBg: 'bg-teal-500'    },
};

const PERKS = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    titleKey: 'growth',
    descKey:  'growthDesc',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    titleKey: 'health',
    descKey:  'healthDesc',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    titleKey: 'culture',
    descKey:  'cultureDesc',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    titleKey: 'impact',
    descKey:  'impactDesc',
  },
] as const;

type FilterKey = 'all' | Dept;

export default function VacanciesPage() {
  const { t } = useLanguage();
  const [active, setActive] = useState<FilterKey>('all');
  const heroRef  = useRef<HTMLDivElement>(null);
  const listRef  = useRef<HTMLDivElement>(null);
  const perksRef = useRef<HTMLDivElement>(null);

  const filters: { key: FilterKey; label: string }[] = [
    { key: 'all',              label: t.vacancies.filterAll        },
    { key: 'Production',       label: t.vacancies.filterProduction },
    { key: 'Sales',            label: t.vacancies.filterSales      },
    { key: 'Marketing',        label: t.vacancies.filterMarketing  },
    { key: 'Logistics',        label: t.vacancies.filterLogistics  },
    { key: 'Finance',          label: t.vacancies.filterFinance    },
    { key: 'Customer Service', label: t.vacancies.filterService    },
  ];

  const filtered =
    active === 'all'
      ? VACANCIES
      : VACANCIES.filter((j) => j.department === (active as Dept));

  useEffect(() => {
    const init = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      if (heroRef.current) {
        gsap.fromTo(
          heroRef.current.children,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: 'power3.out', delay: 0.1 }
        );
      }
      if (perksRef.current) {
        gsap.fromTo(
          perksRef.current.children,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: perksRef.current, start: 'top 82%' },
          }
        );
      }
    };
    init();
    return () => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) =>
        ScrollTrigger.getAll().forEach((s) => s.kill())
      );
    };
  }, []);

  useEffect(() => {
    const animate = async () => {
      const { gsap } = await import('gsap');
      if (listRef.current && listRef.current.children.length) {
        gsap.fromTo(
          listRef.current.children,
          { x: -20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5, stagger: 0.07, ease: 'power3.out' }
        );
      }
    };
    animate();
  }, [active]);

  const perks = t.vacancies.perks;

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="bg-gradient-to-b from-brand-200 via-brand-50 to-white pt-32 pb-16 relative overflow-hidden border-b border-slate-200 shadow-sm">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-brand-200/70 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-brand-200/50 blur-2xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-5 sm:px-8 text-center" ref={heroRef}>
          <span className="text-brand-700 text-xs font-bold tracking-[0.2em] uppercase">
            {t.vacancies.heroTag}
          </span>
          <h1
            className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-950 leading-tight mb-4"
            style={{ fontFamily: 'var(--font-heading), sans-serif' }}
          >
            {t.vacancies.title}
          </h1>
          <p className="text-slate-500 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            {t.vacancies.subtitle}
          </p>
        </div>
      </section>

      {/* ── Jobs ── */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">

          {/* ── Filter Tabs ── */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setActive(f.key)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  active === f.key
                    ? 'bg-brand-700 text-white shadow-md'
                    : 'bg-brand-50 text-slate-600 hover:bg-brand-100 hover:text-brand-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Section header — count */}
          <div className="mb-8">
            <h2
              className="text-xl sm:text-2xl font-bold text-brand-950"
              style={{ fontFamily: 'var(--font-heading), sans-serif' }}
            >
              {filtered.length} {filtered.length === 1 ? 'open position' : 'open positions'}
            </h2>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-400 bg-white rounded-md border border-slate-200">
              <div className="mb-4">
                <svg className="mx-auto text-slate-300" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              </div>
              <p className="text-base font-medium">{t.vacancies.noCurrent}</p>
            </div>
          ) : (
            <div ref={listRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((job) => {
                const cfg = DEPT_CONFIG[job.department];
                return (
                  <Link
                    key={job.id}
                    href={`/vacancies/${job.id}`}
                    className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
                  >
                    {/* Top accent bar */}
                    <div className={`h-1 w-full ${cfg.accentBg}`} />

                    {/* Card body */}
                    <div className="p-6 flex flex-col flex-1">

                      {/* Icon + meta row */}
                      <div className="flex items-start justify-between mb-5">
                        <div className={`w-11 h-11 rounded-lg ${cfg.iconBg} ${cfg.iconColor} flex items-center justify-center flex-shrink-0`}>
                          {DEPT_ICONS[job.department]}
                        </div>
                        <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                          job.type === 'fullTime'
                            ? 'bg-brand-50 text-brand-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          {t.vacancies[job.type]}
                        </span>
                      </div>

                      {/* Department badge */}
                      <span className={`self-start text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide mb-3 ${cfg.badge}`}>
                        {job.department}
                      </span>

                      {/* Title — primary text, most weight */}
                      <h3
                        className="text-[1.05rem] font-bold text-brand-950 mb-2 leading-snug group-hover:text-brand-700 transition-colors duration-200"
                        style={{ fontFamily: 'var(--font-heading), sans-serif' }}
                      >
                        {job.title}
                      </h3>

                      {/* Description — secondary, clamped */}
                      <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 flex-1">
                        {job.shortDescription}
                      </p>

                      {/* Footer — tertiary: location + cta */}
                      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <svg width="12" height="12" viewBox="0 0 13 13" fill="none">
                            <path d="M6.5,1 C4.3,1 2.5,2.8 2.5,5 C2.5,7.8 6.5,12 6.5,12 C6.5,12 10.5,7.8 10.5,5 C10.5,2.8 8.7,1 6.5,1 Z M6.5,6.5 A1.5,1.5 0 1,1 6.5,3.5 A1.5,1.5 0 0,1 6.5,6.5 Z" fill="currentColor"/>
                          </svg>
                          {job.location}
                        </div>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 group-hover:gap-2 transition-all duration-200">
                          {t.vacancies.apply}
                          <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                            <path d="M2 7H12M12 7L8 3M12 7L8 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Why Join ── */}
      <section className="py-16 bg-slate-50 border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10">
          <h2
            className="text-xl sm:text-2xl font-bold text-brand-950 text-center mb-10"
            style={{ fontFamily: 'var(--font-heading), sans-serif' }}
          >
            {perks.title}
          </h2>
          <div ref={perksRef} className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {PERKS.map((perk) => (
              <div
                key={perk.titleKey}
                className="bg-white border border-slate-100 rounded-md p-6 text-center hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-11 h-11 rounded-md bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-4">
                  {perk.icon}
                </div>
                <h3 className="font-bold text-brand-900 text-sm mb-1">
                  {perks[perk.titleKey as keyof typeof perks]}
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed">
                  {perks[perk.descKey as keyof typeof perks]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
