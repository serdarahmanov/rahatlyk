'use client';

import { Suspense, useState, useEffect, useLayoutEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { gsap } from 'gsap';
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
  const titleRef = useRef<HTMLHeadingElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const gridIntroPlayedRef = useRef(false);

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

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const titleWords = titleRef.current?.querySelectorAll('.title-word-inner');
      const filterButtons = filtersRef.current?.querySelectorAll('button');
      const gridCards = gridRef.current?.children;
      const tl = gsap.timeline({ delay: 0.08 });

      if (titleWords?.length) {
        gsap.set(titleWords, { yPercent: 115 });
        tl.to(
          titleWords,
          { yPercent: 0, duration: 0.9, stagger: 0.08, ease: 'power4.out' },
          0
        );
      }

      if (filterButtons?.length) {
        gsap.set(filterButtons, { y: -18, opacity: 0 });
        tl.to(
          filterButtons,
          { y: 0, opacity: 1, duration: 0.55, stagger: 0.055, ease: 'power3.out' },
          0.28
        );
      }

      if (gridCards?.length) {
        gsap.set(gridCards, { y: 30, opacity: 0, scale: 0.97 });
        tl.to(
          gridCards,
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.55,
            stagger: 0.055,
            ease: 'power3.out',
            onComplete: () => {
              gridIntroPlayedRef.current = true;
            },
          },
          0.58
        );
      }
    }, heroRef);

    return () => ctx.revert();
  }, [t.products.title]);

  // Re-animate grid whenever filter changes
  useEffect(() => {
    if (!gridIntroPlayedRef.current) return;

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
      {/* Products */}
      <section className="pt-32 pb-14 bg-brand-50">
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
                    {word}
                    {index < words.length - 1 ? '\u00a0' : ''}
                  </span>
                </span>
              ))}
            </h1>
          </div>

          {/* Filter Tabs */}
          <div ref={filtersRef} className="flex items-center gap-2 overflow-x-auto pb-2 mb-8">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setActive(f.key)}
                className={`flex-shrink-0 rounded-[3px] border px-5 py-3 text-xs font-normal tracking-[0.05em] transition-[background-color,border-color,color] duration-200 ${
                  active === f.key
                    ? 'border-brand-950 bg-brand-950 text-brand-50'
                    : 'border-brand-950/20 bg-transparent text-brand-500 hover:border-brand-950 hover:text-brand-950'
                }`}
              >
                {f.label}
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
                <div className="absolute inset-0 overflow-hidden">
                  <ProductVisual product={product} size="sm" className="w-full h-full" />
                </div>

                {/* Text overlaid on top of the image at the bottom */}
                <div className="absolute bottom-0 inset-x-0 px-5 pb-5 pt-16">
                  <p className="text-brand-400 text-xs mb-1">
                    {getCatLabel(product.category)}
                  </p>
                  <h3 className="font-light text-brand-950 text-base leading-tight mb-1 group-hover:text-brand-700 transition-colors duration-200">
                    {product.name}
                  </h3>
                  <div className="min-w-0">
                    {product.volumes.length > 1 ? (
                      <p className="text-sm font-light text-brand-600 truncate">
                        {product.volumes.map((v) => v.replace(' L', '')).join(' · ')}{' L'}
                      </p>
                    ) : (
                      <p className="text-sm font-light text-brand-600">{product.volume}</p>
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
