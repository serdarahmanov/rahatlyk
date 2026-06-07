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
  water:   { gradient: 'from-brand-400 to-cyan-300',      light: 'bg-brand-50',     text: 'text-brand-800',     badge: 'bg-brand-100 text-brand-800',     label: 'Still Water'    },
  mineral: { gradient: 'from-brand-600 to-teal-400',     light: 'bg-cyan-50',    text: 'text-cyan-700',    badge: 'bg-brand-100 text-cyan-700',    label: 'Mineral Water'  },
  juices:  { gradient: 'from-amber-400 to-orange-400',  light: 'bg-amber-50',   text: 'text-amber-700',   badge: 'bg-amber-100 text-amber-700',  label: 'Juice'          },
  energy:  { gradient: 'from-emerald-500 to-green-400', light: 'bg-emerald-50', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700', label: 'Energy Drink' },
  tea:     { gradient: 'from-lime-500 to-emerald-400',  light: 'bg-lime-50',    text: 'text-lime-700',    badge: 'bg-lime-100 text-lime-700',    label: 'Herbal Tea'     },
  soft:    { gradient: 'from-pink-400 to-rose-400',     light: 'bg-pink-50',    text: 'text-pink-700',    badge: 'bg-pink-100 text-pink-700',    label: 'Soft Drink'     },
};

