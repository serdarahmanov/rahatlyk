'use client';

/* eslint-disable @next/next/no-img-element */

import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { TouchEvent as ReactTouchEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import WaveDivider from '@/components/WaveDivider';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { formatDate } from '@/lib/formatDate';
import { localizePublicHref, withLocale } from '@/lib/i18n/locale';
import type {
  HorizontalScrollData,
  HomeCtaBannerData,
  HomeHeroData,
  PayloadArticle,
  PayloadProductLine,
} from '@/types/payload';

declare global {
  interface Window {
    __pageIntroDone?: boolean;
    __homeHeroCoverReady?: boolean;
    __pageIntroWillPlay?: boolean;
  }
}

/* ── Intro gate ───────────────────────────────────────────────────── */
let introHasCompleted =
  typeof window !== 'undefined' && !!window.__pageIntroDone;

if (typeof window !== 'undefined' && !introHasCompleted) {
  window.addEventListener(
    'page-intro-done',
    () => { introHasCompleted = true; },
    { once: true },
  );
}

/* Tracks whether window.load has fired in this browser session */
let _pageContentLoaded = false;

type HeroImageAsset = HomeHeroData['parallaxImages'][number];

function getHeroAssetSet(hero: HomeHeroData) {
  const bubbleImages = hero.parallaxImages;
  const bottleImage = hero.bottleImageUrl ? {
    fileName: 'bottle.webp',
    src: hero.bottleImageUrl,
  } : null;
  const mobileBottleSrc = hero.mobileBottleImageUrl || hero.bottleImageUrl || null;

  return { bubbleImages, bottleImage, mobileBottleSrc };
}

function getHeroImagesForViewport(isMobile: boolean, hero: HomeHeroData) {
  const { bubbleImages, bottleImage } = getHeroAssetSet(hero);
  if (isMobile) return bottleImage ? [bottleImage] : [];

  return bottleImage ? [...bubbleImages, bottleImage] : bubbleImages;
}

function getHeroRequiredImagesForViewport(isMobile: boolean, hero: HomeHeroData) {
  const { bubbleImages, bottleImage } = getHeroAssetSet(hero);
  return new Set([
    ...(isMobile ? [] : bubbleImages).map((image) => image.fileName),
    ...(bottleImage ? [isMobile && hero.mobileBottleImageUrl ? 'bottle-mobile.webp' : 'bottle.webp'] : []),
  ]);
}

const HERO_SPLASH_PARALLAX = [
  { x: -10, y: -18, rotate: -5, scale: 1.08 },
  { x: -6, y: -26, rotate: 4, scale: 1.12 },
  { x: -14, y: -14, rotate: -7, scale: 1.06 },
  { x: 8, y: -22, rotate: 5, scale: 1.1 },
  { x: 13, y: -16, rotate: -4, scale: 1.08 },
  { x: -4, y: -34, rotate: 8, scale: 1.16 },
  { x: 16, y: -28, rotate: -6, scale: 1.12 },
  { x: -18, y: -21, rotate: 6, scale: 1.1 },
  { x: 7, y: -36, rotate: -8, scale: 1.15 },
  { x: 20, y: -17, rotate: 5, scale: 1.09 },
  { x: -12, y: -31, rotate: -6, scale: 1.14 },
  { x: 12, y: -25, rotate: 7, scale: 1.11 },
  { x: -22, y: -12, rotate: 4, scale: 1.07 },
  { x: 18, y: -33, rotate: -7, scale: 1.15 },
  { x: -8, y: -40, rotate: 9, scale: 1.18 },
];

function homeViewportHeight() {
  if (typeof window === 'undefined') return 0;
  return window.innerHeight;
}

function requestScrollTriggerRefresh() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('refresh-scroll-triggers'));
}

/* ── Helpers ──────────────────────────────────────────────────────── */
function pauseVideo(video: HTMLVideoElement | null) {
  if (!video) return;
  video.pause();
}

