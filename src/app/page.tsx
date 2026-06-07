'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { PRODUCTS, ProductCategory } from '@/lib/data/products';
import { ARTICLES } from '@/lib/data/news';
import ProductVisual from '@/components/ProductVisual';

/* ── Static data ──────────────────────────────────────────────── */
const CATEGORIES = [
  {
    key: 'water',
    descKey: 'waterDesc',
    bodyKey: 'waterBody',
    icon: '💧',
    from: 'from-brand-50',
    to: 'to-brand-100',
    border: 'border-brand-200',
    text: 'text-brand-800',
    dot: 'bg-brand-400',
  },
  {
    key: 'mineral',
    descKey: 'mineralDesc',
    bodyKey: 'mineralBody',
    icon: '✨',
    from: 'from-cyan-50',
    to: 'to-brand-100',
    border: 'border-cyan-200',
    text: 'text-cyan-700',
    dot: 'bg-brand-400',
  },
  {
    key: 'juices',
    descKey: 'juicesDesc',
    bodyKey: 'juicesBody',
    icon: '🍊',
    from: 'from-amber-50',
    to: 'to-orange-100',
    border: 'border-amber-200',
    text: 'text-amber-700',
    dot: 'bg-amber-400',
  },
  {
    key: 'energy',
    descKey: 'energyDesc',
    bodyKey: 'energyBody',
    icon: '⚡',
    from: 'from-emerald-50',
    to: 'to-emerald-100',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    dot: 'bg-emerald-400',
  },
] as const;

const NEWS_PREVIEW = ARTICLES.slice(0, 3);

