'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function PageIntro() {
  const { ready } = useLanguage();

  const bgRef       = useRef<HTMLDivElement>(null);
  const curtainRef  = useRef<HTMLDivElement>(null);
  const logoRef     = useRef<HTMLSpanElement>(null);
  const taglineRef  = useRef<HTMLSpanElement>(null);
  const lineRef     = useRef<HTMLDivElement>(null);
  // ── Set inline style before the first client paint ───────────────
  useLayoutEffect(() => {
    if (logoRef.current)    logoRef.current.style.transform    = 'translateY(110%)';
    if (taglineRef.current) taglineRef.current.style.transform = 'translateY(110%)';
  }, []);

  // ── Logo entrance ────────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      const { gsap } = await import('gsap');

      const tl = gsap.timeline();

      if (logoRef.current) {
        tl.to(logoRef.current, {
          y: '0%',
          duration: 1,
          ease: 'power4.out',
          delay: 0.15,
        });
      }

      if (taglineRef.current) {
        tl.to(taglineRef.current, {
          y: '0%',
          duration: 0.85,
          ease: 'power4.out',
        }, '-=0.55');
      }

      if (lineRef.current) {
        tl.fromTo(
          lineRef.current,
          { scaleX: 0, transformOrigin: 'left center' },
          { scaleX: 1, duration: 0.9, ease: 'power2.inOut' },
          '-=0.6',
        );
      }
    };

    init();
  }, []);

  // ── Curtain exit when locale is ready ────────────────────────────
  useEffect(() => {
    if (!ready) return;

    const init = async () => {
      const { gsap } = await import('gsap');
      const curtain = curtainRef.current;
      const bg      = bgRef.current;
      if (!curtain) return;

      const elapsed = performance.now();
      const holdMs  = Math.max(300, 1400 - elapsed);

      const tl = gsap.timeline({ delay: holdMs / 1000 });

      // Fade out text
      tl.to(
        [logoRef.current, taglineRef.current, lineRef.current].filter(Boolean),
        { opacity: 0, duration: 0.3, ease: 'power2.in' },
      );

      // Slide up the overlay curtain; simultaneously fade the photo out
      tl.to(curtain, {
        yPercent: -100,
        duration: 0.95,
        ease: 'power4.inOut',
        onStart: () => {
          window.dispatchEvent(new CustomEvent('page-intro-done'));
          // Photo stays in place — just fade it out as the overlay lifts
          if (bg) gsap.to(bg, { opacity: 0, duration: 0.65, ease: 'power2.in' });
        },
        onComplete: () => {
          curtain.style.display = 'none';
          if (bg) bg.style.display = 'none';
          const header = document.querySelector<HTMLElement>('header');
          if (header) {
            header.style.transition = 'opacity 0.35s ease';
            header.style.opacity    = '1';
          }
        },
      }, '-=0.05');
    };

    init();
  }, [ready]);

  return (
    <>
      {/* ── Layer 1: photo — fixed, does NOT slide ── */}
      <div
        ref={bgRef}
        style={{ position: 'fixed', inset: 0, zIndex: 9998 }}
      >
        <Image
          src="/story/photo-8.jpg"
          alt=""
          fill
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          priority
        />
      </div>

      {/* ── Layer 2: glass overlay + text — slides up on exit ── */}
      <div
        ref={curtainRef}
        style={{
          position:             'fixed',
          inset:                0,
          zIndex:               9999,
          overflow:             'hidden',
          background:           'rgba(0, 15, 30, 0.35)',
          backdropFilter:       'blur(14px) saturate(1.2)',
          WebkitBackdropFilter: 'blur(14px) saturate(1.2)',
        }}
      >
        {/* Floating text */}
        <div
          style={{
            position:       'absolute',
            inset:          0,
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            justifyContent: 'center',
            gap:            '1.25rem',
          }}
        >
          {/* Wordmark */}
          <div style={{ overflow: 'hidden', paddingBottom: '0.12em' }}>
            <span
              ref={logoRef}
              className="intro-item"
              style={{
                display:       'block',
                color:         'white',
                fontSize:      'clamp(1.4rem, 4vw, 2.25rem)',
                fontWeight:    700,
                letterSpacing: '0.55em',
                fontFamily:    'var(--font-heading), sans-serif',
                textShadow:    '0 2px 20px rgba(0,0,0,0.3)',
              }}
            >
              RAHATLYK
            </span>
          </div>

          {/* Tagline */}
          <div style={{ overflow: 'hidden', paddingBottom: '0.1em' }}>
            <span
              ref={taglineRef}
              className="intro-item"
              style={{
                display:       'block',
                color:         'rgba(255,255,255,0.8)',
                fontSize:      'clamp(0.55rem, 1.2vw, 0.7rem)',
                letterSpacing: '0.35em',
                fontFamily:    'var(--font-heading), sans-serif',
                textTransform: 'uppercase',
                textShadow:    '0 1px 8px rgba(0,0,0,0.25)',
              }}
            >
              Pure · Natural · Life
            </span>
          </div>

          {/* Thin animated line */}
          <div
            style={{
              width:           '2.5rem',
              height:          '1px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              marginTop:       '0.5rem',
              overflow:        'hidden',
              position:        'relative',
            }}
          >
            <div
              ref={lineRef}
              style={{
                position:        'absolute',
                inset:           0,
                backgroundColor: 'rgba(255,255,255,0.85)',
                transform:       'scaleX(0)',
                transformOrigin: 'left center',
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