function splitWordsIntoSpans(el: HTMLElement, displayText?: string): {
  spans: HTMLElement[];
  restore: () => void;
} {
  const text  = displayText ?? (el.textContent ?? '');
  const words = text.trim().split(/\s+/).filter(Boolean);

  while (el.firstChild) el.removeChild(el.firstChild);

  const spans: HTMLElement[] = [];

  words.forEach((word, i) => {
    const mask = document.createElement('span');
    mask.style.display       = 'inline-block';
    mask.style.overflow      = 'hidden';
    mask.style.verticalAlign = 'bottom';
    mask.style.paddingBottom = '0.2em';
    mask.style.marginBottom  = '-0.2em';

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
const HorizontalScrollSection = memo(function HorizontalScrollSection({
  data,
  pageLoaded,
}: {
  data: HorizontalScrollData;
  pageLoaded: boolean;
}) {
  const { locale } = useLanguage();
  const containerRef   = useRef<HTMLDivElement>(null);
  const trackRef       = useRef<HTMLDivElement>(null);
  const box5CoverImgRef = useRef<HTMLImageElement>(null);
  const isFirstDataRef = useRef(true);
  const [box5CoverReadyUrl, setBox5CoverReadyUrl] = useState<string | null>(null);
  const [stableBox5VideoUrl, setStableBox5VideoUrl] = useState<string | null>(() => data.box5VideoUrl ?? null);

  const shouldLoadBox5Video = pageLoaded && (!data.box5CoverImageUrl || box5CoverReadyUrl === data.box5CoverImageUrl);

  useEffect(() => {
    if (!stableBox5VideoUrl && data.box5VideoUrl) {
      const id = requestAnimationFrame(() => setStableBox5VideoUrl(data.box5VideoUrl));
      return () => cancelAnimationFrame(id);
    }
  }, [data.box5VideoUrl, stableBox5VideoUrl]);

  useEffect(() => {
    return () => pauseVideo(document.querySelector<HTMLVideoElement>('[data-box5-video]'));
  }, []);

  useEffect(() => {
    if (box5CoverReadyUrl && box5CoverReadyUrl !== data.box5CoverImageUrl) {
      const id = requestAnimationFrame(() => setBox5CoverReadyUrl(null));
      return () => cancelAnimationFrame(id);
    }
  }, [box5CoverReadyUrl, data.box5CoverImageUrl]);

  useEffect(() => {
    const image = box5CoverImgRef.current;
    if (!image || !data.box5CoverImageUrl || box5CoverReadyUrl === data.box5CoverImageUrl) return;
    if (image.complete && image.naturalWidth > 0) {
      const id = requestAnimationFrame(() => setBox5CoverReadyUrl(data.box5CoverImageUrl));
      return () => cancelAnimationFrame(id);
    }
  }, [data.box5CoverImageUrl, box5CoverReadyUrl]);

  // Refresh ScrollTrigger on language switch (content above shifts layout)
  useEffect(() => {
    if (isFirstDataRef.current) { isFirstDataRef.current = false; return; }
    requestScrollTriggerRefresh();
  }, [data]);

  useEffect(() => {
    let mounted = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ctx: any;
    let removeResize: (() => void) | null = null;
    let lastWidth = typeof window !== 'undefined' ? window.innerWidth : 0;

    const init = async () => {
      const { gsap }          = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      if (!mounted || !containerRef.current || !trackRef.current) return;

      const track = trackRef.current;
      gsap.set(track, { x: 0 });

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
          },
        });
      });

      const handleResize = () => {
        if (!mounted) return;
        const width = window.innerWidth;
        const widthChanged = Math.abs(width - lastWidth) > 1;
        if (width >= 768 || widthChanged) {
          lastWidth = width;
          ScrollTrigger.refresh();
        }
      };
      window.addEventListener('resize', handleResize);
      removeResize = () => window.removeEventListener('resize', handleResize);

      requestAnimationFrame(() => {
        if (!mounted) return;
        requestAnimationFrame(() => {
          if (mounted) ScrollTrigger.refresh();
        });
      });
    };

    init();
    return () => {
      mounted = false;
      removeResize?.();
      ctx?.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="overflow-hidden bg-amber-300 py-7" style={{ height: '100lvh' }}>
      <div
        ref={trackRef}
        className="flex h-full gap-4 px-4"
        style={{ willChange: 'transform' }}
      >

        {/* ── BOX 1 · Full-height portrait photo ────────────────── */}
        <div className="relative h-full flex-shrink-0 overflow-hidden rounded-2xl bg-brand-100 w-[88vw] md:w-[42vw]">
          {data.box1ImageUrl && (
            <Image
              src={data.box1ImageUrl}
              alt="Pure water — Rahatlyk quality"
              fill
              className="object-cover object-center"
              sizes="(max-width: 767px) 88vw, 42vw"
              loading="eager"
            />
          )}
        </div>

        {/* ── BOX 2 · Dark text panel ───────────────────────────── */}
        <div
          className="relative h-full flex-shrink-0 bg-brand-950 flex flex-col justify-center overflow-hidden rounded-2xl w-[80vw] md:w-[28vw]"
          style={{ padding: '0 4vw' }}
        >
          {data.box2ImageUrl && (
            <Image
              src={data.box2ImageUrl}
              alt=""
              fill
              className="object-cover object-center"
              sizes="(max-width: 767px) 80vw, 28vw"
              loading="eager"
            />
          )}
          <div className="absolute inset-0 bg-brand-950/75" />
          <div className="relative z-10">
            {data.box2Tag && (
              <span className="block text-brand-400 text-[10px] font-medium tracking-[0.35em] uppercase mb-6">
                {data.box2Tag}
              </span>
            )}
            {data.box2Headline && (
              <h2
                className="text-white font-light leading-[1.1]"
                style={{ fontFamily: 'var(--font-heading), sans-serif', fontSize: 'clamp(1.6rem, 2.6vw, 3rem)' }}
              >
                {data.box2Headline}
              </h2>
            )}
          </div>
        </div>

        {/* ── BOX 3 + BOX 4 · Product photo + CTA ──────────────── */}
        <div className="relative h-full flex-shrink-0 flex flex-col gap-4 w-[85vw] md:w-[32vw]">
          <div className="relative overflow-hidden rounded-2xl bg-brand-100" style={{ flex: '1 1 60%' }}>
            {data.box3ImageUrl && (
              <Image
                src={data.box3ImageUrl}
                alt="Sarwan water poured fresh"
                fill
                className="object-cover object-center"
                sizes="(max-width: 767px) 85vw, 32vw"
                loading="eager"
              />
            )}
          </div>
          <div
            className="relative flex-shrink-0 flex flex-col justify-center items-start overflow-hidden rounded-2xl"
            style={{ flex: '0 0 40%', padding: '0 3.5vw', background: '#0b2e4a' }}
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0d3d60] via-[#0b2e4a] to-[#04192e]" />
              <div className="water-blob-1 absolute -top-[30%] -left-[20%] w-[70%] h-[100%] rounded-full bg-[#38c8f5] blur-[60px]" />
              <div className="water-blob-2 absolute -top-[20%] left-[30%] w-[50%] h-[80%] rounded-full bg-[#d4f2ff] blur-[50px]" />
              <div className="water-blob-3 absolute top-[30%] right-[-10%] w-[50%] h-[70%] rounded-full bg-[#2a9fd8] blur-[55px]" />
              <div className="water-blob-5 absolute bottom-[-20%] left-[20%] w-[40%] h-[60%] rounded-full bg-[#a0e4fc] blur-[45px]" />
            </div>
            <div className="relative z-10 w-full">
              {data.box4Text && (
                <p className="text-white font-light leading-snug mb-5" style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.25rem)' }}>
                  {data.box4Text}
                </p>
              )}
              {data.box4ButtonLabel && (
                <Link
                  href={localizePublicHref(locale, data.box4ButtonHref || '#')}
                  prefetch={false}
                  className="rounded-[3px] border border-white bg-white px-6 py-3 text-[11px] font-medium tracking-[0.06em] uppercase text-[#141618] transition-colors duration-300 hover:border-[#ecfeff] hover:bg-[#ecfeff]"
                >
                  {data.box4ButtonLabel}
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* ── BOX 5 · Video with cover image ────────────────────── */}
        <div className="relative h-full flex-shrink-0 overflow-hidden rounded-2xl bg-brand-100 w-[90vw] md:w-[52vw]">
          {data.box5CoverImageUrl && (
            <img
              ref={box5CoverImgRef}
              src={data.box5CoverImageUrl}
              alt=""
              aria-hidden="true"
              loading="eager"
              decoding="async"
              onLoad={() => setBox5CoverReadyUrl(data.box5CoverImageUrl)}
              onError={() => setBox5CoverReadyUrl(data.box5CoverImageUrl)}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
          {stableBox5VideoUrl && shouldLoadBox5Video && (
            <video
              src={stableBox5VideoUrl}
              data-box5-video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              onCanPlay={(e) => { e.currentTarget.muted = true; void e.currentTarget.play().catch(() => undefined); }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          {(data.box5Tag || data.box5Headline) && (
            <div className="absolute bottom-14 left-[8%] right-[8%]">
              {data.box5Tag && (
                <span className="block text-white/55 text-[10px] font-medium tracking-[0.35em] uppercase mb-4">
                  {data.box5Tag}
                </span>
              )}
              {data.box5Headline && (
                <h2
                  className="text-white font-light leading-[1.1]"
                  style={{ fontFamily: 'var(--font-heading), sans-serif', fontSize: 'clamp(1.8rem, 3.2vw, 3.8rem)' }}
                >
                  {data.box5Headline}
                </h2>
              )}
            </div>
          )}
        </div>

        {/* ── BOX 6 · Closing panel ─────────────────────────────── */}
        <div
          className="relative h-full flex-shrink-0 bg-brand-50 flex flex-col justify-center overflow-hidden rounded-2xl w-[80vw] md:w-[25vw]"
          style={{ padding: '0 3.5vw' }}
        >
          {data.box6ImageUrl && (
            <Image
              src={data.box6ImageUrl}
              alt=""
              fill
              className="object-cover object-center"
              sizes="(max-width: 767px) 80vw, 25vw"
              loading="eager"
            />
          )}
          {data.box6ImageUrl && <div className="absolute inset-0 bg-brand-50/70" />}
          <div className="relative z-10">
            {data.box6Tag && (
              <span className="block text-brand-600 text-[10px] font-medium tracking-[0.35em] uppercase mb-5">
                {data.box6Tag}
              </span>
            )}
            {data.box6Headline && (
              <h3
                className="text-brand-950 font-light leading-snug mb-8"
                style={{ fontFamily: 'var(--font-heading), sans-serif', fontSize: 'clamp(1.3rem, 1.9vw, 2.1rem)' }}
              >
                {data.box6Headline}
              </h3>
            )}
            {data.box6ButtonLabel && (
              <Link
                href={localizePublicHref(locale, data.box6ButtonHref || '#')}
                prefetch={false}
                className="w-fit rounded-[3px] border border-[#141618] bg-[#141618] px-6 py-3 text-[11px] font-medium tracking-[0.06em] uppercase text-[#FAFAF8] transition-colors duration-300 hover:border-[#ecfeff] hover:bg-[#ecfeff] hover:text-[#141618]"
              >
                {data.box6ButtonLabel}
              </Link>
            )}
          </div>
        </div>

        <div className="flex-shrink-0 w-4" aria-hidden="true" />
      </div>
    </div>
  );
});

/* ── Button-driven category carousel ─────────────────────────────── */
const CollectionsSection = memo(function CollectionsSection({
  lines,
  sectionTag,
  exploreLabel,
}: {
  lines: PayloadProductLine[];
  sectionTag: string;
  exploreLabel: string;
}) {
  const { locale } = useLanguage();
  const sectionRef   = useRef<HTMLDivElement>(null);
  const bottleEls    = useRef<(HTMLDivElement | null)[]>([]);
  const animObj      = useRef({ pos: 0 });
  const textRef      = useRef<HTMLDivElement>(null);
  const navRef       = useRef<HTMLDivElement>(null);
  const pinProgressTrackRef = useRef<HTMLDivElement>(null);
  const pinProgressRef = useRef<HTMLDivElement>(null);
  const isFirstRun   = useRef(true);
  const entranceMult = useRef(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const [snapIndex, setSnapIndex] = useState(0);

  const recalculateLayout = useCallback(() => {
    if (!sectionRef.current) return;
    const header = document.querySelector('header');
    const headerH = header ? header.offsetHeight : 0;
    const viewportH = homeViewportHeight();
    const h = viewportH - headerH;
    const isMobile = window.innerWidth < 768;
    const bottleH = Math.round(h * (isMobile ? 0.5 : 0.8));
    const sectionH = isMobile ? viewportH : h;
    sectionRef.current.style.height = `${sectionH}px`;
    sectionRef.current.style.setProperty('--col-h', `${h}px`);
    sectionRef.current.style.setProperty('--bottle-h', `${bottleH}px`);
    if (textRef.current) {
      if (!isMobile) {
        const bottleTopPx = sectionH - sectionH * 0.08 - bottleH;
        textRef.current.style.paddingTop = `${bottleTopPx}px`;
      } else {
        textRef.current.style.paddingTop = '';
      }
    }
  }, []);

  useLayoutEffect(() => {
    if (textRef.current) textRef.current.style.opacity = '0';
    if (navRef.current) {
      navRef.current.style.opacity  = '0';
      navRef.current.style.transform = 'translateY(14px)';
    }
  }, []);

  useEffect(() => {
    recalculateLayout();
    let lastWidth = window.innerWidth;
    const handleResize = () => {
      const width = window.innerWidth;
      const widthChanged = Math.abs(width - lastWidth) > 1;
      if (width < 768 && !widthChanged) return;
      lastWidth = width;
      recalculateLayout();
      requestScrollTriggerRefresh();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [recalculateLayout]);

  useLayoutEffect(() => {
    recalculateLayout();
  }, [locale, lines, sectionTag, exploreLabel, recalculateLayout]);

  useEffect(() => {
    let firstRaf = 0;
    let secondRaf = 0;
    let cancelled = false;

    import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      if (cancelled) return;
      firstRaf = requestAnimationFrame(() => {
        recalculateLayout();
        secondRaf = requestAnimationFrame(() => ScrollTrigger.refresh());
      });
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(firstRaf);
      cancelAnimationFrame(secondRaf);
    };
  }, [locale, lines, sectionTag, exploreLabel, recalculateLayout]);

  const applyProgress = (pos: number) => {
    const w    = window.innerWidth;
    const isMd = w >= 768;
    const isLg = w >= 1024;
    const isXl = w >= 1280;
    const s = isXl ? 22 : isLg ? 28 : isMd ? 28 : 50;

    bottleEls.current.forEach((el, i) => {
      if (!el) return;
      const offset = i - pos;
      const abs    = Math.abs(offset);
      // Only the active bottle and its immediate neighbors need a promoted
      // GPU layer — every other bottle sits far outside the viewport, so
      // keeping `will-change` on all of them just wastes compositor memory
      // (a real cost on lower-memory phones), especially since mobile has
      // no early-return below to drop them out entirely.
      el.style.willChange = abs < 1.5 ? 'transform, opacity, filter' : 'auto';

      if (isMd && offset < -0.15) {
        el.style.opacity       = '0';
        el.style.filter        = 'none';
        el.style.pointerEvents = 'none';
        el.style.transform     = `translateX(calc(-50% + ${offset * s}vw)) scale(0.6)`;
        return;
      }

      // Mobile swipes only ever move one slot at a time, so anything two or
      // more slots away is guaranteed fully off-screen for the entire
      // transition (at this step size it's translated a full viewport width
      // or more away) — skip the blur/opacity work instead of painting a
      // heavily-blurred layer that's never actually visible.
      if (!isMd && abs >= 1.85) {
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

  useEffect(() => { applyProgress(0); }, []);

  useEffect(() => {
    let cleanup: (() => void) | null = null;
    let cancelled = false;
    const init = async () => {
      const { gsap }          = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      if (cancelled || !sectionRef.current) return;

      const st = ScrollTrigger.create({
        trigger: sectionRef.current!,
        start:   'top 60%',
        once:    true,
        onEnter: () => {
          const tl = gsap.timeline();
          tl.to(entranceMult, {
            current:  1,
            duration: 1,
            ease:     'power2.out',
            onUpdate: () => applyProgress(animObj.current.pos),
          }, 0);
          if (textRef.current) {
            tl.to(textRef.current, { opacity: 1, duration: 0.8, ease: 'power3.out' }, 0.15);
          }
          if (navRef.current) {
            tl.to(navRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.35);
          }
        },
      });

      const progressEl = pinProgressRef.current;
      const progressTrackEl = pinProgressTrackRef.current;
      const setPinProgress = progressEl
        ? gsap.quickTo(progressEl, 'scaleY', {
            duration: 0.2,
            ease: 'power2.out',
          })
        : null;
      const showPinProgress = (origin: 'top' | 'bottom') => {
        if (!progressTrackEl?.isConnected) return;
        gsap.set(progressTrackEl, { transformOrigin: origin });
        gsap.to(progressTrackEl, { scaleY: 1, duration: 0.4, ease: 'power2.out', overwrite: true });
      };
      const hidePinProgress = (origin: 'top' | 'bottom') => {
        if (!progressTrackEl?.isConnected) return;
        gsap.set(progressTrackEl, { transformOrigin: origin });
        gsap.to(progressTrackEl, { scaleY: 0, duration: 0.3, ease: 'power2.in', overwrite: true });
      };

      const pin = ScrollTrigger.create({
        trigger:          sectionRef.current!,
        pin:              true,
        start:            "top top",
        end:              () => `+=${Math.round((sectionRef.current?.offsetHeight ?? 0) * 0.35)}`,
        pinSpacing:       true,
        invalidateOnRefresh: true,
        onRefreshInit:    recalculateLayout,
        onUpdate: (self) => { setPinProgress?.(self.progress); },
        onRefresh: (self) => {
          if (!progressEl?.isConnected) return;
          gsap.set(progressEl, { scaleY: self.progress });
        },
        onEnter:      () => showPinProgress('top'),
        onEnterBack:  () => showPinProgress('bottom'),
        onLeave:      () => hidePinProgress('bottom'),
        onLeaveBack:  () => hidePinProgress('top'),
      });

      cleanup = () => { pin.kill(); st.kill(); };
    };
    init();
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [recalculateLayout]);

  useEffect(() => {
    if (isFirstRun.current) { isFirstRun.current = false; return; }
    const el = textRef.current;
    if (!el) return;
    import('gsap').then(({ gsap }) => {
      const blocks = el.querySelectorAll<HTMLElement>('.reveal-block');
      gsap.fromTo(blocks, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, stagger: 0.08, ease: 'power3.out', overwrite: 'auto' });
      const splitTargets = el.querySelectorAll<HTMLElement>('.split-reveal');
      gsap.fromTo(splitTargets, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.09, ease: 'power3.out', overwrite: 'auto' });
    });
  }, [snapIndex]);

  const goTo = useCallback(async (idx: number) => {
    if (idx < 0 || idx >= lines.length) return;
    setSnapIndex(idx);
    const { gsap } = await import('gsap');
    gsap.killTweensOf(animObj.current);
    gsap.to(animObj.current, {
      pos:      idx,
      duration: 0.55,
      ease:     'power3.inOut',
      onUpdate: () => applyProgress(animObj.current.pos),
    });
  }, [lines.length]);

  const handleTouchStart = useCallback((event: ReactTouchEvent<HTMLDivElement>) => {
    if (window.innerWidth >= 768 || event.touches.length !== 1) {
      touchStartRef.current = null;
      return;
    }

    const touch = event.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback((event: ReactTouchEvent<HTMLDivElement>) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start || window.innerWidth >= 768) return;

    const touch = event.changedTouches[0];
    if (!touch) return;

    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (absX < 42 || absX < absY * 1.25) return;

    if (deltaX < 0) {
      void goTo(snapIndex + 1);
    } else {
      void goTo(snapIndex - 1);
    }
  }, [goTo, snapIndex]);

  const activeLine = lines[snapIndex];

  return (
    <div
      ref={sectionRef}
      className="relative overflow-hidden bg-white"
      style={{ touchAction: 'pan-y' }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        ref={pinProgressTrackRef}
        aria-hidden="true"
        className="absolute top-[15%] bottom-[15%] left-2 md:left-4 z-40 w-[3px] overflow-hidden rounded-full bg-black/15"
        style={{ transform: 'scaleY(0)', transformOrigin: 'top' }}
      >
        <div
          ref={pinProgressRef}
          className="h-full w-full rounded-full bg-black"
          style={{ transform: 'scaleY(0)', transformOrigin: 'top' }}
        />
      </div>

      {lines.map((line, i) => (
        <div
          key={line.key}
          ref={(el) => { bottleEls.current[i] = el; }}
          className="absolute bottom-[18%] md:bottom-[8%] z-0"
          style={{
            left:            '50%',
            height:          'var(--bottle-h, 480px)',
            width:           'var(--bottle-h, 480px)',
            display:         'flex',
            justifyContent:  'center',
            transformOrigin: 'bottom center',
          }}
        >
          {line.imageUrl && (
            <img
              src={line.imageUrl}
              alt={line.name}
              loading="lazy"
              style={{ width: 'auto', height: '100%', display: 'block' }}
            />
          )}
        </div>
      ))}

      <div
        ref={textRef}
        className="
          absolute z-20 flex flex-col
          top-[4%] left-0 right-0 items-center text-center px-6
          md:top-0 md:bottom-auto md:gap-5
          md:right-auto md:left-[5%] md:max-w-[280px] lg:left-[7%] lg:max-w-[320px] xl:left-[8%] xl:max-w-[360px]
          md:items-start md:text-left md:px-0
        "
      >
        <div className="hidden md:block">
          <span className="block text-[10px] font-medium tracking-[0.2em] uppercase text-black/40" style={{ fontWeight: 500 }}>
            {sectionTag}
          </span>
        </div>

        <div className="flex flex-col w-full">
          <div className="overflow-hidden mb-2 w-full md:w-[380px] lg:w-[420px] xl:w-[500px]">
            <h3 className="split-reveal break-normal text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-medium text-black leading-tight" style={{ fontFamily: 'var(--font-heading), sans-serif', overflowWrap: 'normal' }}>
              {activeLine?.name ?? ''}
            </h3>
          </div>
          <div className="overflow-hidden mb-4 w-full">
            <p className="reveal-block block text-black/55 text-xs lg:text-sm font-light tracking-wide">
              {activeLine?.description ?? ''}
            </p>
          </div>
          <div className="overflow-hidden hidden md:block w-full">
            <p className="split-reveal text-black text-xs lg:text-sm leading-snug">
              {activeLine?.body ?? ''}
            </p>
          </div>
        </div>
      </div>

      <div ref={navRef} className="absolute bottom-[6%] md:bottom-[5%] left-0 right-0 z-30 flex items-center justify-between px-6 md:px-[5%] lg:px-[7%] xl:px-[8%] pb-7 md:pb-0">
        <Link
          href={`${withLocale(locale, '/products')}?category=${activeLine?.key ?? ''}`}
          prefetch={false}
          className="group inline-flex items-center gap-1.5 rounded-[3px] border border-[#141618] bg-[#141618] h-9 px-5 text-[11px] font-medium tracking-[0.06em] uppercase text-[#FAFAF8] transition-colors duration-300 hover:border-[#ecfeff] hover:bg-[#ecfeff] hover:text-[#141618]"
        >
          <span>{exploreLabel}</span>
          <svg className="group-hover:translate-x-1 transition-transform duration-200" width="13" height="13" viewBox="0 0 14 14" fill="none">
            <path d="M2 7H12M12 7L8 3M12 7L8 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
        <div className="flex items-center gap-5">
          <button onClick={() => goTo(snapIndex - 1)} disabled={snapIndex === 0} aria-label="Previous" className="hidden md:flex items-center justify-center w-9 h-9 rounded-md bg-black/[0.06] hover:bg-black/[0.11] text-gray-700 disabled:opacity-20 transition-all duration-200">
            <svg width="16" height="16" viewBox="0 0 12 12" fill="none"><path d="M8 2L3 6L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <div className="flex items-center gap-2">
            {lines.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} aria-label={`Category ${i + 1}`} className={`rounded-full transition-all duration-300 ${i === snapIndex ? 'w-6 h-[4px] bg-black' : 'w-[4px] h-[4px] bg-black/25 hover:bg-black/50'}`} />
            ))}
          </div>
          <button onClick={() => goTo(snapIndex + 1)} disabled={snapIndex === lines.length - 1} aria-label="Next" className="hidden md:flex items-center justify-center w-9 h-9 rounded-md bg-black/[0.06] hover:bg-black/[0.11] text-gray-700 disabled:opacity-20 transition-all duration-200">
            <svg width="16" height="16" viewBox="0 0 12 12" fill="none"><path d="M4 2L9 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
});

/* ── News Carousel (auto-play + infinite loop) ────────────────────── */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function NewsCarousel({
  tag,
  articles,
}: {
  tag: string;
  articles: PayloadArticle[];
}) {
  const { locale } = useLanguage();
  const [visCount, setVisCount] = useState(3);
  const trackRef   = useRef<HTMLDivElement>(null);
  const busy       = useRef(false);
  const timer      = useRef<ReturnType<typeof setTimeout> | null>(null);
  const advanceRef = useRef<(dir: 1 | -1) => void>(() => {});

  const items = useMemo(() => articles.slice(0, 5), [articles]);

  const extItems = useMemo(() => [
    ...items.slice(-visCount).map((article) => ({ article, isClone: true })),
    ...items.map((article) => ({ article, isClone: false })),
    ...items.slice(0, visCount).map((article) => ({ article, isClone: true })),
  ], [visCount, items]);

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

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setVisCount(w >= 1024 ? 3 : w >= 640 ? 2 : 1);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const schedule = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => advanceRef.current(1), 3200);
  }, []);

  const advance = useCallback(async (dir: 1 | -1) => {
    if (busy.current || items.length === 0) return;
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
    const inBack  = nextExtIdx >= visCount + items.length;
    const snapX   = inFront ? -(nextExtIdx + items.length) * step
                  : inBack  ? -(nextExtIdx - items.length) * step
                  : null;

    gsap.timeline({
      onComplete: () => {
        if (snapX !== null) gsap.set(track, { x: snapX });
        busy.current = false;
        schedule();
      },
    })
    .to(track, { x: targetX + nudge, duration: 0.52, ease: 'power3.out' })
    .to(track, { x: targetX,         duration: 0.22, ease: 'power2.inOut' });
  }, [schedule, visCount, items.length]);

  useEffect(() => { advanceRef.current = advance; }, [advance]);

  useEffect(() => {
    if (items.length === 0) return;
    schedule();
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [schedule, visCount, items.length]);

  return (
    <div className="flex flex-col h-full">
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 pt-24 w-full flex-shrink-0" style={{ paddingBottom: '20px' }}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium tracking-[0.25em] uppercase text-brand-400" style={{ fontWeight: 500 }}>
            {tag}
          </span>
          <div className="flex items-center gap-5">
            <button onClick={() => advance(-1)} aria-label="Previous news" className="flex items-center justify-center w-9 h-9 rounded-md bg-black/[0.06] hover:bg-black/[0.11] text-gray-700 transition-all duration-200">
              <svg width="16" height="16" viewBox="0 0 12 12" fill="none"><path d="M8 2L3 6L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button onClick={() => advance(1)} aria-label="Next news" className="flex items-center justify-center w-9 h-9 rounded-md bg-black/[0.06] hover:bg-black/[0.11] text-gray-700 transition-all duration-200">
              <svg width="16" height="16" viewBox="0 0 12 12" fill="none"><path d="M4 2L9 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden flex-1 min-h-0">
        <div
          ref={trackRef}
          className="flex items-start gap-30 h-full"
          style={{ paddingLeft: 'clamp(1.25rem, 4vw, 2.5rem)', willChange: 'transform' }}
        >
          {extItems.map(({ article, isClone }, i) => (
            <Link
              key={`${article.id}-${i}`}
              href={withLocale(locale, `/news/${article.slug}`)}
              prefetch={false}
              className="flex-shrink-0 group cursor-pointer w-[60vw] sm:w-[31vw] lg:w-[20vw]"
              style={{ height: '60vh' }}
            >
              <div className="relative overflow-hidden rounded-lg h-full">
                <div className="absolute inset-0 bg-gray-200" />
                {article.images[0]?.url && (
                  <img
                    src={article.images[0].url}
                    alt={article.title}
                    loading={isClone ? 'lazy' : 'eager'}
                    className="absolute inset-0 h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 overflow-hidden rounded-md bg-white/70 px-4 py-3.5 backdrop-blur-sm">
                  <p className="text-[10px] text-gray-700/60 tracking-[0.18em] uppercase mb-1.5">
                    {formatDate(article.date, locale)}
                  </p>
                  <h3 className="text-[13px] sm:text-sm font-medium text-gray-700 leading-snug">
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

/* ── Page ─────────────────────────────────────────────────────────── */
export default function HomeClient({
  lines,
  horizontalScroll,
  ctaBanner,
  hero,
}: {
  lines: PayloadProductLine[]
  horizontalScroll: HorizontalScrollData
  ctaBanner: HomeCtaBannerData
  hero: HomeHeroData
}) {
  const { t, locale } = useLanguage();

  const [pageLoaded, setPageLoaded] = useState(false);
  const titleLine1Ref   = useRef<HTMLDivElement>(null);
  const titleLine2Ref   = useRef<HTMLDivElement>(null);
  const heroSubRef      = useRef<HTMLParagraphElement>(null);
  const brandRef        = useRef<HTMLElement>(null);
  const brandLabelRef   = useRef<HTMLSpanElement>(null);
  const brandTextRef    = useRef<HTMLParagraphElement>(null);
  const heroSectionRef  = useRef<HTMLElement>(null);
  const heroWrapperRef  = useRef<HTMLDivElement>(null);
  const heroReadyImagesRef = useRef<Set<string>>(new Set());
  const heroImagesReadyRef = useRef(false);
  const heroParallaxReadyRef = useRef(false);
  const heroReadyDispatchedRef = useRef(false);
  const prevLocaleRef   = useRef<string | undefined>(undefined);
  const heroTitle       = hero.title       || t.home.hero.title;
  const heroTitleAccent = hero.titleAccent || t.home.hero.titleAccent;
  const heroSubtitle    = hero.subtitle    || t.home.hero.subtitle;
  const heroMobileBottleSrc = getHeroAssetSet(hero).mobileBottleSrc;
  const [heroImages, setHeroImages] = useState<HeroImageAsset[]>([]);
  const [heroRequiredImages, setHeroRequiredImages] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    let lastIsMobile: boolean | null = null;

    const syncHeroImagesForViewport = () => {
      const isMobile = window.innerWidth < 640;
      if (isMobile === lastIsMobile) return;
      lastIsMobile = isMobile;

      heroReadyImagesRef.current.clear();
      const nextRequiredImages = getHeroRequiredImagesForViewport(isMobile, hero);
      const nextHeroImages = getHeroImagesForViewport(isMobile, hero);

      heroImagesReadyRef.current = nextRequiredImages.size === 0;
      heroParallaxReadyRef.current = false;
      heroReadyDispatchedRef.current = false;
      window.__homeHeroCoverReady = false;

      setHeroRequiredImages(nextRequiredImages);
      setHeroImages(nextHeroImages);
    };

    syncHeroImagesForViewport();
    window.addEventListener('resize', syncHeroImagesForViewport);
    window.addEventListener('orientationchange', syncHeroImagesForViewport);

    return () => {
      window.removeEventListener('resize', syncHeroImagesForViewport);
      window.removeEventListener('orientationchange', syncHeroImagesForViewport);
    };
  }, [hero]);

  useEffect(() => {
    let lastWidth = window.innerWidth;

    const refreshOnResize = (force = false) => {
      const width = window.innerWidth;
      const widthChanged = Math.abs(width - lastWidth) > 1;
      if (!force && width < 768 && !widthChanged) return;
      lastWidth = width;
      requestScrollTriggerRefresh();
    };

    const handleResize = () => refreshOnResize(false);
    const handleOrientationChange = () => refreshOnResize(true);
    const refresh = () => requestScrollTriggerRefresh();

    refreshOnResize(true);
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('smooth-scroll-ready', refresh);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('smooth-scroll-ready', refresh);
    };
  }, [locale]);

  const markHomeHeroReady = useCallback(() => {
    if (
      !heroImagesReadyRef.current ||
      !heroParallaxReadyRef.current ||
      heroReadyDispatchedRef.current
    ) return;

    heroReadyDispatchedRef.current = true;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.__homeHeroCoverReady = true;
        window.dispatchEvent(new CustomEvent('home-hero-cover-ready'));
      });
    });
  }, []);

  const markHeroImageReady = useCallback((fileName: string) => {
    if (!heroRequiredImages.has(fileName)) return;

    heroReadyImagesRef.current.add(fileName);
    heroImagesReadyRef.current = [...heroRequiredImages].every((requiredFileName) =>
      heroReadyImagesRef.current.has(requiredFileName)
    );

    markHomeHeroReady();
  }, [heroRequiredImages, markHomeHeroReady]);

  const markHeroImageErrored = useCallback((fileName: string) => {
    console.warn(`Home hero image failed to load: ${fileName}`);
  }, []);

  useEffect(() => {
    let frame = 0;

    const checkLoadedHeroImages = () => {
      heroSectionRef.current
        ?.querySelectorAll<HTMLImageElement>('[data-hero-image-file]')
        .forEach((image) => {
          if (image.complete) {
            const fileName =
              image.dataset.heroImageFile === 'bottle.webp' && image.currentSrc.includes('bottle-mobile.webp')
                ? 'bottle-mobile.webp'
                : image.dataset.heroImageFile ?? '';
            markHeroImageReady(fileName);
          }
        });
    };

    frame = requestAnimationFrame(checkLoadedHeroImages);
    return () => cancelAnimationFrame(frame);
  }, [markHeroImageReady]);

  useEffect(() => {
    if (_pageContentLoaded || document.readyState === 'complete') {
      _pageContentLoaded = true;
      const id = requestAnimationFrame(() => setPageLoaded(true));
      return () => cancelAnimationFrame(id);
    }
    const handler = () => { _pageContentLoaded = true; setPageLoaded(true); };
    window.addEventListener('load', handler, { once: true });
    return () => window.removeEventListener('load', handler);
  }, []);

  // ── Hero text animation ─────────────────────────────────────────
  useEffect(() => {
    const line1 = titleLine1Ref.current;
    const line2 = titleLine2Ref.current;
    const sub   = heroSubRef.current;

    const isLocaleChange = locale !== prevLocaleRef.current;
    prevLocaleRef.current = locale;

    if (!isLocaleChange) {
      if (line1) line1.textContent = heroTitle;
      if (line2) line2.textContent = heroTitleAccent;
      if (sub)  sub.textContent   = heroSubtitle;
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let tl: any = null;
    let introListener: (() => void) | null = null;

    const run = async () => {
      const { gsap } = await import('gsap');
      if (!line1 || !line2) return;

      gsap.killTweensOf([line1, line2, ...(sub ? [sub] : [])]);
      line1.textContent = heroTitle;
      line2.textContent = heroTitleAccent;
      if (sub) {
        sub.textContent = heroSubtitle;
      }

      const targets = [line1, line2, ...(sub ? [sub] : [])];
      tl = gsap.timeline({ delay: 0.2 });
      tl.fromTo(
        targets,
        { y: 34, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75, stagger: 0.08, ease: 'power4.out', clearProps: 'transform,opacity' }
      );

      const heroContent = document.getElementById('hero-content');
      if (heroContent) heroContent.style.opacity = '1';
    };

    const shouldWaitForIntro =
      !introHasCompleted &&
      typeof window !== 'undefined' &&
      window.__pageIntroWillPlay === true;

    if (!shouldWaitForIntro) {
      run();
    } else {
      introListener = () => run();
      window.addEventListener('page-intro-done', introListener, { once: true });
    }

    return () => {
      tl?.kill();
      if (introListener) {
        window.removeEventListener('page-intro-done', introListener);
        introListener = null;
      }
    };
  }, [locale, heroTitle, heroTitleAccent, heroSubtitle]);

  // ── Scroll-triggered animations ─────────────────────────────────
  useEffect(() => {
    const cleanupFns: (() => void)[] = [];

    const init = async () => {
      const { gsap }          = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const setupHeroFade = () => {
        const heroContent = document.getElementById('hero-content');
        const heroWrapper = heroWrapperRef.current;
        if (!heroContent || !heroWrapper) return;

        const tween = gsap.fromTo(
          heroContent,
          { opacity: 1 },
          {
            opacity: 0,
            ease: 'none',
            immediateRender: false,
            scrollTrigger: {
              trigger: heroWrapper,
              start: 'top+=80 top',
              end: 'top+=420 top',
              scrub: true,
            },
          },
        );
        cleanupFns.push(() => tween.scrollTrigger?.kill());
        cleanupFns.push(() => tween.kill());
      };

      if (
        !introHasCompleted &&
        typeof window !== 'undefined' &&
        window.__pageIntroWillPlay === true
      ) {
        const onIntroDone = () => setupHeroFade();
        window.addEventListener('page-intro-done', onIntroDone, { once: true });
        cleanupFns.push(() => window.removeEventListener('page-intro-done', onIntroDone));
      } else {
        setupHeroFade();
      }

      if (heroSectionRef.current) {
        const layers = heroSectionRef.current.querySelectorAll<HTMLElement>('[data-hero-parallax-layer]');
        layers.forEach((layer, index) => {
          const isBottle = layer.dataset.heroLayer === 'bottle';
          const isMobileBottle = isBottle && window.innerWidth < 640;
          const splash = HERO_SPLASH_PARALLAX[index % HERO_SPLASH_PARALLAX.length];
          const tween = gsap.to(
            layer,
            {
              xPercent: isBottle ? (isMobileBottle ? -8 : -2.5) : splash.x,
              yPercent: isBottle ? (isMobileBottle ? -14 : -4) : splash.y,
              rotate: isBottle ? (isMobileBottle ? -3 : -1.5) : splash.rotate,
              scale: isBottle ? (isMobileBottle ? 1.06 : 1.025) : splash.scale,
              ease: 'none',
              immediateRender: false,
              scrollTrigger: {
                trigger: heroWrapperRef.current,
                start: 'top top',
                end: 'bottom top',
                scrub: true,
                invalidateOnRefresh: true,
              },
            },
          );

          cleanupFns.push(() => tween.scrollTrigger?.kill());
          cleanupFns.push(() => tween.kill());
        });

        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
          heroParallaxReadyRef.current = true;
          markHomeHeroReady();
        });
      }

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
            const { spans: lSpans, restore: lRestore } = splitWordsIntoSpans(labelEl);
            gsap.set(labelEl, { opacity: 1 });
            tl.fromTo(lSpans, { yPercent: 115 }, { yPercent: 0, duration: 0.8, ease: 'power4.out', onComplete: lRestore });
            const textWords = textEl.querySelectorAll<HTMLElement>('.brand-text-word');
            gsap.set(textEl, { opacity: 1 });
            tl.fromTo(textWords, { yPercent: 115 }, { yPercent: 0, duration: 0.7, stagger: 0.035, ease: 'power4.out' }, 0.15);
          },
        });
        cleanupFns.push(() => st0.kill());
      }

    };

    init();
    return () => { cleanupFns.forEach((fn) => fn()); };
  }, [heroImages, markHomeHeroReady]);

  return (
    <div>
      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <div ref={heroWrapperRef}>
      <section ref={heroSectionRef} className="sticky top-0 min-h-[100lvh] flex items-end overflow-hidden lg:items-center">
        <div className="absolute inset-0 bg-amber-300" />
        {heroImages.map((image, index) => {
          const isBottle = image.fileName === 'bottle.webp';
          const splash = HERO_SPLASH_PARALLAX[index % HERO_SPLASH_PARALLAX.length];
          const markCurrentBottleReady = (event: { currentTarget: HTMLImageElement }) => {
            markHeroImageReady(
              event.currentTarget.currentSrc.includes('bottle-mobile.webp')
                ? 'bottle-mobile.webp'
                : 'bottle.webp',
            );
          };
          return (
            <div
              key={image.fileName}
              data-hero-parallax-layer
              data-hero-layer={isBottle ? 'bottle' : 'bubble'}
              className="pointer-events-none absolute inset-y-0 -left-[14vw] -right-[14vw] select-none will-change-transform sm:inset-0"
              style={{
                zIndex: isBottle ? 2 : 1,
                transform: `translate(${isBottle ? 2 : splash.x * -0.18}%, ${isBottle ? 3 : 8}%) rotate(${isBottle ? 0 : splash.rotate * -0.35}deg) scale(${isBottle ? 1 : 0.96})`,
                transformOrigin: '65% 72%',
              }}
            >
              {isBottle ? (
                <picture>
                  {heroMobileBottleSrc && heroMobileBottleSrc !== image.src && (
                    <source media="(max-width: 639px)" srcSet={heroMobileBottleSrc} />
                  )}
                  <img
                    src={image.src}
                    alt=""
                    aria-hidden="true"
                    data-hero-image-file="bottle.webp"
                    draggable={false}
                    loading="eager"
                    decoding="sync"
                    onLoad={markCurrentBottleReady}
                    onError={(event) => {
                      markHeroImageErrored(
                        event.currentTarget.currentSrc.includes('bottle-mobile.webp')
                          ? 'bottle-mobile.webp'
                          : 'bottle.webp',
                      );
                    }}
                    className="absolute inset-0 h-full w-full select-none object-cover object-center opacity-100 sm:object-right"
                  />
                </picture>
              ) : (
                <img
                  src={image.src}
                  alt=""
                  aria-hidden="true"
                  data-hero-image-file={image.fileName}
                  draggable={false}
                  loading="eager"
                  decoding="sync"
                  onLoad={() => markHeroImageReady(image.fileName)}
                  onError={() => markHeroImageErrored(image.fileName)}
                  className="absolute inset-0 h-full w-full select-none object-cover object-center opacity-90 sm:object-contain"
                />
              )}
            </div>
          );
        })}
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 z-[3] w-full overflow-hidden">
          <div className="absolute inset-y-[-10%] left-[-22%] w-[64%] bg-white/24 blur-[48px]" />
          <div className="absolute inset-y-[-14%] left-[-28%] w-[48%] bg-white/36 blur-[84px]" />
          <div className="absolute inset-y-[-18%] left-[-34%] w-[34%] bg-white/50 blur-[120px]" />
        </div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pb-20 sm:pb-20 lg:pb-0">
          <div id="hero-content" className="max-w-2xl">
            <div className="text-5xl sm:text-6xl lg:text-7xl font-light text-black leading-[1.06] tracking-tight mb-5" style={{ fontFamily: 'var(--font-heading), sans-serif' }}>
              <div className="overflow-hidden pb-[0.18em] -mb-[0.18em]">
                <div ref={titleLine1Ref}>{hero.title || t.home.hero.title}</div>
              </div>
              <div className="overflow-hidden pb-[0.18em] -mb-[0.18em]">
                <div ref={titleLine2Ref} className="text-black/75">{hero.titleAccent || t.home.hero.titleAccent}</div>
              </div>
            </div>
            <div className="overflow-hidden pb-[0.18em] -mb-[0.18em]">
              <p ref={heroSubRef} className="text-base sm:text-lg text-black/70 max-w-md mb-10 leading-relaxed">
                {hero.subtitle || t.home.hero.subtitle}
              </p>
            </div>
          </div>
        </div>
        <Link
          href={localizePublicHref(locale, hero.ctaHref || '/contact')}
          prefetch={false}
          className="hidden sm:inline-flex absolute z-20 bottom-8 right-5 sm:right-8 lg:right-10 items-center gap-1.5 rounded-[3px] border border-[#141618] bg-[#141618] px-6 py-3 text-[11px] font-medium tracking-[0.06em] uppercase text-[#FAFAF8] transition-colors duration-300 hover:border-[#ecfeff] hover:bg-[#ecfeff] hover:text-[#141618]"
        >
          <span>{hero.ctaLabel || t.home.hero.contactCta}</span>
        </Link>
      </section>
      </div>

      {/* ══════════════════════════════════════════
          BRAND STATEMENT
      ══════════════════════════════════════════ */}
      <div className="relative z-20 -mt-[10svh]">
        <WaveDivider />

        <section ref={brandRef} className="relative z-30 -mt-px overflow-hidden bg-[#006bb6] pt-6 pb-20 sm:pt-10 sm:pb-28 lg:pt-12 lg:pb-32">
          <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:items-start">
            <div className="sm:pt-[0.2em] text-center lg:text-left">
              <span
                ref={brandLabelRef}
                className="block text-4xl font-light tracking-normal text-white uppercase sm:text-5xl lg:text-6xl"
                style={{ fontFamily: 'var(--font-heading), sans-serif', fontWeight: 500, overflow: 'hidden', paddingBottom: '0.1em' }}
              >
                RAHATLYK
              </span>
            </div>
            <div className="min-w-0">
              <p
                ref={brandTextRef}
                className="text-lg font-light leading-[1.42] text-white/90 sm:text-xl lg:text-[1.45rem]"
                style={{ fontFamily: 'var(--font-heading), sans-serif' }}
              >
                {(() => {
                  const text = t.home.brand.text;
                  return text.split(/(\s+)/).map((part, index) => {
                    if (/^\s+$/.test(part)) return part;
                    return (
                      <span key={`${part}-${index}`} className="inline-block overflow-hidden align-bottom pb-[0.12em] mb-[-0.12em]">
                        <span
                          className="brand-text-word inline-block"
                        >
                          {part}
                        </span>
                      </span>
                    );
                  });
                })()}
              </p>
            </div>
          </div>
          </div>
        </section>
        <WaveDivider className="-mt-px bg-[#006bb6]" backFill="#ffffff" frontFill="#ffffff" />
      </div>

      {/* ══════════════════════════════════════════
          HORIZONTAL SCROLL — pinned panels
      ══════════════════════════════════════════ */}
      <div className="relative z-30 -mt-px bg-white pt-10 sm:pt-14 lg:pt-16">
      <HorizontalScrollSection
        data={horizontalScroll}
        pageLoaded={pageLoaded}
      />

      {/* ══════════════════════════════════════════
          COLLECTIONS — bottle carousel
      ══════════════════════════════════════════ */}
      <CollectionsSection
        lines={lines}
        sectionTag={t.home.categories.sectionTag}
        exploreLabel={t.home.categories.explore}
      />

      {/* ══════════════════════════════════════════
          CTA BANNER — last section
      ══════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden flex flex-col items-center justify-center"
        style={{ background: '#0b2e4a', height: '90svh' }}
      >
        {ctaBanner.imageUrl && (
          <picture className="pointer-events-none absolute inset-0 block">
            {ctaBanner.mobileImageUrl && (
              <source media="(max-width: 767px)" srcSet={ctaBanner.mobileImageUrl} />
            )}
            <img
              src={ctaBanner.imageUrl}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="h-full w-full object-cover object-center"
            />
          </picture>
        )}
        <div className="pointer-events-none absolute inset-0 bg-[#04192e]/35" />
        <div className="relative z-10 max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <div className="flex justify-center mb-5">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="text-white/70">
              <path d="M20 4C14 12 7 18 7 25.5a13 13 0 0 0 26 0C33 18 26 12 20 4z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 27a7 7 0 0 0 5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.5"/>
            </svg>
          </div>
          {ctaBanner.title && (
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-medium text-white mb-4 leading-tight"
              style={{ fontFamily: 'var(--font-heading), sans-serif' }}
            >
              {ctaBanner.title}
            </h2>
          )}
          {ctaBanner.subtitle && (
            <p className="text-white/70 text-base sm:text-lg mb-10 max-w-lg mx-auto leading-relaxed">
              {ctaBanner.subtitle}
            </p>
          )}
          <Link
            href={localizePublicHref(locale, ctaBanner.ctaHref || '/about')}
            prefetch={false}
            className="group inline-flex h-9 items-center gap-1.5 rounded-md bg-white/70 px-5 text-[11px] font-medium tracking-[0.06em] uppercase text-gray-700 backdrop-blur-sm transition-all duration-200 hover:bg-white"
          >
            <span>{ctaBanner.ctaLabel || t.home.ctaBanner.cta}</span>
            <svg className="group-hover:translate-x-1 transition-transform duration-200" width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M2 7H12M12 7L8 3M12 7L8 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </section>
      </div>
    </div>
  );
}
