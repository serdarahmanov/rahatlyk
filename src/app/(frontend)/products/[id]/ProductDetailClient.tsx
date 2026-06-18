'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ProductVisual from '@/components/ProductVisual'
import type { PayloadProduct } from '@/types/payload'


function RelatedProducts({ related }: { related: PayloadProduct[] }) {
  if (related.length === 0) return null

  return (
    <section className="py-14 bg-white">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
        <h2
          className="text-xl font-light text-brand-950 mb-8"
          style={{ fontFamily: 'var(--font-heading), sans-serif' }}
        >
          More in {related[0]?.category.label}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-5">
          {related.map((p) => (
            <Link
              key={p.id}
              href={`/products/${p.id}`}
              className="group flex flex-col hover:-translate-y-1.5 hover:shadow-xl transition-[box-shadow,transform] duration-300 rounded-2xl overflow-hidden"
            >
              <div className="relative overflow-hidden h-[320px] bg-white rounded-2xl">
                <ProductVisual product={p} size="sm" className="w-full h-full" />
              </div>
              <div className="px-3 pt-3 pb-4">
                <p className="text-brand-400 text-[10px] uppercase tracking-wider mb-1.5">{p.category.label}</p>
                <h3 className="font-medium text-brand-950 text-[17px] leading-tight mb-1.5 group-hover:text-brand-700 transition-colors duration-200">
                  {p.name}
                </h3>
                <div className="min-w-0">
                  {p.volumes.length > 1 ? (
                    <p className="text-xs font-light text-brand-400 truncate">
                      {p.volumes.map((v) => v.value.replace(' L', '')).join(' · ')}{' L'}
                    </p>
                  ) : (
                    <p className="text-xs font-light text-brand-400">{p.volumes[0]?.value} L</p>
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
}

export default function ProductDetailClient({ product, related, prevProduct, nextProduct }: Props) {
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

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let st: any
    const init = async () => {
      const { gsap }          = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      st = ScrollTrigger
      gsap.registerPlugin(ScrollTrigger)

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
            { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, duration: 0.35, stagger: 0.07, ease: 'power2.out' },
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
    }
    init()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return () => st?.getAll().forEach((s: any) => s.kill())
  }, [product.photos])

  const panels: { key: AccordionKey; label: string; content: React.ReactNode }[] = [
    {
      key: 'nutrition',
      label: 'Nutrition',
      content: (
        <table className="w-full max-w-sm text-sm border-collapse">
          <thead>
            <tr className="border-b border-brand-200">
              <th className="text-left text-[10px] font-light uppercase tracking-widest text-brand-400 pb-3 pr-8 font-normal">Mineral</th>
              <th className="text-left text-[10px] font-light uppercase tracking-widest text-brand-400 pb-3 font-normal">Per Litre</th>
            </tr>
          </thead>
          <tbody>
            {product.nutrition.map((n, i) => (
              <tr key={n.id} className={i < product.nutrition.length - 1 ? 'border-b border-brand-200' : ''}>
                <td className="py-3 pr-8 text-brand-400">{n.label}</td>
                <td className="py-3 text-brand-400">{n.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ),
    },
  ]

  return (
    <div className="min-h-screen">
      <section className="pt-28 pb-16 relative overflow-hidden bg-white border-b border-brand-200">
        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
          <nav className="flex items-center gap-2 text-brand-400 text-xs mb-8">
            <Link href="/" className="hover:text-brand-700 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-brand-700 transition-colors">Products</Link>
            <span>/</span>
            <Link href={`/products?category=${product.category.slug}`} className="hover:text-brand-700 transition-colors">{product.category.label}</Link>
            <span>/</span>
            <span className="text-brand-600 font-normal">{product.name}</span>
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
                        activePhoto === i
                          ? 'ring-2 ring-brand-500 ring-offset-2 opacity-100'
                          : 'opacity-50 hover:opacity-80'
                      }`}
                    >
                      <Image src={photo.url} alt={`thumb ${i + 1}`} fill className="object-cover" sizes="64px" />
                    </button>
                  ))}
                </div>
              )}

              <div ref={mainPhotoRef} className="relative flex-1 aspect-[3/4] rounded-2xl overflow-hidden bg-brand-100">
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
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)] hover:scale-110 transition-all duration-200"
                    >
                      <svg width="20" height="20" viewBox="0 0 14 14" fill="none">
                        <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => goPhoto(activePhoto + 1)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)] hover:scale-110 transition-all duration-200"
                    >
                      <svg width="20" height="20" viewBox="0 0 14 14" fill="none">
                        <path d="M5 2L10 7L5 12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </div>

            <div ref={heroRef}>
              <span className="block text-[10px] font-light tracking-[0.3em] uppercase text-brand-400 mb-5">
                {product.category.label}
              </span>

              <h1
                className="text-4xl sm:text-5xl font-light text-black leading-tight mb-3"
                style={{ fontFamily: 'var(--font-heading), sans-serif' }}
              >
                {product.name}
              </h1>

              <p className="text-brand-400 text-sm tracking-wide mb-8">{product.tagline}</p>

              {product.volumes.length > 0 && (
                <div className="mb-8">
                  <p className="text-xs font-light uppercase tracking-widest text-brand-400 mb-5">Size</p>
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
                              className="opacity-40 text-brand-400 group-hover:opacity-100 group-hover:text-brand-800 group-hover:scale-110 group-hover:drop-shadow-md transition-all duration-300"
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
                            <span className="text-[10px] font-light tracking-wide text-brand-400 group-hover:text-brand-700 transition-colors duration-200">
                              {vol.value} L
                            </span>
                          </div>
                        )
                      })}
                  </div>
                </div>
              )}

              <div className="mb-6 border-t border-brand-200">
                {panels.map(({ key, label, content }) => {
                  const isOpen = openPanel === key
                  return (
                    <div key={key} className="border-b border-brand-200">
                      <button
                        onClick={() => setOpenPanel(isOpen ? ('' as AccordionKey) : key)}
                        className="w-full flex items-center gap-4 py-4 group text-left"
                        aria-expanded={isOpen}
                      >
                        <span className="flex-1 text-[10px] font-light tracking-[0.22em] uppercase text-brand-400">
                          {label}
                        </span>
                        <svg
                          width="12" height="12" viewBox="0 0 14 14" fill="none"
                          className={`flex-shrink-0 text-brand-400 transition-transform duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'}`}
                        >
                          <path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </button>
                      <div style={{
                        display: 'grid',
                        gridTemplateRows: isOpen ? '1fr' : '0fr',
                        transition: 'grid-template-rows 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}>
                        <div style={{ overflow: 'hidden' }}>
                          <div
                            className="pb-5"
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
                    href={`/products/${prevProduct.id}`}
                    title={prevProduct.name}
                    className="group flex items-center gap-2 text-xs font-light text-brand-400 hover:text-brand-700 transition-colors duration-200"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="max-w-[110px] truncate">{prevProduct.name}</span>
                  </Link>
                ) : (
                  <span className="flex items-center gap-2 text-xs font-light text-brand-200 pointer-events-none select-none">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                )}

                <span className="text-brand-200 select-none">|</span>

                {nextProduct ? (
                  <Link
                    href={`/products/${nextProduct.id}`}
                    title={nextProduct.name}
                    className="group flex items-center gap-2 text-xs font-light text-brand-400 hover:text-brand-700 transition-colors duration-200"
                  >
                    <span className="max-w-[110px] truncate">{nextProduct.name}</span>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M5 2L10 7L5 12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                ) : (
                  <span className="flex items-center gap-2 text-xs font-light text-brand-200 pointer-events-none select-none">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M5 2L10 7L5 12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-brand-50 border-t border-brand-200" ref={detailRef}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="flex flex-col sm:flex-row sm:items-start gap-10 sm:gap-16 lg:gap-24">
            <div className="flex-shrink-0 sm:pt-[0.15em] sm:w-[200px]">
              <span className="block text-[10px] font-light tracking-[0.35em] uppercase text-brand-400 mb-3">
                About
              </span>
              <h3
                className="text-lg font-light text-brand-950 leading-snug"
                style={{ fontFamily: 'var(--font-heading), sans-serif' }}
              >
                {product.name}
              </h3>
            </div>
            <div className="flex-1 space-y-4">
              <p className="text-brand-700 text-base leading-relaxed">{product.description}</p>
              <p className="text-brand-500 text-sm leading-relaxed">{product.longDescription}</p>
            </div>
          </div>
        </div>
      </section>

      <RelatedProducts related={related} />
    </div>
  )
}
