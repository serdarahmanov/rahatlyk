'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { PRODUCTS, Product, ProductCategory } from '@/lib/data/products';
import ProductVisual from '@/components/ProductVisual';

/* ── Category config ──────────────────────────────────────────── */
const CAT_CONFIG: Record<ProductCategory, {
  gradient: string;
  light: string;
  text: string;
  badge: string;
  label: string;
}> = {
  water:   { gradient: 'from-brand-300 to-brand-100', light: 'bg-brand-50',  text: 'text-brand-800', badge: 'border border-brand-200 text-brand-700', label: 'Still Water'   },
  mineral: { gradient: 'from-brand-400 to-brand-200', light: 'bg-brand-100', text: 'text-brand-800', badge: 'border border-brand-200 text-brand-700', label: 'Mineral Water' },
  juices:  { gradient: 'from-brand-500 to-brand-300', light: 'bg-brand-100', text: 'text-brand-900', badge: 'border border-brand-200 text-brand-700', label: 'Juice'         },
  energy:  { gradient: 'from-brand-700 to-brand-500', light: 'bg-brand-100', text: 'text-brand-900', badge: 'border border-brand-200 text-brand-700', label: 'Energy Drink'  },
  tea:     { gradient: 'from-brand-800 to-brand-600', light: 'bg-brand-200', text: 'text-brand-900', badge: 'border border-brand-200 text-brand-700', label: 'Herbal Tea'    },
  soft:    { gradient: 'from-brand-900 to-brand-700', light: 'bg-brand-200', text: 'text-brand-950', badge: 'border border-brand-200 text-brand-700', label: 'Soft Drink'    },
};

