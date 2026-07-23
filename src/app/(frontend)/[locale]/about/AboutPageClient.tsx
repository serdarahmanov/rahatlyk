'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n/LanguageContext';


export type AboutPageData = {
  hero: {
    coverImage: string | null;
    mobileCoverImage: string | null;
    videoUrl: string | null;
    mobileVideoUrl: string | null;
    title: string;
    accentWordIndex: number;
  };
  whoWeAre: {
    statement: {
      text: string;
      accentWordIndex: number;
    };
    sectionTitle: string;
    paragraphs: string[];
    fullViewportImage: string | null;
    backgroundVideo: string | null;
  };
  story: {
    sectionLabel: string;
    title: string;
    subtitle: string;
    milestones: Array<{
      year: string;
      title: string;
      body: string;
      isCurrent?: boolean;
    }>;
  };
  numbers: {
    stats: Array<{
      value: number;
      suffix: string;
      label: string;
    }>;
    tagline: {
      text: string;
      accentText: string;
    };
  };
  mosaic: {
    leftImage: string | null;
    centerImage: string | null;
    rightImage: string | null;
  };
  finalSection: {
    image: string | null;
    mobileImage: string | null;
    heading: string;
    body: string;
  };
};

const headingStyle = { fontFamily: 'var(--font-heading), sans-serif' };
const accentStyle = { fontFamily: 'var(--font-accent), Georgia, "Times New Roman", serif' };

// Videos are deferred until the page's eagerly-loading images have loaded,
// so a video download never competes with the content that renders first.
// Natively lazy-loaded images (loading="lazy", e.g. the mosaic and bubble
// parallax images) are excluded — they're meant to stay deferred until the
// user scrolls near them, and waiting on them would block the videos for
// no reason (up to the full timeout cap) if the user never scrolls there.
function waitForAboutImages(root: HTMLElement) {
  const WAIT_CAP_MS = 12000;

  const waitForImage = (image: HTMLImageElement) =>
    new Promise<void>((resolve) => {
      if (image.complete && image.naturalWidth > 0) {
        resolve();
        return;
      }

      const done = () => {
        image.removeEventListener('load', done);
        image.removeEventListener('error', done);
        resolve();
      };

      image.addEventListener('load', done, { once: true });
      image.addEventListener('error', done, { once: true });
    });

  const images = Array.from(root.querySelectorAll<HTMLImageElement>('img'))
    .filter((image) => image.loading !== 'lazy');
  const mediaWait = Promise.all(images.map(waitForImage));
  const cap = new Promise<void>((resolve) => window.setTimeout(resolve, WAIT_CAP_MS));

  return Promise.race([mediaWait.then(() => undefined), cap]);
}

