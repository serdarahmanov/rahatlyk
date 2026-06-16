'use client'

import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { gsap } from 'gsap'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { formatDate } from '@/lib/formatDate'
import FilterBar from '@/components/FilterBar'
import Pagination from '@/components/Pagination'
import type { PayloadArticle, PayloadResult } from '@/types/payload'

interface Props {
  featured: PayloadArticle | null
  result: PayloadResult<PayloadArticle>
  category: string
}

function NewsCard({ article }: { article: PayloadArticle }) {
  const router = useRouter()
  const imgs = article.images.map((i) => i.url)
  const [current, setCurrent] = useState(0)
  const [incoming, setIncoming] = useState<number | null>(null)
  const [busy, setBusy] = useState(false)
  const busyRef = useRef(false)
  const [intervalMs] = useState(() => 2000 + Math.floor(Math.random() * 3000))

  useEffect(() => { busyRef.current = busy }, [busy])

  useEffect(() => {
    if (imgs.length <= 1) return
    const id = setInterval(() => {
      if (busyRef.current) return
      const next = (current + 1) % imgs.length
      setIncoming(next)
      setBusy(true)
    }, intervalMs)
    return () => clearInterval(id)
  }, [current, imgs.length, intervalMs])

  const go = (dir: 1 | -1, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (busy || imgs.length <= 1) return
    const next = (current + dir + imgs.length) % imgs.length
    setIncoming(next)
    setBusy(true)
  }

  const goTo = (idx: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (busy || idx === current) return
    setIncoming(idx)
    setBusy(true)
  }

  const onAnimEnd = () => {
    if (incoming !== null) {
      setCurrent(incoming)
      setIncoming(null)
      setBusy(false)
    }
  }

  return (
    <div className="group cursor-pointer" onClick={() => router.push(`/news/${article.id}`)}>
      <div className="relative overflow-hidden rounded-sm" style={{ paddingBottom: '125%' }}>
        <div className="absolute inset-0" style={{ zIndex: 1 }}>
          {imgs[current] && (
            <Image
              src={imgs[current]}
              alt={article.title}
              fill
              className="object-cover object-center"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          )}
        </div>

        {incoming !== null && (
          <div
            className="absolute inset-0 news-slide-in"
            style={{ zIndex: 2 }}
            onAnimationEnd={onAnimEnd}
          >
            <Image
              src={imgs[incoming]}
              alt=""
              fill
              className="object-cover object-center"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        )}

        {imgs.length > 1 && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
            {imgs.map((_, i) => (
              <button
                key={i}
                onClick={(e) => goTo(i, e)}
                className={`block w-10 h-[3px] rounded-full transition-opacity duration-300 bg-white ${
                  i === current ? 'opacity-100' : 'opacity-35'
                }`}
              />
            ))}
          </div>
        )}

        {imgs.length > 1 && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10">
            <button
              onClick={(e) => go(-1, e)}
              aria-label="Previous"
              className="flex items-center justify-center text-white/70 hover:text-white transition-colors duration-200"
            >
              <svg width="20" height="20" viewBox="0 0 12 12" fill="none">
                <path d="M8 2L3 6L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              onClick={(e) => go(1, e)}
              aria-label="Next"
              className="flex items-center justify-center text-white/70 hover:text-white transition-colors duration-200"
            >
              <svg width="20" height="20" viewBox="0 0 12 12" fill="none">
                <path d="M4 2L9 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="pt-3 px-0.5">
        <h3
          className="text-[15px] font-normal text-brand-950 leading-snug mb-1"
          style={{ fontFamily: 'var(--font-heading), sans-serif' }}
        >
          {article.title}
        </h3>
        <span className="text-[12px] text-brand-400 flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
          Read article{' '}
          <span className="inline-block group-hover:translate-x-0.5 transition-transform duration-200 text-brand-500">
            &rarr;
          </span>
        </span>
      </div>
    </div>
  )
}

