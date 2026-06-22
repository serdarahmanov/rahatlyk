'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ProductVisual from '@/components/ProductVisual'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { withLocale } from '@/lib/i18n/locale'
import type { PayloadProduct, ProductDetailLabelsData } from '@/types/payload'


function RelatedProducts({ related }: { related: PayloadProduct[] }) {
  const { locale } = useLanguage()
  if (related.length === 0) return null

  return (
    <section className="py-14 bg-white">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
        <h2
          className="text-xl font-light text-gray-900 mb-8"
          style={{ fontFamily: 'var(--font-heading), sans-serif' }}
        >
          More in {related[0]?.category.label}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-5">
          {related.map((p) => (
            <Link
              key={p.id}
              href={withLocale(locale, `/products/${p.id}`)}
              className="group flex flex-col hover:-translate-y-1.5 hover:shadow-xl transition-[box-shadow,transform] duration-300 rounded-2xl overflow-hidden"
            >
              <div className="relative overflow-hidden h-[320px] bg-white rounded-2xl">
                <ProductVisual product={p} size="sm" className="w-full h-full" />
              </div>
              <div className="px-3 pt-3 pb-4">
                <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-1.5">{p.category.label}</p>
                <h3 className="font-medium text-gray-900 text-[17px] leading-tight mb-1.5 group-hover:text-gray-700 transition-colors duration-200">
                  {p.name}
                </h3>
                <div className="min-w-0">
                  {p.volumes.length > 1 ? (
                    <p className="text-xs font-light text-gray-500 truncate">
                      {p.volumes.map((v) => v.value.replace(' L', '')).join(' · ')}{' L'}
                    </p>
                  ) : (
                    <p className="text-xs font-light text-gray-500">{p.volumes[0]?.value} L</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

type AccordionKey = 'nutrition'

interface Props {
  product: PayloadProduct
  related: PayloadProduct[]
  prevProduct: PayloadProduct | null
  nextProduct: PayloadProduct | null
  labels: ProductDetailLabelsData
}

export default function ProductDetailClient({ product, related, prevProduct, nextProduct, labels }: Props) {
  const { locale, t } = useLanguage()
  const [openPanel, setOpenPanel] = useState<AccordionKey>('' as AccordionKey)
  const [activePhoto, setActivePhoto] = useState(0)
  const [photoDir, setPhotoDir] = useState<'left' | 'right'>('right')

  const goPhoto = (next: number) => {
    const total = product.photos?.length ?? 1
    const resolved = (next + total) % total
    setPhotoDir(next > activePhoto || (activePhoto === total - 1 && next === 0) ? 'right' : 'left')
    setActivePhoto(resolved)
  }

  const heroRef      = useRef<HTMLDivElement>(null)
  const bottleRef    = useRef<HTMLDivElement>(null)
  const mainPhotoRef = useRef<HTMLDivElement>(null)
  const detailRef    = useRef<HTMLDivElement>(null)
  const nameColRef   = useRef<HTMLDivElement>(null)
  const descBoxRef   = useRef<HTMLDivElement>(null)
  const aboutGridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    let ownedTriggers: Array<{ kill: () => void }> = []
    const init = async () => {
      const { gsap }          = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      if (cancelled) return
      gsap.registerPlugin(ScrollTrigger)
      const existingTriggers = new Set(ScrollTrigger.getAll())

      const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } })

      if (mainPhotoRef.current) {
        tl.fromTo(
          mainPhotoRef.current,
          { clipPath: 'inset(50% 50% 50% 50%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.0 },
          0
        )
      } else if (bottleRef.current) {
        tl.fromTo(
          bottleRef.current,
          { clipPath: 'inset(50% 50% 50% 50%)', opacity: 0 },
          { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, duration: 1.0 },
          0
        )
      }

      if (heroRef.current) {
        tl.fromTo(
          Array.from(heroRef.current.children),
          { clipPath: 'inset(50% 50% 50% 50%)', opacity: 0 },
          { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' },
          0.4
        )
      }

      if (bottleRef.current && product.photos && product.photos.length > 1) {
        const thumbCol = bottleRef.current.firstElementChild
        if (thumbCol) {
          tl.fromTo(
            Array.from(thumbCol.children),
            { clipPath: 'inset(50% 50% 50% 50%)', opacity: 0 },
            {
              clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, duration: 0.35, stagger: 0.07, ease: 'power2.out',
              onComplete: () => { gsap.set(thumbCol.children, { clearProps: 'clipPath' }) },
            },
            0.85
          )
        }
      }

      if (detailRef.current) {
        gsap.fromTo(
          detailRef.current,
          { y: 30, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: detailRef.current, start: 'top 85%' },
          }
        )
      }

      if (nameColRef.current && descBoxRef.current && window.innerWidth >= 768) {
        ScrollTrigger.create({
          trigger: aboutGridRef.current,
          start: 'top 80%',
          endTrigger: descBoxRef.current,
          end: () => {
            const nameH = nameColRef.current?.offsetHeight ?? 0
            const pct  = 80 + (nameH / window.innerHeight) * 100
            return `bottom ${pct}%`
          },
          pin: nameColRef.current,
          pinSpacing: false,
          pinType: 'transform',
        })
      }

      ownedTriggers = ScrollTrigger.getAll().filter((trigger) => !existingTriggers.has(trigger))
    }
    init()
    return () => {
      cancelled = true
      ownedTriggers.forEach((trigger) => trigger.kill())
    }
  }, [product.photos])

  const panels: { key: AccordionKey; label: string; content: React.ReactNode }[] = [
    {
      key: 'nutrition',
      label: labels.nutritionLabel ?? 'Nutrition',
      content: (
        <table className="w-full max-w-sm text-sm border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left text-[10px] font-light uppercase tracking-widest text-gray-500 pb-3 pr-8 font-normal">{labels.mineralLabel ?? 'Mineral'}</th>
              <th className="text-left text-[10px] font-light uppercase tracking-widest text-gray-500 pb-3 font-normal">{labels.perLitreLabel ?? 'Per Litre'}</th>
            </tr>
          </thead>
          <tbody>
            {product.nutrition.map((n, i) => (
              <tr key={n.id} className={i < product.nutrition.length - 1 ? 'border-b border-gray-200' : ''}>
                <td className="py-3 pr-8 text-gray-500">{n.label}</td>
                <td className="py-3 text-gray-500">{n.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ),
    },
  ]

  return (
    <div className="min-h-screen">
      <section className="pt-28 pb-16 relative overflow-hidden bg-white border-b border-gray-200">
        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
          <nav className="flex flex-wrap items-center gap-2 text-gray-400 text-xs mb-8">
            <Link href={withLocale(locale)} className="hover:text-gray-700 transition-colors">{t.nav.home}</Link>
            <span>/</span>
            <Link href={withLocale(locale, '/products')} className="hover:text-gray-700 transition-colors">{t.nav.products}</Link>
            <span>/</span>
            <Link href={`${withLocale(locale, '/products')}?category=${product.category.slug}`} className="hover:text-gray-700 transition-colors">{product.category.label}</Link>
            <span>/</span>
            <span className="text-black truncate max-w-[180px]">{product.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div ref={bottleRef} className="flex gap-3">
              {product.photos && product.photos.length > 1 && (
                <div className="hidden lg:flex flex-col gap-2 flex-shrink-0">
                  {product.photos.map((photo, i) => (
                    <button
                      key={photo.id}
                      onClick={() => goPhoto(i)}
                      className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-200 ${
                        activePhoto === i ? 'opacity-100' : 'opacity-50 hover:opacity-80'
                      }`}
                    >
                      <Image src={photo.url} alt={`thumb ${i + 1}`} fill className="object-cover" sizes="64px" />
                      {activePhoto === i && (
                        <span className="absolute inset-0 rounded-lg border-2 border-black/[0.06] pointer-events-none z-10" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              <div ref={mainPhotoRef} className="relative flex-1 aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100">
                {product.photos && product.photos.length > 0 ? (
                  <Image
                    key={activePhoto}
                    src={product.photos[activePhoto].url}
                    alt={`${product.name} photo ${activePhoto + 1}`}
                    fill
                    className={`object-cover ${photoDir === 'right' ? 'photo-enter-right' : 'photo-enter-left'}`}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <Image
                    src="/products/FeatureProductImg_RTD_LT.png"
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                )}

                {product.photos && product.photos.length > 1 && (
                  <>
                    <button
                      onClick={() => goPhoto(activePhoto - 1)}
                      aria-label="Previous photo"
                      className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md bg-white/70 text-gray-700 backdrop-blur-sm transition-all duration-200 hover:bg-white"
                    >
                      <svg width="16" height="16" viewBox="0 0 12 12" fill="none">
                        <path d="M8 2L3 6L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => goPhoto(activePhoto + 1)}
                      aria-label="Next photo"
                      className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md bg-white/70 text-gray-700 backdrop-blur-sm transition-all duration-200 hover:bg-white"
                    >
                      <svg width="16" height="16" viewBox="0 0 12 12" fill="none">
                        <path d="M4 2L9 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </div>

            <div ref={heroRef}>
              <span className="block text-[10px] font-medium tracking-[0.3em] uppercase text-gray-500 mb-5">
                {product.category.label}
              </span>

              <h1
                className={`text-4xl sm:text-5xl text-black leading-tight mb-3 ${
                  locale === 'ru' ? 'font-light' : 'font-medium'
                }`}
                style={{ fontFamily: 'var(--font-heading), sans-serif' }}
              >
                {product.name}
              </h1>

              <p className="text-gray-500 text-sm tracking-wide mb-8">{product.tagline}</p>

              {product.volumes.length > 0 && (
                <div className="mb-8">
                  <p className="text-xs font-light text-gray-500 mb-5">{labels.sizeLabel ?? 'Size'}</p>
                  <div className="flex items-end gap-5">
                    {[...product.volumes]
                      .sort((a, b) => parseFloat(a.value) - parseFloat(b.value))
                      .map((vol) => {
                        const val = parseFloat(vol.value)
                        const max = Math.max(...product.volumes.map(x => parseFloat(x.value)))
                        const h   = Math.max(28, Math.round((val / max) * 60))
                        return (
                          <div key={vol.id} className="flex flex-col items-center gap-1.5 group">
                            <div
                              style={{ height: `${h}px` }}
                              className="opacity-40 text-gray-500 group-hover:opacity-80 group-hover:text-gray-600 group-hover:scale-105 group-hover:drop-shadow-sm transition-all duration-300"
                            >
                              {val > 15 && val <= 20 ? (
                                <svg viewBox="0 0 512 512" fill="currentColor" className="h-full w-auto" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M345.6,133.565h-33.948V89.043h11.13c6.146,0,11.13-4.983,11.13-11.13V11.13c0-6.147-4.984-11.13-11.13-11.13H189.217 c-6.146,0-11.13,4.983-11.13,11.13v66.783c0,6.147,4.984,11.13,11.13,11.13h11.13v44.522H166.4 c-54.93,0-99.617,44.688-99.617,99.617v89.6v44.522v94.052c0,27.925,22.718,50.643,50.643,50.643h277.148 c27.925,0,50.643-22.718,50.643-50.643v-94.052v-44.522v-89.6C445.217,178.253,400.53,133.565,345.6,133.565z M200.348,22.261 h111.304v44.522h-11.13h-89.043h-11.13V22.261z M222.609,122.435H256c6.146,0,11.13-4.983,11.13-11.13 c0-6.147-4.984-11.13-11.13-11.13h-33.391v-11.13h66.783v44.522h-66.783V122.435z M166.4,155.826h45.078h89.043H345.6 c42.654,0,77.357,34.702,77.357,77.357v78.47H233.925c-6.146,0-11.13,4.983-11.13,11.13s4.984,11.13,11.13,11.13h189.032v22.261 H89.043v-22.261h77.913c6.146,0,11.13-4.983,11.13-11.13s-4.984-11.13-11.13-11.13H89.043v-78.47 C89.043,190.529,123.746,155.826,166.4,155.826z M394.574,489.739H117.426c-15.65,0-28.383-12.732-28.383-28.383v-82.922h333.913 v82.922C422.957,477.007,410.224,489.739,394.574,489.739z"/>
                                  <path d="M190.163,327.046c0.278,0.668,0.624,1.313,1.024,1.914c0.401,0.612,0.868,1.18,1.38,1.692 c2.07,2.07,4.942,3.261,7.869,3.261c0.722,0,1.458-0.078,2.182-0.223c0.701-0.134,1.402-0.356,2.081-0.634 c0.668-0.278,1.313-0.623,1.914-1.024c0.612-0.401,1.18-0.868,1.692-1.38c0.512-0.512,0.981-1.08,1.391-1.692 c0.401-0.601,0.746-1.247,1.024-1.914c0.278-0.679,0.49-1.38,0.634-2.093s0.211-1.447,0.211-2.17c0-0.723-0.068-1.458-0.211-2.17 c-0.144-0.712-0.356-1.414-0.634-2.081c-0.278-0.679-0.623-1.325-1.024-1.926c-0.411-0.612-0.879-1.18-1.391-1.692 s-1.08-0.979-1.692-1.38c-0.601-0.401-1.247-0.746-1.914-1.024c-0.679-0.278-1.38-0.501-2.081-0.634 c-3.629-0.735-7.469,0.456-10.051,3.039c-0.512,0.512-0.979,1.08-1.38,1.692c-0.4,0.601-0.746,1.247-1.024,1.926 c-0.278,0.668-0.489,1.369-0.633,2.081c-0.146,0.712-0.223,1.447-0.223,2.17c0,0.723,0.077,1.458,0.223,2.17 C189.674,325.665,189.885,326.367,190.163,327.046z"/>
                                </svg>
                              ) : val > 1 && val <= 15 ? (
                                <svg viewBox="0 0 512 512" fill="currentColor" className="h-full w-auto" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M389.03,234.667c10.135-11.322,16.303-26.269,16.303-42.667c0-35.355-28.645-64-64-64H320v-21.333h21.333 c11.782,0,21.333-9.551,21.333-21.333v-64C362.667,9.551,353.115,0,341.333,0H170.667c-11.782,0-21.333,9.551-21.333,21.333v64 c0,11.782,9.551,21.333,21.333,21.333H192V128h-21.333c-35.355,0-64,28.645-64,64c0,16.397,6.169,31.344,16.303,42.667 c-10.135,11.322-16.303,26.269-16.303,42.667s6.169,31.344,16.303,42.667c-10.135,11.322-16.303,26.269-16.303,42.667 s6.169,31.344,16.303,42.667c-10.135,11.322-16.303,26.269-16.303,42.667c0,35.355,28.645,64,64,64h170.667 c35.355,0,64-28.645,64-64c0-16.397-6.169-31.344-16.303-42.667c10.135-11.322,16.303-26.269,16.303-42.667 S399.165,331.322,389.03,320c10.135-11.322,16.303-26.269,16.303-42.667S399.165,245.989,389.03,234.667z M362.667,362.667 c0,11.791-9.542,21.333-21.333,21.333H170.667c-11.791,0-21.333-9.542-21.333-21.333s9.542-21.333,21.333-21.333h170.667 C353.125,341.333,362.667,350.875,362.667,362.667z M170.667,298.667c-11.791,0-21.333-9.542-21.333-21.333 S158.875,256,170.667,256h170.667c11.791,0,21.333,9.542,21.333,21.333s-9.542,21.333-21.333,21.333H170.667z M192,42.667h128V64 h-21.333h-85.333H192V42.667z M234.667,106.667h42.667V128h-42.667V106.667z M170.667,170.667h42.667h85.333h42.667 c11.791,0,21.333,9.542,21.333,21.333s-9.542,21.333-21.333,21.333H170.667c-11.791,0-21.333-9.542-21.333-21.333 S158.875,170.667,170.667,170.667z M341.333,469.333H170.667c-11.791,0-21.333-9.542-21.333-21.333s9.542-21.333,21.333-21.333 h170.667c11.791,0,21.333,9.542,21.333,21.333S353.125,469.333,341.333,469.333z"/>
                                </svg>
                              ) : (
                                <svg viewBox="0 0 512 512" fill="currentColor" className="h-full w-auto" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M358.079,149.289c0-10.352-3.787-20.314-10.665-28.051l-55.449-62.38c-1.48-1.665-2.295-3.808-2.295-6.036V48.16 c5.093-2.829,8.551-8.26,8.551-14.489V16.569C298.221,7.432,290.789,0,281.653,0h-51.307c-9.136,0-16.568,7.432-16.568,16.568V33.67 c0,6.228,3.458,11.659,8.551,14.489v4.663c0,2.228-0.816,4.371-2.295,6.036l-55.449,62.381 c-6.877,7.737-10.665,17.699-10.665,28.051v46.853c0,6.603,2.564,12.614,6.745,17.102c-4.18,4.488-6.745,10.5-6.745,17.102v8.551 c0,6.603,2.564,12.614,6.745,17.102c-4.18,4.488-6.745,10.5-6.745,17.102v8.551c0,6.603,2.564,12.614,6.745,17.102 c-4.18,4.488-6.745,10.5-6.745,17.102v8.551c0,6.603,2.564,12.614,6.745,17.102c-4.18,4.488-6.745,10.5-6.745,17.102v8.551 c0,6.603,2.564,12.614,6.745,17.102c-4.18,4.488-6.745,10.5-6.745,17.102v8.551c0,6.603,2.564,12.614,6.745,17.102 c-4.18,4.488-6.745,10.5-6.745,17.102v25.653c0,23.28,18.941,42.221,42.221,42.221h119.716c23.281,0,42.221-18.941,42.221-42.221 v-25.653c0-6.603-2.564-12.614-6.745-17.102c4.18-4.488,6.745-10.5,6.745-17.102v-8.551c0-6.603-2.564-12.614-6.745-17.102 c4.18-4.488,6.745-10.5,6.745-17.102v-8.551c0-6.603-2.564-12.614-6.745-17.102c4.18-4.488,6.745-10.5,6.745-17.102v-8.551 c0-6.603-2.564-12.614-6.745-17.102c4.18-4.488,6.745-10.5,6.745-17.102v-8.551c0-6.603-2.564-12.614-6.745-17.102 c4.18-4.488,6.745-10.5,6.745-17.102v-8.551c0-6.603-2.564-12.614-6.745-17.102c4.18-4.488,6.745-10.5,6.745-17.102V149.289z M229.812,16.568c0-0.295,0.239-0.534,0.534-0.534h51.307c0.295,0,0.534,0.239,0.534,0.534V33.67c0,0.295-0.239,0.534-0.534,0.534 h-51.307c-0.295,0-0.534-0.239-0.534-0.534V16.568z M176.568,131.891l55.45-62.381c4.092-4.604,6.345-10.53,6.345-16.688v-2.585 h35.273v2.584c0,6.158,2.253,12.085,6.345,16.689l55.449,62.381c1.346,1.514,2.476,3.176,3.427,4.928H173.143 C174.093,135.066,175.224,133.403,176.568,131.891z M342.046,469.779c0,14.44-11.748,26.188-26.188,26.188H196.142 c-14.44,0-26.188-11.748-26.188-26.188v-25.653c0-5.01,4.076-9.086,9.086-9.086H332.96c5.01,0,9.086,4.076,9.086,9.086V469.779z M342.046,409.921c0,5.01-4.076,9.086-9.086,9.086H179.04c-5.01,0-9.086-4.076-9.086-9.086v-8.551c0-5.01,4.076-9.086,9.086-9.086 H332.96c5.01,0,9.086,4.076,9.086,9.086V409.921z M342.046,367.165c0,5.01-4.076,9.086-9.086,9.086H179.04 c-5.01,0-9.086-4.076-9.086-9.086v-8.551c0-5.01,4.076-9.086,9.086-9.086H332.96c5.01,0,9.086,4.076,9.086,9.086V367.165z M342.046,324.409c0,5.01-4.076,9.086-9.086,9.086H179.04c-5.01,0-9.086-4.076-9.086-9.086v-8.551c0-5.01,4.076-9.086,9.086-9.086 H332.96c5.01,0,9.086,4.076,9.086,9.086V324.409z M342.046,281.653c0,5.01-4.076,9.086-9.086,9.086H179.04 c-5.01,0-9.086-4.076-9.086-9.086v-8.551c0-5.01,4.076-9.086,9.086-9.086H332.96c5.01,0,9.086,4.076,9.086,9.086V281.653z M342.046,238.898c0,5.01-4.076,9.086-9.086,9.086H179.04c-5.01,0-9.086-4.076-9.086-9.086v-8.551c0-5.01,4.076-9.086,9.086-9.086 H332.96c5.01,0,9.086,4.076,9.086,9.086V238.898z M332.96,205.228H179.04c-5.01,0-9.086-4.076-9.086-9.086v-43.29h172.092v43.29 C342.046,201.152,337.97,205.228,332.96,205.228z"/>
                                </svg>
                              )}
                            </div>
                            <span className="text-[10px] font-light tracking-wide text-gray-500 group-hover:text-gray-700 transition-colors duration-200">
                              {vol.value} L
                            </span>
                          </div>
                        )
                      })}
                  </div>
                </div>
              )}

              <div className="mb-6">
                {panels.map(({ key, label, content }) => {
                  const isOpen = openPanel === key
                  return (
                    <div
                      key={key}
                      className={`overflow-hidden rounded-[10px] transition-colors duration-300 ${
                        isOpen ? 'bg-[#EBEBED]' : 'bg-[#F5F5F7] hover:bg-[#EBEBED]'
                      }`}
                    >
                      <button
                        onClick={() => setOpenPanel(isOpen ? ('' as AccordionKey) : key)}
                        className="w-full flex items-center gap-4 px-5 py-4 group text-left"
                        aria-expanded={isOpen}
                      >
                        <span className="flex-1 text-[10px] font-medium tracking-[0.22em] uppercase text-gray-500">
                          {label}
                        </span>
                        <svg
                          width="16" height="16" viewBox="0 0 14 14" fill="none"
                          className={`flex-shrink-0 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'}`}
                        >
                          <path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                        </svg>
                      </button>
                      <div style={{
                        display: 'grid',
                        gridTemplateRows: isOpen ? '1fr' : '0fr',
                        transition: 'grid-template-rows 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}>
                        <div style={{ overflow: 'hidden' }}>
                          <div
                            className="px-5 pb-5"
                            style={{
                              opacity: isOpen ? 1 : 0,
                              transform: isOpen ? 'translateY(0)' : 'translateY(-4px)',
                              transition: 'opacity 0.22s ease 0.08s, transform 0.22s ease 0.08s',
                            }}
                          >
                            {content}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="flex items-center justify-end gap-2 pt-6">
                {prevProduct ? (
                  <Link
                    href={withLocale(locale, `/products/${prevProduct.id}`)}
                    title={prevProduct.name}
                    aria-label={`Previous product: ${prevProduct.name}`}
                    className="flex h-9 w-9 items-center justify-center rounded-md bg-black/[0.06] text-gray-700 transition-all duration-200 hover:bg-black/[0.11]"
                  >
                    <svg width="16" height="16" viewBox="0 0 12 12" fill="none">
                      <path d="M8 2L3 6L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center rounded-md bg-black/[0.06] text-gray-700 opacity-20 pointer-events-none select-none">
                    <svg width="16" height="16" viewBox="0 0 12 12" fill="none">
                      <path d="M8 2L3 6L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                )}

                {nextProduct ? (
                  <Link
                    href={withLocale(locale, `/products/${nextProduct.id}`)}
                    title={nextProduct.name}
                    aria-label={`Next product: ${nextProduct.name}`}
                    className="flex h-9 w-9 items-center justify-center rounded-md bg-black/[0.06] text-gray-700 transition-all duration-200 hover:bg-black/[0.11]"
                  >
                    <svg width="16" height="16" viewBox="0 0 12 12" fill="none">
                      <path d="M4 2L9 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center rounded-md bg-black/[0.06] text-gray-700 opacity-20 pointer-events-none select-none">
                    <svg width="16" height="16" viewBox="0 0 12 12" fill="none">
                      <path d="M4 2L9 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white" ref={detailRef}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
          <h2
            className="text-5xl sm:text-6xl font-medium text-black/[0.12] mb-10 leading-none"
            style={{ fontFamily: 'var(--font-heading), sans-serif' }}
          >
            {labels.aboutLabel ?? 'About'}
          </h2>
          <div ref={aboutGridRef} className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-4 sm:gap-6 lg:gap-8 items-start">
            <div ref={nameColRef}>
              <div className="rounded-[10px] bg-black/[0.06] px-5 py-4">
                <h3
                  className={`text-xl text-gray-900 leading-snug ${locale === 'ru' ? 'font-medium' : 'font-semibold'}`}
                  style={{ fontFamily: 'var(--font-heading), sans-serif' }}
                >
                  {product.name}
                </h3>
              </div>
            </div>
            <div ref={descBoxRef} className="rounded-[10px] bg-black/[0.06] px-5 py-4 space-y-4">
              <p className="text-gray-700 text-xl leading-relaxed">{product.description}</p>
              <p className="text-gray-500 text-[17px] leading-relaxed">{product.longDescription}</p>
            </div>
          </div>
        </div>
      </section>

      <RelatedProducts related={related} />
    </div>
  )
}
