'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { PRODUCTS, ProductCategory } from '@/lib/data/products';
import { ARTICLES } from '@/lib/data/news';

declare global {
  interface Window {
    __pageIntroDone?: boolean;
  }
}

/* ── Intro gate ───────────────────────────────────────────────────
   The hero animation must NOT start until PageIntro's curtain has
   exited. We track this with a module-level flag so it persists
   across re-renders but resets on full page reload.

   IMPORTANT: this module loads lazily — it only executes the first
   time the user visits "/". If the user refreshes on a different page
   and then navigates here, PageIntro has already fired `page-intro-done`
   before this module was even parsed. We guard against that by reading
   the global stamp that PageIntro writes before dispatching the event. */
let introHasCompleted =
  typeof window !== 'undefined' && !!window.__pageIntroDone;

if (typeof window !== 'undefined' && !introHasCompleted) {
  window.addEventListener(
    'page-intro-done',
    () => { introHasCompleted = true; },
    { once: true },
  );
}

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

const NEWS_ITEMS = ARTICLES.slice(0, 5);

/* ── Word-level mask-reveal helper ────────────────────────────────
   Replaces an element's text with per-word <span> pairs so GSAP
   can stagger each word individually from behind its own mask.
   Returns the inner spans (what GSAP animates) + a restore fn. */
// `displayText` lets callers bypass el.textContent (which may carry stale locale
// text after a restore() from the previous animation) and use the live translation.
function splitWordsIntoSpans(el: HTMLElement, displayText?: string): {
  spans: HTMLElement[];
  restore: () => void;
} {
  const text  = displayText ?? (el.textContent ?? '');
  const words = text.trim().split(/\s+/).filter(Boolean);

  while (el.firstChild) el.removeChild(el.firstChild);

  const spans: HTMLElement[] = [];

  words.forEach((word, i) => {
    // Per-word overflow-hidden mask
    const mask = document.createElement('span');
    mask.style.display       = 'inline-block';
    mask.style.overflow      = 'hidden';
    mask.style.verticalAlign = 'bottom';
    mask.style.paddingBottom = '0.2em';
    mask.style.marginBottom  = '-0.2em';

    // The span GSAP slides up
    const inner = document.createElement('span');
    inner.style.display = 'inline-block';
    inner.textContent   = word;

    mask.appendChild(inner);
    el.appendChild(mask);

    if (i < words.length - 1) el.appendChild(document.createTextNode(' '));

    spans.push(inner);
  });

  return {
    spans,
    restore: () => {
      while (el.firstChild) el.removeChild(el.firstChild);
      el.textContent = text;
    },
  };
}