/* ── Hero water-drop visual ───────────────────────────────────── */
function WaterDrop() {
  return (
    <div className="relative w-64 h-80 xl:w-80 xl:h-96">
      {/* Glow behind */}
      <div className="absolute inset-0 rounded-full bg-brand-200/40 blur-3xl scale-110 animate-pulse-glow" />

      {/* Main drop SVG */}
      <svg
        viewBox="0 0 200 260"
        className="relative z-10 w-full h-full animate-float-slow drop-shadow-[0_24px_40px_rgba(2,132,199,0.28)]"
      >
        <defs>
          <linearGradient id="dropMain" x1="15%" y1="0%" x2="85%" y2="100%">
            <stop offset="0%" stopColor="#BAE6FD" />
            <stop offset="45%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
          <linearGradient id="dropHL" x1="0%" y1="0%" x2="60%" y2="60%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.65)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
        {/* Body */}
        <path
          d="M100,14 C70,60 28,96 28,148 A72,72 0 0,0 172,148 C172,96 130,60 100,14 Z"
          fill="url(#dropMain)"
        />
        {/* Highlight */}
        <path
          d="M72,58 C62,78 52,106 52,136 A48,28 0 0,0 72,158 C66,130 60,100 72,58 Z"
          fill="url(#dropHL)"
        />
        {/* Label */}
        <text
          x="100"
          y="154"
          textAnchor="middle"
          fill="white"
          fontSize="10"
          letterSpacing="4"
          fontWeight="400"
          opacity="0.9"
          style={{ fontFamily: 'serif' }}
        >
          RAHATLYK
        </text>
        <text
          x="100"
          y="167"
          textAnchor="middle"
          fill="white"
          fontSize="7"
          letterSpacing="2"
          opacity="0.6"
        >
          PURE WATER
        </text>
      </svg>

      {/* Ripple at base */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-28 h-7 border-2 border-brand-300/50 rounded-full animate-ripple" />
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 w-28 h-7 border-2 border-brand-200/30 rounded-full animate-ripple"
        style={{ animationDelay: '1s' }}
      />

      {/* Floating bubbles */}
      <div
        className="absolute top-8 right-2 xl:right-6 w-9 h-9 rounded-full bg-gradient-to-br from-brand-200 to-brand-300/80 animate-float"
        style={{ animationDelay: '0.4s' }}
      />
      <div
        className="absolute top-24 -right-4 w-5 h-5 rounded-full bg-gradient-to-br from-cyan-200 to-cyan-300 animate-float opacity-70"
        style={{ animationDelay: '1.3s' }}
      />
      <div
        className="absolute top-14 -left-6 w-11 h-11 rounded-full bg-gradient-to-br from-brand-100 to-brand-200/80 animate-float opacity-80"
        style={{ animationDelay: '0.9s' }}
      />
      <div
        className="absolute top-44 left-1 w-4 h-4 rounded-full bg-brand-300/60 animate-float"
        style={{ animationDelay: '1.9s' }}
      />
    </div>
  );
}

/* ── Button-driven category carousel (no scroll pinning) ─────────── */
function CollectionsSection({ cats }: { cats: Record<string, string> }) {
  const sectionRef   = useRef<HTMLDivElement>(null);
  const bottleEls    = useRef<(HTMLDivElement | null)[]>([]);
  const animObj      = useRef({ pos: 0 });
  const textRef      = useRef<HTMLDivElement>(null);
  const navRef       = useRef<HTMLDivElement>(null);
  const isFirstRun   = useRef(true);
  const entranceMult = useRef(0); // 0 = hidden, tweened to 1 on section enter
  const [snapIndex, setSnapIndex] = useState(0);

  // Synchronously hide text + nav BEFORE first paint so there's no flash
  useLayoutEffect(() => {
    if (textRef.current) textRef.current.style.opacity = '0';
    if (navRef.current) {
      navRef.current.style.opacity  = '0';
      navRef.current.style.transform = 'translateY(14px)';
    }
  }, []);

  // Height = viewport minus the fixed header so no space hides behind it
  useEffect(() => {
    const fit = () => {
      if (!sectionRef.current) return;
      const header = document.querySelector('header');
      const headerH = header ? header.offsetHeight : 0;
      sectionRef.current.style.height = `${window.innerHeight - headerH}px`;
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  const applyProgress = (pos: number) => {
    const w    = window.innerWidth;
    const isMd = w >= 768;
    const isLg = w >= 1024;
    const isXl = w >= 1280;

    /*
     * Focused bottle stays at left:50% (true horizontal centre).
     * s = gap between bottle centres in vw.
     *   xl (≥1280): 22vw — second upcoming bottle peeks from the right edge
     *   lg (≥1024): 28vw — one upcoming bottle partially visible on right
     *   md  (≥768): 28vw — tablet: one upcoming bottle peeking
     *   mobile    : 50vw — full centred carousel
     */
    const s = isXl ? 22 : isLg ? 28 : isMd ? 28 : 50;

    bottleEls.current.forEach((el, i) => {
      if (!el) return;
      const offset = i - pos;
      const abs    = Math.abs(offset);

      /* md+: hide any bottle with a negative offset (sits in the text-panel zone) */
      if (isMd && offset < -0.15) {
        el.style.opacity       = '0';
        el.style.filter        = 'none';
        el.style.pointerEvents = 'none';
        el.style.transform     = `translateX(calc(-50% + ${offset * s}vw)) scale(0.6)`;
        return;
      }

      const scale   = Math.max(0.60, 1 - abs * 0.24);
      const opacity = Math.max(0.50, 1 - abs * 0.38);
      const blur    = Math.min(abs * 8, 14);
      el.style.transform     = `translateX(calc(-50% + ${offset * s}vw)) scale(${scale})`;
      el.style.opacity       = String(opacity * entranceMult.current);
      el.style.filter        = blur > 0.1 ? `blur(${blur}px)` : 'none';
      el.style.pointerEvents = abs < 0.3 ? 'auto' : 'none';
    });
  };

  // Paint initial state (bottles invisible via entranceMult = 0)
  useEffect(() => { applyProgress(0); }, []);

  // One-shot entrance animation when the section scrolls into view
  useEffect(() => {
    let cleanup: (() => void) | null = null;
    const init = async () => {
      const { gsap }          = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const st = ScrollTrigger.create({
        trigger: sectionRef.current!,
        start:   'top 60%',
        once:    true,
        onEnter: () => {
          const tl = gsap.timeline();

          // Bottles — fade in via entranceMult multiplier
          tl.to(entranceMult, {
            current:  1,
            duration: 1,
            ease:     'power2.out',
            onUpdate: () => applyProgress(animObj.current.pos),
          }, 0);

          // Text panel — fade in (no x/y to avoid overriding CSS translateY(-50%))
          if (textRef.current) {
            tl.to(textRef.current, {
              opacity: 1,
              duration: 0.8, ease: 'power3.out',
            }, 0.15);
          }

          // Nav dots + arrows — fade up
          if (navRef.current) {
            tl.to(navRef.current, {
              opacity: 1, y: 0,
              duration: 0.6, ease: 'power3.out',
            }, 0.35);
          }
        },
      });
      cleanup = () => st.kill();
    };
    init();
    return () => { cleanup?.(); };
  }, []);

  /*
   * GSAP mask-reveal: each .reveal-inner slides up from behind its
   * overflow-hidden parent whenever the active category changes.
   * Skipped on the very first mount so the text is visible immediately.
   */
  useEffect(() => {
    if (isFirstRun.current) { isFirstRun.current = false; return; }
    const el = textRef.current;
    if (!el) return;
    import('gsap').then(({ gsap }) => {
      import('gsap/SplitText').then(({ SplitText }) => {
        gsap.registerPlugin(SplitText);

        // Animate non-split blocks first (tag + explore link)
        const blocks = el.querySelectorAll<HTMLElement>('.reveal-block');
        gsap.fromTo(
          blocks,
          { yPercent: 115 },
          { yPercent: 0, duration: 0.65, stagger: 0.09, ease: 'power3.out', overwrite: 'auto' }
        );

        // Per-line mask reveal for title and body paragraph
        const splitTargets = el.querySelectorAll<HTMLElement>('.split-reveal');
        splitTargets.forEach((target, ti) => {
          const split = new SplitText(target, { type: 'lines', linesClass: 'line-inner' });
          // wrap each line in an overflow-hidden div so the mask works
          split.lines.forEach((line) => {
            const mask = document.createElement('div');
            mask.style.overflow = 'hidden';
            mask.style.display  = 'block';
            (line as HTMLElement).parentNode?.insertBefore(mask, line);
            mask.appendChild(line);
          });
          gsap.fromTo(
            split.lines,
            { yPercent: 115 },
            {
              yPercent:  0,
              duration:  0.7,
              stagger:   0.07,
              ease:      'power3.out',
              overwrite: 'auto',
              delay:     ti * 0.12,
              onComplete: () => split.revert(),
            }
          );
        });
      });
    });
  }, [snapIndex]);

  const goTo = async (idx: number) => {
    if (idx < 0 || idx >= CATEGORIES.length) return;
    setSnapIndex(idx);
    const { gsap } = await import('gsap');
    gsap.killTweensOf(animObj.current);
    gsap.to(animObj.current, {
      pos:      idx,
      duration: 0.55,
      ease:     'power3.inOut',
      onUpdate: () => applyProgress(animObj.current.pos),
    });
  };

  const activeCat = CATEGORIES[snapIndex];

  return (
    <div ref={sectionRef} className="relative overflow-hidden bg-white">

      {/* ── Bottle track — all share the same bottom baseline ── */}
      {CATEGORIES.map((cat, i) => {
        const product = PRODUCTS.find(
          (p) => p.category === (cat.key as ProductCategory),
        )!;
        return (
          <div
            key={cat.key}
            ref={(el) => { bottleEls.current[i] = el; }}
            className="absolute"
            style={{
              left:            '50%',
              bottom:          '12%',
              transformOrigin: 'bottom center',
              willChange:      'transform, opacity, filter',
            }}
          >
            <ProductVisual
              product={product}
              size="lg"
              className="h-[22rem] sm:h-[30rem] lg:h-[40rem] w-auto mx-auto"
            />
          </div>
        );
      })}

      {/* ── Text zone — fades in on each category change ── */}
      {/*
        Mobile  : centred below the bottle  (bottom-[13%], left-0 right-0)
        lg+     : left of the bottle, vertically centred  (left-[5%], top-1/2)
      */}
      {/*
        Mobile (<768)  : centred below the bottle
        Tablet/Desktop : left panel — vertically centred, text fills the empty left half
        Animation      : GSAP per-line mask reveal on snapIndex change (no React remount)
      */}
      <div
        ref={textRef}
        className="
          absolute z-10 flex flex-col
          top-[8%] left-0 right-0 items-center text-center px-6
          md:top-1/2 md:-translate-y-1/2
          md:right-auto md:left-[5%] md:max-w-[280px] lg:left-[7%] lg:max-w-[320px] xl:left-[8%] xl:max-w-[360px]
          md:items-start md:text-left md:px-0
        "
      >
        {/* Sub-label — reveal-block slides as one unit */}
        <div className="overflow-hidden hidden md:block mb-3">
          <span className="reveal-block block text-[10px] font-bold tracking-[0.2em] uppercase text-brand-500">
            {cats.sectionTag ?? ''}
          </span>
        </div>

        {/* Category name — SplitText per-line reveal */}
        <div className="overflow-hidden mb-2 w-full">
          <h3
            className="split-reveal text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-brand-950 leading-tight"
            style={{ fontFamily: 'var(--font-heading), sans-serif' }}
          >
            {cats[activeCat.key] ?? ''}
          </h3>
        </div>

        {/* Short tagline — reveal-block */}
        <div className="overflow-hidden mb-4 w-full">
          <p className="reveal-block block text-brand-600 text-xs lg:text-sm font-semibold tracking-wide">
            {cats[activeCat.descKey] ?? ''}
          </p>
        </div>

        {/* Full paragraph — SplitText per-line reveal, tablet/desktop only */}
        <div className="overflow-hidden hidden md:block mb-6 w-full">
          <p className="split-reveal text-slate-500 text-xs lg:text-sm leading-relaxed">
            {cats[activeCat.bodyKey] ?? ''}
          </p>
        </div>

        {/* Explore link — no animation */}
        <Link
          href={`/products?category=${activeCat.key}`}
          className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.22em] uppercase text-brand-700 group"
        >
          <span>{cats.explore}</span>
          <svg
            className="group-hover:translate-x-1 transition-transform duration-200"
            width="13" height="13" viewBox="0 0 14 14" fill="none"
          >
            <path d="M2 7H12M12 7L8 3M12 7L8 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>

      {/* ── Bottom navigation ── */}
      <div ref={navRef} className="absolute bottom-0 left-0 right-0 z-30 flex items-center justify-center pb-7 gap-5">

        <button
          onClick={() => goTo(snapIndex - 1)}
          disabled={snapIndex === 0}
          aria-label="Previous"
          className="w-9 h-9 flex items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:border-slate-400 hover:text-brand-700 disabled:opacity-20 transition-all duration-200"
        >
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M8 2L3 6L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="flex items-center gap-2">
          {CATEGORIES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Category ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === snapIndex
                  ? 'w-6 h-[4px] bg-brand-700'
                  : 'w-[4px] h-[4px] bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => goTo(snapIndex + 1)}
          disabled={snapIndex === CATEGORIES.length - 1}
          aria-label="Next"
          className="w-9 h-9 flex items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:border-slate-400 hover:text-brand-700 disabled:opacity-20 transition-all duration-200"
        >
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M4 2L9 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

      </div>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */
export default function HomePage() {
  const { t } = useLanguage();

  /* refs for GSAP */
  const heroTextRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const newsRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cleanupFns: (() => void)[] = [];

    const init = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      // Hero entrance
      if (heroTextRef.current) {
        gsap.fromTo(
          heroTextRef.current.children,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
        );
      }
      if (dropRef.current) {
        gsap.fromTo(
          dropRef.current,
          { x: 60, opacity: 0 },
          { x: 0, opacity: 1, duration: 1.2, ease: 'power3.out', delay: 0.4 }
        );
      }

      // Stats section
      if (statsRef.current) {
        const st1 = gsap.fromTo(
          statsRef.current.children,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: { trigger: statsRef.current, start: 'top 82%' },
          }
        );
        cleanupFns.push(() => st1.scrollTrigger?.kill());
      }

      // Story section
      if (storyRef.current) {
        const st3 = gsap.fromTo(
          storyRef.current.querySelectorAll('.story-animate'),
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: { trigger: storyRef.current, start: 'top 78%' },
          }
        );
        cleanupFns.push(() => st3.scrollTrigger?.kill());
      }

      // News cards
      if (newsRef.current) {
        const st4 = gsap.fromTo(
          newsRef.current.querySelectorAll('.news-card'),
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: { trigger: newsRef.current, start: 'top 78%' },
          }
        );
        cleanupFns.push(() => st4.scrollTrigger?.kill());
      }
    };

    init();
    return () => {
      cleanupFns.forEach((fn) => fn());
    };
  }, []);

  const cats = t.home.categories;

  return (
    <div>
      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-white via-brand-50/40 to-white">
        {/* Bg blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-brand-100 to-brand-200/60 opacity-50 blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-[350px] h-[350px] rounded-full bg-gradient-to-tr from-brand-50 to-brand-100/60 opacity-60 blur-2xl" />
          <div className="absolute top-1/3 left-1/3 w-[200px] h-[200px] rounded-full bg-gradient-to-br from-brand-50 to-brand-100 opacity-40 blur-2xl" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-20 lg:pt-0">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-screen py-20 lg:py-0">

            {/* Left: Text */}
            <div className="text-center lg:text-left" ref={heroTextRef}>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-200 rounded-full px-4 py-1.5 mb-7">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-600 animate-pulse" />
                <span className="text-brand-800 text-xs font-semibold tracking-wide">{t.home.hero.badge}</span>
              </div>

              {/* Headline */}
              <h1
                className="text-5xl sm:text-6xl lg:text-6xl xl:text-7xl font-bold text-brand-950 leading-[1.06] tracking-tight mb-5"
                style={{ fontFamily: 'var(--font-heading), sans-serif' }}
              >
                {t.home.hero.title}
                <br />
                <span className="gradient-text">{t.home.hero.titleAccent}</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-500 max-w-md mx-auto lg:mx-0 mb-10 leading-relaxed">
                {t.home.hero.subtitle}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/products" className="btn-primary gap-2">
                  {t.home.hero.cta}
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <Link href="/about" className="btn-outline">
                  {t.home.hero.ctaSecondary}
                </Link>
              </div>
            </div>

            {/* Right: Drop */}
            <div className="hidden lg:flex items-center justify-center" ref={dropRef}>
              <WaterDrop />
            </div>
          </div>
        </div>

      </section>

      {/* ══════════════════════════════════════════
          STATS BAND
      ══════════════════════════════════════════ */}
      <section className="bg-gradient-to-r from-brand-700 to-brand-800 py-14">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div ref={statsRef} className="grid grid-cols-3 gap-6 sm:gap-12 text-center">
            {[
              { val: t.home.story.stat1, lbl: t.home.story.stat1Label },
              { val: t.home.story.stat2, lbl: t.home.story.stat2Label },
              { val: t.home.story.stat3, lbl: t.home.story.stat3Label },
            ].map((s, i) => (
              <div key={i}>
                <div
                  className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-1.5"
                  style={{ fontFamily: 'var(--font-heading), sans-serif' }}
                >
                  {s.val}
                </div>
                <div className="text-brand-200 text-xs sm:text-sm tracking-wide">{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          COLLECTIONS — VOSS-style 4-panel
      ══════════════════════════════════════════ */}
      <CollectionsSection cats={cats} />

      {/* ══════════════════════════════════════════
          STORY / BRAND SECTION — full-bleed photo background
      ══════════════════════════════════════════ */}
      <section
        ref={storyRef}
        className="relative overflow-hidden min-h-[560px] sm:min-h-[640px] lg:min-h-[720px] flex items-center"
      >
        {/* ── Full-section background photo ── */}
        <Image
          src="/story/photo-8.jpg"
          alt="Mountain lake — the source behind RAHATLYK purity"
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />

        {/* ── Overlay: stronger on the left so text is readable ── */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/20" />
        {/* ── Bottom vignette ── */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* ── Content ── */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-24">
          <div className="max-w-xl">

            <span className="story-animate block text-brand-300 text-xs font-bold tracking-[0.22em] uppercase mb-4">
              {t.home.story.tag}
            </span>

            <h2
              className="story-animate text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-6"
              style={{ fontFamily: 'var(--font-heading), sans-serif' }}
            >
              {t.home.story.title}
            </h2>

            <p className="story-animate text-white/65 text-base sm:text-lg leading-relaxed mb-10">
              {t.home.story.text}
            </p>

            <div className="story-animate flex items-center gap-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 bg-white text-brand-900 text-[0.9375rem] font-semibold tracking-[0.04em] uppercase px-8 py-3 rounded-[4px] hover:bg-brand-50 hover:-translate-y-0.5 transition-all duration-300 shadow-lg"
              >
                {t.home.story.cta}
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

          </div>
        </div>

        {/* ── Award badge — bottom-right corner ── */}
        <div className="absolute bottom-7 right-7 z-10 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-3.5 flex items-center gap-3 max-w-[210px]">
          <div className="w-9 h-9 flex items-center justify-center flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
              <path d="M4 22h16" />
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
            </svg>
          </div>
          <div>
            <div className="font-semibold text-white text-[11px] leading-tight">{t.home.story.badge}</div>
            <div className="text-white/55 text-[10px] mt-0.5">{t.home.story.badgeSub}</div>
          </div>
        </div>

        {/* ── Est. watermark — bottom-left ── */}
        <span className="absolute bottom-7 left-7 z-10 text-white/35 text-[10px] font-semibold tracking-[0.22em] uppercase">
          Est. 2003 · Turkmenistan
        </span>

      </section>

      {/* ══════════════════════════════════════════
          NEWS PREVIEW
      ══════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10" ref={newsRef}>
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-brand-700 text-xs font-bold tracking-[0.2em] uppercase">
                {t.home.news.tag}
              </span>
              <h2
                className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-950"
                style={{ fontFamily: 'var(--font-heading), sans-serif' }}
              >
                {t.home.news.title}
              </h2>
            </div>
            <Link href="/news" className="hidden sm:flex btn-outline text-sm">
              {t.home.news.cta}
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {NEWS_PREVIEW.map((article) => (
              <Link
                key={article.id}
                href={`/news/${article.id}`}
                className="news-card group rounded-md overflow-hidden bg-white border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5"
              >
                {/* Cover photo */}
                <div className="h-44 relative overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                  <span className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-white/20">
                    {article.category}
                  </span>
                </div>
                <div className="p-5">
                  <p className="text-slate-400 text-xs mb-2.5">{article.date}</p>
                  <h3 className="font-bold text-brand-950 text-sm leading-snug group-hover:text-brand-700 transition-colors duration-200">
                    {article.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8 sm:hidden">
            <Link href="/news" className="btn-outline">
              {t.home.news.cta}
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════════ */}
      <section className="relative py-24 bg-gradient-to-br from-brand-700 via-brand-800 to-brand-900 overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/5" />
          <div className="absolute top-1/2 left-1/4 w-48 h-48 rounded-full bg-white/5" />
          <div className="absolute -bottom-12 right-1/3 w-64 h-64 rounded-full bg-white/5" />
          <svg
            className="absolute bottom-0 left-0 right-0 w-full opacity-10"
            viewBox="0 0 1440 80"
            preserveAspectRatio="none"
          >
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="white" />
          </svg>
        </div>
        <div className="relative max-w-3xl mx-auto px-5 sm:px-8 text-center">
          {/* Monochrome water-drop icon */}
          <div className="flex justify-center mb-5">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="text-white/70">
              <path d="M20 4C14 12 7 18 7 25.5a13 13 0 0 0 26 0C33 18 26 12 20 4z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 27a7 7 0 0 0 5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.5"/>
            </svg>
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight"
            style={{ fontFamily: 'var(--font-heading), sans-serif' }}
          >
            {t.home.ctaBanner.title}
          </h2>
          <p className="text-brand-200 text-base sm:text-lg mb-10 max-w-lg mx-auto leading-relaxed">
            {t.home.ctaBanner.subtitle}
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-white text-brand-900 text-[0.9375rem] font-semibold tracking-[0.04em] uppercase px-8 py-3 rounded-[4px] hover:bg-brand-50 hover:-translate-y-0.5 transition-all duration-300 shadow-lg"
          >
            {t.home.ctaBanner.cta}
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
