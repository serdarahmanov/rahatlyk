'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { ARTICLES, NewsCategory } from '@/lib/data/news';

/* ── Category colours ──────────────────────────────────────── */
const CAT_CONFIG: Record<NewsCategory, { badge: string; dot: string }> = {
  company:        { badge: 'bg-brand-100 text-brand-800',     dot: 'bg-brand-500'    },
  health:         { badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500'  },
  products:       { badge: 'bg-amber-100 text-amber-700',     dot: 'bg-amber-500'    },
  sustainability: { badge: 'bg-lime-100 text-lime-700',       dot: 'bg-lime-500'     },
};

/* ── Related article card ──────────────────────────────────── */
function RelatedCard({ article }: { article: (typeof ARTICLES)[number] }) {
  const { t } = useLanguage();
  const cfg = CAT_CONFIG[article.category];
  return (
    <Link
      href={`/news/${article.id}`}
      className="group bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      <div className="h-40 relative overflow-hidden">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="absolute top-3 right-3 text-xl">{article.emoji}</div>
        <span className="absolute bottom-3 left-3 z-10 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider bg-white/20 backdrop-blur text-white border border-white/25">
          {article.category}
        </span>
      </div>
      <div className="p-4">
        <p className="text-slate-400 text-xs mb-2">{article.date}</p>
        <h3 className="font-bold text-brand-950 text-sm leading-snug group-hover:text-brand-700 transition-colors duration-200 line-clamp-2">
          {article.title}
        </h3>
        <span className="mt-3 flex items-center gap-1 text-xs font-semibold text-brand-700">
          {t.news.readMore}
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5H8M8 5L5.5 2.5M8 5L5.5 7.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

/* ── Page ──────────────────────────────────────────────────── */
export default function ArticlePage() {
  const { t } = useLanguage();
  const params  = useParams();
  const id      = params?.id as string;
  const article = ARTICLES.find((a) => a.id === Number(id));

  const heroRef    = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const relatedRef = useRef<HTMLDivElement>(null);

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
          { y: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: 'power3.out', delay: 0.1 }
        );
      }
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current.querySelectorAll('.article-para'),
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: { trigger: contentRef.current, start: 'top 82%' },
          }
        );
      }
      if (relatedRef.current && relatedRef.current.children.length) {
        gsap.fromTo(
          relatedRef.current.children,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: { trigger: relatedRef.current, start: 'top 85%' },
          }
        );
      }
    };
    init();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return () => st?.getAll().forEach((s: any) => s.kill());
  }, [id]);

  /* ── 404 ── */
  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center px-8">
          <p className="text-7xl mb-6">📰</p>
          <h1
            className="text-3xl font-bold text-brand-950 mb-3"
            style={{ fontFamily: 'var(--font-heading), sans-serif' }}
          >
            Article Not Found
          </h1>
          <p className="text-slate-500 mb-8">
            This article may have been removed or the link is incorrect.
          </p>
          <Link href="/news" className="btn-primary">
            {t.home.news.cta}
          </Link>
        </div>
      </div>
    );
  }

  const cfg     = CAT_CONFIG[article.category];
  const related = ARTICLES.filter((a) => a.id !== article.id && a.category === article.category).slice(0, 3);
  const more    = related.length < 3
    ? [...related, ...ARTICLES.filter((a) => a.id !== article.id && a.category !== article.category)].slice(0, 3)
    : related;

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

      {/* ── Hero banner ── */}
      <section className="relative min-h-[420px] lg:min-h-[520px] flex items-end overflow-hidden">
        {/* Cover photo */}
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
        {/* Dark gradient overlay — heavy at bottom so text is readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

        <div className="relative z-10 w-full max-w-4xl mx-auto px-5 sm:px-8 pb-14 pt-36" ref={heroRef}>
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-white/60 text-xs mb-6">
            <Link href="/" className="hover:text-white transition-colors">{t.nav.home}</Link>
            <span>/</span>
            <Link href="/news" className="hover:text-white transition-colors">{t.nav.news}</Link>
            <span>/</span>
            <Link href={`/news?category=${encodeURIComponent(article.category)}`} className="hover:text-white transition-colors capitalize">{article.category}</Link>
            <span>/</span>
            <span className="text-white/90 truncate max-w-[200px]">{article.title}</span>
          </nav>

          {/* Category + featured badge */}
          <div className="flex items-center gap-2 mb-5">
            <span className="bg-white/20 backdrop-blur text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider border border-white/25">
              {getCatLabel(article.category)}
            </span>
            {article.featured && (
              <span className="bg-white/15 backdrop-blur text-white/80 text-[10px] font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider border border-white/20">
                {t.news.featured}
              </span>
            )}
          </div>

          {/* Title */}
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5"
            style={{ fontFamily: 'var(--font-heading), sans-serif' }}
          >
            {article.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-4 text-white/70 text-sm">
            <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
            <span>{article.date}</span>
            <span className="text-white/40">·</span>
            <span>{article.readTime} {t.news.minRead}</span>
          </div>
        </div>
      </section>

      {/* ── Article body ── */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="grid lg:grid-cols-[1fr_220px] gap-14 items-start">

            {/* Body text */}
            <article ref={contentRef}>
              {/* Lead paragraph — slightly larger */}
              <p className="article-para text-slate-700 text-lg leading-relaxed mb-6 font-medium">
                {article.body[0]}
              </p>

              {/* Remaining paragraphs */}
              {article.body.slice(1).map((para, i) => (
                <p key={i} className="article-para text-slate-600 text-base leading-relaxed mb-5">
                  {para}
                </p>
              ))}

              {/* Bottom nav */}
              <div className="mt-12 pt-8 border-t border-slate-100 flex flex-wrap items-center gap-4">
                <Link
                  href="/news"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-900 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M12 7H2M2 7L6 3M2 7L6 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {t.home.news.cta}
                </Link>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="hidden lg:block space-y-5 sticky top-28">
              {/* Category pill */}
              <div className="bg-slate-50 rounded-md border border-slate-100 p-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                  Category
                </p>
                <span className={`inline-block text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide ${cfg.badge}`}>
                  {getCatLabel(article.category)}
                </span>
              </div>

              {/* Date & read time */}
              <div className="bg-slate-50 rounded-md border border-slate-100 p-5 space-y-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Published</p>
                  <p className="text-slate-700 text-sm font-semibold">{article.date}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Read time</p>
                  <p className="text-slate-700 text-sm font-semibold">{article.readTime} {t.news.minRead}</p>
                </div>
              </div>

            </aside>

          </div>
        </div>
      </section>

      {/* ── Related articles ── */}
      {more.length > 0 && (
        <section className="py-14 bg-slate-50 border-t border-slate-100">
          <div className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-10">
            <h2
              className="text-xl font-bold text-brand-950 mb-8"
              style={{ fontFamily: 'var(--font-heading), sans-serif' }}
            >
              More Articles
            </h2>
            <div ref={relatedRef} className="grid sm:grid-cols-3 gap-5">
              {more.map((a) => (
                <RelatedCard key={a.id} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
