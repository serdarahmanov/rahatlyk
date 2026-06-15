'use client';

import { Suspense, useState, useEffect, useLayoutEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { ARTICLES, Article, NewsCategory } from '@/lib/data/news';
import FilterBar from '@/components/FilterBar';

type FilterKey = 'all' | NewsCategory;

/* Section */
function NewsCard({
  article,
}: {
  article: Article;
}) {
  const router  = useRouter();
  const imgs    = article.images?.length ? article.images : [article.image];
  const [current, setCurrent]   = useState(0);
  const [incoming, setIncoming] = useState<number | null>(null);
  const [busy, setBusy]         = useState(false);
  const busyRef   = useRef(false);
  // Each card gets a unique interval (2 s - 5 s) so they never tick together.
  const [intervalMs] = useState(() => 2000 + Math.floor(Math.random() * 3000));

  // Keep busyRef in sync so the interval always reads the fresh value
  useEffect(() => { busyRef.current = busy; }, [busy]);

  // Auto-advance at this card's own random cadence
  useEffect(() => {
    if (imgs.length <= 1) return;
    const id = setInterval(() => {
      if (busyRef.current) return;
      const next = (current + 1) % imgs.length;
      setIncoming(next);
      setBusy(true);
    }, intervalMs);
    return () => clearInterval(id);
  }, [current, imgs.length, intervalMs]);

  // Navigate with arrow buttons
  const go = (dir: 1 | -1, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (busy || imgs.length <= 1) return;
    const next = (current + dir + imgs.length) % imgs.length;
    setIncoming(next);
    setBusy(true);
  };

  // Navigate by clicking a dash
  const goTo = (idx: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (busy || idx === current) return;
    setIncoming(idx);
    setBusy(true);
  };

  const onAnimEnd = () => {
    if (incoming !== null) {
      setCurrent(incoming);
      setIncoming(null);
      setBusy(false);
    }
  };

  return (
    <div
      className="group cursor-pointer"
      onClick={() => router.push(`/news/${article.id}`)}
    >
      {/* Section */}
      <div
        className="relative overflow-hidden rounded-sm"
        style={{ paddingBottom: '125%' }}
      >
        {/* Section */}
        <div className="absolute inset-0" style={{ zIndex: 1 }}>
          <Image
            src={imgs[current]}
            alt={article.title}
            fill
            className="object-cover object-center"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>

        {/* Section */}
        {incoming !== null && (
          <div
            className="absolute inset-0 news-slide-in"
            style={{ zIndex: 2 }}
            onAnimationEnd={onAnimEnd}
          >
            <Image
              src={imgs[incoming]}
              alt=""
              fill
              className="object-cover object-center"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        )}

        {/* Section */}
        {imgs.length > 1 && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
            {imgs.map((_, i) => (
              <button
                key={i}
                onClick={(e) => goTo(i, e)}
                className={`block w-10 h-[3px] rounded-full transition-opacity duration-300 bg-white ${
                  i === current ? 'opacity-100' : 'opacity-35'
                }`}
              />
            ))}
          </div>
        )}

        {/* Section */}
        {imgs.length > 1 && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10">
            <button
              onClick={(e) => go(-1, e)}
              aria-label="Previous"
              className="flex items-center justify-center text-white/70 hover:text-white transition-colors duration-200"
            >
              <svg width="20" height="20" viewBox="0 0 12 12" fill="none">
                <path d="M8 2L3 6L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              onClick={(e) => go(1, e)}
              aria-label="Next"
              className="flex items-center justify-center text-white/70 hover:text-white transition-colors duration-200"
            >
              <svg width="20" height="20" viewBox="0 0 12 12" fill="none">
                <path d="M4 2L9 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Section */}
      <div className="pt-3 px-0.5">
        <h3
          className="text-[15px] font-normal text-brand-950 leading-snug mb-1"
          style={{ fontFamily: 'var(--font-heading), sans-serif' }}
        >
          {article.title}
        </h3>
        <span className="text-[12px] text-brand-400 flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
          Read article{' '}
          <span className="inline-block group-hover:translate-x-0.5 transition-transform duration-200 text-brand-500">
            â†’
          </span>
        </span>
      </div>
    </div>
  );
}

/* Section */
function NewsContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') as FilterKey | null;
  const [active, setActive] = useState<FilterKey>(
    initialCategory && initialCategory !== 'all' ? initialCategory : 'all'
  );
  const heroRef     = useRef<HTMLDivElement>(null);
  const titleRef    = useRef<HTMLHeadingElement>(null);
  const filtersRef  = useRef<HTMLDivElement>(null);
  const contentRef  = useRef<HTMLDivElement>(null);
  const gridRef     = useRef<HTMLDivElement>(null);
  const contentIntroPlayedRef = useRef(false);

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

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const titleWords = titleRef.current?.querySelectorAll('.title-word-inner');
      const filterButtons = filtersRef.current?.querySelectorAll('button');
      const contentItems = contentRef.current?.children;
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

      if (contentItems?.length) {
        gsap.set(contentItems, { y: 30, opacity: 0, scale: 0.97 });
        tl.to(
          contentItems,
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.55,
            stagger: 0.055,
            ease: 'power3.out',
            onComplete: () => {
              contentIntroPlayedRef.current = true;
            },
          },
          0.58
        );
      }
    });

    return () => ctx.revert();
  }, [t.news.title]);

  useEffect(() => {
    if (!contentIntroPlayedRef.current) return;

    const animate = async () => {
      const { gsap } = await import('gsap');
      if (gridRef.current && gridRef.current.children.length) {
        gsap.fromTo(
          gridRef.current.children,
          { y: 30, opacity: 0, scale: 0.97 },
          { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.055, ease: 'power3.out' }
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

      {/* Section */}
      <section className="pt-32 pb-10 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="mb-5 text-left" ref={heroRef}>
            <h1
              ref={titleRef}
              className="text-4xl sm:text-5xl lg:text-6xl font-light text-black leading-tight"
              style={{ fontFamily: 'var(--font-heading), sans-serif' }}
            >
              {t.news.title.split(/\s+/).map((word, index, words) => (
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
          <FilterBar ref={filtersRef} filters={filters} active={active} onChange={(key) => setActive(key as FilterKey)} />

          <div ref={contentRef}>
          {/* Featured Article */}
          <div className="mb-8">
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

            {/* Section */}
            <div className="absolute top-5 left-5 z-10">
              <span className="backdrop-blur-xl bg-white/15 border border-white/25 text-white text-[10px] font-light px-3 py-1.5 rounded-full uppercase tracking-wider">
                {t.news.featured}
              </span>
            </div>

            {/* Section */}
            <div className="absolute bottom-5 left-5 right-5 rounded-xl overflow-hidden backdrop-blur-xl bg-white/10 border border-white/20 px-5 py-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-light text-white/55 uppercase tracking-[0.15em]">{getCatLabel(featured.category)}</span>
                <span className="text-white/30">Â·</span>
                <span className="text-[10px] text-white/55">{featured.date}</span>
                <span className="text-white/30">Â·</span>
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

        {/* Section */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredRest.map((article) => (
            <NewsCard
              key={article.id}
              article={article}
            />
          ))}
          </div>

        {filteredRest.length === 0 && (
          <div className="text-center py-20 text-brand-400">
            <div className="text-5xl mb-4">ðŸ“°</div>
            <p className="text-lg font-normal">No articles in this category yet.</p>
          </div>
        )}

        </div>
        </div>
      </section>
    </div>
  );
}

/* Section */
export default function NewsPage() {
  return (
    <Suspense>
      <NewsContent />
    </Suspense>
  );
}
