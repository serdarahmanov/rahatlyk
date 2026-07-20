'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { withLocale } from '@/lib/i18n/locale'
import { formatDate } from '@/lib/formatDate'
import EmptyState from '@/components/EmptyState'
import FilterBar from '@/components/FilterBar'
import { lexicalToPlainText } from '@/lib/lexical-serialize'
import Pagination from '@/components/Pagination'
import type { ArticleLabelsData, PayloadArticle, PayloadCategory, PayloadResult } from '@/types/payload'

interface Props {
  categories: PayloadCategory[]
  featured: PayloadArticle[]
  result: PayloadResult<PayloadArticle>
  category: string
  labels: ArticleLabelsData
}

function NewsCard({
  article,
  featured = false,
  priority = false,
  entryIndex = 0,
  labels,
}: {
  article: PayloadArticle
  featured?: boolean
  priority?: boolean
  entryIndex?: number
  labels: ArticleLabelsData
}) {
  const router = useRouter()
  const { locale } = useLanguage()
  const imgs = article.images.map((i) => i.url)
  const [current, setCurrent] = useState(0)
  const [incoming, setIncoming] = useState<number | null>(null)
  const [busy, setBusy] = useState(false)
  const busyRef = useRef(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const [intervalMs] = useState(() => 5000 + Math.floor(Math.random() * 3000))

  useEffect(() => { busyRef.current = busy }, [busy])

  useEffect(() => {
    if (imgs.length <= 1) return
    let id: ReturnType<typeof setInterval> | undefined

    const start = () => {
      id = setInterval(() => {
        if (busyRef.current) return
        const next = (current + 1) % imgs.length
        setIncoming(next)
        setBusy(true)
      }, intervalMs)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { if (!id) start() }
        else { clearInterval(id); id = undefined }
      },
      { threshold: 0.1 },
    )

    if (cardRef.current) observer.observe(cardRef.current)
    return () => { observer.disconnect(); clearInterval(id) }
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
    <div
      ref={cardRef}
      className="news-card-enter group cursor-pointer"
      style={{ '--news-entry-index': entryIndex } as React.CSSProperties}
      onClick={() => router.push(withLocale(locale, `/news/${article.slug}`))}
    >
      <div className="relative overflow-hidden rounded-sm" style={{ paddingBottom: '62%' }}>
        <div className="absolute inset-0" style={{ zIndex: 1 }}>
          {imgs[current] && (
            <Image
              src={imgs[current]}
              alt={article.title}
              fill
              priority={priority}
              className="object-cover object-center"
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 640px"
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
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 640px"
            />
          </div>
        )}

        {featured && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-sky-500 text-white text-[10px] font-medium px-2.5 py-1 rounded-md uppercase tracking-wider">
              {labels.featuredLabel}
            </span>
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
        {featured && (
          <p className="text-[12px] text-gray-500 truncate mb-1.5">
            {lexicalToPlainText(article.body[0]?.text)}
          </p>
        )}
        <span className="inline-flex h-9 items-center gap-1.5 rounded-md bg-gray-100 px-5 text-[11px] font-medium tracking-[0.06em] uppercase text-gray-700 transition-all duration-200 group-hover:bg-gray-200">
          {labels.readArticleLabel}
          <svg className="transition-transform duration-200 group-hover:translate-x-1" width="13" height="13" viewBox="0 0 14 14" fill="none">
            <path d="M2 7H12M12 7L8 3M12 7L8 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>
    </div>
  )
}

export default function NewsClient({ categories, featured, result, category, labels }: Props) {
  const { locale } = useLanguage()
  const router = useRouter()

  const filters = [
    { key: 'all', label: labels.filterAllLabel },
    ...categories.map(c => ({ key: c.slug, label: c.label })),
  ]

  const handleFilterChange = (key: string) => {
    const newsPath = withLocale(locale, '/news')
    router.push(key === 'all' ? newsPath : `${newsPath}?category=${key}`)
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams()
    if (category !== 'all') params.set('category', category)
    if (page > 1) params.set('page', String(page))
    const qs = params.toString()
    const newsPath = withLocale(locale, '/news')
    router.push(qs ? `${newsPath}?${qs}` : newsPath)
  }

  return (
    <div className="min-h-screen">
      <section className="pt-32 pb-10 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="mb-5 text-left">
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-light text-black leading-tight"
              style={{ fontFamily: 'var(--font-heading), sans-serif' }}
            >
              {labels.pageTitle.split(/\s+/).map((word, index, words) => (
                <span key={`${word}-${index}`} style={{ display: 'inline' }}>
                  <span className="inline-block overflow-hidden align-bottom pb-[0.18em] mb-[-0.18em]">
                    <span
                      className="news-title-word inline-block"
                      style={{ '--news-entry-index': index } as React.CSSProperties}
                    >
                      {word}
                    </span>
                  </span>
                  {index < words.length - 1 ? ' ' : ''}
                </span>
              ))}
            </h1>
          </div>

          <FilterBar filters={filters} active={category} onChange={handleFilterChange} />

          <div>
            {featured.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-16 mb-16">
                {featured.map((article, index) => (
                  <NewsCard
                    key={`${category}-${result.page}-${article.id}`}
                    article={article}
                    featured
                    priority={index === 0}
                    entryIndex={index}
                    labels={labels}
                  />
                ))}
              </div>
            )}

            {featured.length > 0 && result.docs.length > 0 && (
              <hr className="border-t border-brand-200 mb-16" />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-16 mb-24">
              {result.docs.map((article, index) => (
                <NewsCard
                  key={`${category}-${result.page}-${article.id}`}
                  article={article}
                  priority={featured.length === 0 && index === 0}
                  entryIndex={featured.length + index}
                  labels={labels}
                />
              ))}
            </div>

            {result.totalDocs === 0 && featured.length === 0 && (
              <EmptyState message={labels.noArticlesMessage} />
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
