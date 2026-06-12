'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createPortal } from 'react-dom';

type MoodKey = 'fresh' | 'energy' | 'play' | 'calm';

type Mood = {
  key: MoodKey;
  label: string;
  word: string;
  tint: string;
  product: string;
  desc: string;
};

const headingStyle = { fontFamily: 'var(--font-heading), sans-serif' };
const accentStyle = { fontFamily: 'var(--font-accent), Georgia, "Times New Roman", serif' };

const MILESTONES = [
  {
    title: 'The first drop',
    lead: '2003.',
    body: 'Rahatlyk begins with one product and one goal: drinking water every family can rely on, bottled to a standard people can trust.',
  },
  {
    title: 'Minerals',
    lead: '2008.',
    body: 'Naturally balanced mineral water extends the line into everyday wellness and gives the brand a clearer production identity.',
  },
  {
    title: 'Colour',
    lead: '2013.',
    body: 'Juices and soft drinks launch, bringing fruit, sparkle and seasonal flavour into the same in-house production culture.',
  },
  {
    title: 'Energy & calm',
    lead: '2018.',
    body: 'Energy drinks for active days and herbal teas for slower evenings turn the collection into a full rhythm of daily refreshment.',
  },
  {
    title: 'Today',
    lead: 'Now.',
    body: 'A modern production family with six beverage collections, tighter quality control and a platform that brings Rahatlyk directly to customers.',
    current: true,
  },
];

const STATS = [
  { value: 6, suffix: '', label: 'product collections, from water to herbal teas' },
  { value: 100, suffix: '%', label: 'produced and bottled inside Turkmenistan' },
  { value: 20, suffix: '+', label: 'flavours and formats across all collections' },
  { value: 5, suffix: '', label: 'quality-control stages from source to bottle' },
];

const CERTIFICATES = [
  {
    year: '2019 — valid',
    title: 'ISO 9001',
    tag: 'Quality management',
    issuer: 'Quality management systems — audited across every production line, from filtration to the final cap.',
    modalName: 'ISO 9001 — Quality management',
    meta: 'Issued 2019 · Valid',
  },
  {
    year: '2020 — valid',
    title: 'ISO 22000',
    tag: 'Food safety',
    issuer: 'Food safety management — covering sourcing, preparation, bottling and storage of all six collections.',
    modalName: 'ISO 22000 — Food safety',
    meta: 'Issued 2020 · Valid',
  },
  {
    year: '2021 — valid',
    title: 'HACCP',
    tag: 'Hazard control',
    issuer: 'Hazard analysis & critical control points — applied at five quality stages from source to bottle.',
    modalName: 'HACCP — Hazard control',
    meta: 'Issued 2021 · Valid',
  },
  {
    year: '2022 — valid',
    title: 'State Standard',
    tag: 'Turkmenistan',
    issuer: 'National conformity certification for beverages produced and distributed within Turkmenistan.',
    modalName: 'State Standard of Turkmenistan',
    meta: 'Issued 2022 · Valid',
  },
];

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

const MOODS: Mood[] = [
  {
    key: 'fresh',
    label: 'Refreshed',
    word: 'refreshed',
    tint: '#4FA3B5',
    product: 'Rahatlyk - Drinking Water',
    desc: 'Cold, clear and exactly what you need. Our drinking water never misses.',
  },
  {
    key: 'energy',
    label: 'Unstoppable',
    word: 'unstoppable',
    tint: '#8FA84A',
    product: 'Rahatlyk - Energy Drink',
    desc: 'A clean spark for whatever you are about to conquer. Keep moving.',
  },
  {
    key: 'play',
    label: 'Playful',
    word: 'playful',
    tint: '#D98A55',
    product: 'Rahatlyk - Juices & Soft Drinks',
    desc: 'Bright, fruity, sparkling - made for good company and better laughs.',
  },
  {
    key: 'calm',
    label: 'Cozy',
    word: 'cozy',
    tint: '#B07A4E',
    product: 'Rahatlyk - Herbal Tea',
    desc: 'Warm hands, slow breath, quiet evening. We bottled that feeling.',
  },
];

