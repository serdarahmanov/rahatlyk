'use client'

import { useLayoutEffect, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { gsap } from 'gsap'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import EmptyState from '@/components/EmptyState'
import FilterBar from '@/components/FilterBar'
import Pagination from '@/components/Pagination'
import type { PayloadCategory, PayloadVacancy, PayloadResult } from '@/types/payload'

const DEPT_ICONS: Record<string, React.ReactNode> = {
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
}

const DEPT_ACCENT: Record<string, { dot: string; bg1: string; bg2: string }> = {
  Production:         { dot: '#5e6b7a', bg1: 'rgba(94,107,122,0.18)',  bg2: 'rgba(94,107,122,0.05)'  },
  Sales:              { dot: '#2c8a4a', bg1: 'rgba(44,138,74,0.18)',   bg2: 'rgba(44,138,74,0.05)'   },
  Marketing:          { dot: '#7d5bbe', bg1: 'rgba(125,91,190,0.18)',  bg2: 'rgba(125,91,190,0.05)'  },
  Logistics:          { dot: '#c47c28', bg1: 'rgba(196,124,40,0.18)',  bg2: 'rgba(196,124,40,0.05)'  },
  Finance:            { dot: '#2767d6', bg1: 'rgba(39,103,214,0.18)',  bg2: 'rgba(39,103,214,0.05)'  },
  'Customer Service': { dot: '#c0392b', bg1: 'rgba(192,57,43,0.18)',   bg2: 'rgba(192,57,43,0.05)'   },
  Quality:            { dot: '#1d8a8a', bg1: 'rgba(29,138,138,0.18)',  bg2: 'rgba(29,138,138,0.05)'  },
}

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
] as const

interface Props {
  departments: PayloadCategory[]
  result: PayloadResult<PayloadVacancy>
  department: string
}