/* ── Pinned horizontal-scroll section ────────────────────────────── */
function HorizontalScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ctx: any;

    const init = async () => {
      const { gsap }          = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      // Component may have unmounted while the async imports were resolving.
      // Bail out to prevent creating an orphaned ScrollTrigger with no cleanup.
      if (!mounted || !containerRef.current || !trackRef.current) return;

      const track  = trackRef.current;
      const header = document.querySelector<HTMLElement>('header');

      // Reset any leftover inline transform from the previous visit's revert
      gsap.set(track, { x: 0 });

      const hideHeader = () =>
        gsap.to(header, { yPercent: -105, duration: 0.55, ease: 'power2.inOut', overwrite: true });
      const showHeader = () =>
        gsap.to(header, { yPercent: 0,    duration: 0.55, ease: 'power2.inOut', overwrite: true });

      ctx = gsap.context(() => {
        gsap.to(track, {
          x:    () => -(track.scrollWidth - window.innerWidth),
          ease: 'none',
          scrollTrigger: {
            trigger:             containerRef.current,
            start:               'top top',
            end:                 () => `+=${track.scrollWidth - window.innerWidth}`,
            pin:                 true,
            scrub:               1,
            invalidateOnRefresh: true,
            onEnter:     hideHeader,
            onLeave:     showHeader,
            onEnterBack: hideHeader,
            onLeaveBack: showHeader,
          },
        });
      });

      // After client-side navigation the browser needs one frame to finish
      // layout before ScrollTrigger's trigger positions are accurate.
      requestAnimationFrame(() => {
        if (mounted) ScrollTrigger.refresh();
      });
    };

    init();
    return () => {
      mounted = false; // signal to in-flight init that it should not proceed
      ctx?.revert();
    };
  }, []);

  return (
    /* outer container — GSAP pins this; overflow-hidden clips the sliding track */
    <div ref={containerRef} className="h-screen overflow-hidden bg-white py-4">

      {/* track — flex row of variable-width panels; GSAP translates this leftward */}
      <div
        ref={trackRef}
        className="flex h-full gap-4 px-4"
        style={{ willChange: 'transform' }}
      >

        {/* ── PANEL 1 · Full-height portrait photo (~42 vw) ────────── */}
        <div
          className="relative h-full flex-shrink-0 overflow-hidden rounded-2xl"
          style={{ width: '42vw' }}
        >
          <Image
            src="/reference/KarunaJuice_Photo_RainbowlFoods.jpg"
            alt="Pure water — Rahatlyk quality"
            fill
            className="object-cover object-center"
            sizes="42vw"
          />
        </div>

        {/* ── PANEL 2 · Solid dark text panel (~28 vw) ─────────────── */}
        <div
          className="relative h-full flex-shrink-0 bg-brand-950 flex flex-col justify-center overflow-hidden rounded-2xl"
          style={{ width: '28vw', padding: '0 4vw' }}
        >
          <span className="block text-brand-400 text-[10px] font-light tracking-[0.35em] uppercase mb-6">
            PRISTINE BY NATURE
          </span>
          <h2
            className="text-white font-light leading-[1.1]"
            style={{
              fontFamily: 'var(--font-heading), sans-serif',
              fontSize:   'clamp(1.6rem, 2.6vw, 3rem)',
            }}
          >
            Purity you can taste — straight from the source
          </h2>
        </div>

        {/* ── PANEL 3 · Split: product photo top + CTA bottom (~32 vw) */}
        <div
          className="relative h-full flex-shrink-0 flex flex-col gap-4"
          style={{ width: '32vw' }}
        >
          {/* top: product shot — own rounded container */}
          <div className="relative overflow-hidden rounded-2xl" style={{ flex: '1 1 60%' }}>
            <Image
              src="/reference/Smoothie-Drink-Product-Photography-Studio-in-London-Innocent-Smoothies-Neve-Studios-1.webp"
              alt="Sarwan water poured fresh"
              fill
              className="object-cover object-center"
              sizes="32vw"
            />
          </div>

          {/* bottom: numbered CTA block — own rounded container */}
          <div
            className="relative flex-shrink-0 flex flex-col justify-center items-start overflow-hidden rounded-2xl"
            style={{ flex: '0 0 40%', padding: '0 3.5vw', background: '#0b2e4a' }}
          >
            {/* ── Live water blobs ── */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0d3d60] via-[#0b2e4a] to-[#04192e]" />
              <div className="water-blob-1 absolute -top-[30%] -left-[20%] w-[70%] h-[100%] rounded-full bg-[#38c8f5] blur-[60px]" />
              <div className="water-blob-2 absolute -top-[20%] left-[30%] w-[50%] h-[80%] rounded-full bg-[#d4f2ff] blur-[50px]" />
              <div className="water-blob-3 absolute top-[30%] right-[-10%] w-[50%] h-[70%] rounded-full bg-[#2a9fd8] blur-[55px]" />
              <div className="water-blob-5 absolute bottom-[-20%] left-[20%] w-[40%] h-[60%] rounded-full bg-[#a0e4fc] blur-[45px]" />
            </div>
            {/* ── Content ── */}
            <div className="relative z-10 w-full">
              <div className="w-7 h-7 rounded-full border border-white/30 flex items-center justify-center text-white/60 text-[11px] font-normal mb-4">
                01
              </div>
              <p
                className="text-white font-light leading-snug mb-5"
                style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.25rem)' }}
              >
                Discover our story and what drives us
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 bg-white text-brand-900 text-[11px] font-light tracking-[0.18em] uppercase px-5 py-2.5 rounded-full hover:bg-brand-50 transition-colors duration-200"
              >
                Our Story
              </Link>
            </div>
          </div>
        </div>

        {/* ── PANEL 4 · Full-bleed wide photo with text overlay (~52 vw) */}
        <div
          className="relative h-full flex-shrink-0 overflow-hidden rounded-2xl"
          style={{ width: '52vw' }}
        >
          <Image
            src="/reference/New-250ml-Juice-Banner-Website.jpg"
            alt="Every drop of Rahatlyk — centuries filtered"
            fill
            className="object-cover object-center"
            sizes="52vw"
          />
          {/* gradient: only at the bottom so text is readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-14 left-[8%] right-[8%]">
            <span className="block text-white/55 text-[10px] font-light tracking-[0.35em] uppercase mb-4">
              CENTURIES OF FILTRATION
            </span>
            <h2
              className="text-white font-light leading-[1.1]"
              style={{
                fontFamily: 'var(--font-heading), sans-serif',
                fontSize:   'clamp(1.8rem, 3.2vw, 3.8rem)',
              }}
            >
              Each sip delivers a purity you can feel
            </h2>
          </div>
        </div>

        {/* ── PANEL 5 · Closing light panel (~25 vw) ───────────────── */}
        <div
          className="relative h-full flex-shrink-0 bg-brand-50 flex flex-col justify-center overflow-hidden rounded-2xl"
          style={{ width: '25vw', padding: '0 3.5vw' }}
        >
          <span className="block text-brand-600 text-[10px] font-light tracking-[0.35em] uppercase mb-5">
            EXPLORE MORE
          </span>
          <h3
            className="text-brand-950 font-light leading-snug mb-8"
            style={{
              fontFamily: 'var(--font-heading), sans-serif',
              fontSize:   'clamp(1.3rem, 1.9vw, 2.1rem)',
            }}
          >
            Clean water, real refreshment
          </h3>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-brand-950 text-white text-[11px] font-light tracking-[0.18em] uppercase px-6 py-3 rounded-full hover:bg-brand-700 transition-colors duration-200 w-fit"
          >
            Explore
          </Link>
        </div>

        {/* Spacer — forces scrollWidth to include the right px-4 padding */}
        <div className="flex-shrink-0 w-4" aria-hidden="true" />

      </div>
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
      const h = window.innerHeight - headerH;
      const isMobile = window.innerWidth < 768;
      const bottleH = Math.round(h * (isMobile ? 0.5 : 0.8));
      // Desktop only: add 5% extra height at the bottom (after nav icons)
      const sectionH = isMobile ? h : Math.round(h * 1.05);
      sectionRef.current.style.height = `${sectionH}px`;
      sectionRef.current.style.setProperty('--col-h', `${h}px`);
      sectionRef.current.style.setProperty('--bottle-h', `${bottleH}px`);
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
      // reveal-block elements (tagline)
      const blocks = el.querySelectorAll<HTMLElement>('.reveal-block');
      gsap.fromTo(
        blocks,
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, stagger: 0.08, ease: 'power3.out', overwrite: 'auto' }
      );

      // split-reveal elements (title + body) — simple fade+slide, no DOM mutation
      const splitTargets = el.querySelectorAll<HTMLElement>('.split-reveal');
      gsap.fromTo(
        splitTargets,
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.09, ease: 'power3.out', overwrite: 'auto' }
      );
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
            className="absolute bottom-[12%] md:bottom-[11%]"
            style={{
              left:            '50%',
              height:          'var(--bottle-h, 480px)',
              width:           'var(--bottle-h, 480px)',
              display:         'flex',
              justifyContent:  'center',
              transformOrigin: 'bottom center',
              willChange:      'transform, opacity, filter',
            }}
          >
            {/* plain img so width/height 100% is guaranteed — no Next.js fill quirks */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/products/FeatureProductImg_RTD_LT.png"
              alt={product.name}
              loading="lazy"
              style={{ width: 'auto', height: '100%', display: 'block' }}
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
          md:top-0 md:bottom-0 md:justify-between md:py-[11%]
          md:right-auto md:left-[5%] md:max-w-[280px] lg:left-[7%] lg:max-w-[320px] xl:left-[8%] xl:max-w-[360px]
          md:items-start md:text-left md:px-0
        "
      >
        {/* Sub-label — pinned to top on desktop */}
        <div className="hidden md:block">
          <span className="block text-[10px] font-light tracking-[0.2em] uppercase text-black/40">
            {cats.sectionTag ?? ''}
          </span>
        </div>

        {/* Middle — changing content */}
        <div className="flex flex-col w-full">
          {/* Category name — SplitText per-line reveal */}
          <div className="overflow-hidden mb-2 w-full">
            <h3
              className="split-reveal text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-light text-black leading-tight"
              style={{ fontFamily: 'var(--font-heading), sans-serif' }}
            >
              {cats[activeCat.key] ?? ''}
            </h3>
          </div>

          {/* Short tagline — reveal-block */}
          <div className="overflow-hidden mb-4 w-full">
            <p className="reveal-block block text-black/55 text-xs lg:text-sm font-light tracking-wide">
              {cats[activeCat.descKey] ?? ''}
            </p>
          </div>

          {/* Full paragraph — SplitText per-line reveal, tablet/desktop only */}
          <div className="overflow-hidden hidden md:block w-full">
            <p className="split-reveal text-black/45 text-xs lg:text-sm leading-relaxed">
              {cats[activeCat.bodyKey] ?? ''}
            </p>
          </div>
        </div>

        {/* Explore link — pinned to bottom on desktop */}
        <Link
          href={`/products?category=${activeCat.key}`}
          className="inline-flex items-center gap-1.5 text-[11px] font-light tracking-[0.22em] uppercase text-black/75 group mt-4 md:mt-0"
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
      <div ref={navRef} className="absolute bottom-0 md:bottom-[7%] left-0 right-0 z-30 flex items-center justify-center pb-7 md:pb-0 gap-5">

        <button
          onClick={() => goTo(snapIndex - 1)}
          disabled={snapIndex === 0}
          aria-label="Previous"
          className="flex items-center justify-center text-black/60 hover:text-black disabled:opacity-20 transition-all duration-200"
        >
          <svg width="16" height="16" viewBox="0 0 12 12" fill="none">
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
                  ? 'w-6 h-[4px] bg-black'
                  : 'w-[4px] h-[4px] bg-black/25 hover:bg-black/50'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => goTo(snapIndex + 1)}
          disabled={snapIndex === CATEGORIES.length - 1}
          aria-label="Next"
          className="flex items-center justify-center text-black/60 hover:text-black disabled:opacity-20 transition-all duration-200"
        >
          <svg width="16" height="16" viewBox="0 0 12 12" fill="none">
            <path d="M4 2L9 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

      </div>
    </div>
  );
}

