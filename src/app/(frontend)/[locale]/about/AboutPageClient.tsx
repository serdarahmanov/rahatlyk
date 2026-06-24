'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import { useLanguage } from '@/lib/i18n/LanguageContext';


export type AboutPageData = {
  hero: {
    coverImage: string;
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
    fullViewportImage: string;
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
    leftImage: string;
    rightImage: string;
  };
  certs: {
    heading: {
      text: string;
      accentText: string;
    };
    subtitle: string;
    sealText: string;
    certificates: Array<{
      name: string;
      tag: string;
      description: string;
      expiryDate: string;
      photo: string | null;
    }>;
  };
};

const headingStyle = { fontFamily: 'var(--font-heading), sans-serif' };
const accentStyle = { fontFamily: 'var(--font-accent), Georgia, "Times New Roman", serif' };

const MOSAIC_LINES = [
  {
    index: 'Collection 01',
    title: 'The',
    accent: 'Waters',
    desc: 'Drinking water and naturally balanced mineral water - purified, tested batch by batch, and bottled at our own facility. The foundation of everything we make.',
    direction: 1,
    cells: [
      { type: 'image', width: 'lg', src: '/story/photo-2.jpg', alt: 'Clear water surface' },
      { type: 'image', width: 'lg', src: '/news/1.5liter-bottles.jpg', alt: 'Bottled drinking water' },
      { type: 'image', width: 'md', src: '/story/photo-9.jpg', alt: 'Natural water landscape' },
    ],
  },
  {
    index: 'Collection 02',
    title: 'Juices',
    accent: '& Soft Drinks',
    desc: 'Sun-ripened fruit pressed to taste like the season, plus sparkling soft drinks made for good company. Recipes developed entirely in-house.',
    direction: -1,
    cells: [
      { type: 'image', width: 'lg', src: '/reference/New-250ml-Juice-Banner-Website.jpg', alt: 'Fresh juice bottles' },
      { type: 'image', width: 'lg', src: '/reference/KarunaJuice_Photo_RainbowlFoods.jpg', alt: 'Fresh fruit drink' },
      { type: 'image', width: 'md', src: '/reference/Smoothie-Drink-Product-Photography-Studio-in-London-Innocent-Smoothies-Neve-Studios-1.webp', alt: 'Smoothie drink' },
    ],
  },
  {
    index: 'Collection 03',
    title: 'Energy',
    accent: '& Calm',
    desc: 'A clean charge for people who keep moving, and herbal teas that slow the evening down. Two ends of the day, one collection.',
    direction: 1,
    cells: [
      { type: 'image', width: 'lg', src: '/story/photo-5.jpg', alt: 'Calm herbal tea mood' },
      { type: 'image', width: 'lg', src: '/story/photo-3.jpg', alt: 'Morning energy' },
      { type: 'image', width: 'md', src: '/story/photo-6.jpg', alt: 'Active day drink' },
    ],
  },
] as const;


