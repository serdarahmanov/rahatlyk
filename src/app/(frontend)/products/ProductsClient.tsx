'use client'

import { useLayoutEffect, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { gsap } from 'gsap'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import ProductVisual from '@/components/ProductVisual'
import FilterBar from '@/components/FilterBar'
import Pagination from '@/components/Pagination'
import type { PayloadCategory, PayloadProduct, PayloadResult } from '@/types/payload'

interface Props {
  categories: PayloadCategory[]
  result: PayloadResult<PayloadProduct>
  category: string
}

export default function ProductsClient({ categories, result, category }: Props) {
  const { t } = useLanguage()
  const router = useRouter()

  const heroRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const filtersRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const gridIntroPlayedRef = useRef(false)

  const filters = [
    { key: 'all', label: t.products.filterAll },
    ...categories.map(c => ({ key: c.slug, label: c.label })),
  ]

  const handleFilterChange = (key: string) => {
    router.push(key === 'all' ? '/products' : `/products?category=${key}`)
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams()
    if (category !== 'all') params.set('category', category)
    if (page > 1) params.set('page', String(page))
    const qs = params.toString()
    router.push(qs ? `/products?${qs}` : '/products')
  }

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const titleWords    = titleRef.current?.querySelectorAll('.title-word-inner')
      const filterButtons = filtersRef.current?.querySelectorAll('button')
      const gridCards     = gridRef.current?.children
      const tl = gsap.timeline({ delay: 0.08 })

      if (titleWords?.length) {
        gsap.set(titleWords, { yPercent: 115 })
        tl.to(titleWords, { yPercent: 0, duration: 0.9, stagger: 0.08, ease: 'power4.out' }, 0)
      }
      if (filterButtons?.length) {
        gsap.set(filterButtons, { y: -18, opacity: 0 })
        tl.to(filterButtons, { y: 0, opacity: 1, duration: 0.55, stagger: 0.055, ease: 'power3.out' }, 0.28)
      }
      if (gridCards?.length) {
        gsap.set(gridCards, { y: 30, opacity: 0, scale: 0.97 })
        tl.to(gridCards, {
          y: 0, opacity: 1, scale: 1, duration: 0.55, stagger: 0.055, ease: 'power3.out',
          onComplete: () => { gridIntroPlayedRef.current = true },
        }, 0.58)
      }
    }, heroRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!gridIntroPlayedRef.current) return
    const animate = async () => {
      const { gsap } = await import('gsap')
      if (gridRef.current) {
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
      <section className="pt-32 pb-14 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="mb-5 text-left" ref={heroRef}>
            <h1
              ref={titleRef}
              className="text-4xl sm:text-5xl lg:text-6xl font-light text-black leading-tight"
              style={{ fontFamily: 'var(--font-heading), sans-serif' }}
            >
              {t.products.title.split(/\s+/).map((word, index, words) => (
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

          <div
            ref={gridRef}
            className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4 lg:gap-5"
          >
            {result.docs.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group relative bg-white rounded-2xl overflow-hidden h-[420px] hover:-translate-y-1.5 hover:shadow-xl transition-[box-shadow,transform] duration-300"
              >
                <div className="absolute inset-0 overflow-hidden">
                  <ProductVisual product={product} size="sm" className="w-full h-full" />
                </div>
                <div className="absolute bottom-0 inset-x-0 px-5 pb-5 pt-16">
                  <p className="text-brand-400 text-xs mb-1">{product.category.label}</p>
                  <h3 className="font-light text-brand-950 text-base leading-tight mb-1 group-hover:text-brand-700 transition-colors duration-200">
                    {product.name}
                  </h3>
                  <div className="min-w-0">
                    {product.volumes.length > 1 ? (
                      <p className="text-sm font-light text-brand-600 truncate">
                        {product.volumes.map((v) => v.value.replace(' L', '')).join(' · ')}{' L'}
                      </p>
                    ) : (
                      <p className="text-sm font-light text-brand-600">{product.volumes[0]?.value}</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <Pagination
            page={result.page}
            totalPages={result.totalPages}
            totalDocs={result.totalDocs}
            limit={result.limit}
            onChange={handlePageChange}
            label="products"
          />
        </div>
      </section>
    </div>
  )
}