/* ── Related products strip ───────────────────────────────────── */
function RelatedProducts({ current }: { current: Product }) {
  const { t } = useLanguage();
  const related = PRODUCTS.filter(
    (p) => p.category === current.category && p.id !== current.id
  ).slice(0, 4);

  if (related.length === 0) return null;

  return (
    <section className="py-14 bg-slate-50 border-t border-slate-100">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
        <h2
          className="text-xl font-bold text-brand-950 mb-8"
          style={{ fontFamily: 'var(--font-heading), sans-serif' }}
        >
          More in {CAT_CONFIG[current.category].label}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {related.map((p) => (
            <Link
              key={p.id}
              href={`/products/${p.id}`}
              className="group bg-white rounded-md border border-slate-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div
                className="flex items-center justify-center py-7 px-4"
                style={{ background: `linear-gradient(135deg, ${p.highlight}, ${p.topColor}40)` }}
              >
                <ProductVisual product={p} size="sm" />
              </div>
              <div className="p-3">
                <p className="font-bold text-brand-950 text-sm group-hover:text-brand-700 transition-colors">{p.name}</p>
                <p className="text-slate-400 text-xs mt-0.5">{p.volume} · {p.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Detail page ──────────────────────────────────────────────── */
type Tab = 'about' | 'features' | 'nutrition';

export default function ProductDetailPage() {
  const { t } = useLanguage();
  const params = useParams();
  const id = params?.id as string;

  const product = PRODUCTS.find((p) => p.id === Number(id));

  /* ── Prev / Next ── */
  const currentIndex = product ? PRODUCTS.findIndex((p) => p.id === product.id) : -1;
  const prevProduct  = currentIndex > 0 ? PRODUCTS[currentIndex - 1] : null;
  const nextProduct  = currentIndex < PRODUCTS.length - 1 ? PRODUCTS[currentIndex + 1] : null;

  const [tab, setTab] = useState<Tab>('about');
  const [activePhoto, setActivePhoto] = useState(0);
  const [photoDir, setPhotoDir] = useState<'left' | 'right'>('right');

  const goPhoto = (next: number) => {
    const total = product?.photos?.length ?? 1;
    const resolved = (next + total) % total;
    setPhotoDir(next > activePhoto || (activePhoto === total - 1 && next === 0) ? 'right' : 'left');
    setActivePhoto(resolved);
  };

  const heroRef   = useRef<HTMLDivElement>(null);
  const bottleRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const init = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      if (bottleRef.current) {
        gsap.fromTo(
          bottleRef.current,
          { scale: 0.88, opacity: 0, y: 20 },
          { scale: 1, opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.15 }
        );
      }
      if (heroRef.current) {
        gsap.fromTo(
          heroRef.current.children,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out', delay: 0.2 }
        );
      }
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
          <p className="text-slate-500 mb-8">This product may have been discontinued or moved.</p>
          <Link href="/products" className="btn-primary">
            Browse All Products
          </Link>
        </div>
      </div>
    );
  }

  const cfg = CAT_CONFIG[product.category];

  const tabContent: Record<Tab, React.ReactNode> = {
    about: (
      <div className="space-y-4">
        <p className="text-slate-600 text-base leading-relaxed">{product.description}</p>
        <p className="text-slate-500 text-sm leading-relaxed">{product.longDescription}</p>
      </div>
    ),
    features: (
      <ul className="space-y-3">
        {product.features.map((f, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
            <span className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${cfg.badge}`}>
              ✓
            </span>
            {f}
          </li>
        ))}
      </ul>
    ),
    nutrition: (
      <table className="w-full max-w-sm text-sm border-collapse">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="text-left text-[10px] font-bold uppercase tracking-widest text-slate-400 pb-3 pr-8">Mineral</th>
            <th className="text-left text-[10px] font-bold uppercase tracking-widest text-slate-400 pb-3">Per Litre</th>
          </tr>
        </thead>
        <tbody>
          {product.nutrition.map((n, i) => (
            <tr key={n.label} className={i < product.nutrition.length - 1 ? 'border-b border-slate-100' : ''}>
              <td className="py-3 pr-8 text-slate-500 font-medium">{n.label}</td>
              <td className="py-3 font-semibold text-slate-800">{n.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    ),
  };

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="pt-28 pb-16 relative overflow-hidden bg-gradient-to-b from-brand-200 via-brand-50 to-white border-b border-slate-200 shadow-sm">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-brand-200/70 blur-3xl" />
          <div className="absolute bottom-0 left-10 w-64 h-64 rounded-full bg-brand-200/50 blur-2xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-slate-500 text-xs mb-8">
            <Link href="/" className="hover:text-brand-700 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-brand-700 transition-colors">Products</Link>
            <span>/</span>
            <span className="text-brand-800 font-medium">{product.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left — photo gallery if photos exist, bottle visual otherwise */}
            {product.photos && product.photos.length > 0 ? (
              <div ref={bottleRef} className="flex gap-3">
                {/* Thumbnail column — left, desktop only */}
                {product.photos.length > 1 && (
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
                <div className="relative flex-1 aspect-square rounded-2xl overflow-hidden bg-slate-100">
                  <Image
                    key={activePhoto}
                    src={product.photos[activePhoto]}
                    alt={`${product.name} photo ${activePhoto + 1}`}
                    fill
                    className={`object-cover ${photoDir === 'right' ? 'photo-enter-right' : 'photo-enter-left'}`}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />

                  {/* Arrow — prev */}
                  <button
                    onClick={() => goPhoto(activePhoto - 1)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow hover:bg-white transition-colors duration-200 z-10"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>

                  {/* Arrow — next */}
                  <button
                    onClick={() => goPhoto(activePhoto + 1)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow hover:bg-white transition-colors duration-200 z-10"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M5 2L10 7L5 12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <div ref={bottleRef} className="flex items-center justify-center py-8">
                <ProductVisual product={product} size="lg" />
              </div>
            )}

            {/* Info */}
            <div ref={heroRef}>
              {/* Category badge */}
              <span className={`inline-block text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 ${cfg.badge}`}>
                {cfg.label}
              </span>

              <h1
                className="text-4xl sm:text-5xl font-bold text-brand-950 leading-tight mb-2"
                style={{ fontFamily: 'var(--font-heading), sans-serif' }}
              >
                {product.name}
              </h1>

              <p className="text-slate-500 text-lg mb-2">{product.subtitle}</p>

              <p className="text-base font-medium mb-6 italic text-brand-700">
                "{product.tagline}"
              </p>

              <p className="text-slate-600 text-sm leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Volume picker — bottle icons scaled by size */}
              {product.volumes.length > 1 && (
                <div className="mb-8">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-5">Size</p>
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
                            className="opacity-40 text-slate-500 group-hover:opacity-100 group-hover:text-brand-400 group-hover:scale-110 group-hover:drop-shadow-md transition-all duration-300"
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
                          <span className="text-[10px] font-semibold tracking-wide text-slate-400 group-hover:text-slate-700 transition-colors duration-200">
                            {v}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── Prev / Next ── */}
              <div className="flex items-center justify-end gap-2 pt-6 border-t border-slate-200">
                {prevProduct ? (
                  <Link
                    href={`/products/${prevProduct.id}`}
                    title={prevProduct.name}
                    className="group flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-brand-700 transition-colors duration-200"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="max-w-[110px] truncate">{prevProduct.name}</span>
                  </Link>
                ) : (
                  <span className="flex items-center gap-2 text-xs font-semibold text-slate-200 pointer-events-none select-none">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                )}

                <span className="text-slate-200 select-none">|</span>

                {nextProduct ? (
                  <Link
                    href={`/products/${nextProduct.id}`}
                    title={nextProduct.name}
                    className="group flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-brand-700 transition-colors duration-200"
                  >
                    <span className="max-w-[110px] truncate">{nextProduct.name}</span>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M5 2L10 7L5 12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                ) : (
                  <span className="flex items-center gap-2 text-xs font-semibold text-slate-200 pointer-events-none select-none">
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


      {/* ── Tabs ── */}
      <section className="py-14 bg-white" ref={detailRef}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
          {/* Tab bar */}
          <div className="flex gap-1 bg-slate-100 p-1 rounded-md mb-10 w-fit">
            {(['about', 'features', 'nutrition'] as Tab[]).map((key) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`px-5 py-2 rounded text-sm font-semibold capitalize transition-all duration-200 ${
                  tab === key
                    ? 'bg-white text-brand-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            ))}
          </div>

          <div className="max-w-3xl">{tabContent[tab]}</div>
        </div>
      </section>

      {/* ── Related products ── */}
      <RelatedProducts current={product} />

    </div>
  );
}
