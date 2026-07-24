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

      const [{ default: Lenis }, { gsap }] = await Promise.all([
        import('lenis'),
        import('gsap'),
      ]);
      if (cancelled) return;

      const lenis = new Lenis({
        duration: 1.12,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 0.85,
      });

      lenisInstance = lenis;

      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        ScrollTrigger.config({ ignoreMobileResize: true });
        scrollTriggerUpdate = () => ScrollTrigger.update();
        refreshScrollTrigger = () => ScrollTrigger.refresh();
        requestAnimationFrame(() => {
          if (cancelled) return;
          ScrollTrigger.refresh();
          window.dispatchEvent(new CustomEvent('smooth-scroll-ready'));
        });
      });

      lenis.on('scroll', () => {
        scrollTriggerUpdate?.();
      });

      const lenisTick = (time: number) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(lenisTick);
      gsap.ticker.lagSmoothing(0);
      removeTicker = () => gsap.ticker.remove(lenisTick);
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
