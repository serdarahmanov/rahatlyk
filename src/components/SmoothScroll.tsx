'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import type LenisType from 'lenis';

export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    let lenisInstance: LenisType | null = null;
    let scrollTriggerUpdate: (() => void) | null = null;
    let refreshScrollTrigger: (() => void) | null = null;
    let removeTicker: (() => void) | null = null;

    const onScrollTop = () => {
      if (lenisInstance) {
        lenisInstance.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }
      requestAnimationFrame(() => refreshScrollTrigger?.());
    };
    const onRefresh = () => requestAnimationFrame(() => refreshScrollTrigger?.());
    window.addEventListener('scroll-to-top', onScrollTop);
    window.addEventListener('refresh-scroll-triggers', onRefresh);

    const run = async () => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduceMotion || cancelled) return;

      // Lenis smooths desktop wheel scroll, but touch devices already have good
      // native momentum scrolling — layering Lenis's own easing on top of that
      // plus GSAP's per-frame transform-based pin recompute (needed to avoid a
      // Safari-specific position:fixed jump during toolbar show/hide) creates
      // two independent smoothing passes fighting each other, visible as jitter
      // on pinned sections. So Lenis is skipped entirely on touch devices —
      // ScrollTrigger/GSAP pins still run normally, just driven by native scroll.
      const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

      const { gsap } = await import('gsap');
      if (cancelled) return;

      let lenis: LenisType | null = null;
      if (!isTouchDevice) {
        const { default: Lenis } = await import('lenis');
        if (cancelled) return;

        lenis = new Lenis({
          duration: 1.12,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          syncTouch: false,
          wheelMultiplier: 0.85,
        });
        lenisInstance = lenis;
      }

      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        if (cancelled) return;
        ScrollTrigger.config({ ignoreMobileResize: true });
        scrollTriggerUpdate = () => ScrollTrigger.update();
        refreshScrollTrigger = () => ScrollTrigger.refresh();

        // Only on touch devices, where Lenis is skipped (see above) — normalizeScroll
        // is GSAP's own fix for mobile-browser scroll/viewport quirks (including the
        // toolbar-driven resize behavior behind the pin jump we fixed with
        // pinType:'transform'), but it takes over scroll itself, so it must not run
        // alongside Lenis, which is already doing that on desktop.
        if (isTouchDevice) {
          ScrollTrigger.normalizeScroll(true);
        }

        requestAnimationFrame(() => {
          if (cancelled) return;
          ScrollTrigger.refresh();
          window.dispatchEvent(new CustomEvent('smooth-scroll-ready'));
        });
      });

      if (lenis) {
        lenis.on('scroll', () => {
          scrollTriggerUpdate?.();
        });

        const lenisTick = (time: number) => {
          lenis!.raf(time * 1000);
        };
        gsap.ticker.add(lenisTick);
        gsap.ticker.lagSmoothing(0);
        removeTicker = () => gsap.ticker.remove(lenisTick);
      }
    };

    run();

    return () => {
      cancelled = true;
      window.removeEventListener('scroll-to-top', onScrollTop);
      window.removeEventListener('refresh-scroll-triggers', onRefresh);
      removeTicker?.();
      lenisInstance?.destroy();
    };
  }, [pathname]);

  return null;
}
