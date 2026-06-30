'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { formatDate } from '@/lib/formatDate';
import { localizePublicHref, withLocale } from '@/lib/i18n/locale';
import type {
  HorizontalScrollData,
  HomeCtaBannerData,
  HomeHeroData,
  HomeStoryData,
  ArticleLabelsData,
  PayloadArticle,
  PayloadProductLine,
} from '@/types/payload';

declare global {
  interface Window {
    __pageIntroDone?: boolean;
    __homeHeroCoverReady?: boolean;
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

/* ── Word-level mask-reveal helper ───────────────────────────────── */
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
function HorizontalScrollSection({
  data,
  box5VideoEnabled,
}: {
  data: HorizontalScrollData;
  box5VideoEnabled: boolean;
}) {
  const { locale } = useLanguage();
  const containerRef    = useRef<HTMLDivElement>(null);
  const trackRef        = useRef<HTMLDivElement>(null);
  const isFirstDataRef  = useRef(true);
  const [isMobile, setIsMobile] = useState(false);
  const [loadedBox5CoverUrl, setLoadedBox5CoverUrl] = useState<string | null>(null);

  const shouldLoadBox5Video = box5VideoEnabled && (!data.box5CoverImageUrl || loadedBox5CoverUrl === data.box5CoverImageUrl);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    return () => pauseVideo(document.querySelector<HTMLVideoElement>('[data-box5-video]'));
  }, []);

  useEffect(() => {
    import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      ScrollTrigger.refresh();
    });
  }, [isMobile]);

  // After a language switch, router.refresh() updates content in sections above this
  // one (hero text, brand text, etc.), which shifts cumulative scroll offsets and
  // invalidates ScrollTrigger's cached start position. Refreshing recalculates it.
  useEffect(() => {
    if (isFirstDataRef.current) { isFirstDataRef.current = false; return; }
    let raf: number;
    import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    return () => cancelAnimationFrame(raf);
  }, [data]);

  useEffect(() => {
    let mounted = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ctx: any;
    let header: HTMLElement | null = null;
    let resetHeader: (() => void) | null = null;

    const init = async () => {
      const { gsap }          = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      if (!mounted || !containerRef.current || !trackRef.current) return;

      const track  = trackRef.current;
      header = document.querySelector<HTMLElement>('header');
      resetHeader = () => {
        if (!header) return;
        gsap.killTweensOf(header);
        gsap.set(header, { clearProps: 'transform' });
      };

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

      requestAnimationFrame(() => {
        if (mounted) ScrollTrigger.refresh();
      });
    };

    init();
    return () => {
      mounted = false;
      resetHeader?.();
      ctx?.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="h-screen overflow-hidden bg-white py-7">
      <div
        ref={trackRef}
        className="flex h-full gap-4 px-4"
        style={{ willChange: 'transform' }}
      >

        {/* ── BOX 1 · Full-height portrait photo ────────────────── */}
        <div
          className="relative h-full flex-shrink-0 overflow-hidden rounded-2xl bg-brand-100"
          style={{ width: isMobile ? '88vw' : '42vw' }}
        >
          {data.box1ImageUrl && (
            <Image
              src={data.box1ImageUrl}
              alt="Pure water — Rahatlyk quality"
              fill
              className="object-cover object-center"
              sizes="42vw"
            />
          )}
        </div>

        {/* ── BOX 2 · Dark text panel (optional background photo) ── */}
        <div
          className="relative h-full flex-shrink-0 bg-brand-950 flex flex-col justify-center overflow-hidden rounded-2xl"
          style={{ width: isMobile ? '80vw' : '28vw', padding: '0 4vw' }}
        >
          {data.box2ImageUrl && (
            <Image
              src={data.box2ImageUrl}
              alt=""
              fill
              className="object-cover object-center"
              sizes="28vw"
            />
          )}
          {/* Dark overlay so text stays readable over any background */}
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
                style={{
                  fontFamily: 'var(--font-heading), sans-serif',
                  fontSize:   'clamp(1.6rem, 2.6vw, 3rem)',
                }}
              >
                {data.box2Headline}
              </h2>
            )}
          </div>
        </div>

        {/* ── BOX 3 + BOX 4 · Split: product photo + CTA ────────── */}
        <div
          className="relative h-full flex-shrink-0 flex flex-col gap-4"
          style={{ width: isMobile ? '85vw' : '32vw' }}
        >
          {/* BOX 3 · Product photo */}
          <div className="relative overflow-hidden rounded-2xl bg-brand-100" style={{ flex: '1 1 60%' }}>
            {data.box3ImageUrl && (
              <Image
                src={data.box3ImageUrl}
                alt="Sarwan water poured fresh"
                fill
                className="object-cover object-center"
                sizes="32vw"
              />
            )}
          </div>

          {/* BOX 4 · CTA — live gradient background (static) */}
          <div
            className="relative flex-shrink-0 flex flex-col justify-center items-start overflow-hidden rounded-2xl"
            style={{ flex: '0 0 40%', padding: '0 3.5vw', background: '#0b2e4a' }}
          >
            {/* Live water blobs — static */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0d3d60] via-[#0b2e4a] to-[#04192e]" />
              <div className="water-blob-1 absolute -top-[30%] -left-[20%] w-[70%] h-[100%] rounded-full bg-[#38c8f5] blur-[60px]" />
              <div className="water-blob-2 absolute -top-[20%] left-[30%] w-[50%] h-[80%] rounded-full bg-[#d4f2ff] blur-[50px]" />
              <div className="water-blob-3 absolute top-[30%] right-[-10%] w-[50%] h-[70%] rounded-full bg-[#2a9fd8] blur-[55px]" />
              <div className="water-blob-5 absolute bottom-[-20%] left-[20%] w-[40%] h-[60%] rounded-full bg-[#a0e4fc] blur-[45px]" />
            </div>
            <div className="relative z-10 w-full">
              {data.box4Text && (
                <p
                  className="text-white font-light leading-snug mb-5"
                  style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.25rem)' }}
                >
                  {data.box4Text}
                </p>
              )}
              {data.box4ButtonLabel && (
                <Link
                  href={localizePublicHref(locale, data.box4ButtonHref || '#')}
                  className="rounded-[3px] border border-white bg-white px-6 py-3 text-[11px] font-medium tracking-[0.06em] uppercase text-[#141618] transition-colors duration-300 hover:border-[#ecfeff] hover:bg-[#ecfeff]"
                >
                  {data.box4ButtonLabel}
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* ── BOX 5 · Full-bleed video with cover image fallback ── */}
        <div
          className="relative h-full flex-shrink-0 overflow-hidden rounded-2xl bg-brand-100"
          style={{ width: isMobile ? '90vw' : '52vw' }}
        >
          {data.box5CoverImageUrl && (
            <Image
              src={data.box5CoverImageUrl}
              alt=""
              fill
              aria-hidden="true"
              sizes="(max-width: 767px) 90vw, 52vw"
              onLoad={() => setLoadedBox5CoverUrl(data.box5CoverImageUrl)}
              onError={() => setLoadedBox5CoverUrl(data.box5CoverImageUrl)}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
          {data.box5VideoUrl && shouldLoadBox5Video && (
            <video
              src={data.box5VideoUrl}
              data-box5-video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              onCanPlay={(event) => {
                const video = event.currentTarget;
                video.muted = true;
                void video.play().catch(() => undefined);
              }}
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
                  style={{
                    fontFamily: 'var(--font-heading), sans-serif',
                    fontSize:   'clamp(1.8rem, 3.2vw, 3.8rem)',
                  }}
                >
                  {data.box5Headline}
                </h2>
              )}
            </div>
          )}
        </div>

        {/* ── BOX 6 · Closing panel (optional background photo) ─── */}
        <div
          className="relative h-full flex-shrink-0 bg-brand-50 flex flex-col justify-center overflow-hidden rounded-2xl"
          style={{ width: isMobile ? '80vw' : '25vw', padding: '0 3.5vw' }}
        >
          {data.box6ImageUrl && (
            <Image
              src={data.box6ImageUrl}
              alt=""
              fill
              className="object-cover object-center"
              sizes="25vw"
            />
          )}
          {/* Light overlay so text stays readable over any background */}
          {data.box6ImageUrl && (
            <div className="absolute inset-0 bg-brand-50/70" />
          )}
          <div className="relative z-10">
            {data.box6Tag && (
              <span className="block text-brand-600 text-[10px] font-medium tracking-[0.35em] uppercase mb-5">
                {data.box6Tag}
              </span>
            )}
            {data.box6Headline && (
              <h3
                className="text-brand-950 font-light leading-snug mb-8"
                style={{
                  fontFamily: 'var(--font-heading), sans-serif',
                  fontSize:   'clamp(1.3rem, 1.9vw, 2.1rem)',
                }}
              >
                {data.box6Headline}
              </h3>
            )}
            {data.box6ButtonLabel && (
              <Link
                href={localizePublicHref(locale, data.box6ButtonHref || '#')}
                className="w-fit rounded-[3px] border border-[#141618] bg-[#141618] px-6 py-3 text-[11px] font-medium tracking-[0.06em] uppercase text-[#FAFAF8] transition-colors duration-300 hover:border-[#ecfeff] hover:bg-[#ecfeff] hover:text-[#141618]"
              >
                {data.box6ButtonLabel}
              </Link>
            )}
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-shrink-0 w-4" aria-hidden="true" />

      </div>
    </div>
  );
}

