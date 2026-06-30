'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

declare global {
  interface Window {
    __pageIntroDone?: boolean;
    __homeHeroCoverReady?: boolean;
  }
}

export default function PageIntro() {
  const pathname = usePathname();
  const relativePath = pathname.replace(/^\/(en|ru|tm)(?=\/|$)/, '') || '/';

  // Frozen at mount — SPA navigation never changes this, so the intro
  // cannot re-trigger when the user navigates back to the home page.
  const [shouldPlay] = useState(() => relativePath === '/');

  const curtainRef   = useRef<HTMLDivElement>(null);
  const logoRef      = useRef<HTMLSpanElement>(null);
  const progressRef  = useRef<HTMLDivElement>(null);

  // ── Text + progress bar kick-off ─────────────────────────────────
  useEffect(() => {
    if (!shouldPlay) return;
    const MIN_TOTAL_MS = 2800;

    // Start the logo slide-up only after the heading font is ready,
    // so there is no FOUT jump mid-animation.
    document.fonts.ready.then(() => {
      if (logoRef.current) logoRef.current.style.animationPlayState = 'running';
    });

    const init = async () => {
      const { gsap } = await import('gsap');
      if (progressRef.current) {
        gsap.fromTo(
          progressRef.current,
          { scaleX: 0 },
          { scaleX: 0.82, duration: MIN_TOTAL_MS / 1000, ease: 'power1.out', transformOrigin: 'left center' },
        );
      }
    };
    init();
  }, [shouldPlay]);

  // ── Curtain exit when locale is ready ────────────────────────────
  useEffect(() => {
    if (!shouldPlay) return;

    const init = async () => {
      const { gsap } = await import('gsap');
      const curtain = curtainRef.current;
      if (!curtain) return;

      // Wait for BOTH conditions before dismissing the intro:
      //   1. window.load  — all images, fonts and sub-resources are ready
      //   2. minimum hold — intro always shows for at least MIN_TOTAL_MS from
      //      navigation start, with a floor of MIN_AFTER_READY_MS after the
      //      locale became ready (in case resources load unusually fast)
      await new Promise<void>((resolve) => {
        // Fonts + hero video metadata — query the DOM directly; the hero element
        // is already committed before any useEffect runs. Hard cap so a stalled
        // asset never blocks the curtain indefinitely.
        const LOAD_CAP_MS = 4000;
        const capTimer = setTimeout(resolve, LOAD_CAP_MS);
        const done = () => {
          clearTimeout(capTimer);
          window.removeEventListener('home-hero-cover-ready', done);
          resolve();
        };

        if (window.__homeHeroCoverReady) {
          done();
          return;
        }

        window.addEventListener('home-hero-cover-ready', done, { once: true });
      });

      const tl = gsap.timeline();

      // Snap progress bar to 100%
      if (progressRef.current) {
        gsap.killTweensOf(progressRef.current);
        tl.to(progressRef.current, { scaleX: 1, duration: 0.35, ease: 'power2.out', transformOrigin: 'left center' });
      }

      // Fade out logo
      if (logoRef.current) {
        tl.to(logoRef.current, { opacity: 0, duration: 0.3, ease: 'power2.in' }, '-=0.05');
      }

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
  }, [shouldPlay]);

  if (!shouldPlay) return null;

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
        {/* Wordmark — starts paused; JS releases it after fonts.ready */}
        <div style={{ overflow: 'hidden', paddingBottom: '0.12em' }}>
          <span
            ref={logoRef}
            className="intro-item"
            style={{
              display:          'block',
              color:            'white',
              fontSize:         'clamp(1.4rem, 4vw, 2.25rem)',
              fontWeight:       700,
              letterSpacing:    '0.55em',
              fontFamily:       'var(--font-heading), sans-serif',
              animation:        'intro-text-up 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.05s both',
              animationPlayState: 'paused',
            }}
          >
            RAHATLYK
          </span>
        </div>

      </div>
      {/* Progress bar — full width, pinned to bottom */}
      <div
        style={{
          position:        'absolute',
          top:             0,
          left:            0,
          right:           0,
          height:          '4px',
          backgroundColor: 'rgba(255,255,255,0.10)',
          overflow:        'hidden',
          zIndex:          2,
        }}
      >
        <div
          ref={progressRef}
          style={{
            position:        'absolute',
            inset:           0,
            backgroundColor: 'rgba(255,255,255,0.75)',
            transform:       'scaleX(0)',
            transformOrigin: 'left center',
          }}
        />
      </div>
    </div>
  );
}