/* ── News Carousel (auto-play + infinite loop) ────────────────── */
function NewsCarousel({ tag }: { tag: string }) {
  const [visCount, setVisCount] = useState(3);
  const trackRef   = useRef<HTMLDivElement>(null);
  const busy       = useRef(false);
  const timer      = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Ref to the latest advance fn so the timer callback never holds a stale closure
  const advanceRef = useRef<(dir: 1 | -1) => void>(() => {});

  const extItems = useMemo(() => [
    ...NEWS_ITEMS.slice(-visCount),
    ...NEWS_ITEMS,
    ...NEWS_ITEMS.slice(0, visCount),
  ], [visCount]);

  // Snap track to first real card after breakpoint change
  useLayoutEffect(() => {
    const id = requestAnimationFrame(() => {
      const track = trackRef.current;
      if (!track || !track.children[0]) return;
      import('gsap').then(({ gsap }) => {
        const cardW = (track.children[0] as HTMLElement).getBoundingClientRect().width;
        const gap   = parseFloat(window.getComputedStyle(track).columnGap) || 24;
        gsap.set(track, { x: -(visCount * (cardW + gap)) });
      });
    });
    return () => cancelAnimationFrame(id);
  }, [visCount]);

  // Responsive visible count
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setVisCount(w >= 1024 ? 3 : w >= 640 ? 2 : 1);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Schedule next auto-advance; resets any existing timer
  const schedule = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => advanceRef.current(1), 3200);
  }, []);

  const advance = useCallback(async (dir: 1 | -1) => {
    if (busy.current) return;
    busy.current = true;

    const { gsap } = await import('gsap');
    const track = trackRef.current;
    if (!track) { busy.current = false; return; }

    const cardW = (track.children[0] as HTMLElement).getBoundingClientRect().width;
    const gap   = parseFloat(window.getComputedStyle(track).columnGap) || 24;
    const step  = cardW + gap;

    const currentX   = gsap.getProperty(track, 'x') as number;
    const targetX    = currentX - dir * step;
    const nudge      = -dir * 18;
    const nextExtIdx = Math.round(-targetX / step);

    const inFront = nextExtIdx < visCount;
    const inBack  = nextExtIdx >= visCount + NEWS_ITEMS.length;
    const snapX   = inFront ? -(nextExtIdx + NEWS_ITEMS.length) * step
                  : inBack  ? -(nextExtIdx - NEWS_ITEMS.length) * step
                  : null;

    gsap.timeline({
      onComplete: () => {
        if (snapX !== null) gsap.set(track, { x: snapX });
        busy.current = false;
        schedule(); // queue the next auto-advance after every animation
      },
    })
    .to(track, { x: targetX + nudge, duration: 0.52, ease: 'power3.out' })
    .to(track, { x: targetX,         duration: 0.22, ease: 'power2.inOut' });
  }, [schedule, visCount]);

  // Keep ref current so the timer always calls the latest advance
  useEffect(() => {
    advanceRef.current = advance;
  }, [advance]);

  // Kick off auto-play on mount and restart whenever the breakpoint changes
  useEffect(() => {
    schedule();
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [schedule, visCount]);

  return (
    <div className="flex flex-col h-full">

      {/* ── Header: constrained, sits at top ── */}
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 pt-24 w-full flex-shrink-0" style={{ paddingBottom: '20px' }}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-light tracking-[0.25em] uppercase text-brand-400">
            {tag}
          </span>
          <div className="flex items-center gap-5">
            <button
              onClick={() => advance(-1)}
              aria-label="Previous news"
              className="text-brand-400 hover:text-brand-950 transition-colors duration-200"
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M14 5L8 11L14 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              onClick={() => advance(1)}
              aria-label="Next news"
              className="text-brand-400 hover:text-brand-950 transition-colors duration-200"
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M8 5L14 11L8 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Track: fills remaining height, spans full width ── */}
      {/* min-h-0 is required so a flex child can shrink below its content size */}
      <div className="overflow-hidden flex-1 min-h-0">
        <div
          ref={trackRef}
          className="flex items-start gap-30 h-full"
          style={{ paddingLeft: 'clamp(1.25rem, 4vw, 2.5rem)', willChange: 'transform' }}
        >
          {extItems.map((article, i) => (
            <Link
              key={`${article.id}-${i}`}
              href={`/news/${article.id}`}
              className="flex-shrink-0 group cursor-pointer w-[60vw] sm:w-[31vw] lg:w-[20vw]"
              style={{ height: '60vh' }}
            >
              {/* Tall vertical card — image fills, text overlaid at bottom */}
              <div className="relative overflow-hidden rounded-lg h-full">

                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 33vw"
                />

                {/* Gradient vignette so glass panel reads clearly */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

                {/* ── Frosted-glass caption panel ── */}
                <div className="absolute bottom-4 left-4 right-4 rounded-xl overflow-hidden backdrop-blur-xl bg-white/10 border border-white/20 px-4 py-3.5">
                  <p className="text-[10px] text-white/55 tracking-[0.18em] uppercase mb-1.5">
                    {article.date}
                  </p>
                  <h3 className="text-[13px] sm:text-sm font-light text-white leading-snug">
                    {article.title}
                  </h3>
                </div>

              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */
export default function HomePage() {
  const { t, locale } = useLanguage();

  /* refs for GSAP */
  // Two separate line refs instead of SplitText — avoids innerHTML conflicts with React
  const titleLine1Ref = useRef<HTMLDivElement>(null);
  const titleLine2Ref = useRef<HTMLDivElement>(null);
  const heroSubRef    = useRef<HTMLParagraphElement>(null);
  const brandRef      = useRef<HTMLElement>(null);
  const brandLabelRef = useRef<HTMLSpanElement>(null);
  const brandTextRef  = useRef<HTMLParagraphElement>(null);
  const storyRef  = useRef<HTMLDivElement>(null);

  // ── Hero animation — reruns from scratch on every locale change ──
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let tl: any = null;
    const restores: Array<() => void> = [];
    let introListener: (() => void) | null = null;

    const run = async () => {
      const { gsap } = await import('gsap');
      const line1 = titleLine1Ref.current;
      const line2 = titleLine2Ref.current;
      const sub   = heroSubRef.current;
      if (!line1 || !line2) return;

      gsap.killTweensOf([line1, line2, ...(sub ? [sub] : [])]);

      // Pass the live translation text so we always animate the correct locale,
      // even if el.textContent was left with stale text by a previous restore().
      const hero = t.home.hero;
      const { spans: spans1, restore: restore1 } = splitWordsIntoSpans(line1, hero.title);
      const { spans: spans2, restore: restore2 } = splitWordsIntoSpans(line2, hero.titleAccent);
      restores.push(restore1, restore2);

      const subSpans: HTMLElement[] = [];
      let restore3: (() => void) | null = null;
      if (sub) {
        const result = splitWordsIntoSpans(sub, hero.subtitle);
        subSpans.push(...result.spans);
        restore3 = result.restore;
        restores.push(restore3);
      }

      // Word spans are now in the DOM at their default position.
      // Create the timeline first — fromTo's immediateRender:true applies
      // yPercent:115 synchronously, hiding every word behind its mask.
      // Only THEN reveal the container so no text is ever visible before masking.
      tl = gsap.timeline({ delay: 0.2 });

      // Headline words — staggered word-by-word
      tl.fromTo(
        [...spans1, ...spans2],
        { yPercent: 115 },
        {
          yPercent: 0,
          duration: 0.75,
          stagger: 0.06,
          ease: 'power4.out',
          onComplete: () => {
            restore1();
            restore2();
          },
        }
      );

      // Subtitle words — follow the headline with a slight overlap, same stagger
      if (subSpans.length) {
        tl.fromTo(
          subSpans,
          { yPercent: 115 },
          {
            yPercent: 0,
            duration: 0.65,
            stagger: 0.04,
            ease: 'power3.out',
            onComplete: () => {
              restore3?.();
              restores.length = 0; // all restored — skip cleanup
            },
          },
          '<0.4'
        );
      }

      // All fromTo tweens have applied yPercent:115 (immediateRender:true) — every
      // word is already hidden behind its overflow-hidden mask. Now it's safe to
      // make the container visible; no text will flash before the animation begins.
      const heroContent = document.getElementById('hero-content');
      if (heroContent) heroContent.style.opacity = '1';
    };

    // On the very first page load the entry curtain (PageIntro) is still
    // showing — we must NOT start the hero animation until it has finished.
    // On subsequent locale changes the curtain is already gone, so we run
    // immediately.
    if (introHasCompleted) {
      run();
    } else {
      introListener = () => run();
      window.addEventListener('page-intro-done', introListener, { once: true });
    }

    return () => {
      tl?.kill();
      restores.forEach((r) => r()); // restore DOM if animation was cut short
      restores.length = 0;
      if (introListener) {
        window.removeEventListener('page-intro-done', introListener);
        introListener = null;
      }
    };
  }, [locale, t.home.hero]); // re-fire whenever language changes

  // ── Scroll-triggered animations — run once on mount ──────────
  useEffect(() => {
    const cleanupFns: (() => void)[] = [];

    const init = async () => {
      const { gsap }          = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      // Brand statement section — word-mask reveal
      if (brandRef.current && brandLabelRef.current && brandTextRef.current) {
        const labelEl = brandLabelRef.current;
        const textEl  = brandTextRef.current;
        gsap.set([labelEl, textEl], { opacity: 0 });
        const st0 = ScrollTrigger.create({
          trigger: brandRef.current,
          start: 'top 75%',
          once: true,
          onEnter: () => {
            const tl = gsap.timeline();
            // Label: single-word mask reveal
            const { spans: lSpans, restore: lRestore } = splitWordsIntoSpans(labelEl);
            gsap.set(labelEl, { opacity: 1 });
            tl.fromTo(lSpans, { yPercent: 115 }, {
              yPercent: 0, duration: 0.8, ease: 'power4.out', onComplete: lRestore,
            });
            // Text: simple fade+slide (preserves inline HTML like <strong>)
            gsap.set(textEl, { opacity: 1 });
            tl.fromTo(textEl, { y: 12, opacity: 0 }, {
              y: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
            }, 0.15);
          },
        });
        cleanupFns.push(() => st0.kill());
      }

      // Story section
      if (storyRef.current) {
        const st2 = gsap.fromTo(
          storyRef.current.querySelectorAll('.story-animate'),
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.9, stagger: 0.15, ease: 'power3.out',
            scrollTrigger: { trigger: storyRef.current, start: 'top 78%' },
          }
        );
        cleanupFns.push(() => st2.scrollTrigger?.kill());
      }


    };

    init();
    return () => { cleanupFns.forEach((fn) => fn()); };
  }, []);

  // ── Track footer height so CTA + footer = exactly 100vh ─────
  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer) return;
    const update = () =>
      document.documentElement.style.setProperty(
        '--footer-h',
        `${footer.getBoundingClientRect().height}px`,
      );
    update();
    const ro = new ResizeObserver(update);
    ro.observe(footer);
    return () => ro.disconnect();
  }, []);

  const cats = t.home.categories;

  return (
    <div>
      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-end overflow-hidden">

        {/* ── Background photo — swap src to change the hero image ── */}
        <Image
          src="/story/photo-8.jpg"
          alt="RAHATLYK — pure water from the source"
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />

        {/* ── Overlay: stronger at bottom so text pops, open at top ── */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />

        {/* ── Content ── */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pb-20 lg:pb-28">
          {/* id="hero-content" is targeted by an inline <style> in <head> that sets
              opacity:0 before any JS runs, hiding server-rendered English text. */}
          <div id="hero-content" className="max-w-2xl">

            {/* Headline — manual 2-line mask reveal */}
            <div
              className="text-6xl sm:text-7xl lg:text-8xl font-light text-white leading-[1.06] tracking-tight mb-5"
              style={{ fontFamily: 'var(--font-heading), sans-serif' }}
            >
              {/* Each inner div slides up from behind its overflow-hidden parent.
                  pb-[0.18em] gives descenders (g, y, p…) room; -mb-[0.18em] cancels the extra space. */}
              <div className="overflow-hidden pb-[0.18em] -mb-[0.18em]">
                <div ref={titleLine1Ref}>{t.home.hero.title}</div>
              </div>
              <div className="overflow-hidden pb-[0.18em] -mb-[0.18em]">
                <div ref={titleLine2Ref} className="text-white/75">{t.home.hero.titleAccent}</div>
              </div>
            </div>

            {/* Subtitle — mask reveal */}
            <div className="overflow-hidden pb-[0.18em] -mb-[0.18em]">
              <p ref={heroSubRef} className="text-base sm:text-lg text-white/65 max-w-md mb-10 leading-relaxed">
                {t.home.hero.subtitle}
              </p>
            </div>

          </div>
        </div>

      </section>

      {/* ══════════════════════════════════════════
          BRAND STATEMENT
      ══════════════════════════════════════════ */}
      <section ref={brandRef} className="py-20 sm:py-28 lg:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex flex-col sm:flex-row sm:items-start gap-10 sm:gap-16 lg:gap-24">

            {/* Left: brand label */}
            <div className="flex-shrink-0 sm:pt-[0.2em] sm:pr-12 lg:pr-16 sm:border-r sm:border-brand-200">
              <span
                ref={brandLabelRef}
                className="block text-[11px] font-light tracking-[0.45em] text-black uppercase"
                style={{ fontFamily: 'var(--font-heading), sans-serif', overflow: 'hidden', paddingBottom: '0.1em' }}
              >
                RAHATLYK
              </span>
            </div>

            {/* Right: brand statement */}
            <div className="flex-1 min-w-0">
              <p
                ref={brandTextRef}
                className="text-sm sm:text-[15px] text-black leading-[1.55] font-light"
                style={{ fontFamily: 'var(--font-heading), sans-serif' }}
              >
                {(() => {
                  const text = t.home.brand.text;
                  const idx  = text.indexOf(' ');
                  if (idx === -1) return text;
                  return (
                    <>
                      <strong className="font-light">{text.slice(0, idx)}</strong>
                      {text.slice(idx)}
                    </>
                  );
                })()}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          HORIZONTAL SCROLL — pinned panels
      ══════════════════════════════════════════ */}
      <HorizontalScrollSection />

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
          src="/reference/62e2cf43262eaf2729f83b11_4.jpg"
          alt="Mountain lake — the source behind RAHATLYK purity"
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />

        {/* ── Overlay: centred text needs even coverage ── */}
        <div className="absolute inset-0 bg-black/45" />
        {/* ── Bottom vignette ── */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* ── Content ── */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-24">
          <div className="max-w-xl mx-auto text-center">

            <span className="story-animate block text-brand-300 text-[10px] font-light tracking-[0.22em] uppercase mb-4">
              {t.home.story.tag}
            </span>

            <h2
              className="story-animate text-2xl sm:text-3xl lg:text-4xl font-light text-white leading-tight mb-5"
              style={{ fontFamily: 'var(--font-heading), sans-serif' }}
            >
              {t.home.story.title}
            </h2>

            <p className="story-animate text-white/65 text-sm sm:text-base leading-relaxed">
              {t.home.story.text}
            </p>

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
            <div className="font-light text-white text-[11px] leading-tight">{t.home.story.badge}</div>
            <div className="text-white/55 text-[10px] mt-0.5">{t.home.story.badgeSub}</div>
          </div>
        </div>


      </section>

      {/* ══════════════════════════════════════════
          NEWS CAROUSEL
      ══════════════════════════════════════════ */}
      <section className="bg-white overflow-hidden" style={{ height: '100svh' }}>
        <NewsCarousel tag={t.home.news.tag} />
      </section>

      {/* ══════════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden flex flex-col items-center justify-center"
        style={{ background: '#0b2e4a', height: 'calc(100vh - var(--footer-h, 320px))' }}
      >
        {/* ── Live water gradient blobs ── */}
        <div className="pointer-events-none absolute inset-0">
          {/* Deep base wash */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0d3d60] via-[#0b2e4a] to-[#04192e]" />
          {/* Top-left azure bloom */}
          <div className="water-blob-1 absolute -top-[20%] -left-[10%] w-[65%] h-[75%] rounded-full bg-[#38c8f5] blur-[90px]" />
          {/* Top-center bright highlight — like sunlight on water */}
          <div className="water-blob-2 absolute -top-[10%] left-[25%] w-[40%] h-[55%] rounded-full bg-[#d4f2ff] blur-[70px]" />
          {/* Mid-right cobalt swell */}
          <div className="water-blob-3 absolute top-[20%] right-[-5%] w-[45%] h-[60%] rounded-full bg-[#2a9fd8] blur-[80px]" />
          {/* Bottom-left deep pocket */}
          <div className="water-blob-4 absolute bottom-[-15%] left-[10%] w-[50%] h-[50%] rounded-full bg-[#1a6ab8] blur-[70px]" />
          {/* Center subtle glow */}
          <div className="water-blob-5 absolute top-[35%] left-[40%] w-[30%] h-[35%] rounded-full bg-[#a0e4fc] blur-[60px]" />
          {/* Grain overlay for organic texture */}
          <div
            className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: '300px 300px',
            }}
          />
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
            className="text-3xl sm:text-4xl lg:text-5xl font-light text-white mb-4 leading-tight"
            style={{ fontFamily: 'var(--font-heading), sans-serif' }}
          >
            {t.home.ctaBanner.title}
          </h2>
          <p className="text-brand-200 text-base sm:text-lg mb-10 max-w-lg mx-auto leading-relaxed">
            {t.home.ctaBanner.subtitle}
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-[11px] font-light tracking-[0.22em] uppercase text-white/75 group"
          >
            <span>{t.home.ctaBanner.cta}</span>
            <svg
              className="group-hover:translate-x-1 transition-transform duration-200"
              width="13" height="13" viewBox="0 0 14 14" fill="none"
            >
              <path d="M2 7H12M12 7L8 3M12 7L8 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </section>

    </div>
  );
}
