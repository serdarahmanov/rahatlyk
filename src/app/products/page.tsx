'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
      <section className="relative overflow-hidden pt-32 pb-16">
        {/* Background image */}
        <Image
          src="/story/photo-4.jpg"
          alt=""
          fill
          className="object-cover object-center"
          priority
        />
        {/* Glass overlay over the whole section */}
        <div className="absolute inset-0 bg-white/40 backdrop-blur-sm" />

        {/* Content — same layout as before */}
        <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 text-center" ref={heroRef}>
          <span className="text-black text-xs font-bold tracking-[0.2em] uppercase">
            {t.products.heroTag}
          </span>
          <h1
            className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-bold text-black leading-tight mb-4"
            style={{ fontFamily: 'var(--font-heading), sans-serif' }}
          >
            {t.products.title}
          </h1>
          <p className="text-black text-base sm:text-lg max-w-xl mx-auto">
            {t.products.subtitle}
          </p>
        </div>
      </section>

      {/* ── Grid ── */}
      <section className="py-14 bg-brand-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">

          {/* ── Filter Tabs ── */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setActive(f.key)}
                className={`flex-shrink-0 px-2 py-1 text-xs sm:text-sm font-semibold transition-all duration-200 relative group ${
                  active === f.key
                    ? 'text-brand-950'
                    : 'text-brand-400 hover:text-brand-700'
                }`}
              >
                {f.label}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-brand-950 rounded-full transition-all duration-200 ${active === f.key ? 'w-full' : 'w-0'}`} />
              </button>
            ))}
          </div>

          <div
            ref={gridRef}
            className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4 lg:gap-5"
          >
            {filtered.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group relative bg-white rounded-2xl overflow-hidden h-[420px] hover:-translate-y-1.5 hover:shadow-xl transition-[box-shadow,transform] duration-300"
              >
                {/* Product visual — 75% of card height, pushed up */}
                <div className="absolute top-0 inset-x-0 h-[75%]">
                  <ProductVisual product={product} size="sm" className="w-full h-full" />
                </div>

                {/* Text overlaid on top of the image at the bottom */}
                <div className="absolute bottom-0 inset-x-0 px-5 pb-5 pt-16">
                  <p className="text-brand-400 text-xs mb-1">
                    {getCatLabel(product.category)}
                  </p>
                  <h3 className="font-bold text-brand-950 text-base leading-tight mb-1 group-hover:text-brand-700 transition-colors duration-200">
                    {product.name}
                  </h3>
                  <div className="min-w-0">
                    {product.volumes.length > 1 ? (
                      <p className="text-sm font-semibold text-brand-600 truncate">
                        {product.volumes.map((v) => v.replace(' L', '')).join(' · ')}{' L'}
                      </p>
                    ) : (
                      <p className="text-sm font-semibold text-brand-600">{product.volume}</p>
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
