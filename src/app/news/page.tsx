'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { ARTICLES, NewsCategory } from '@/lib/data/news';

const CATEGORY_COLORS: Record<NewsCategory, string> = {
  company:        'bg-brand-200 text-brand-800',
  health:         'bg-brand-100 text-brand-700',
  products:       'bg-brand-200 text-brand-800',
  sustainability: 'bg-brand-100 text-brand-700',
};

type FilterKey = 'all' | NewsCategory;

/* ── Inner component (uses useSearchParams) ─────────────────── */
function NewsContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') as FilterKey | null;
  const [active, setActive] = useState<FilterKey>(
    initialCategory && initialCategory !== 'all' ? initialCategory : 'all'
  );
  const heroRef     = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const gridRef     = useRef<HTMLDivElement>(null);

  const filters: { key: FilterKey; label: string }[] = [
    { key: 'all',            label: t.news.filterAll            },
    { key: 'company',        label: t.news.filterCompany        },
    { key: 'health',         label: t.news.filterHealth         },
    { key: 'products',       label: t.news.filterProducts       },
    { key: 'sustainability', label: t.news.filterSustainability },
  ];

  const featured     = ARTICLES.find((a) => a.featured)!;
  const rest         = ARTICLES.filter((a) => !a.featured);
  const filteredRest = active === 'all' ? rest : rest.filter((a) => a.category === active);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let st: any;
    const init = async () => {
      const { gsap }          = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      st = ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      if (heroRef.current) {
        gsap.fromTo(
          heroRef.current.children,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: 'power3.out', delay: 0.1 }
        );
      }
      if (featuredRef.current) {
        gsap.fromTo(
          featuredRef.current,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: featuredRef.current, start: 'top 85%' },
          }
        );
      }
    };
    init();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return () => st?.getAll().forEach((s: any) => s.kill());
  }, []);

  useEffect(() => {
    const animate = async () => {
      const { gsap } = await import('gsap');
      if (gridRef.current && gridRef.current.children.length) {
        gsap.fromTo(
          gridRef.current.children,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55, stagger: 0.07, ease: 'power3.out' }
        );
      }
    };
    animate();
  }, [active]);

  const getCatLabel = (cat: NewsCategory) => {
    const map: Record<NewsCategory, string> = {
      company:        t.news.filterCompany,
      health:         t.news.filterHealth,
      products:       t.news.filterProducts,
      sustainability: t.news.filterSustainability,
    };
    return map[cat];
  };

  return (
    <div className="min-h-screen">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-32 pb-16">
        <Image
          src="/news/1.5liter-bottles.jpg"
          alt=""
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-white/40 backdrop-blur-sm" />
        <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 text-center" ref={heroRef}>
          <span className="text-black text-xs font-bold tracking-[0.2em] uppercase">{t.news.heroTag}</span>
          <h1
            className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-bold text-black leading-tight mb-4"
            style={{ fontFamily: 'var(--font-heading), sans-serif' }}
          >
            {t.news.title}
          </h1>
          <p className="text-black text-base sm:text-lg max-w-xl mx-auto">{t.news.subtitle}</p>
        </div>
      </section>

      <div className="bg-brand-50">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-12">

        {/* ── Featured Article ── */}
        <div ref={featuredRef}>
        <Link
          href={`/news/${featured.id}`}
          className="group rounded-xl overflow-hidden border border-brand-200 shadow-sm mb-14 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 block"
        >
          <div className="relative min-h-[300px] lg:min-h-[380px] flex items-end p-8 sm:p-12 overflow-hidden">
            {/* Photo */}
            <Image
              src={featured.image}
              alt={featured.title}
              fill
              className="object-cover object-center"
              sizes="(max-width: 1280px) 100vw, 1280px"
              priority
            />
            {/* Gradient overlay for legibility */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10`} />
            <div className="absolute top-8 left-8 z-10">
              <span className="bg-white/20 backdrop-blur text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider border border-white/25">
                {t.news.featured}
              </span>
            </div>
            <div className="relative z-10">
              <span className="text-xs font-bold text-white/80 uppercase tracking-wider">
                {getCatLabel(featured.category)}
              </span>
              <h2
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mt-2 max-w-2xl leading-tight group-hover:opacity-90 transition-opacity"
                style={{ fontFamily: 'var(--font-heading), sans-serif' }}
              >
                {featured.title}
              </h2>
              <div className="flex items-center gap-4 mt-4">
                <span className="text-white/70 text-sm">{featured.date}</span>
                <span className="text-white/50">·</span>
                <span className="text-white/70 text-sm">{featured.readTime} {t.news.minRead}</span>
              </div>
            </div>
          </div>
          <div className="bg-white p-8 sm:p-10">
            <p className="text-brand-600 text-base leading-relaxed max-w-3xl">{featured.excerpt}</p>
            <span className="mt-6 inline-flex items-center gap-2 btn-primary text-sm py-2.5 px-6">
              {t.news.readMore}
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M2 6.5H11M11 6.5L7.5 3M11 6.5L7.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </Link>
        </div>

        {/* ── Filter Tabs ── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setActive(f.key)}
              className={`flex-shrink-0 px-2 py-1 text-xs sm:text-sm font-semibold transition-all duration-200 relative ${
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

        {/* ── Articles Grid ── */}
        <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRest.map((article) => (
            <Link
              key={article.id}
              href={`/news/${article.id}`}
              className="group bg-white rounded-xl border border-brand-200 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              {/* Card image area */}
              <div className="h-48 relative overflow-hidden">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Gradient scrim so the badge stays readable */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                <span className="absolute bottom-4 left-4 z-10 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider bg-white/20 backdrop-blur text-white border border-white/25">
                  {getCatLabel(article.category)}
                </span>
              </div>

              {/* Card body */}
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-brand-400 text-xs">{article.date}</span>
                  <span className="text-brand-300 text-xs">·</span>
                  <span className="text-brand-400 text-xs">{article.readTime} {t.news.minRead}</span>
                </div>
                <h3 className="font-bold text-brand-950 text-sm leading-snug mb-2 group-hover:text-brand-700 transition-colors duration-200">
                  {article.title}
                </h3>
                <p className="text-brand-500 text-xs leading-relaxed line-clamp-2">{article.excerpt}</p>
                <span className="mt-4 flex items-center gap-1 text-xs font-semibold text-brand-700 group-hover:gap-2 transition-all duration-200">
                  {t.news.readMore}
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5H8M8 5L5.5 2.5M8 5L5.5 7.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>

        {filteredRest.length === 0 && (
          <div className="text-center py-20 text-brand-400">
            <div className="text-5xl mb-4">📰</div>
            <p className="text-lg font-medium">No articles in this category yet.</p>
          </div>
        )}

      </div>
      </div>
    </div>
  );
}

/* ── Page export ─────────────────────────────────────────────── */
export default function NewsPage() {
  return (
    <Suspense>
      <NewsContent />
    </Suspense>
  );
}