export default function VacanciesClient({ departments, result, department }: Props) {
  const { t } = useLanguage()
  const router = useRouter()

  const heroRef    = useRef<HTMLDivElement>(null)
  const titleRef   = useRef<HTMLHeadingElement>(null)
  const filtersRef = useRef<HTMLDivElement>(null)
  const listRef    = useRef<HTMLDivElement>(null)
  const perksRef   = useRef<HTMLDivElement>(null)
  const contentIntroPlayedRef = useRef(false)

  const filters = [
    { key: 'all', label: t.vacancies.filterAll },
    ...departments.map(d => ({ key: d.slug, label: d.label })),
  ]

  const handleFilterChange = (key: string) => {
    router.push(key === 'all' ? '/vacancies' : `/vacancies?department=${encodeURIComponent(key)}`)
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams()
    if (department !== 'all') params.set('department', department)
    if (page > 1) params.set('page', String(page))
    const qs = params.toString()
    router.push(qs ? `/vacancies?${qs}` : '/vacancies')
  }

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const titleWords    = titleRef.current?.querySelectorAll('.title-word-inner')
      const filterButtons = filtersRef.current?.querySelectorAll('button')
      const vacancyCards  = listRef.current?.children
      const tl = gsap.timeline({ delay: 0.08 })

      if (titleWords?.length) {
        gsap.set(titleWords, { yPercent: 115 })
        tl.to(titleWords, { yPercent: 0, duration: 0.9, stagger: 0.08, ease: 'power4.out' }, 0)
      }
      if (filterButtons?.length) {
        gsap.set(filterButtons, { y: -18, opacity: 0 })
        tl.to(filterButtons, { y: 0, opacity: 1, duration: 0.55, stagger: 0.055, ease: 'power3.out' }, 0.28)
      }
      if (vacancyCards?.length) {
        gsap.set(vacancyCards, { y: 30, opacity: 0, scale: 0.97 })
        tl.to(vacancyCards, {
          y: 0, opacity: 1, scale: 1, duration: 0.55, stagger: 0.055, ease: 'power3.out',
          onComplete: () => { contentIntroPlayedRef.current = true },
        }, 0.58)
      }
    })
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    let cancelled = false
    let ownedTriggers: Array<{ kill: () => void }> = []
    const init = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      if (cancelled) return
      gsap.registerPlugin(ScrollTrigger)
      const existingTriggers = new Set(ScrollTrigger.getAll())
      if (perksRef.current) {
        gsap.fromTo(
          perksRef.current.children,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: perksRef.current, start: 'top 82%' },
          }
        )
      }
      ownedTriggers = ScrollTrigger.getAll().filter((trigger) => !existingTriggers.has(trigger))
    }
    init()
    return () => {
      cancelled = true
      ownedTriggers.forEach((trigger) => trigger.kill())
    }
  }, [])

  useEffect(() => {
    if (!contentIntroPlayedRef.current) return
    const animate = async () => {
      const { gsap } = await import('gsap')
      if (listRef.current && listRef.current.children.length) {
        gsap.fromTo(
          listRef.current.children,
          { y: 30, opacity: 0, scale: 0.97 },
          { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.055, ease: 'power3.out' }
        )
      }
    }
    animate()
  }, [result.docs])

  const perks = t.vacancies.perks

  return (
    <div className="min-h-screen">
      <section className="pt-32 pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="mb-5 text-left" ref={heroRef}>
            <h1
              ref={titleRef}
              className="text-4xl sm:text-5xl lg:text-6xl font-light text-black leading-tight"
              style={{ fontFamily: 'var(--font-heading), sans-serif' }}
            >
              {t.vacancies.title.split(/\s+/).map((word, index, words) => (
                <span key={`${word}-${index}`} style={{ display: 'inline' }}>
                  <span className="inline-block overflow-hidden align-bottom pb-[0.18em] mb-[-0.18em]">
                    <span className="title-word-inner inline-block">{word}</span>
                  </span>
                  {index < words.length - 1 ? ' ' : ''}
                </span>
              ))}
            </h1>
          </div>

          <FilterBar ref={filtersRef} filters={filters} active={department} onChange={handleFilterChange} />

          <div className="mb-8">
            <h2
              className="text-xl sm:text-2xl font-light text-brand-950"
              style={{ fontFamily: 'var(--font-heading), sans-serif' }}
            >
              {result.totalDocs} {result.totalDocs === 1 ? t.vacancies.openPosition : t.vacancies.openPositions}
            </h2>
          </div>

          {result.totalDocs === 0 ? (
            <EmptyState message={t.vacancies.noCurrent} />
          ) : (
            <div ref={listRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {result.docs.map((job) => {
                const acc = DEPT_ACCENT[job.department.slug] ?? DEPT_ACCENT['Production']
                return (
                  <Link
                    key={job.id}
                    href={`/vacancies/${job.id}`}
                    className="group bg-white rounded-[14px] border border-[#e8e8ed] overflow-hidden flex flex-col shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.05),0_18px_40px_rgba(0,0,0,0.10)] hover:-translate-y-[5px] hover:border-transparent transition-[transform,box-shadow,border-color] duration-300"
                  >
                    <div
                      className="h-40 flex-shrink-0 overflow-hidden relative"
                      style={job.imageUrl ? undefined : { background: `linear-gradient(135deg, ${acc.bg1}, ${acc.bg2})` }}
                    >
                      {job.imageUrl ? (
                        <img
                          src={job.imageUrl}
                          alt={job.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full">
                          <div style={{ color: acc.dot, opacity: 0.55, transform: 'scale(2)' }}>
                            {DEPT_ICONS[job.department.slug]}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="px-5 pt-[18px] pb-5 flex flex-col flex-1" style={{ fontFamily: 'var(--font-heading), var(--font-inter), system-ui, sans-serif' }}>
                      <div className="flex items-center gap-2 mb-2.5">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: acc.dot }} />
                        <span className="text-[11px] font-semibold tracking-[0.05em] uppercase" style={{ color: '#6e6e73' }}>
                          {job.department.label}
                        </span>
                      </div>

                      <h3
                        className="text-[17px] font-semibold leading-[1.25] tracking-[-0.015em] mb-2"
                        style={{ color: '#1d1d1f' }}
                      >
                        {job.title}
                      </h3>

                      <p className="text-[13.5px] leading-[1.5] line-clamp-2 flex-1 mb-4" style={{ color: '#6e6e73' }}>
                        {job.overview}
                      </p>

                      <div className="flex items-center gap-[7px] text-sm font-semibold mb-2.5" style={{ color: '#1d1d1f' }}>
                        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="flex-shrink-0" style={{ color: '#6e6e73' }}>
                          <rect x="1.5" y="3.5" width="13" height="9" rx="2" stroke="currentColor" strokeWidth="1.3"/>
                          <circle cx="8" cy="8" r="1.8" stroke="currentColor" strokeWidth="1.3"/>
                        </svg>
                        {job.salary}
                      </div>

                      <div className="flex items-center gap-1.5 text-[13px]" style={{ color: '#86868b' }}>
                        <svg width="13" height="13" viewBox="0 0 14 14" fill="currentColor" className="flex-shrink-0">
                          <path d="M7,1 C4.8,1 3,2.8 3,5 C3,7.8 7,13 7,13 C7,13 11,7.8 11,5 C11,2.8 9.2,1 7,1 Z M7,6.5 A1.5,1.5 0 1,1 7,3.5 A1.5,1.5 0 0,1 7,6.5 Z"/>
                        </svg>
                        {job.location}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}

          <Pagination
            page={result.page}
            totalPages={result.totalPages}
            totalDocs={result.totalDocs}
            limit={result.limit}
            onChange={handlePageChange}
            label="positions"
          />
        </div>
      </section>

      <section className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10">
          <h2
            className="text-xl sm:text-2xl font-medium text-gray-900 text-center mb-10"
            style={{ fontFamily: 'var(--font-heading), sans-serif' }}
          >
            {perks.title}
          </h2>
          <div ref={perksRef} className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {PERKS.map((perk) => (
              <div
                key={perk.titleKey}
                className="bg-white border border-slate-100 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mx-auto mb-4">
                  {perk.icon}
                </div>
                <h3 className="font-light text-gray-900 text-sm mb-1">
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
  )
}
