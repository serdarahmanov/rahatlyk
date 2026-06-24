'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { gsap } from 'gsap'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { withLocale } from '@/lib/i18n/locale'
import { formatDate } from '@/lib/formatDate'
import type { PayloadArticle } from '@/types/payload'
import { LexicalContent } from '@/lib/lexical-serialize'

function RelatedCard({ article }: { article: PayloadArticle }) {
  const router = useRouter()
  const { t, locale } = useLanguage()
  const imgs = article.images.map((i) => i.url)
  const [current, setCurrent] = useState(0)
  const [incoming, setIncoming] = useState<number | null>(null)
  const [busy, setBusy] = useState(false)
  const busyRef = useRef(false)
  const [intervalMs] = useState(() => 5000 + Math.floor(Math.random() * 3000))

  useEffect(() => { busyRef.current = busy }, [busy])

  useEffect(() => {
    if (imgs.length <= 1) return
    const id = setInterval(() => {
      if (busyRef.current) return
      setIncoming((current + 1) % imgs.length)
      setBusy(true)
    }, intervalMs)
    return () => clearInterval(id)
  }, [current, imgs.length, intervalMs])

  const go = (dir: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (busy || imgs.length <= 1) return
    setIncoming((current + dir + imgs.length) % imgs.length)
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
    <div className="group cursor-pointer" onClick={() => router.push(withLocale(locale, `/news/${article.id}`))}>
      <div className="relative overflow-hidden rounded-sm" style={{ paddingBottom: '62%' }}>
        <div className="absolute inset-0" style={{ zIndex: 1 }}>
          {imgs[current] && (
            <Image
              src={imgs[current]}
              alt={article.title}
              fill
              className="object-cover object-center"
              sizes="33vw"
            />
          )}
        </div>
        {incoming !== null && (
          <div className="absolute inset-0 news-slide-in" style={{ zIndex: 2 }} onAnimationEnd={onAnimEnd}>
            <Image src={imgs[incoming]} alt="" fill className="object-cover object-center" sizes="33vw" />
          </div>
        )}
        {imgs.length > 1 && (
          <div className="absolute inset-x-0 bottom-4 z-10 flex items-center justify-between px-4">
            <button
              onClick={(e) => go(-1, e)}
              aria-label="Previous photo"
              className="flex h-9 w-9 items-center justify-center rounded-md bg-white/70 text-gray-700 backdrop-blur-sm transition-all duration-200 hover:bg-white"
            >
              <svg width="16" height="16" viewBox="0 0 12 12" fill="none">
                <path d="M8 2L3 6L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="flex items-center gap-2">
              {imgs.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => goTo(i, e)}
                  aria-label={`Photo ${i + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    i === current ? 'h-[4px] w-6 bg-white' : 'h-[4px] w-[4px] bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={(e) => go(1, e)}
              aria-label="Next photo"
              className="flex h-9 w-9 items-center justify-center rounded-md bg-white/70 text-gray-700 backdrop-blur-sm transition-all duration-200 hover:bg-white"
            >
              <svg width="16" height="16" viewBox="0 0 12 12" fill="none">
                <path d="M4 2L9 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        )}
      </div>
      <div className="pt-3 px-0.5">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-[11px] text-gray-400 uppercase tracking-[0.12em]">{article.category.label}</span>
          <span className="text-gray-300">&middot;</span>
          <span className="text-[11px] text-gray-400">{formatDate(article.date, locale)}</span>
        </div>
        <h3
          className="text-[21px] font-medium text-brand-950 leading-snug mb-1"
          style={{ fontFamily: 'var(--font-heading), sans-serif' }}
        >
          {article.title}
        </h3>
        <span className="inline-flex h-9 items-center gap-1.5 rounded-md bg-gray-100 px-5 text-[11px] font-medium tracking-[0.06em] uppercase text-gray-700 transition-all duration-200 group-hover:bg-gray-200">
          {t.news.readArticle}
          <svg className="transition-transform duration-200 group-hover:translate-x-1" width="13" height="13" viewBox="0 0 14 14" fill="none">
            <path d="M2 7H12M12 7L8 3M12 7L8 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>
    </div>
  )
}

interface Props {
  article: PayloadArticle
  more: PayloadArticle[]
}

export default function ArticleDetailClient({ article, more }: Props) {
  const { t, locale } = useLanguage()

  const imgs = article.images.map(i => i.url).filter(Boolean)
  const [activeIdx, setActiveIdx] = useState(0)
  const [incoming, setIncoming]   = useState<number | null>(null)
  const [visitedIndexes, setVisitedIndexes] = useState<Set<number>>(() => new Set([0]))

  const infoRef    = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const relatedRef = useRef<HTMLDivElement>(null)

  const swapTo = (idx: number) => {
    if (idx === activeIdx || incoming !== null) return
    setVisitedIndexes((visited) => {
      if (visited.has(idx)) return visited
      const next = new Set(visited)
      next.add(idx)
      return next
    })
    setIncoming(idx)
  }

  const onAnimEnd = () => {
    if (incoming !== null) {
      setActiveIdx(incoming)
      setIncoming(null)
    }
  }

  useEffect(() => {
    let cancelled = false
    let ownedTriggers: Array<{ kill: () => void }> = []
    const init = async () => {
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      if (cancelled) return
      gsap.registerPlugin(ScrollTrigger)
      const existingTriggers = new Set(ScrollTrigger.getAll())

      if (infoRef.current) {
        gsap.fromTo(
          infoRef.current.children,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.09, ease: 'power3.out', delay: 0.1 }
        )
      }
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current.querySelectorAll('.article-para'),
          { y: 24, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.65, stagger: 0.09, ease: 'power3.out',
            scrollTrigger: { trigger: contentRef.current, start: 'top 83%' },
          }
        )
      }
      if (relatedRef.current && relatedRef.current.children.length) {
        gsap.fromTo(
          relatedRef.current.children,
          { y: 28, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.6, stagger: 0.09, ease: 'power3.out',
            scrollTrigger: { trigger: relatedRef.current, start: 'top 87%' },
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
  }, [article.id])

  return (
    <div className="min-h-screen">

      {/* ── Mobile layout (single column, hidden on sm+) ──────────────────────── */}
      <div className="sm:hidden pt-24 pb-16 px-5">

        <nav className="flex flex-wrap items-center gap-2 text-gray-400 text-xs mb-6">
          <Link href={withLocale(locale)} className="hover:text-gray-700 transition-colors">{t.nav.home}</Link>
          <span>/</span>
          <Link href={withLocale(locale, '/news')} className="hover:text-gray-700 transition-colors">{t.nav.news}</Link>
          <span>/</span>
          <Link
            href={`${withLocale(locale, '/news')}?category=${encodeURIComponent(article.category.slug)}`}
            className="hover:text-gray-700 transition-colors"
          >
            {article.category.label}
          </Link>
          <span>/</span>
          <span className="text-black truncate max-w-[160px]">{article.title}</span>
        </nav>

        <h1
          className="text-2xl font-normal text-gray-900 leading-tight mb-5 mt-2"
          style={{ fontFamily: 'var(--font-heading), sans-serif' }}
        >
          {article.title}
        </h1>

        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-md uppercase tracking-wider">
            {article.category.label}
          </span>
          {article.featured && (
            <span className="bg-gray-100 text-gray-500 text-xs font-medium px-3 py-1 rounded-md uppercase tracking-wider">
              {t.news.featured}
            </span>
          )}
          <span className="ml-auto bg-gray-100 text-gray-500 text-xs font-medium px-3 py-1 rounded-md tracking-wider">
            {formatDate(article.date, locale)}
          </span>
        </div>

        {imgs[activeIdx] && (
          <div className="relative overflow-hidden rounded-sm mb-8" style={{ paddingBottom: '62%' }}>
            {imgs.map((src, index) => {
              if (!visitedIndexes.has(index)) return null
              const isActive = index === activeIdx
              const isIncoming = index === incoming
              return (
                <div
                  key={src}
                  className={`absolute inset-0 ${isIncoming ? 'news-slide-in' : ''}`}
                  style={{
                    zIndex: isIncoming ? 2 : isActive ? 1 : 0,
                    visibility: isActive || isIncoming ? 'visible' : 'hidden',
                  }}
                  onAnimationEnd={isIncoming ? onAnimEnd : undefined}
                >
                  <Image
                    src={src}
                    alt={isActive ? article.title : ''}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 639px) 100vw, 60vw"
                    priority={index === 0}
                  />
                </div>
              )
            })}
            {imgs.length > 1 && (
              <div className="absolute inset-x-0 bottom-4 flex items-center justify-between px-4" style={{ zIndex: 10 }}>
                <button
                  onClick={() => swapTo((activeIdx - 1 + imgs.length) % imgs.length)}
                  aria-label="Previous photo"
                  className="flex items-center justify-center w-9 h-9 rounded-md bg-white/70 hover:bg-white text-gray-700 backdrop-blur-sm transition-all duration-200"
                >
                  <svg width="16" height="16" viewBox="0 0 12 12" fill="none">
                    <path d="M8 2L3 6L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div className="flex items-center gap-2">
                  {imgs.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => swapTo(i)}
                      aria-label={`Photo ${i + 1}`}
                      className={`rounded-full transition-all duration-300 ${i === activeIdx ? 'w-6 h-[4px] bg-white' : 'w-[4px] h-[4px] bg-white/40 hover:bg-white/70'}`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => swapTo((activeIdx + 1) % imgs.length)}
                  aria-label="Next photo"
                  className="flex items-center justify-center w-9 h-9 rounded-md bg-white/70 hover:bg-white text-gray-700 backdrop-blur-sm transition-all duration-200"
                >
                  <svg width="16" height="16" viewBox="0 0 12 12" fill="none">
                    <path d="M4 2L9 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}

        <div>
          {article.body.map((para, i) => (
            <p
              key={para.id}
              className={`leading-relaxed mb-6 ${i === 0 ? 'text-black text-[17px] font-medium' : 'text-black text-base'}`}
            >
              <LexicalContent data={para.text} />
            </p>
          ))}
          <div className="mt-8">
            <Link
              href={withLocale(locale, '/news')}
              className="inline-block rounded-[3px] border border-[#141618] bg-[#141618] px-8 py-3.5 text-sm font-medium tracking-[0.06em] text-[#FAFAF8] transition-colors duration-300 hover:border-[#ecfeff] hover:bg-[#ecfeff] hover:text-[#141618]"
            >
              {t.home.news.cta}
            </Link>
          </div>
        </div>

      </div>

      {/* ── Desktop / tablet two-column pinned section (hidden on mobile) ─────── */}
      <section className="hidden sm:flex max-w-screen-2xl mx-auto items-start gap-24 pt-32 pb-40 px-6 sm:px-10 lg:px-16">

        {/* Left — sticky, full viewport height */}
        <div className="sticky top-32 h-[calc(100vh-8rem)] w-[60%] shrink-0 flex flex-col bg-white overflow-hidden pb-8">

          {/* Info */}
          <div className="flex-none flex flex-col" ref={infoRef}>

            <nav className="flex flex-wrap items-center gap-2 text-gray-400 text-xs mb-8">
              <Link href={withLocale(locale)} className="hover:text-gray-700 transition-colors">{t.nav.home}</Link>
              <span>/</span>
              <Link href={withLocale(locale, '/news')} className="hover:text-gray-700 transition-colors">{t.nav.news}</Link>
              <span>/</span>
              <Link
                href={`${withLocale(locale, '/news')}?category=${encodeURIComponent(article.category.slug)}`}
                className="hover:text-gray-700 transition-colors"
              >
                {article.category.label}
              </Link>
              <span>/</span>
              <span className="text-black truncate max-w-[180px]">{article.title}</span>
            </nav>

            <h1
              className="text-3xl sm:text-4xl lg:text-[2.6rem] font-normal text-gray-900 leading-tight mb-10 mt-2"
              style={{ fontFamily: 'var(--font-heading), sans-serif' }}
            >
              {article.title}
            </h1>

          </div>

          {/* Badges + date — above the photo */}
          <div className="flex-none flex items-center gap-2 mb-3 flex-wrap">
            <span className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-md uppercase tracking-wider">
              {article.category.label}
            </span>
            {article.featured && (
              <span className="bg-gray-100 text-gray-500 text-xs font-medium px-3 py-1 rounded-md uppercase tracking-wider">
                {t.news.featured}
              </span>
            )}
            <span className="ml-auto bg-gray-100 text-gray-500 text-xs font-medium px-3 py-1 rounded-md tracking-wider">
              {formatDate(article.date, locale)}
            </span>
          </div>

          {/* Main photo with prev/next navigation */}
          {imgs[activeIdx] && (
            <div className="relative flex-1 overflow-hidden rounded-sm min-h-0">
              {imgs.map((src, index) => {
                if (!visitedIndexes.has(index)) return null
                const isActive = index === activeIdx
                const isIncoming = index === incoming
                return (
                  <div
                    key={src}
                    className={`absolute inset-0 ${isIncoming ? 'news-slide-in' : ''}`}
                    style={{
                      zIndex: isIncoming ? 2 : isActive ? 1 : 0,
                      visibility: isActive || isIncoming ? 'visible' : 'hidden',
                    }}
                    onAnimationEnd={isIncoming ? onAnimEnd : undefined}
                  >
                    <Image
                      src={src}
                      alt={isActive ? article.title : ''}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 639px) 100vw, 60vw"
                      priority={index === 0}
                    />
                  </div>
                )
              })}

              {imgs.length > 1 && (
                <div className="absolute inset-x-0 bottom-4 flex items-center justify-between px-4" style={{ zIndex: 10 }}>
                  <button
                    onClick={() => swapTo((activeIdx - 1 + imgs.length) % imgs.length)}
                    aria-label="Previous photo"
                    className="flex items-center justify-center w-9 h-9 rounded-md bg-white/70 hover:bg-white text-gray-700 backdrop-blur-sm transition-all duration-200"
                  >
                    <svg width="16" height="16" viewBox="0 0 12 12" fill="none">
                      <path d="M8 2L3 6L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <div className="flex items-center gap-2">
                    {imgs.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => swapTo(i)}
                        aria-label={`Photo ${i + 1}`}
                        className={`rounded-full transition-all duration-300 ${i === activeIdx ? 'w-6 h-[4px] bg-white' : 'w-[4px] h-[4px] bg-white/40 hover:bg-white/70'}`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => swapTo((activeIdx + 1) % imgs.length)}
                    aria-label="Next photo"
                    className="flex items-center justify-center w-9 h-9 rounded-md bg-white/70 hover:bg-white text-gray-700 backdrop-blur-sm transition-all duration-200"
                  >
                    <svg width="16" height="16" viewBox="0 0 12 12" fill="none">
                      <path d="M4 2L9 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right — text only, scrollable */}
        <div className="w-[40%] min-w-0 pt-[calc(50vh-8rem)]">

          {/* Article body */}
          <div className="bg-white py-0 pb-24" ref={contentRef}>
            {article.body.map((para, i) => (
              <p
                key={para.id}
                className={`article-para leading-relaxed mb-6 ${
                  i === 0 ? 'text-black text-lg font-medium' : 'text-black text-base'
                }`}
              >
                <LexicalContent data={para.text} />
              </p>
            ))}

            <div className="mt-10">
              <Link
                href={withLocale(locale, '/news')}
                className="inline-block rounded-[3px] border border-[#141618] bg-[#141618] px-8 py-3.5 text-sm font-medium tracking-[0.06em] text-[#FAFAF8] transition-colors duration-300 hover:border-[#ecfeff] hover:bg-[#ecfeff] hover:text-[#141618]"
              >
                {t.home.news.cta}
              </Link>
            </div>

          </div>

          {/* Sticky white mask — text scrolls behind this, height matches left column pb-8 */}
          <div className="sticky bottom-0 h-8 bg-white pointer-events-none" />

        </div>


      </section>

      {/* ── Related articles ──────────────────────────────────────────────────── */}
      {more.length > 0 && (
        <section className="py-14 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
            <h2
              className="text-xl font-normal text-gray-900 mb-8"
              style={{ fontFamily: 'var(--font-heading), sans-serif' }}
            >
              More Articles
            </h2>
            <div ref={relatedRef} className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-6 gap-y-10">
              {more.map(a => <RelatedCard key={a.id} article={a} />)}
            </div>
          </div>
        </section>
      )}

    </div>
  )
}
