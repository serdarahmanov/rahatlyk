'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { PRODUCTS, ProductCategory } from '@/lib/data/products';
import ProductVisual from '@/components/ProductVisual';

type FilterKey = 'all' | ProductCategory;

/* ── Inner component (uses useSearchParams) ── */
function ProductsContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') as FilterKey | null;
  const [active, setActive] = useState<FilterKey>(
    initialCategory && initialCategory !== 'all' ? initialCategory : 'all'
  );
  const gridRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const filters: { key: FilterKey; label: string }[] = [
    { key: 'all',     label: t.products.filterAll },
    { key: 'water',   label: t.products.filterWater },
    { key: 'mineral', label: t.products.filterMineral },
    { key: 'juices',  label: t.products.filterJuices },
    { key: 'energy',  label: t.products.filterEnergy },
    { key: 'tea',     label: t.products.filterTea },
    { key: 'soft',    label: t.products.filterSoft },
  ];

  const filtered =
    active === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.category === active);

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
    };
    init();
  }, []);

  // Re-animate grid whenever filter changes
  useEffect(() => {
    const animate = async () => {
      const { gsap } = await import('gsap');
      if (gridRef.current) {
        gsap.fromTo(
          gridRef.current.children,
          { y: 30, opacity: 0, scale: 0.97 },
          { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.055, ease: 'power3.out' }
        );
      }
    };
    animate();
  }, [active]);

  const getCatLabel = (cat: ProductCategory): string => {
    const map: Record<ProductCategory, string> = {
      water:   t.products.filterWater,
      mineral: t.products.filterMineral,
      juices:  t.products.filterJuices,
      energy:  t.products.filterEnergy,
      tea:     t.products.filterTea,
      soft:    t.products.filterSoft,
    };
    return map[cat];
  };

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
            {t.products.heroTag}
          </span>
          <h1
            className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-950 leading-tight mb-4"
            style={{ fontFamily: 'var(--font-heading), sans-serif' }}
          >
            {t.products.title}
          </h1>
          <p className="text-slate-500 text-base sm:text-lg max-w-xl mx-auto">
            {t.products.subtitle}
          </p>
        </div>
      </section>

      {/* ── Grid ── */}
      <section className="py-14 bg-slate-50">
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

          <div
            ref={gridRef}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6"
          >
            {filtered.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group bg-white rounded-2xl overflow-hidden hover:-translate-y-1.5 hover:shadow-xl transition-[box-shadow,transform] duration-300 flex flex-col border border-slate-100"
              >
                {/* Product visual — floats on white bg, no colour band */}
                <div className="flex items-center justify-center pt-14 pb-10 px-8 flex-1 min-h-[240px]">
                  <ProductVisual product={product} size="sm" className="w-24 h-44 mx-auto" />
                </div>

                {/* Info — bottom, left-aligned */}
                <div className="px-6 pb-7">
                  <p className="text-slate-400 text-xs mb-1.5">
                    {getCatLabel(product.category)}
                  </p>
                  <h3 className="font-bold text-slate-900 text-base leading-tight mb-1.5 group-hover:text-brand-700 transition-colors duration-200">
                    {product.name}
                  </h3>
                  <div className="min-w-0">
                    {product.volumes.length > 1 ? (
                      <p className="text-sm font-semibold text-slate-600 truncate">
                        {product.volumes.map((v) => v.replace(' L', '')).join(' · ')}{' L'}
                      </p>
                    ) : (
                      <p className="text-sm font-semibold text-slate-600">{product.volume}</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ── Page export — wraps content in Suspense (required for useSearchParams) ── */
export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsContent />
    </Suspense>
  );
}