/* ── Button-driven category carousel ─────────────────────────────── */
function CollectionsSection({
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
  const [snapIndex, setSnapIndex] = useState(0);

  const recalculateLayout = useCallback(() => {
    if (!sectionRef.current) return;
    const header = document.querySelector('header');
    const headerH = header ? header.offsetHeight : 0;
    const h = window.innerHeight - headerH;
    const isMobile = window.innerWidth < 768;
    const bottleH = Math.round(h * (isMobile ? 0.5 : 0.8));
    const sectionH = isMobile ? window.innerHeight : h;
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
    window.addEventListener('resize', recalculateLayout);
    return () => window.removeEventListener('resize', recalculateLayout);
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

      const headerEl = document.querySelector('header');
      const headerH  = headerEl ? headerEl.offsetHeight : 0;
      const setPinProgress = gsap.quickTo(pinProgressRef.current, 'scaleY', {
        duration: 0.2,
        ease: 'power2.out',
      });
      const showPinProgress = (origin: 'top' | 'bottom') => {
        gsap.set(pinProgressTrackRef.current, { transformOrigin: origin });
        gsap.to(pinProgressTrackRef.current, {
          scaleY: 1,
          duration: 0.4,
          ease: 'power2.out',
          overwrite: true,
        });
      };
      const hidePinProgress = (origin: 'top' | 'bottom') => {
        gsap.set(pinProgressTrackRef.current, { transformOrigin: origin });
        gsap.to(pinProgressTrackRef.current, {
          scaleY: 0,
          duration: 0.3,
          ease: 'power2.in',
          overwrite: true,
        });
      };

      const pin = ScrollTrigger.create({
        trigger:          sectionRef.current!,
        pin:              true,
        start:            `top top+=${headerH}`,
        end:              `+=${Math.round(window.innerHeight * 0.35)}`,
        pinSpacing:       true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          setPinProgress(self.progress);
        },
        onRefresh: (self) => {
          gsap.set(pinProgressRef.current, { scaleY: self.progress });
        },
        onEnter: () => showPinProgress('top'),
        onEnterBack: () => showPinProgress('bottom'),
        onLeave: () => hidePinProgress('bottom'),
        onLeaveBack: () => hidePinProgress('top'),
      });

      cleanup = () => { pin.kill(); st.kill(); };
    };
    init();
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

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

  const goTo = async (idx: number) => {
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
  };

  const activeLine = lines[snapIndex];

  return (
    <div ref={sectionRef} className="relative overflow-hidden bg-white">
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
            willChange:      'transform, opacity, filter',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={line.imageUrl ?? '/products/FeatureProductImg_RTD_LT.png'}
            alt={line.name}
            loading="lazy"
            style={{ width: 'auto', height: '100%', display: 'block' }}
          />
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
          className="group inline-flex items-center gap-1.5 rounded-[3px] border border-[#141618] bg-[#141618] h-9 px-5 text-[11px] font-medium tracking-[0.06em] uppercase text-[#FAFAF8] transition-colors duration-300 hover:border-[#ecfeff] hover:bg-[#ecfeff] hover:text-[#141618]"
        >
          <span>{exploreLabel}</span>
          <svg className="group-hover:translate-x-1 transition-transform duration-200" width="13" height="13" viewBox="0 0 14 14" fill="none">
            <path d="M2 7H12M12 7L8 3M12 7L8 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
        <div className="flex items-center gap-5">
          <button onClick={() => goTo(snapIndex - 1)} disabled={snapIndex === 0} aria-label="Previous" className="flex items-center justify-center w-9 h-9 rounded-md bg-black/[0.06] hover:bg-black/[0.11] text-gray-700 disabled:opacity-20 transition-all duration-200">
            <svg width="16" height="16" viewBox="0 0 12 12" fill="none"><path d="M8 2L3 6L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <div className="flex items-center gap-2">
            {lines.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} aria-label={`Category ${i + 1}`} className={`rounded-full transition-all duration-300 ${i === snapIndex ? 'w-6 h-[4px] bg-black' : 'w-[4px] h-[4px] bg-black/25 hover:bg-black/50'}`} />
            ))}
          </div>
          <button onClick={() => goTo(snapIndex + 1)} disabled={snapIndex === lines.length - 1} aria-label="Next" className="flex items-center justify-center w-9 h-9 rounded-md bg-black/[0.06] hover:bg-black/[0.11] text-gray-700 disabled:opacity-20 transition-all duration-200">
            <svg width="16" height="16" viewBox="0 0 12 12" fill="none"><path d="M4 2L9 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── News Carousel (auto-play + infinite loop) ────────────────────── */