export default function AboutPageClient({ data }: { data: AboutPageData }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLElement>(null);
  const heroDarkRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLImageElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const videoScrubSectionRef = useRef<HTMLElement>(null);
  const videoScrubRef = useRef<HTMLVideoElement>(null);
  const mosaicSectionRef = useRef<HTMLElement>(null);
  const mosaicScrollerRef = useRef<HTMLDivElement>(null);
  const lastPlxSectionRef = useRef<HTMLElement>(null);
  const lastPlxMediaRef = useRef<HTMLDivElement>(null);
  const [openMilestone, setOpenMilestone] = useState<number>(0);
  const [shouldLoadHeroVideo, setShouldLoadHeroVideo] = useState(false);
  const [heroVideoReady, setHeroVideoReady] = useState(false);
  const [contentMediaReady, setContentMediaReady] = useState(false);
  const [activeHeroVideoUrl, setActiveHeroVideoUrl] = useState<string | null>(null);
  const [mosaicIndex, setMosaicIndex] = useState(0);

  const { locale } = useLanguage();
  const isFirstLocaleRef = useRef(true);

  // After a language switch, router.refresh() can shift element heights
  // (different text lengths per locale), invalidating ScrollTrigger's cached
  // start/end positions. Refreshing after the DOM settles fixes the lag.
  useEffect(() => {
    if (isFirstLocaleRef.current) { isFirstLocaleRef.current = false; return; }
    let raf: number;
    import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    return () => cancelAnimationFrame(raf);
  }, [locale]);

  useEffect(() => {
    let cancelled = false;
    let selectFrame = 0;
    const selectHeroVideo = () => {
      if (cancelled) return;
      const isMobile = window.innerWidth < 768;
      const nextUrl =
        isMobile
          ? data.hero.mobileVideoUrl || data.hero.videoUrl
          : data.hero.videoUrl;

      setActiveHeroVideoUrl(nextUrl || null);
    };

    selectFrame = requestAnimationFrame(selectHeroVideo);
    window.addEventListener('resize', selectHeroVideo);
    window.addEventListener('orientationchange', selectHeroVideo);

    return () => {
      cancelled = true;
      cancelAnimationFrame(selectFrame);
      window.removeEventListener('resize', selectHeroVideo);
      window.removeEventListener('orientationchange', selectHeroVideo);
    };
  }, [data.hero.mobileVideoUrl, data.hero.videoUrl]);

  // Both about-page videos wait for the page's images to finish loading first,
  // so a large video download never competes with (and delays) the rest of
  // the page's content.
  useEffect(() => {
    let cancelled = false;
    let waitFrame = 0;

    waitFrame = requestAnimationFrame(() => {
      if (cancelled || !rootRef.current) return;
      waitForAboutImages(rootRef.current).then(() => {
        if (!cancelled) setContentMediaReady(true);
      });
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(waitFrame);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    let resetFrame = 0;

    resetFrame = requestAnimationFrame(() => {
      if (cancelled) return;
      setShouldLoadHeroVideo(false);
      setHeroVideoReady(false);

      if (!activeHeroVideoUrl || !contentMediaReady) return;
      setShouldLoadHeroVideo(true);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(resetFrame);
    };
  }, [activeHeroVideoUrl, contentMediaReady]);

  // Re-initialize word-opacity animations whenever text content changes.
  // The initial mount AND every locale switch (which loads new text via
  // router.refresh()) both trigger this, ensuring GSAP always targets the
  // current DOM elements — not stale detached ones from the previous render.
  useEffect(() => {
    let wordCtx: { revert: () => void } | undefined;
    let cancelled = false;

    const setup = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      if (cancelled || !rootRef.current) return;

      wordCtx = gsap.context(() => {
        gsap.fromTo('.about-statement .statement-word',
          { opacity: 0.12 },
          {
            opacity: 1,
            duration: 0.09,
            stagger: 0.045,
            ease: 'none',
            scrollTrigger: {
              trigger: '.about-statement p',
              start: 'top 90%',
              end: 'bottom 50%',
              scrub: true,
            },
          }
        );

        gsap.utils.toArray<HTMLElement>('[data-about-para]').forEach((para) => {
          const words = para.querySelectorAll<HTMLElement>('.body-word');
          if (!words.length) return;
          gsap.to(words, {
            opacity: 1,
            duration: 0.07,
            stagger: 0.035,
            ease: 'none',
            scrollTrigger: {
              trigger: para,
              start: 'top 90%',
              end: 'bottom 52%',
              scrub: true,
            },
          });
        });

        // After layout settles, evaluate all scroll positions so words that
        // are already scrolled past jump to opacity 1 immediately.
        requestAnimationFrame(() => ScrollTrigger.refresh());
      }, rootRef);
    };

    setup();

    return () => {
      cancelled = true;
      wordCtx?.revert();
    };
  }, [data.whoWeAre.statement.text]);

  useEffect(() => {
    let cleanup = () => {};
    let cancelled = false;
    const extraCleanup: Array<() => void> = [];

    const init = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');

      if (cancelled || !rootRef.current) return;

      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (reduceMotion) {
          gsap.set('[data-about-fade]', { opacity: 1, y: 0 });
          gsap.set('.about-hero-title', { opacity: 1 });
          gsap.set('.about-hero-word-inner', { yPercent: 0 });
          gsap.set('.statement-word', { opacity: 1 });
          gsap.set('.wwa-mask-word', { yPercent: 0 });
          gsap.set('.body-word', { opacity: 1 });
          gsap.set('.about-clip', { clipPath: 'inset(0% 0% 0% 0%)' });
          gsap.set('[data-about-plx-strong]', { yPercent: 0 });
          gsap.set('[data-last-plx-media]', { y: 0 });
          gsap.set('.about-mosaic-intro, .about-mosaic-track, .about-mosaic-card', { opacity: 1, x: 0, y: 0 });
          return;
        }

        const heroWords = gsap.utils.toArray<HTMLElement>('.about-hero-word-inner');
        gsap.set(heroWords, { yPercent: 115 });
        gsap.set('.about-hero-title', { opacity: 1 });
        gsap.to(heroWords, {
          yPercent: 0,
          duration: 0.75,
          stagger: 0.06,
          ease: 'power4.out',
          delay: 0.2,
        });

        if (pageRef.current && heroDarkRef.current && heroImageRef.current) {
          gsap.timeline({
            scrollTrigger: {
              trigger: pageRef.current,
              start: 'top bottom',
              end: 'top 40%',
              scrub: true,
            },
          })
            .to(heroDarkRef.current, { opacity: 0.94, ease: 'none' }, 0)
            .to(heroImageRef.current, { scale: 1.18, ease: 'none' }, 0);
        }

        gsap.utils.toArray<HTMLElement>('[data-about-fade]').forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 26 },
            {
              opacity: 1,
              y: 0,
              duration: 0.85,
              ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 90%' },
            }
          );
        });

        // "Who we are" — word mask slide-up, staggered
        const wwaWords = gsap.utils.toArray<HTMLElement>('.wwa-mask-word');
        if (wwaWords.length) {
          gsap.set(wwaWords, { yPercent: 110 });
          gsap.to(wwaWords, {
            yPercent: 0,
            duration: 0.65,
            stagger: 0.09,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: wwaWords[0].parentElement?.parentElement ?? wwaWords[0],
              start: 'top 88%',
            },
          });
        }

        gsap.utils.toArray<HTMLElement>('.about-clip').forEach((frame) => {
          gsap.fromTo(
            frame,
            { clipPath: 'inset(12% 6% 12% 6%)' },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              duration: 1.15,
              ease: 'power3.out',
              scrollTrigger: { trigger: frame, start: 'top 86%' },
            }
          );
        });

        gsap.utils.toArray<HTMLElement>('[data-about-plx]').forEach((img) => {
          gsap.fromTo(
            img,
            { yPercent: -8 },
            {
              yPercent: 8,
              ease: 'none',
              scrollTrigger: {
                trigger: img.parentElement,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            }
          );
        });

        gsap.utils.toArray<HTMLElement>('[data-about-plx-strong]').forEach((img) => {
          const mobile = window.innerWidth < 640
          gsap.fromTo(
            img,
            { yPercent: mobile ? -4 : -14, scale: mobile ? 1 : 1.08 },
            {
              yPercent: mobile ? 4 : 14,
              scale: mobile ? 1 : 1.08,
              ease: 'none',
              scrollTrigger: {
                trigger: img.parentElement,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            }
          );
        });

        if (videoScrubSectionRef.current && videoScrubRef.current) {
          const video = videoScrubRef.current;
          const section = videoScrubSectionRef.current;

          // Play/pause by checking actual rendered position (works during pin too)
          const syncVideo = () => {
            const { top, bottom } = section.getBoundingClientRect();
            const visible = top < window.innerHeight && bottom > 0;
            if (visible && video.paused) {
              video.play().catch(() => {});
            } else if (!visible && !video.paused) {
              video.pause();
              video.currentTime = 0;
            }
          };
          window.addEventListener('scroll', syncVideo, { passive: true });
          extraCleanup.push(() => window.removeEventListener('scroll', syncVideo));

          // Pin ends exactly when para 2 (starting at y:2.5vh) reaches centre (y:0)
          ScrollTrigger.create({
            trigger: section,
            start: 'top top',
            end: () => '+=' + window.innerHeight * 2.5,
            pin: true,
            invalidateOnRefresh: true,
          });

          const paras = Array.from(section.querySelectorAll<HTMLElement>('[data-video-para]'));
          if (paras.length === 3) {
            const vh = window.innerHeight;

            // Para 0 centre sits at the viewport bottom edge when pin starts,
            // so its top edge is exactly at the fold — enters the instant user scrolls.
            // Para 1 and 2 each sit 1 viewport further below.
            gsap.set(paras[0], { opacity: 1, y: vh * 0.5 });
            gsap.set(paras[1], { opacity: 1, y: vh * 1.5 });
            gsap.set(paras[2], { opacity: 1, y: vh * 2.5 });

            // Move all 2.5 viewports up — para 2 lands exactly at centre when pin ends.
            const tl = gsap.timeline({ paused: true })
              .to(paras, { y: `-=${2.5 * vh}`, duration: 2.5, ease: 'none' });

            ScrollTrigger.create({
              trigger: section,
              start: 'top top',
              end: () => '+=' + window.innerHeight * 2.5,
              animation: tl,
              scrub: true,
              invalidateOnRefresh: true,
            });
          }
        }

        if (lastPlxSectionRef.current && lastPlxMediaRef.current) {
          const section = lastPlxSectionRef.current;
          const media = lastPlxMediaRef.current;
          const travel = () => Math.max(media.offsetHeight - section.offsetHeight, 0);

          gsap.fromTo(
            media,
            { y: () => -travel() },
            {
              y: 0,
              ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
                invalidateOnRefresh: true,
              },
            }
          );
        }

        gsap.utils.toArray<HTMLElement>('[data-count-to]').forEach((el) => {
          const target = Number(el.dataset.countTo);
          const textNode = Array.from(el.childNodes).find((n) => n.nodeType === Node.TEXT_NODE);
          if (!textNode) return;
          ScrollTrigger.create({
            trigger: el,
            start: 'top 90%',
            once: true,
            onEnter: () => {
              const obj = { val: 0 };
              gsap.to(obj, {
                val: target,
                duration: 1.25,
                ease: 'power1.out',
                onUpdate: () => { textNode.textContent = String(Math.round(obj.val)); },
              });
            },
          });
        });

        if (mosaicSectionRef.current) {
          const rows = gsap.utils.toArray<HTMLElement>('.about-mosaic-row');

          rows.forEach((row, index) => {
            const direction = Number(row.dataset.dir) || 1;
            const track = row.querySelector<HTMLElement>('.about-mosaic-track');

            if (!track) return;

            const overflow = () => Math.max(track.scrollWidth - row.offsetWidth, 0);
            const shift = index === 2 ? 0.32 : 0.2;

            gsap.fromTo(
              track,
              { x: () => -overflow() * 0.5 + direction * overflow() * shift },
              {
                x: () => -overflow() * 0.5 - direction * overflow() * shift,
                ease: 'none',
                scrollTrigger: {
                  trigger: row,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: true,
                  invalidateOnRefresh: true,
                },
              }
            );
          });

          const mosaicBg = document.querySelector<HTMLElement>('.about-mosaic-bg');
          const mosaicStats = document.querySelector<HTMLElement>('.about-mosaic-followup');

          if (mosaicBg && mosaicStats) {
            gsap.fromTo(
              mosaicBg,
              { yPercent: -5 },
              {
                yPercent: 5,
                ease: 'none',
                scrollTrigger: {
                  trigger: mosaicStats,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: true,
                },
              }
            );
          }
        }

      }, rootRef);

      cleanup = () => {
        extraCleanup.forEach((fn) => fn());
        ctx.revert();
      };
    };

    init();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);


  // Derive hero title words with accent position
  const heroWords = data.hero.title.split(' ');

  // Derive statement words with accent position
  const statementWords = data.whoWeAre.statement.text.split(' ');
  const mosaicImages = [data.mosaic.leftImage, data.mosaic.centerImage, data.mosaic.rightImage]
    .filter((src): src is string => Boolean(src));

  const handleMosaicScroll = () => {
    const scroller = mosaicScrollerRef.current;
    if (!scroller || scroller.clientWidth <= 0) return;
    const nextIndex = Math.round(scroller.scrollLeft / scroller.clientWidth);
    setMosaicIndex(Math.max(0, Math.min(mosaicImages.length - 1, nextIndex)));
  };

  return (
    <div ref={rootRef} className="min-h-screen overflow-x-clip bg-[#FAFAF8] text-[#141618]">
      <header className="sticky top-0 z-0 h-[100svh] min-h-[520px] overflow-hidden bg-[#0E1112]">
        <div className="absolute inset-0">
          {data.hero.coverImage && (
            <picture className="absolute inset-0 block">
              {data.hero.mobileCoverImage && (
                <source media="(max-width: 767px)" srcSet={data.hero.mobileCoverImage} />
              )}
              <img
                ref={heroImageRef}
                src={data.hero.coverImage}
                alt="About page hero"
                fetchPriority="high"
                className="h-full w-full object-cover object-center will-change-transform"
              />
            </picture>
          )}
          {activeHeroVideoUrl && (
            <video
              ref={heroVideoRef}
              src={shouldLoadHeroVideo ? activeHeroVideoUrl : undefined}
              muted
              playsInline
              loop
              preload={shouldLoadHeroVideo ? 'auto' : 'none'}
              onCanPlayThrough={(event) => {
                setHeroVideoReady(true);
                void event.currentTarget.play().catch(() => undefined);
              }}
              onLoadedData={(event) => {
                if (event.currentTarget.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) {
                  setHeroVideoReady(true);
                  void event.currentTarget.play().catch(() => undefined);
                }
              }}
              className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ${
                heroVideoReady ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}
        </div>
        <div className="absolute inset-0 z-[2] bg-black/35" />
        <div className="absolute inset-0 z-[3] flex items-end justify-start px-[clamp(18px,3.6vw,52px)] pb-[clamp(64px,10vh,120px)] text-left">
          <h1
            className="about-hero-title max-w-[16ch] text-[clamp(34px,5.8vw,78px)] font-light leading-[1.04] tracking-[-0.01em] text-white opacity-0"
            style={headingStyle}
          >
            {heroWords.map((word, index) => {
              const isAccent = data.hero.accentWordIndex > 0 && (index + 1) === data.hero.accentWordIndex;
              return (
                <span
                  key={`${word}-${index}`}
                  className="inline-block overflow-hidden align-bottom pb-[0.18em] mb-[-0.18em]"
                >
                  <span
                    className={`about-hero-word-inner inline-block ${isAccent ? 'font-light italic' : ''}`}
                    style={isAccent ? accentStyle : undefined}
                  >
                    {word}{index < heroWords.length - 1 ? ' ' : ''}
                  </span>
                </span>
              );
            })}
          </h1>
        </div>
        <div ref={heroDarkRef} className="pointer-events-none absolute inset-0 z-[6] bg-[#0A0C0D] opacity-0" />
      </header>

      <main ref={pageRef} className="relative z-[2] bg-[#FAFAF8] shadow-[0_-30px_80px_rgba(10,12,13,0.18)]">
        <section className="about-statement px-[clamp(18px,3.6vw,52px)] pb-[clamp(80px,14vh,160px)] pt-[clamp(140px,22vh,260px)]">
          <p
            className={`mx-auto max-w-[24ch] text-right text-[clamp(24px,3.3vw,44px)] leading-[1.18] tracking-[-0.01em] ${locale === 'ru' ? 'font-normal' : 'font-medium'}`}
            style={headingStyle}
          >
            {statementWords.map((word, index) => {
              const isAccent = data.whoWeAre.statement.accentWordIndex > 0 && (index + 1) === data.whoWeAre.statement.accentWordIndex;
              const isLastWord = index === statementWords.length - 1;
              return (
                <Fragment key={`s-${index}`}>
                  {isAccent ? (
                    <em className="statement-word inline-block opacity-[0.12] italic font-medium text-[#0891b2]" style={accentStyle}>
                      {word}
                    </em>
                  ) : (
                    <span className="statement-word inline-block opacity-[0.12]">{word}</span>
                  )}
                  {!isLastWord && ' '}
                </Fragment>
              );
            })}
          </p>
        </section>

        <section ref={videoScrubSectionRef} className="relative h-screen overflow-hidden bg-[#0c3a52]">
          {data.whoWeAre.backgroundVideo && (
            <video
              ref={videoScrubRef}
              src={contentMediaReady ? data.whoWeAre.backgroundVideo : undefined}
              muted
              playsInline
              loop
              preload={contentMediaReady ? 'auto' : 'none'}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
          <div className="absolute inset-0 flex items-center justify-center px-[clamp(24px,8vw,120px)]">
            {data.whoWeAre.paragraphs.map((text, i) => {
              const firstSpace = i === 0 ? text.indexOf(' ') : -1;
              const firstWord = firstSpace > -1 ? text.slice(0, firstSpace) : null;
              const restText  = firstSpace > -1 ? text.slice(firstSpace + 1) : text;
              return (
                <div key={i} data-video-para className="absolute max-w-[90%] sm:max-w-[72ch] text-center" style={{ opacity: 0 }}>
                  {i === 0 && (
                    <p className="mb-1 text-[12px] font-medium uppercase tracking-[0.06em] text-white">
                      {data.whoWeAre.sectionTitle}
                    </p>
                  )}
                  {firstWord && (
                    <p className="mb-12 text-[clamp(42px,6vw,88px)] font-normal leading-none text-white" style={headingStyle}>
                      {firstWord}
                    </p>
                  )}
                  <p className="text-[clamp(17px,1.9vw,26px)] font-normal leading-[1.4] text-white">
                    {restText}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="px-[clamp(18px,3.6vw,52px)] pb-[clamp(28px,4vw,56px)] pt-[clamp(60px,8vw,120px)]">
          <div className="mx-auto grid w-[95%] sm:w-[75%] items-start gap-[clamp(28px,6vw,72px)] lg:grid-cols-2">
            <div className="lg:sticky lg:top-24">
              <p data-about-fade className="max-w-[24ch] text-[clamp(20px,2vw,30px)] font-medium leading-[1.12] tracking-[-0.01em]" style={headingStyle}>
                {data.story.title}
              </p>
              <p data-about-fade className="mt-[clamp(28px,4vw,56px)] max-w-[40ch] text-[13.5px] leading-[1.45] text-[#737C80]">
                {data.story.subtitle}
              </p>
            </div>
            <div className="flex flex-col gap-[clamp(16px,1.8vw,26px)]">
              <p className="mb-1 text-[13px] text-[#141618]" style={headingStyle}>{data.story.sectionLabel}</p>
              <div data-about-fade className="rounded-[3px] bg-[#F1F1EF] overflow-hidden">
                {data.story.milestones.map((milestone, i) => {
                  const isOpen = openMilestone === i;
                  return (
                    <article key={milestone.title}>
                      {i > 0 && <div className="mx-[clamp(14px,1.6vw,22px)] h-px bg-[#DDDDD9]" />}
                      <div className="p-[clamp(14px,1.6vw,22px)]">
                        <button
                          type="button"
                          className="flex w-full items-center justify-between gap-3 text-left sm:pointer-events-none sm:cursor-default"
                          onClick={() => setOpenMilestone(isOpen ? -1 : i)}
                        >
                          <h3 className="flex items-baseline gap-[0.45em] text-[clamp(22px,2.8vw,42px)] font-light leading-none tracking-[-0.015em]" style={headingStyle}>
                            <span className="font-normal tracking-[-0.015em] text-[#ABAFAA]">{milestone.year}</span>
                            <span>
                              {milestone.title}
                              {milestone.isCurrent ? <sup className="align-super text-[0.3em] not-italic text-[#0891b2]">o</sup> : null}
                            </span>
                          </h3>
                          <svg
                            className={`sm:hidden shrink-0 size-5 text-[#ABAFAA] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                            viewBox="0 0 20 20"
                            fill="none"
                            aria-hidden="true"
                          >
                            <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                        <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out sm:grid-rows-[1fr] ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                          <div className="overflow-hidden">
                            <p className="pt-10 pb-3 sm:pb-0 sm:pt-0 sm:mt-[clamp(52px,7vw,92px)] max-w-[58ch] text-sm leading-[1.45] text-[#141618]">
                              {milestone.body}
                            </p>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {mosaicImages.length > 0 && (
          <section className="px-[clamp(18px,3.6vw,52px)] pt-0 pb-[clamp(16px,2vw,30px)]">
            <div
              ref={mosaicScrollerRef}
              onScroll={handleMosaicScroll}
              className="flex w-full snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-3 sm:gap-[clamp(14px,2vw,32px)] sm:overflow-visible"
            >
              {mosaicImages.map((src, index) => (
                <div key={`${src}-${index}`} className="relative min-w-full snap-center overflow-hidden rounded-[4px] sm:min-w-0" style={{ aspectRatio: '4/5' }}>
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="(max-width: 639px) calc(100vw - 36px), 33vw"
                    className="object-cover object-center"
                  />
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-center gap-2 sm:hidden" aria-label="Mosaic image position">
              {mosaicImages.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`Mosaic image ${index + 1}`}
                  onClick={() => {
                    const scroller = mosaicScrollerRef.current;
                    if (!scroller) return;
                    scroller.scrollTo({ left: index * scroller.clientWidth, behavior: 'smooth' });
                    setMosaicIndex(index);
                  }}
                  className={`rounded-full transition-all duration-300 ${
                    index === mosaicIndex ? 'h-[4px] w-6 bg-black' : 'h-[4px] w-[4px] bg-black/25'
                  }`}
                />
              ))}
            </div>
          </section>
        )}

        <div className="about-mosaic-field overflow-hidden rounded-t-[clamp(10px,1.6vw,20px)]">
          <div className="about-mosaic-bg" aria-hidden="true">
            <div className="about-mosaic-base" />
            <div className="about-mosaic-blob about-mosaic-blob-1" />
            <div className="about-mosaic-blob about-mosaic-blob-2" />
            <div className="about-mosaic-blob about-mosaic-blob-3" />
            <div className="about-mosaic-blob about-mosaic-blob-4" />
            <div className="about-mosaic-blob about-mosaic-blob-5" />
            <div className="about-mosaic-grain" />
          </div>

          <section className="about-mosaic-followup px-[clamp(18px,3.6vw,52px)]">
            <div className="about-mosaic-stats-stage">
              <div className="about-mosaic-stats-grid" aria-label="Rahatlyk at a glance">
                {data.numbers.stats.map((stat) => (
                  <div key={stat.label} data-about-fade className="about-mosaic-stat">
                    <strong data-count-to={stat.value} style={{ ...headingStyle, fontSize: 'clamp(48px, 6vw, 88px)' }}>
                      {stat.value}
                      {stat.suffix ? <i>{stat.suffix}</i> : null}
                    </strong>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>
              <p data-about-fade className="about-mosaic-stats-line" style={headingStyle}>
                {data.numbers.tagline.text} <em style={accentStyle}>{data.numbers.tagline.accentText}</em>
              </p>
            </div>
          </section>
        </div>


        <section ref={lastPlxSectionRef} className="relative h-screen overflow-hidden">
          {data.finalSection.image && (
            <div
              ref={lastPlxMediaRef}
              data-last-plx-media
              className="absolute inset-x-0 top-0 h-[128%] will-change-transform"
            >
              <picture className="absolute inset-0 block">
                {data.finalSection.mobileImage && (
                  <source media="(max-width: 767px)" srcSet={data.finalSection.mobileImage} />
                )}
                <img
                  src={data.finalSection.image}
                  alt=""
                  aria-hidden="true"
                  className="h-full w-full object-cover object-center"
                />
              </picture>
            </div>
          )}
          <div className="absolute inset-0 bg-white/50" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-[clamp(18px,3.6vw,52px)] text-center text-[#141618]">
            <h2
              className="max-w-[20ch] text-[clamp(32px,5vw,72px)] font-light leading-[1.06] tracking-[-0.01em]"
              style={headingStyle}
            >
              {data.finalSection.heading}
            </h2>
            <p className="mt-[clamp(14px,2vw,24px)] max-w-[44ch] text-[clamp(14px,1.4vw,18px)] font-medium leading-[1.5] text-[#141618]/85">
              {data.finalSection.body}
            </p>
          </div>
        </section>

      </main>

    </div>
  );
}