export default function AboutPageClient({ data }: { data: AboutPageData }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLElement>(null);
  const heroDarkRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLImageElement>(null);
  const videoScrubSectionRef = useRef<HTMLElement>(null);
  const videoScrubRef = useRef<HTMLVideoElement>(null);
  const mosaicSectionRef = useRef<HTMLElement>(null);
  const lastPlxSectionRef = useRef<HTMLElement>(null);
  const lastPlxMediaRef = useRef<HTMLDivElement>(null);
  const certSectionRef = useRef<HTMLElement>(null);
  const certFloatRef = useRef<HTMLDivElement>(null);
  const certModalRef = useRef<HTMLDivElement>(null);
  const [activeCertificate, setActiveCertificate] = useState<number | null>(null);
  const [openMilestone, setOpenMilestone] = useState<number>(0);

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
    // Key on the statement text: changes every time a locale's data arrives.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

        gsap.utils.toArray<HTMLElement>('[data-cert-reveal]').forEach((el) => {
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

        gsap.utils.toArray<HTMLElement>('[data-cert-rule]').forEach((rule, index) => {
          gsap.fromTo(
            rule,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 1.05,
              delay: index * 0.08,
              ease: 'power3.inOut',
              scrollTrigger: { trigger: rule.parentElement, start: 'top 92%' },
            }
          );
        });

        gsap.utils.toArray<HTMLElement>('[data-cert-row]').forEach((row) => {
          gsap.fromTo(
            row.querySelectorAll('.cert-name, .cert-issuer, .cert-thumb'),
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.75,
              stagger: 0.05,
              ease: 'power3.out',
              scrollTrigger: { trigger: row, start: 'top 92%' },
            }
          );
        });

        if (certSectionRef.current && certFloatRef.current && window.matchMedia('(min-width: 821px)').matches) {
          const certSection = certSectionRef.current;
          const floatEl = certFloatRef.current;
          const xTo = gsap.quickTo(floatEl, 'x', { duration: 0.45, ease: 'power3.out' });
          const yTo = gsap.quickTo(floatEl, 'y', { duration: 0.45, ease: 'power3.out' });
          const opacityTo = gsap.quickTo(floatEl, 'opacity', { duration: 0.35, ease: 'power3.out' });
          const rows = gsap.utils.toArray<HTMLElement>('.cert-row');
          let isHoveringCertificate = false;
          let lastPointer = { x: 0, y: 0 };

          const hideFloat = () => {
            isHoveringCertificate = false;
            opacityTo(0);
            gsap.to(floatEl, { scale: 0.92, rotation: -1.5, duration: 0.35, ease: 'power3.out', overwrite: 'auto' });
          };

          const onPointerMove = (event: PointerEvent) => {
            lastPointer = { x: event.clientX, y: event.clientY };
            if (isHoveringCertificate) {
              xTo(event.clientX);
              yTo(event.clientY);
            }
          };

          const hideIfPointerOutsideSection = () => {
            if (!isHoveringCertificate) return;

            const rect = certSection.getBoundingClientRect();
            const isInsideSection =
              lastPointer.x >= rect.left &&
              lastPointer.x <= rect.right &&
              lastPointer.y >= rect.top &&
              lastPointer.y <= rect.bottom;

            if (!isInsideSection) hideFloat();
          };

          window.addEventListener('pointermove', onPointerMove);
          window.addEventListener('scroll', hideIfPointerOutsideSection, { passive: true });
          certSection.addEventListener('pointerleave', hideFloat);
          certSection.addEventListener('pointercancel', hideFloat);

          extraCleanup.push(() => {
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('scroll', hideIfPointerOutsideSection);
            certSection.removeEventListener('pointerleave', hideFloat);
            certSection.removeEventListener('pointercancel', hideFloat);
          });

          ScrollTrigger.create({
            trigger: certSection,
            start: 'top bottom',
            end: 'bottom top',
            onUpdate: hideIfPointerOutsideSection,
            onLeave: hideFloat,
            onLeaveBack: hideFloat,
          });

          rows.forEach((row) => {
            const onPointerEnter = (event: PointerEvent) => {
              isHoveringCertificate = true;
              lastPointer = { x: event.clientX, y: event.clientY };
              xTo(event.clientX);
              yTo(event.clientY);
              const index = row.dataset.cert;
              floatEl.querySelectorAll<HTMLElement>('[data-cert-float]').forEach((panel) => {
                panel.classList.toggle('is-active', panel.dataset.certFloat === index);
              });
              opacityTo(1);
              gsap.to(floatEl, { scale: 1, rotation: 0, duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
            };

            row.addEventListener('pointerenter', onPointerEnter);
            row.addEventListener('pointerleave', hideFloat);
            extraCleanup.push(() => {
              row.removeEventListener('pointerenter', onPointerEnter);
              row.removeEventListener('pointerleave', hideFloat);
            });
          });
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


  const openCertificateModal = async (index: number) => {
    setActiveCertificate(index);

    const { gsap } = await import('gsap');
    requestAnimationFrame(() => {
      if (!certModalRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      gsap.fromTo(
        certModalRef.current.querySelector('.cert-modal-panel'),
        { opacity: 0, y: 30, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out' }
      );
    });
  };

  const closeCertificateModal = () => {
    setActiveCertificate(null);
  };

  useEffect(() => {
    if (activeCertificate === null) return;

    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeCertificateModal();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [activeCertificate]);

  // Derive hero title words with accent position
  const heroWords = data.hero.title.split(' ');

  // Derive statement words with accent position
  const statementWords = data.whoWeAre.statement.text.split(' ');

  // Derive "Who we are" label words
  const wwaTitleWords = data.whoWeAre.sectionTitle.split(' ');

  const activeCert = activeCertificate !== null ? data.certs.certificates[activeCertificate] : null;

  return (
    <div ref={rootRef} className="min-h-screen overflow-x-clip bg-[#FAFAF8] text-[#141618]">
      <header className="sticky top-0 z-0 h-[100svh] min-h-[520px] overflow-hidden bg-[#0E1112]">
        <div className="absolute inset-0">
          <Image
            ref={heroImageRef}
            src={data.hero.coverImage}
            alt="About page hero"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center will-change-transform"
          />
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
            className={`mx-auto max-w-[24ch] text-right text-[clamp(24px,3.3vw,44px)] leading-[1.18] tracking-[-0.01em] ${locale === 'ru' ? 'font-normal' : 'font-[550]'}`}
            style={headingStyle}
          >
            {statementWords.map((word, index) => {
              const isAccent = data.whoWeAre.statement.accentWordIndex > 0 && (index + 1) === data.whoWeAre.statement.accentWordIndex;
              const isLastWord = index === statementWords.length - 1;
              return (
                <Fragment key={`s-${index}`}>
                  {isAccent ? (
                    <em className="statement-word inline-block opacity-[0.12] italic font-semibold text-[#0891b2]" style={accentStyle}>
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
          <video
            ref={videoScrubRef}
            src="/videos/hero-optimized.mp4"
            muted
            playsInline
            loop
            className="absolute inset-0 h-full w-full object-cover"
          />
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

        <section className="px-[clamp(18px,3.6vw,52px)] pb-[clamp(110px,14vw,220px)] pt-[clamp(60px,8vw,120px)]">
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

        <section className="px-[clamp(18px,3.6vw,52px)] pt-[clamp(40px,6vw,80px)]">
          <div className="mx-auto flex w-[95%] sm:w-[75%] gap-[clamp(16px,2.5vw,36px)]">
            <div className="relative flex-1 overflow-hidden rounded-[4px]" style={{ aspectRatio: '4/5' }}>
              <Image
                src={data.mosaic.leftImage}
                alt=""
                fill
                sizes="(max-width: 768px) 50vw, 45vw"
                className="object-cover object-center"
              />
            </div>
            <div className="relative flex-1 overflow-hidden rounded-[4px]" style={{ aspectRatio: '4/5' }}>
              <Image
                src={data.mosaic.rightImage}
                alt=""
                fill
                sizes="(max-width: 768px) 50vw, 45vw"
                className="object-cover object-center"
              />
            </div>
          </div>
        </section>

        <div className="about-mosaic-field">
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

        <section ref={certSectionRef} className="certs" id="certs">
          <div className="certs-inner">
            <div className="certs-seal-wrap" data-cert-reveal aria-hidden="true">
              <svg className="certs-seal" viewBox="0 0 150 150">
                <defs>
                  <path id="certSealPath" d="M 75,75 m -58,0 a 58,58 0 1,1 116,0 a 58,58 0 1,1 -116,0" />
                </defs>
                <text>
                  <textPath href="#certSealPath">
                    {data.certs.sealText}
                  </textPath>
                </text>
              </svg>
            </div>
            <div className="certs-head">
              <div>
                <h2 className="certs-title" data-cert-reveal>
                  {data.certs.heading.text} <em>{data.certs.heading.accentText}</em>
                </h2>
              </div>
              <p className="certs-intro" data-cert-reveal>
                {data.certs.subtitle}
              </p>
            </div>

            <div className="certs-ledger">
              <span className="ledger-top-rule" data-cert-rule />

              {data.certs.certificates.map((certificate, index) => (
                <button
                  key={certificate.name}
                  className="cert-row"
                  type="button"
                  data-cert={index}
                  data-cert-row
                  onClick={() => openCertificateModal(index)}
                >
                  <span className="cert-name">
                    {certificate.name} <em>{certificate.tag}</em>
                  </span>
                  <span className="cert-issuer">{certificate.description}</span>
                  <span className="cert-thumb">
                    {certificate.photo ? (
                      <Image src={certificate.photo} alt={certificate.name} width={1448} height={1086} style={{ width: '100%', height: 'auto' }} />
                    ) : (
                      <CertificateArtwork title={certificate.name} />
                    )}
                  </span>
                  <span className="rule-bottom" data-cert-rule />
                </button>
              ))}
            </div>
          </div>
        </section>


        <div ref={certFloatRef} className="cert-float" aria-hidden="true">
          <div className="cert-float-inner">
            {data.certs.certificates.map((certificate, index) => (
              <div key={certificate.name} data-cert-float={index}>
                {certificate.photo ? (
                  <Image src={certificate.photo} alt={certificate.name} width={1448} height={1086} style={{ width: '100%', height: 'auto' }} />
                ) : (
                  <CertificateArtwork title={certificate.name} />
                )}
              </div>
            ))}
          </div>
        </div>

        <section ref={lastPlxSectionRef} className="relative h-screen overflow-hidden">
          <div
            ref={lastPlxMediaRef}
            data-last-plx-media
            className="absolute inset-x-0 top-0 h-[128%] will-change-transform"
          >
            <Image
              src="/about/last section image/about last section image.png"
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 bg-white/50" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-[clamp(18px,3.6vw,52px)] text-center text-[#141618]">
            <h2
              className="max-w-[20ch] text-[clamp(32px,5vw,72px)] font-light leading-[1.06] tracking-[-0.01em]"
              style={headingStyle}
            >
              Every drop, a promise kept.
            </h2>
            <p className="mt-[clamp(14px,2vw,24px)] max-w-[44ch] text-[clamp(14px,1.4vw,18px)] leading-[1.5] text-[#141618]/75">
              From the first filtration to the final cap, Rahatlyk keeps quality in its own hands — every bottle, every time.
            </p>
          </div>
        </section>

      </main>

      {activeCertificate !== null && activeCert && typeof document !== 'undefined'
        ? createPortal(
            <div
              ref={certModalRef}
              className="cert-modal is-open"
              role="dialog"
              aria-modal="true"
              aria-label="Certificate preview"
              style={{
                backdropFilter: 'blur(10px) saturate(1.1)',
                WebkitBackdropFilter: 'blur(10px) saturate(1.1)',
                background: 'rgba(255,255,255,0.65)',
              }}
            >
              <button className="cert-modal-backdrop" type="button" data-close aria-label="Close certificate preview" onClick={closeCertificateModal} />
              <div className="cert-modal-panel">
                <button className="cert-modal-close" type="button" data-close onClick={closeCertificateModal}>
                  {{ en: 'Close', tm: 'Ýap', ru: 'Закрыть' }[locale]}
                </button>
                <div style={{ display: 'inline-block', maxWidth: '80vw' }}>
                  <div className="cert-modal-doc">
                    {activeCert.photo ? (
                      <Image
                        src={activeCert.photo}
                        alt={activeCert.name}
                        width={1448}
                        height={1086}
                        style={{ width: '100%', height: 'auto', display: 'block' }}
                      />
                    ) : (
                      <CertificateArtwork title={activeCert.name} />
                    )}
                  </div>
                  <div className="cert-modal-caption">
                    <h3>{activeCert.name} — {activeCert.tag}</h3>
                    <span>{activeCert.expiryDate
                      .replace('Issued', { en: 'Issued', tm: 'Berlen', ru: 'Выдан' }[locale] ?? 'Issued')
                      .replace('Valid', { en: 'Valid', tm: 'Güýçli', ru: 'Действителен' }[locale] ?? 'Valid')
                    }</span>
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}

function CertificateArtwork({ title }: { title: string }) {
  return (
    <span className="ph-doc">
      <span className="ph-sub">Certificate</span>
      <span className="ph-title">{title}</span>
      <span className="ph-rule" />
      <span className="ph-seal">R</span>
    </span>
  );
}