function NewsCarousel({ tag, articles }: { tag: string; articles: PayloadArticle[] }) {
  const { locale } = useLanguage();
  const [visCount, setVisCount] = useState(3);
  const trackRef   = useRef<HTMLDivElement>(null);
  const busy       = useRef(false);
  const timer      = useRef<ReturnType<typeof setTimeout> | null>(null);
  const advanceRef = useRef<(dir: 1 | -1) => void>(() => {});

  const items = useMemo(() => articles.slice(0, 5), [articles]);

  const extItems = useMemo(() => [
    ...items.slice(-visCount),
    ...items,
    ...items.slice(0, visCount),
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
          {extItems.map((article, i) => (
            <Link
              key={`${article.id}-${i}`}
              href={withLocale(locale, `/news/${article.id}`)}
              className="flex-shrink-0 group cursor-pointer w-[60vw] sm:w-[31vw] lg:w-[20vw]"
              style={{ height: '60vh' }}
            >
              <div className="relative overflow-hidden rounded-lg h-full">
                {article.images[0]?.url && (
                  <Image
                    src={article.images[0].url}
                    alt={article.title}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 33vw"
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
  story,
  newsArticles,
  ctaBanner,
  hero,
  articleLabels,
}: {
  lines: PayloadProductLine[]
  horizontalScroll: HorizontalScrollData
  story: HomeStoryData
  newsArticles: PayloadArticle[]
  ctaBanner: HomeCtaBannerData
  hero: HomeHeroData
  articleLabels: ArticleLabelsData
}) {
  const { t, locale } = useLanguage();
  const [readyHeroVideoUrl, setReadyHeroVideoUrl] = useState<string | null>(null);
  const [fullyLoadedHeroVideoUrl, setFullyLoadedHeroVideoUrl] = useState<string | null>(null);
  const [loadedHeroCoverUrl, setLoadedHeroCoverUrl] = useState<string | null>(null);
  const [homePageAssetsReady, setHomePageAssetsReady] = useState(false);
  const isHeroCoverReady = !hero.posterUrl || loadedHeroCoverUrl === hero.posterUrl;
  const shouldLoadHeroVideo = !!hero.videoUrl && isHeroCoverReady && homePageAssetsReady;
  const isHeroVideoFullyLoaded = !hero.videoUrl || fullyLoadedHeroVideoUrl === hero.videoUrl;

  const titleLine1Ref   = useRef<HTMLDivElement>(null);
  const titleLine2Ref   = useRef<HTMLDivElement>(null);
  const heroSubRef      = useRef<HTMLParagraphElement>(null);
  const brandRef        = useRef<HTMLElement>(null);
  const brandLabelRef   = useRef<HTMLSpanElement>(null);
  const brandTextRef    = useRef<HTMLParagraphElement>(null);
  const storyRef        = useRef<HTMLDivElement>(null);
  const storyImgRef     = useRef<HTMLDivElement>(null);
  const heroVideoRef    = useRef<HTMLVideoElement>(null);
  const prevLocaleRef   = useRef<string | undefined>(undefined);

  const markHeroCoverReady = useCallback(() => {
    setLoadedHeroCoverUrl(hero.posterUrl);
    if (typeof window !== 'undefined') {
      window.__homeHeroCoverReady = true;
      window.dispatchEvent(new CustomEvent('home-hero-cover-ready'));
    }
  }, [hero.posterUrl]);

  useEffect(() => {
    if (!hero.posterUrl && typeof window !== 'undefined') {
      window.__homeHeroCoverReady = true;
      window.dispatchEvent(new CustomEvent('home-hero-cover-ready'));
    }
  }, [hero.posterUrl]);

  useEffect(() => {
    let cancelled = false;

    const markReady = () => {
      void document.fonts.ready.then(() => {
        if (!cancelled) setHomePageAssetsReady(true);
      });
    };

    if (document.readyState === 'complete') {
      markReady();
    } else {
      window.addEventListener('load', markReady, { once: true });
    }

    return () => {
      cancelled = true;
      window.removeEventListener('load', markReady);
    };
  }, []);

  useEffect(() => {
    return () => pauseVideo(document.querySelector<HTMLVideoElement>('[data-hero-video]'));
  }, []);

  const handleHeroCanPlay = useCallback(() => {
    const video = heroVideoRef.current;
    if (video) {
      video.muted = true;
      void video.play().catch(() => undefined);
    }
    setReadyHeroVideoUrl(hero.videoUrl);
  }, [hero.videoUrl]);

  const checkHeroVideoFullyLoaded = useCallback(() => {
    const video = heroVideoRef.current;
    if (!hero.videoUrl || !video) {
      setFullyLoadedHeroVideoUrl(hero.videoUrl);
      return;
    }

    const duration = video.duration;
    if (!Number.isFinite(duration) || duration <= 0 || video.buffered.length === 0) return;

    for (let index = 0; index < video.buffered.length; index += 1) {
      if (video.buffered.start(index) <= 0.25 && video.buffered.end(index) >= duration - 0.25) {
        setFullyLoadedHeroVideoUrl(hero.videoUrl);
        return;
      }
    }
  }, [hero.videoUrl]);

  // ── Hero animation ──────────────────────────────────────────────
  useEffect(() => {
    const line1 = titleLine1Ref.current;
    const line2 = titleLine2Ref.current;
    const sub   = heroSubRef.current;

    const heroTitle       = hero.title       || t.home.hero.title;
    const heroTitleAccent = hero.titleAccent || t.home.hero.titleAccent;
    const heroSubtitle    = hero.subtitle    || t.home.hero.subtitle;

    const isLocaleChange = locale !== prevLocaleRef.current;
    prevLocaleRef.current = locale;

    // hero prop re-fired by router.refresh() but locale didn't change — just swap text silently
    if (!isLocaleChange) {
      if (line1) line1.textContent = heroTitle;
      if (line2) line2.textContent = heroTitleAccent;
      if (sub)  sub.textContent   = heroSubtitle;
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let tl: any = null;
    const restores: Array<() => void> = [];
    let introListener: (() => void) | null = null;

    const run = async () => {
      const { gsap } = await import('gsap');
      if (!line1 || !line2) return;

      gsap.killTweensOf([line1, line2, ...(sub ? [sub] : [])]);

      const { spans: spans1, restore: restore1 } = splitWordsIntoSpans(line1, heroTitle);
      const { spans: spans2, restore: restore2 } = splitWordsIntoSpans(line2, heroTitleAccent);
      restores.push(restore1, restore2);

      const subSpans: HTMLElement[] = [];
      let restore3: (() => void) | null = null;
      if (sub) {
        const result = splitWordsIntoSpans(sub, heroSubtitle);
        subSpans.push(...result.spans);
        restore3 = result.restore;
        restores.push(restore3);
      }

      tl = gsap.timeline({ delay: 0.2 });

      tl.fromTo(
        [...spans1, ...spans2],
        { yPercent: 115 },
        {
          yPercent: 0,
          duration: 0.75,
          stagger: 0.06,
          ease: 'power4.out',
          onComplete: () => { restore1(); restore2(); },
        }
      );

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
              restores.length = 0;
            },
          },
          '<0.4'
        );
      }

      const heroContent = document.getElementById('hero-content');
      if (heroContent) heroContent.style.opacity = '1';
    };

    if (introHasCompleted) {
      run();
    } else {
      introListener = () => run();
      window.addEventListener('page-intro-done', introListener, { once: true });
    }

    return () => {
      tl?.kill();
      restores.forEach((r) => r());
      restores.length = 0;
      if (introListener) {
        window.removeEventListener('page-intro-done', introListener);
        introListener = null;
      }
    };
  }, [locale, t.home.hero, hero]);

  // ── Scroll-triggered animations ─────────────────────────────────
  useEffect(() => {
    const cleanupFns: (() => void)[] = [];

    const init = async () => {
      const { gsap }          = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

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

      if (storyRef.current && storyImgRef.current) {
        const st3 = gsap.fromTo(
          storyImgRef.current,
          { yPercent: 10 },
          {
            yPercent: -10,
            ease: 'none',
            scrollTrigger: {
              trigger: storyRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
        cleanupFns.push(() => st3.scrollTrigger?.kill());
      }
    };

    init();
    return () => { cleanupFns.forEach((fn) => fn()); };
  }, []);

  return (
    <div>
      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-end overflow-hidden">
        <div className="absolute inset-0 bg-brand-900" />
        {hero.posterUrl && (
          <Image
            src={hero.posterUrl}
            alt=""
            fill
            priority
            aria-hidden="true"
            onLoad={markHeroCoverReady}
            onError={markHeroCoverReady}
            className="object-cover object-center"
            sizes="100vw"
          />
        )}
        {shouldLoadHeroVideo ? (
          <video
            ref={heroVideoRef}
            data-hero-video
            src={hero.videoUrl ?? undefined}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onCanPlay={handleHeroCanPlay}
            onCanPlayThrough={checkHeroVideoFullyLoaded}
            onLoadedMetadata={checkHeroVideoFullyLoaded}
            onProgress={checkHeroVideoFullyLoaded}
            onError={() => {
              setReadyHeroVideoUrl(null);
              setFullyLoadedHeroVideoUrl(hero.videoUrl);
            }}
            className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ${
              readyHeroVideoUrl === hero.videoUrl ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pb-20 lg:pb-28">
          <div id="hero-content" className="max-w-2xl">
            <div className="text-5xl sm:text-6xl lg:text-7xl font-light text-white leading-[1.06] tracking-tight mb-5" style={{ fontFamily: 'var(--font-heading), sans-serif' }}>
              <div className="overflow-hidden pb-[0.18em] -mb-[0.18em]">
                <div ref={titleLine1Ref}>{hero.title || t.home.hero.title}</div>
              </div>
              <div className="overflow-hidden pb-[0.18em] -mb-[0.18em]">
                <div ref={titleLine2Ref} className="text-white/75">{hero.titleAccent || t.home.hero.titleAccent}</div>
              </div>
            </div>
            <div className="overflow-hidden pb-[0.18em] -mb-[0.18em]">
              <p ref={heroSubRef} className="text-base sm:text-lg text-white/65 max-w-md mb-10 leading-relaxed">
                {hero.subtitle || t.home.hero.subtitle}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          BRAND STATEMENT
      ══════════════════════════════════════════ */}
      <section ref={brandRef} className="py-20 sm:py-28 lg:py-32 bg-white">
        <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:items-start">
            <div className="sm:pt-[0.2em] text-center">
              <span
                ref={brandLabelRef}
                className="block text-[15px] font-medium tracking-[0.45em] text-black uppercase"
                style={{ fontFamily: 'var(--font-heading), sans-serif', fontWeight: 500, overflow: 'hidden', paddingBottom: '0.1em' }}
              >
                RAHATLYK
              </span>
            </div>
            <div className="min-w-0">
              <p
                ref={brandTextRef}
                className="text-base sm:text-[17px] text-black leading-[1.38] font-light"
                style={{ fontFamily: 'var(--font-heading), sans-serif' }}
              >
                {(() => {
                  const text = t.home.brand.text;
                  return text.split(/(\s+)/).map((part, index) => {
                    if (/^\s+$/.test(part)) return part;
                    return (
                      <span key={`${part}-${index}`} className="inline-block overflow-hidden align-bottom pb-[0.12em] mb-[-0.12em]">
                        <span
                          className={`brand-text-word inline-block ${part === 'RAHATLYK' ? 'italic text-[#0891b2]' : ''}`}
                          style={part === 'RAHATLYK' ? { fontFamily: 'var(--font-accent), Georgia, "Times New Roman", serif' } : undefined}
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

      {/* ══════════════════════════════════════════
          HORIZONTAL SCROLL — pinned panels
      ══════════════════════════════════════════ */}
      <HorizontalScrollSection data={horizontalScroll} box5VideoEnabled={isHeroVideoFullyLoaded} />

      {/* ══════════════════════════════════════════
          COLLECTIONS — bottle carousel
      ══════════════════════════════════════════ */}
      <CollectionsSection
        lines={lines}
        sectionTag={t.home.categories.sectionTag}
        exploreLabel={t.home.categories.explore}
      />

      {/* ══════════════════════════════════════════
          OUR STORY — full-bleed photo background
      ══════════════════════════════════════════ */}
      <section
        ref={storyRef}
        className="relative overflow-hidden h-[100svh] flex items-center"
      >
        <div
          ref={storyImgRef}
          className="absolute inset-x-0 -top-[15%] -bottom-[15%]"
        >
          {story.imageUrl ? (
            <Image
              src={story.imageUrl}
              alt="The story behind RAHATLYK purity"
              fill
              className="object-cover object-center"
              sizes="100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-brand-900" />
          )}
        </div>
        <div className="pointer-events-none absolute inset-0 bg-white/20" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-24">
          <div className="max-w-xl mx-auto text-center">
            {story.title && (
              <h2
                className="story-animate text-2xl sm:text-3xl lg:text-4xl font-medium text-black leading-tight mb-12"
                style={{ fontFamily: 'var(--font-heading), sans-serif' }}
              >
                {story.title}
              </h2>
            )}
            {story.text && (
              <p className="story-animate text-black text-sm sm:text-base leading-relaxed font-medium">
                {story.text}
              </p>
            )}
          </div>
        </div>

        {/* Award badge — bottom-right corner */}
        <div className="absolute bottom-7 right-7 z-10 flex max-w-[210px] items-center gap-3 rounded-md bg-white/70 p-3.5 backdrop-blur-sm">
          <div className="w-9 h-9 flex items-center justify-center flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
              <path d="M4 22h16" />
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
            </svg>
          </div>
          <div>
            <div className="font-medium text-gray-700 text-[11px] leading-tight">Best Beverage Brand</div>
            <div className="text-gray-700/60 text-[10px] mt-0.5">Central Asia Award 2025</div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          LATEST NEWS CAROUSEL
      ══════════════════════════════════════════ */}
      <section className="bg-white overflow-hidden" style={{ height: '100svh' }}>
        <NewsCarousel tag={articleLabels.homeSectionTag} articles={newsArticles} />
      </section>

      {/* ══════════════════════════════════════════
          CTA BANNER — last section
      ══════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden flex flex-col items-center justify-center"
        style={{ background: '#0b2e4a', height: '90svh' }}
      >
        {ctaBanner.imageUrl && (
          <Image
            src={ctaBanner.imageUrl}
            alt=""
            fill
            sizes="100vw"
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
          />
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
            href={localizePublicHref(locale, ctaBanner.ctaHref || '/products')}
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
  );
}
