'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

declare global {
  interface Window {
    __pageIntroDone?: boolean;
  }
}

export default function PageIntro() {
  const { ready } = useLanguage();

  const curtainRef = useRef<HTMLDivElement>(null);
  const logoRef    = useRef<HTMLSpanElement>(null);
  const taglineRef = useRef<HTMLSpanElement>(null);
  const lineRef    = useRef<HTMLDivElement>(null);

  // ── Hide text before first paint so there's no flash ─────────────
  useLayoutEffect(() => {
    if (logoRef.current)    logoRef.current.style.transform = 'translateY(110%)';
    if (taglineRef.current) taglineRef.current.style.transform = 'translateY(110%)';
  }, []);

  // ── Text entrance ─────────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      const { gsap } = await import('gsap');
      const tl = gsap.timeline();

      if (logoRef.current) {
        tl.to(logoRef.current, {
          y: '0%', duration: 1, ease: 'power4.out', delay: 0.15,
        });
      }
      if (taglineRef.current) {
        tl.to(taglineRef.current, {
          y: '0%', duration: 0.85, ease: 'power4.out',
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
      if (!curtain) return;

      // Wait for BOTH conditions before dismissing the intro:
      //   1. window.load  — all images, fonts and sub-resources are ready
      //   2. minimum hold — intro always shows for at least MIN_TOTAL_MS from
      //      navigation start, with a floor of MIN_AFTER_READY_MS after the
      //      locale became ready (in case resources load unusually fast)
      const MIN_TOTAL_MS       = 2800; // total ms from page-navigation start
      const MIN_AFTER_READY_MS = 1200; // floor after locale/ready gate

      const elapsed = performance.now();

      await Promise.all([
        // All images + fonts done
        new Promise<void>((resolve) => {
          if (document.readyState === 'complete') resolve();
          else window.addEventListener('load', () => resolve(), { once: true });
        }),
        // Minimum display time
        new Promise<void>((resolve) =>
          setTimeout(resolve, Math.max(MIN_AFTER_READY_MS, MIN_TOTAL_MS - elapsed)),
        ),
      ]);

      const tl = gsap.timeline();

      // Fade out text
      tl.to(
        [logoRef.current, taglineRef.current, lineRef.current].filter(Boolean),
        { opacity: 0, duration: 0.3, ease: 'power2.in' },
      );

      // Slide the solid panel straight up — no backdrop-filter means no blur seam
      tl.to(curtain, {
        yPercent:  -100,
        duration:  0.95,
        ease:      'power4.inOut',
        onStart: () => {
          window.__pageIntroDone = true;
          window.dispatchEvent(new CustomEvent('page-intro-done'));
        },
        onComplete: () => {
          curtain.style.display = 'none';
          window.dispatchEvent(new CustomEvent('page-intro-complete'));
        },
      }, '-=0.05');
    };

    init();
  }, [ready]);

  return (
    <div
      ref={curtainRef}
      style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#0c3a52', overflow: 'hidden' }}
    >
      {/* ── Fresh water gradient ── */}
      <div className="pointer-events-none absolute inset-0">
        {/* Base wash — teal depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f4a68] via-[#0c3a52] to-[#051a2c]" />
        {/* All blobs use drift-only animations (no pulse, no delay) so they
            all appear instantly at the same opacity — no ladder effect */}
        {/* Top-left aqua bloom */}
        <div className="absolute -top-[20%] -left-[10%] w-[65%] h-[75%] rounded-full bg-[#4dd8f5] blur-[90px]"
          style={{ opacity: 0.55, animation: 'water-drift-1 12s ease-in-out infinite' }} />
        {/* Top-center sunlight — near white */}
        <div className="absolute -top-[10%] left-[25%] w-[40%] h-[55%] rounded-full bg-[#eef9ff] blur-[70px]"
          style={{ opacity: 0.50, animation: 'water-drift-2 16s ease-in-out infinite' }} />
        {/* Mid-right soft blue */}
        <div className="absolute top-[20%] right-[-5%] w-[45%] h-[60%] rounded-full bg-[#38b8d4] blur-[80px]"
          style={{ opacity: 0.45, animation: 'water-drift-3 11s ease-in-out infinite' }} />
        {/* Bottom pale shimmer */}
        <div className="absolute bottom-[-15%] left-[10%] w-[50%] h-[50%] rounded-full bg-[#c8ebf8] blur-[70px]"
          style={{ opacity: 0.50, animation: 'water-drift-4 14s ease-in-out infinite' }} />
        {/* Center white glow */}
        <div className="absolute top-[35%] left-[40%] w-[30%] h-[35%] rounded-full bg-[#e8f8ff] blur-[60px]"
          style={{ opacity: 0.40, animation: 'water-drift-1 18s ease-in-out infinite reverse' }} />
        {/* Grain overlay for organic texture */}
        <div
          className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '300px 300px',
          }}
        />
      </div>

      {/* ── Centered branding (above gradient layer) ── */}
      <div
        style={{
          position:       'absolute',
          inset:          0,
          zIndex:         1,
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
              color:         'rgba(255,255,255,0.55)',
              fontSize:      'clamp(0.55rem, 1.2vw, 0.7rem)',
              letterSpacing: '0.35em',
              fontFamily:    'var(--font-heading), sans-serif',
              textTransform: 'uppercase',
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
            backgroundColor: 'rgba(255,255,255,0.12)',
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
              backgroundColor: 'rgba(255,255,255,0.6)',
              transform:       'scaleX(0)',
              transformOrigin: 'left center',
            }}
          />
        </div>
      </div>
    </div>
  );
}