/* ── Related products strip ───────────────────────────────────── */
function RelatedProducts({ current }: { current: Product }) {
  const { t } = useLanguage();
  const related = PRODUCTS.filter(
    (p) => p.category === current.category && p.id !== current.id
  ).slice(0, 4);

  if (related.length === 0) return null;

  return (
    <section className="py-14 bg-white">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
        <h2
          className="text-xl font-bold text-brand-950 mb-8"
          style={{ fontFamily: 'var(--font-heading), sans-serif' }}
        >
          More in {CAT_CONFIG[current.category].label}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-5">
          {related.map((p) => (
            <Link
              key={p.id}
              href={`/products/${p.id}`}
              className="group relative bg-white rounded-2xl overflow-hidden h-[420px] hover:-translate-y-1.5 hover:shadow-xl transition-[box-shadow,transform] duration-300"
            >
              {/* Product visual — 75% of card height */}
              <div className="absolute top-0 inset-x-0 h-[75%]">
                <ProductVisual product={p} size="sm" className="w-full h-full" />
              </div>

              {/* Text overlaid at the bottom */}
              <div className="absolute bottom-0 inset-x-0 px-5 pb-5 pt-16">
                <p className="text-brand-400 text-xs mb-1">{CAT_CONFIG[p.category].label}</p>
                <h3 className="font-bold text-brand-950 text-base leading-tight mb-1 group-hover:text-brand-700 transition-colors duration-200">
                  {p.name}
                </h3>
                <div className="min-w-0">
                  {p.volumes.length > 1 ? (
                    <p className="text-sm font-semibold text-brand-600 truncate">
                      {p.volumes.map((v) => v.replace(' L', '')).join(' · ')}{' L'}
                    </p>
                  ) : (
                    <p className="text-sm font-semibold text-brand-600">{p.volume}</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Detail page ──────────────────────────────────────────────── */
type AccordionKey = 'features' | 'nutrition';

export default function ProductDetailPage() {
  const { t } = useLanguage();
  const params = useParams();
  const id = params?.id as string;

  const product = PRODUCTS.find((p) => p.id === Number(id));

  /* ── Prev / Next ── */
  const currentIndex = product ? PRODUCTS.findIndex((p) => p.id === product.id) : -1;
  const prevProduct  = currentIndex > 0 ? PRODUCTS[currentIndex - 1] : null;
  const nextProduct  = currentIndex < PRODUCTS.length - 1 ? PRODUCTS[currentIndex + 1] : null;

  const [openPanel, setOpenPanel] = useState<AccordionKey>('' as AccordionKey);
  const [activePhoto, setActivePhoto] = useState(0);
  const [photoDir, setPhotoDir] = useState<'left' | 'right'>('right');

  const goPhoto = (next: number) => {
    const total = product?.photos?.length ?? 1;
    const resolved = (next + total) % total;
    setPhotoDir(next > activePhoto || (activePhoto === total - 1 && next === 0) ? 'right' : 'left');
    setActivePhoto(resolved);
  };

  const heroRef      = useRef<HTMLDivElement>(null);
  const bottleRef    = useRef<HTMLDivElement>(null);
  const mainPhotoRef = useRef<HTMLDivElement>(null);
  const detailRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } });

      /* 1 ─ Main image: expand from centre outward */
      if (mainPhotoRef.current) {
        tl.fromTo(
          mainPhotoRef.current,
          { clipPath: 'inset(50% 50% 50% 50%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.0 },
          0
        );
      } else if (bottleRef.current) {
        /* ProductVisual fallback */
        tl.fromTo(
          bottleRef.current,
          { clipPath: 'inset(50% 50% 50% 50%)', opacity: 0 },
          { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, duration: 1.0 },
          0
        );
      }

      /* 2 ─ Info panel: each child expands from centre, staggered */
      if (heroRef.current) {
        tl.fromTo(
          Array.from(heroRef.current.children),
          { clipPath: 'inset(50% 50% 50% 50%)', opacity: 0 },
          { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' },
          0.4
        );
      }

      /* 3 ─ Thumbnails: staggered after image */
      if (bottleRef.current && product?.photos && product.photos.length > 1) {
        const thumbCol = bottleRef.current.firstElementChild;
        if (thumbCol) {
          tl.fromTo(
            Array.from(thumbCol.children),
            { clipPath: 'inset(50% 50% 50% 50%)', opacity: 0 },
            { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, duration: 0.35, stagger: 0.07, ease: 'power2.out' },
            0.85
          );
        }
      }

      /* About section scroll trigger */
      if (detailRef.current) {
        gsap.fromTo(
          detailRef.current,
          { y: 30, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: detailRef.current, start: 'top 85%' },
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

  /* 404 */
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center px-8">
          <p className="text-7xl mb-6">💧</p>
          <h1
            className="text-3xl font-bold text-brand-950 mb-3"
            style={{ fontFamily: 'var(--font-heading), sans-serif' }}
          >
            Product Not Found
          </h1>
          <p className="text-brand-500 mb-8">This product may have been discontinued or moved.</p>
          <Link href="/products" className="btn-primary">
            Browse All Products
          </Link>
        </div>
      </div>
    );
  }

  const cfg = CAT_CONFIG[product.category];

  /* ── Accordion panels (Features + Nutrition only — About is a separate section) ── */
  const panels: { key: AccordionKey; label: string; content: React.ReactNode }[] = [
    {
      key: 'features',
      label: 'Features',
      content: (
        <ul className="space-y-3">
          {product.features.map((f, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-brand-400 leading-relaxed">
              <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-brand-400 flex-shrink-0 translate-y-[6px]" />
              {f}
            </li>
          ))}
        </ul>
      ),
    },
    {
      key: 'nutrition',
      label: 'Nutrition',
      content: (
        <table className="w-full max-w-sm text-sm border-collapse">
          <thead>
            <tr className="border-b border-brand-200">
              <th className="text-left text-[10px] font-bold uppercase tracking-widest text-brand-400 pb-3 pr-8 font-normal">Mineral</th>
              <th className="text-left text-[10px] font-bold uppercase tracking-widest text-brand-400 pb-3 font-normal">Per Litre</th>
            </tr>
          </thead>
          <tbody>
            {product.nutrition.map((n, i) => (
              <tr key={n.label} className={i < product.nutrition.length - 1 ? 'border-b border-brand-200' : ''}>
                <td className="py-3 pr-8 text-brand-400">{n.label}</td>
                <td className="py-3 text-brand-400">{n.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ),
    },
  ];

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="pt-28 pb-16 relative overflow-hidden bg-white border-b border-brand-200">

        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-brand-400 text-xs mb-8">
            <Link href="/" className="hover:text-brand-700 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-brand-700 transition-colors">Products</Link>
            <span>/</span>
            <Link href={`/products?category=${product.category}`} className="hover:text-brand-700 transition-colors">{cfg.label}</Link>
            <span>/</span>
            <span className="text-brand-600 font-medium">{product.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left — always the same gallery frame; photos when available, fallback PNG otherwise */}
            <div ref={bottleRef} className="flex gap-3">
              {/* Thumbnail column — only when 2+ photos */}
              {product.photos && product.photos.length > 1 && (
                <div className="hidden lg:flex flex-col gap-2 flex-shrink-0">
                  {product.photos.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => goPhoto(i)}
                      className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-200 ${
                        activePhoto === i
                          ? 'ring-2 ring-brand-500 ring-offset-2 opacity-100'
                          : 'opacity-50 hover:opacity-80'
                      }`}
                    >
                      <Image src={src} alt={`thumb ${i + 1}`} fill className="object-cover" sizes="64px" />
                    </button>
                  ))}
                </div>
              )}

              {/* Main photo */}
              <div ref={mainPhotoRef} className="relative flex-1 aspect-[3/4] rounded-2xl overflow-hidden bg-brand-100">
                {product.photos && product.photos.length > 0 ? (
                  <Image
                    key={activePhoto}
                    src={product.photos[activePhoto]}
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
                    className="object-contain p-8"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                )}

                {/* Arrows — only when 2+ photos */}
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

            {/* Info */}
            <div ref={heroRef}>
              {/* Category label — plain, no box */}
              <span className="block text-[10px] font-bold tracking-[0.3em] uppercase text-brand-400 mb-5">
                {cfg.label}
              </span>

              <h1
                className="text-4xl sm:text-5xl font-bold text-black leading-tight mb-3"
                style={{ fontFamily: 'var(--font-heading), sans-serif' }}
              >
                {product.name}
              </h1>

              <p className="text-brand-400 text-sm tracking-wide mb-8">{product.tagline}</p>

              {/* Volume picker — bottle icons scaled by size */}
              {product.volumes.length > 1 && (
                <div className="mb-8">
                  <p className="text-xs font-bold uppercase tracking-widest text-brand-400 mb-5">Size</p>
                  <div className="flex items-end gap-5">
                    {product.volumes.map((v) => {
                      const val  = parseFloat(v);
                      const vals = product.volumes.map(parseFloat);
                      const min  = Math.min(...vals);
                      const max  = Math.max(...vals);
                      /* scale bottle height between 28px and 68px */
                      const h = max === min
                        ? 48
                        : 28 + ((val - min) / (max - min)) * 40;
                      return (
                        <div
                          key={v}
                          className="flex flex-col items-center gap-1.5 group"
                        >
                          {/* Bottle SVG */}
                          <div
                            style={{ height: `${h}px` }}
                            className="opacity-40 text-brand-400 group-hover:opacity-100 group-hover:text-brand-800 group-hover:scale-110 group-hover:drop-shadow-md transition-all duration-300"
                          >
                            <svg
                              viewBox="0 0 16 40"
                              fill="currentColor"
                              className="h-full w-auto"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              {/* Cap */}
                              <rect x="5.5" y="0" width="5" height="4" rx="1" />
                              {/* Neck taper */}
                              <path d="M5.5 4 L4.5 9 L11.5 9 L10.5 4 Z" />
                              {/* Shoulder curve */}
                              <path d="M4.5 9 C2.5 11 2 13 2 14 L2 36 Q2 38 4 38 L12 38 Q14 38 14 36 L14 14 C14 13 13.5 11 11.5 9 Z" />
                              {/* Label stripe */}
                              <rect x="3" y="17" width="10" height="8" rx="0.5" opacity="0.18" fill="white" />
                            </svg>
                          </div>
                          {/* Volume label */}
                          <span className="text-[10px] font-semibold tracking-wide text-brand-400 group-hover:text-brand-700 transition-colors duration-200">
                            {v}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── Features / Nutrition accordion ── */}
              <div className="mb-6 border-t border-brand-200">
                {panels.map(({ key, label, content }) => {
                  const isOpen = openPanel === key;
                  return (
                    <div key={key} className="border-b border-brand-200">
                      <button
                        onClick={() => setOpenPanel(isOpen ? ('' as AccordionKey) : key)}
                        className="w-full flex items-center gap-4 py-4 group text-left"
                        aria-expanded={isOpen}
                      >
                        <span className="flex-1 text-[10px] font-bold tracking-[0.22em] uppercase text-brand-400">
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
                  );
                })}
              </div>

              {/* ── Prev / Next ── */}
              <div className="flex items-center justify-end gap-2 pt-6">
                {prevProduct ? (
                  <Link
                    href={`/products/${prevProduct.id}`}
                    title={prevProduct.name}
                    className="group flex items-center gap-2 text-xs font-semibold text-brand-400 hover:text-brand-700 transition-colors duration-200"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="max-w-[110px] truncate">{prevProduct.name}</span>
                  </Link>
                ) : (
                  <span className="flex items-center gap-2 text-xs font-semibold text-brand-200 pointer-events-none select-none">
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
                    className="group flex items-center gap-2 text-xs font-semibold text-brand-400 hover:text-brand-700 transition-colors duration-200"
                  >
                    <span className="max-w-[110px] truncate">{nextProduct.name}</span>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M5 2L10 7L5 12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                ) : (
                  <span className="flex items-center gap-2 text-xs font-semibold text-brand-200 pointer-events-none select-none">
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


      {/* ── About — horizontal two-column layout ── */}
      <section className="py-16 bg-brand-50 border-t border-brand-200" ref={detailRef}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="flex flex-col sm:flex-row sm:items-start gap-10 sm:gap-16 lg:gap-24">
            {/* Left — label + product name */}
            <div className="flex-shrink-0 sm:pt-[0.15em] sm:w-[200px]">
              <span className="block text-[10px] font-bold tracking-[0.35em] uppercase text-brand-400 mb-3">
                About
              </span>
              <h3
                className="text-lg font-bold text-brand-950 leading-snug"
                style={{ fontFamily: 'var(--font-heading), sans-serif' }}
              >
                {product.name}
              </h3>
            </div>
            {/* Right — description text */}
            <div className="flex-1 space-y-4">
              <p className="text-brand-700 text-base leading-relaxed">{product.description}</p>
              <p className="text-brand-500 text-sm leading-relaxed">{product.longDescription}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Related products ── */}
      <RelatedProducts current={product} />

    </div>
  );
}