export default function AboutPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLElement>(null);
  const heroDarkRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLImageElement>(null);
  const moodSectionRef = useRef<HTMLElement>(null);
  const moodCursorRef = useRef<HTMLDivElement>(null);
  const moodGlowRef = useRef<HTMLDivElement>(null);
  const moodWordRef = useRef<HTMLSpanElement>(null);
  const moodTintRef = useRef<HTMLDivElement>(null);
  const mosaicSectionRef = useRef<HTMLElement>(null);
  const certSectionRef = useRef<HTMLElement>(null);
  const certFloatRef = useRef<HTMLDivElement>(null);
  const certModalRef = useRef<HTMLDivElement>(null);
  const [activeCertificate, setActiveCertificate] = useState<number | null>(null);
  const [activeMood, setActiveMood] = useState<MoodKey>('fresh');

  const activeMoodData = MOODS.find((mood) => mood.key === activeMood) ?? MOODS[0];

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

        gsap.to('.about-statement .statement-word', {
          opacity: 1,
          stagger: 0.045,
          ease: 'none',
          scrollTrigger: {
            trigger: '.about-statement',
            start: 'top 80%',
            end: 'top 35%',
            scrub: true,
          },
        });

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
              // grandparent: span.overflow → p label
              trigger: wwaWords[0].parentElement?.parentElement ?? wwaWords[0],
              start: 'top 88%',
            },
          });
        }

        // Body paragraphs — word-by-word opacity reveal on scroll (mirrors statement section)
        gsap.utils.toArray<HTMLElement>('[data-about-para]').forEach((para) => {
          const words = para.querySelectorAll<HTMLElement>('.body-word');
          if (!words.length) return;
          gsap.to(words, {
            opacity: 1,
            stagger: 0.035,
            ease: 'none',
            scrollTrigger: {
              trigger: para,
              start: 'top 88%',
              end: 'bottom 52%',
              scrub: true,
            },
          });
        });

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
          gsap.fromTo(
            img,
            { yPercent: -14, scale: 1.08 },
            {
              yPercent: 14,
              scale: 1.08,
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

        gsap.utils.toArray<HTMLElement>('[data-count-to]').forEach((el) => {
          gsap.fromTo(
            el,
            { innerText: 0 },
            {
              innerText: Number(el.dataset.countTo),
              duration: 1.25,
              ease: 'power1.out',
              snap: { innerText: 1 },
              scrollTrigger: { trigger: el, start: 'top 90%' },
            }
          );
        });

        if (mosaicSectionRef.current) {
          const rows = gsap.utils.toArray<HTMLElement>('.about-mosaic-row');

          rows.forEach((row, index) => {
            const direction = Number(row.dataset.dir) || 1;
            const track = row.querySelector<HTMLElement>('.about-mosaic-track');

            if (!track) return;

            // overflow = how many px the track extends beyond the visible row width
            const overflow = () => Math.max(track.scrollWidth - row.offsetWidth, 0);

            // Row 3 (index 2) travels a wider range so it feels faster than rows 1 & 2.
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

        if (moodSectionRef.current && moodCursorRef.current) {
          const moodSection = moodSectionRef.current;
          const moodCursor = moodCursorRef.current;
          const cursorX = gsap.quickTo(moodCursor, 'x', { duration: 0.28, ease: 'power3.out' });
          const cursorY = gsap.quickTo(moodCursor, 'y', { duration: 0.28, ease: 'power3.out' });

          const onPointerMove = (event: PointerEvent) => {
            const rect = moodSection.getBoundingClientRect();
            cursorX(event.clientX - rect.left);
            cursorY(event.clientY - rect.top);
            gsap.to(moodCursor, { opacity: 1, scale: 1, duration: 0.18, ease: 'power2.out' });
          };

          const onPointerEnter = () => {
            gsap.to(moodCursor, { opacity: 1, scale: 1, duration: 0.25, ease: 'power2.out' });
          };

          const onPointerLeave = () => {
            gsap.to(moodCursor, { opacity: 0, scale: 0.78, duration: 0.25, ease: 'power2.out' });
          };

          moodSection.addEventListener('pointermove', onPointerMove);
          moodSection.addEventListener('pointerenter', onPointerEnter);
          moodSection.addEventListener('pointerleave', onPointerLeave);

          extraCleanup.push(() => {
            moodSection.removeEventListener('pointermove', onPointerMove);
            moodSection.removeEventListener('pointerenter', onPointerEnter);
            moodSection.removeEventListener('pointerleave', onPointerLeave);
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

  const handleMoodChange = async (nextMood: MoodKey) => {
    if (nextMood === activeMood) return;

    const { gsap } = await import('gsap');
    const nextMoodData = MOODS.find((mood) => mood.key === nextMood) ?? MOODS[0];
    const textNodes = [moodWordRef.current].filter(Boolean);

    gsap.timeline()
      .to(moodTintRef.current, { background: nextMoodData.tint, duration: 0.75, ease: 'power1.inOut' }, 0)
      .to(moodGlowRef.current, { background: nextMoodData.tint, duration: 0.75, ease: 'power1.inOut' }, 0)
      .to(moodCursorRef.current, { color: nextMoodData.tint, duration: 0.75, ease: 'power1.inOut' }, 0)
      .to(textNodes, { y: -16, opacity: 0, duration: 0.25, ease: 'power2.in', stagger: 0.04 }, 0)
      .add(() => setActiveMood(nextMood), 0.28)
      .fromTo(textNodes, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out', stagger: 0.05 }, 0.34);
  };

  const openCertificateModal = async (index: number) => {
    setActiveCertificate(index);

    const { gsap } = await import('gsap');
    requestAnimationFrame(() => {
      if (!certModalRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      // Overlay fades in via CSS @keyframes (never touch its opacity via GSAP —
      // that kills backdrop-filter compositing in Chrome / Safari).
      // GSAP only drives the card panel entrance.
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

  return (
    <div ref={rootRef} className="min-h-screen overflow-x-clip bg-[#FAFAF8] text-[#141618]">
      <header className="sticky top-0 z-0 h-[100svh] min-h-[520px] overflow-hidden bg-[#0E1112]">
        <div className="absolute inset-0">
          <Image
            ref={heroImageRef}
            src="/story/photo-8.jpg"
            alt="Clear water surface"
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
            {[
              { text: 'The' },
              { text: 'taste' },
              { text: 'of' },
              { text: 'comfort,', accent: true },
              { text: 'made' },
              { text: 'in' },
              { text: 'Turkmenistan.' },
            ].map((word, index, words) => (
              <span
                key={`${word.text}-${index}`}
                className="inline-block overflow-hidden align-bottom pb-[0.18em] mb-[-0.18em]"
              >
                <span
                  className={`about-hero-word-inner inline-block ${word.accent ? 'font-light italic' : ''}`}
                  style={word.accent ? accentStyle : undefined}
                >
                  {word.text}
                  {index < words.length - 1 ? '\u00a0' : ''}
                </span>
              </span>
            ))}
          </h1>
        </div>
        <div ref={heroDarkRef} className="pointer-events-none absolute inset-0 z-[6] bg-[#0A0C0D] opacity-0" />
      </header>

      <main ref={pageRef} className="relative z-[2] bg-[#FAFAF8] shadow-[0_-30px_80px_rgba(10,12,13,0.18)]">
        <section className="about-statement px-[clamp(18px,3.6vw,52px)] pb-[clamp(80px,14vh,160px)] pt-[clamp(140px,22vh,260px)] text-center">
          <p
            className="mx-auto max-w-[24ch] text-[clamp(24px,3.3vw,44px)] font-light leading-[1.18] tracking-[-0.01em]"
            style={headingStyle}
          >
            <span className="statement-word inline-block opacity-[0.12]">In</span>{' '}
            <span className="statement-word inline-block opacity-[0.12]">Turkmen,</span>{' '}
            <em className="statement-word inline-block opacity-[0.12] italic text-[#D98A55]" style={accentStyle}>rahatlyk</em>{' '}
            <span className="statement-word inline-block opacity-[0.12]">means</span>{' '}
            <span className="statement-word inline-block opacity-[0.12]">comfort</span>{' '}
            <span className="statement-word inline-block opacity-[0.12]">&mdash;</span>
            <br />
            <span className="statement-word inline-block opacity-[0.12]">our</span>{' '}
            <span className="statement-word inline-block opacity-[0.12]">name,</span>{' '}
            <span className="statement-word inline-block opacity-[0.12]">our</span>{' '}
            <span className="statement-word inline-block opacity-[0.12]">promise,</span>
            <br />
            <span className="statement-word inline-block opacity-[0.12]">and</span>{' '}
            <span className="statement-word inline-block opacity-[0.12]">the</span>{' '}
            <span className="statement-word inline-block opacity-[0.12]">measure</span>{' '}
            <span className="statement-word inline-block opacity-[0.12]">of</span>
            <br />
            <em className="statement-word inline-block opacity-[0.12] not-italic">every</em>{' '}
            <span className="statement-word inline-block opacity-[0.12]">bottle</span>{' '}
            <span className="statement-word inline-block opacity-[0.12]">we</span>{' '}
            <span className="statement-word inline-block opacity-[0.12]">make.</span>
          </p>
        </section>

        <section className="bg-[#FAFAF8] px-[clamp(18px,3.6vw,52px)] pb-[clamp(70px,10vw,140px)]">
          <div className="mx-auto max-w-[760px]">
            {/* Word-mask title */}
            <p className="text-[13px] font-semibold uppercase tracking-[0.28em] text-[#141618]">
              {['Who', 'we', 'are'].map((word, i, arr) => (
                <span key={i} className="inline-block overflow-hidden pb-[0.1em] mb-[-0.1em] align-bottom">
                  <span className="wwa-mask-word inline-block">
                    {word}{i < arr.length - 1 ? ' ' : ''}
                  </span>
                </span>
              ))}
            </p>
            {/* Word-opacity paragraphs */}
            <div className="mt-8 space-y-6 text-[clamp(14px,1.2vw,17px)] leading-[1.38] text-[#141618]">
              {[
                'Rahatlyk is a Turkmen beverage company with a simple belief: drinks should be made close to home, to a standard families can trust. We purify, prepare and bottle everything ourselves — from first filtration to the final cap.',
                'What began with drinking water has grown into six collections: still and mineral waters, juices, energy drinks, herbal teas and soft drinks — each developed in-house and distributed across the country.',
                'We are building a direct connection with the people who drink what we make. Because comfort, to us, includes being within reach.',
              ].map((text, pi) => (
                <p key={pi} data-about-para>
                  {text.split(' ').map((word, wi, arr) => (
                    <span key={wi} className="body-word" style={{ opacity: 0.12 }}>
                      {word}{wi < arr.length - 1 ? ' ' : ''}
                    </span>
                  ))}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section className="relative h-[100svh] min-h-[560px] overflow-hidden bg-[#E9ECEB]">
          <Image
            data-about-plx-strong
            src="/story/photo-2.jpg"
            alt="Air bubbles rising through clear water"
            fill
            sizes="100vw"
            className="h-[128%] object-cover object-center will-change-transform"
          />
        </section>

        <section className="px-[clamp(18px,3.6vw,52px)] pb-[clamp(110px,14vw,220px)] pt-[clamp(60px,8vw,120px)]">
          <div className="grid items-start gap-[clamp(28px,6vw,72px)] lg:grid-cols-2">
            <div className="lg:sticky lg:top-24">
              <p data-about-fade className="max-w-[24ch] text-[clamp(20px,2vw,30px)] font-light leading-[1.12] tracking-[-0.01em]" style={headingStyle}>
                One bottling line. Six collections. Every step, closer to the people we serve.
              </p>
              <p data-about-fade className="mt-[clamp(28px,4vw,56px)] max-w-[40ch] text-[13.5px] leading-[1.45] text-[#737C80]">
                Everything made in-house — from filtration to the final cap. Quality stays in our hands.
              </p>
            </div>
            <div className="flex flex-col gap-[clamp(16px,1.8vw,26px)]">
              <p className="mb-1 text-[13px] text-[#141618]" style={headingStyle}>Our story</p>
              {MILESTONES.map((milestone) => (
                <article key={milestone.title} data-about-fade className="rounded-[3px] bg-[#F1F1EF] p-[clamp(14px,1.6vw,22px)]">
                  <h3 className="flex items-baseline gap-[0.45em] text-[clamp(22px,2.8vw,42px)] font-light leading-none tracking-[-0.015em]" style={headingStyle}>
                    <span className="font-normal tracking-[-0.015em] text-[#ABAFAA]">{milestone.lead.replace('.', '')}</span>
                    <span>
                      {milestone.title}
                      {milestone.current ? <sup className="align-super text-[0.3em] not-italic text-[#D98A55]">o</sup> : null}
                    </span>
                  </h3>
                  <p className="mt-[clamp(52px,7vw,92px)] max-w-[58ch] text-sm leading-[1.45] text-[#141618]">
                    {milestone.body}
                  </p>
                </article>
              ))}
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

          <section ref={mosaicSectionRef} className="about-mosaic-lines" aria-label="Rahatlyk collections in motion">
            {MOSAIC_LINES.map((line) => (
              <div key={line.index} className="about-mosaic-row" data-dir={line.direction}>
                <div className="about-mosaic-intro">
                  <div className="about-mosaic-track">
                  {line.cells.map((cell, index) => {
                    return (
                      <div key={`${line.index}-${cell.src}-${index}`} className={`about-mosaic-cell about-mosaic-${cell.width}`}>
                        <Image
                            src={cell.src}
                            alt={cell.alt}
                            fill
                            sizes="(max-width: 768px) 72vw, 34vw"
                            className="object-cover object-center"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </section>

          <section className="about-mosaic-followup px-[clamp(18px,3.6vw,52px)]">
            <div className="about-mosaic-stats-stage">
              <div className="about-mosaic-stats-grid" aria-label="Rahatlyk at a glance">
                {STATS.map((stat) => (
                  <div key={stat.label} data-about-fade className="about-mosaic-stat">
                    <strong style={headingStyle}>
                      {stat.value}
                      {stat.suffix ? <i>{stat.suffix}</i> : null}
                    </strong>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>
              <p data-about-fade className="about-mosaic-stats-line" style={headingStyle}>
                Comfort, <em style={accentStyle}>bottled.</em>
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
                    RAHATLYK&nbsp;&nbsp;&middot;&nbsp;&nbsp;CERTIFIED QUALITY&nbsp;&nbsp;&middot;&nbsp;&nbsp;EST.
                    2003&nbsp;&nbsp;&middot;
                  </textPath>
                </text>
              </svg>
            </div>
          <div className="certs-head">
            <div>
              <h2 className="certs-title" data-cert-reveal>
                Our standards, <em>on the record.</em>
              </h2>
            </div>
            <p className="certs-intro" data-cert-reveal>
              Independently audited standards &mdash; issued, renewed and verified behind every bottle.
            </p>
          </div>

          <div className="certs-ledger">
            <span className="ledger-top-rule" data-cert-rule />

            {CERTIFICATES.map((certificate, index) => (
              <button
                key={certificate.title}
                className="cert-row"
                type="button"
                data-cert={index}
                data-cert-row
                onClick={() => openCertificateModal(index)}
              >
                <span className="cert-name">
                  {certificate.title} <em>{certificate.tag}</em>
                </span>
                <span className="cert-issuer">{certificate.issuer}</span>
                <span className="cert-thumb">
                  <CertificateArtwork title={certificate.title} />
                </span>
                <span className="rule-bottom" data-cert-rule />
              </button>
            ))}
          </div>

          </div>
        </section>

        <section ref={moodSectionRef} className="group relative min-h-screen select-none overflow-hidden bg-[#0F1213] p-0 text-white md:cursor-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_38%),linear-gradient(135deg,#0F1213_0%,#171B1C_45%,#0A0C0D_100%)]" />
          <div ref={moodTintRef} className="absolute inset-0 opacity-15 mix-blend-color" style={{ background: activeMoodData.tint }} />
          <div
            ref={moodGlowRef}
            className="pointer-events-none absolute left-1/2 top-1/2 z-[2] h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-35 blur-[72px] transition-opacity duration-500 group-hover:opacity-50"
            style={{ background: activeMoodData.tint }}
          />
          <div
            ref={moodCursorRef}
            className="pointer-events-none absolute left-0 top-0 z-[4] hidden h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-transparent opacity-0 shadow-[0_0_18px_rgba(255,255,255,0.12)] md:flex"
            style={{ color: activeMoodData.tint }}
          >
            <span className="h-1 w-1 rounded-full bg-current" />
          </div>
          <div className="relative z-[3] flex min-h-screen flex-col items-center justify-end px-[clamp(18px,3.6vw,52px)] pb-[clamp(80px,14vh,150px)] pt-[clamp(220px,34vh,340px)] text-center">
            <div className="mx-auto max-w-4xl">
              <div className="flex items-center justify-center gap-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/80">
                  Find your bottle
                </p>
              </div>
              <h2 className="mt-3.5 inline-grid grid-cols-[auto_minmax(8ch,1fr)] items-baseline gap-x-3 text-left text-[clamp(30px,5vw,70px)] font-light leading-none" style={headingStyle}>
                <span className="whitespace-nowrap">Today I feel</span>
                <span className="whitespace-nowrap">
                  <span
                    ref={moodWordRef}
                    className="inline-block min-w-[8.5ch] border-b border-white/40 text-left italic"
                    style={accentStyle}
                  >
                    {activeMoodData.word}
                  </span>
                  <span className="opacity-50">.</span>
                </span>
              </h2>
            </div>
            <div className="mt-10 flex flex-wrap justify-center gap-2.5">
              {MOODS.map((mood) => (
                <button
                  key={mood.key}
                  type="button"
                  aria-pressed={mood.key === activeMood}
                  onClick={() => handleMoodChange(mood.key)}
                  className={`rounded-[3px] border px-5 py-3 text-xs font-medium tracking-[0.07em] shadow-[0_0_0_rgba(255,255,255,0)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(0,0,0,0.22)] md:cursor-none ${mood.key === activeMood ? 'border-white bg-white text-[#141618]' : 'border-white/35 bg-white/0 text-white/85 hover:border-white hover:bg-white/10 hover:text-white'}`}
                >
                  {mood.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <div ref={certFloatRef} className="cert-float" aria-hidden="true">
          <div className="cert-float-inner">
            {CERTIFICATES.map((certificate, index) => (
              <div key={certificate.title} data-cert-float={index}>
                <CertificateArtwork title={certificate.title} />
              </div>
            ))}
          </div>
        </div>

        <section className="about-end-screen">
          <div className="about-end-cta">
            <h2 data-about-fade className="text-[clamp(30px,4.6vw,60px)] font-light leading-none tracking-[-0.01em]" style={headingStyle}>
              Ready to taste <em className="not-italic">comfort?</em>
            </h2>
            <Link data-about-fade href="/products" className="rounded-[3px] border border-[#141618] bg-[#141618] px-8 py-3.5 text-sm font-medium tracking-[0.06em] text-[#FAFAF8] transition-colors duration-300 hover:border-[#D98A55] hover:bg-[#D98A55]">
              Explore the collection
            </Link>
          </div>

          <div className="about-footer-links" aria-label="Rahatlyk links">
            <div className="about-footer-links__inner">
              <div className="about-footer-links__row" data-about-fade>
                <span>Contact</span>
                <Link href="/contact">Contact page</Link>
              </div>
              <div className="about-footer-links__row" data-about-fade>
                <span>Careers</span>
                <Link href="/vacancies">Open positions</Link>
              </div>
              <div className="about-footer-links__row" data-about-fade>
                <span>Journal</span>
                <Link href="/news">Latest stories</Link>
              </div>
            </div>
          </div>

          <div className="about-end-wordmark" aria-hidden="true" style={headingStyle}>
            RAHATLYK
          </div>
        </section>
      </main>
      {activeCertificate !== null && typeof document !== 'undefined'
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
                  Close
                </button>
                <div className="cert-modal-doc">
                  <CertificateArtwork title={CERTIFICATES[activeCertificate].title} />
                </div>
                <div className="cert-modal-caption">
                  <h3>{CERTIFICATES[activeCertificate].modalName}</h3>
                  <span>{CERTIFICATES[activeCertificate].meta}</span>
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
