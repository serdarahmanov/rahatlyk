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
          <span className="text-black text-xs font-light tracking-[0.2em] uppercase">{t.news.heroTag}</span>
          <h1
            className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-light text-black leading-tight mb-4"
            style={{ fontFamily: 'var(--font-heading), sans-serif' }}
          >
            {t.news.title}
          </h1>
          <p className="text-black text-base sm:text-lg max-w-xl mx-auto">{t.news.subtitle}</p>
        </div>
      </section>

      <div className="bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-10">

        {/* ── Featured Article ── */}
        <div ref={featuredRef} className="mb-8">
          <Link
            href={`/news/${featured.id}`}
            className="group relative overflow-hidden rounded-2xl block"
            style={{ height: 'clamp(340px, 46vw, 520px)' }}
          >
            <Image
              src={featured.image}
              alt={featured.title}
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

            {/* Featured pill — top left */}
            <div className="absolute top-5 left-5 z-10">
              <span className="backdrop-blur-xl bg-white/15 border border-white/25 text-white text-[10px] font-light px-3 py-1.5 rounded-full uppercase tracking-wider">
                {t.news.featured}
              </span>
            </div>

            {/* Glass caption — bottom */}
            <div className="absolute bottom-5 left-5 right-5 rounded-xl overflow-hidden backdrop-blur-xl bg-white/10 border border-white/20 px-5 py-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-light text-white/55 uppercase tracking-[0.15em]">{getCatLabel(featured.category)}</span>
                <span className="text-white/30">·</span>
                <span className="text-[10px] text-white/55">{featured.date}</span>
                <span className="text-white/30">·</span>
                <span className="text-[10px] text-white/55">{featured.readTime} {t.news.minRead}</span>
              </div>
              <h2
                className="text-xl sm:text-2xl lg:text-3xl font-light text-white leading-snug"
                style={{ fontFamily: 'var(--font-heading), sans-serif' }}
              >
                {featured.title}
              </h2>
              <p className="mt-1.5 text-white/55 text-xs leading-relaxed line-clamp-1 hidden sm:block">{featured.excerpt}</p>
            </div>
          </Link>
        </div>

        {/* ── Filter Tabs ── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setActive(f.key)}
              className={`flex-shrink-0 px-2 py-1 text-xs sm:text-sm font-light transition-all duration-200 relative ${
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

        {/* ── Articles Grid — portrait cards, iPhone-style tight grid ── */}
        <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredRest.map((article) => (
            <Link
              key={article.id}
              href={`/news/${article.id}`}
              className="group relative overflow-hidden rounded-xl block aspect-[3/4]"
            >
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

              {/* Glass caption panel */}
              <div className="absolute bottom-3 left-3 right-3 rounded-lg overflow-hidden backdrop-blur-xl bg-white/10 border border-white/20 px-3 py-2.5">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[9px] font-light text-white/55 uppercase tracking-[0.12em]">{getCatLabel(article.category)}</span>
                  <span className="text-white/30 text-[9px]">·</span>
                  <span className="text-[9px] text-white/55">{article.date}</span>
                </div>
                <h3 className="text-[12px] sm:text-[13px] font-light text-white leading-snug line-clamp-2">
                  {article.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {filteredRest.length === 0 && (
          <div className="text-center py-20 text-brand-400">
            <div className="text-5xl mb-4">📰</div>
            <p className="text-lg font-normal">No articles in this category yet.</p>
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