export default function NewsClient({ featured, result, category }: Props) {
  const { t, locale } = useLanguage()
  const router = useRouter()

  const heroRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const filtersRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const contentIntroPlayedRef = useRef(false)

  const filters = [
    { key: 'all',            label: t.news.filterAll },
    { key: 'company',        label: t.news.filterCompany },
    { key: 'health',         label: t.news.filterHealth },
    { key: 'products',       label: t.news.filterProducts },
    { key: 'sustainability', label: t.news.filterSustainability },
  ]

  const handleFilterChange = (key: string) => {
    router.push(key === 'all' ? '/news' : `/news?category=${key}`)
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams()
    if (category !== 'all') params.set('category', category)
    if (page > 1) params.set('page', String(page))
    const qs = params.toString()
    router.push(qs ? `/news?${qs}` : '/news')
  }

  const getCatLabel = (cat: string) => {
    const map: Record<string, string> = {
      company:        t.news.filterCompany,
      health:         t.news.filterHealth,
      products:       t.news.filterProducts,
      sustainability: t.news.filterSustainability,
    }
    return map[cat] ?? cat
  }

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const titleWords    = titleRef.current?.querySelectorAll('.title-word-inner')
      const filterButtons = filtersRef.current?.querySelectorAll('button')
      const contentItems  = contentRef.current?.children
      const tl = gsap.timeline({ delay: 0.08 })

      if (titleWords?.length) {
        gsap.set(titleWords, { yPercent: 115 })
        tl.to(titleWords, { yPercent: 0, duration: 0.9, stagger: 0.08, ease: 'power4.out' }, 0)
      }
      if (filterButtons?.length) {
        gsap.set(filterButtons, { y: -18, opacity: 0 })
        tl.to(filterButtons, { y: 0, opacity: 1, duration: 0.55, stagger: 0.055, ease: 'power3.out' }, 0.28)
      }
      if (contentItems?.length) {
        gsap.set(contentItems, { y: 30, opacity: 0, scale: 0.97 })
        tl.to(contentItems, {
          y: 0, opacity: 1, scale: 1, duration: 0.55, stagger: 0.055, ease: 'power3.out',
          onComplete: () => { contentIntroPlayedRef.current = true },
        }, 0.58)
      }
    })
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!contentIntroPlayedRef.current) return
    const animate = async () => {
      const { gsap } = await import('gsap')
      if (gridRef.current && gridRef.current.children.length) {
        gsap.fromTo(
          gridRef.current.children,
          { y: 30, opacity: 0, scale: 0.97 },
          { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.055, ease: 'power3.out' }
        )
      }
    }
    animate()
  }, [result.docs])

  return (
    <div className="min-h-screen">
      <section className="pt-32 pb-10 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="mb-5 text-left" ref={heroRef}>
            <h1
              ref={titleRef}
              className="text-4xl sm:text-5xl lg:text-6xl font-light text-black leading-tight"
              style={{ fontFamily: 'var(--font-heading), sans-serif' }}
            >
              {t.news.title.split(/\s+/).map((word, index, words) => (
                <span
                  key={`${word}-${index}`}
                  className="inline-block overflow-hidden align-bottom pb-[0.18em] mb-[-0.18em]"
                >
                  <span className="title-word-inner inline-block">
                    {word}{index < words.length - 1 ? ' ' : ''}
                  </span>
                </span>
              ))}
            </h1>
          </div>

          <FilterBar ref={filtersRef} filters={filters} active={category} onChange={handleFilterChange} />

          <div ref={contentRef}>
            {featured && (
              <div className="mb-8">
                <Link
                  href={`/news/${featured.id}`}
                  className="group relative overflow-hidden rounded-2xl block"
                  style={{ height: 'clamp(340px, 46vw, 520px)' }}
                >
                  {featured.images[0]?.url && (
                    <Image
                      src={featured.images[0].url}
                      alt={featured.title}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      sizes="100vw"
                      priority
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

                  <div className="absolute top-5 left-5 z-10">
                    <span className="backdrop-blur-xl bg-white/15 border border-white/25 text-white text-[10px] font-light px-3 py-1.5 rounded-full uppercase tracking-wider">
                      {t.news.featured}
                    </span>
                  </div>

                  <div className="absolute bottom-5 left-5 right-5 rounded-xl overflow-hidden backdrop-blur-xl bg-white/10 border border-white/20 px-5 py-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-light text-white/55 uppercase tracking-[0.15em]">{getCatLabel(featured.category)}</span>
                      <span className="text-white/30">&middot;</span>
                      <span className="text-[10px] text-white/55">{formatDate(featured.date, locale)}</span>
                    </div>
                    <h2
                      className="text-xl sm:text-2xl lg:text-3xl font-light text-white leading-snug"
                      style={{ fontFamily: 'var(--font-heading), sans-serif' }}
                    >
                      {featured.title}
                    </h2>
                    <p className="mt-1.5 text-white/55 text-xs leading-relaxed line-clamp-1 hidden sm:block">
                      {featured.body[0]?.text}
                    </p>
                  </div>
                </Link>
              </div>
            )}

            <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {result.docs.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>

            {result.totalDocs === 0 && (
              <div className="text-center py-20 text-brand-400">
                <div className="text-5xl mb-4">&#128240;</div>
                <p className="text-lg font-normal">No articles in this category yet.</p>
              </div>
            )}

            <Pagination
              page={result.page}
              totalPages={result.totalPages}
              totalDocs={result.totalDocs}
              limit={result.limit}
              onChange={handlePageChange}
              label="articles"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
