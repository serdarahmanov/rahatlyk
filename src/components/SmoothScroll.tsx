'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) return;

    let frame = 0;
    let scrollTriggerUpdate: (() => void) | null = null;

    const lenis = new Lenis({
      duration: 1.12,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.85,
    });

    import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      scrollTriggerUpdate = () => ScrollTrigger.update();
    });

    lenis.on('scroll', () => {
      scrollTriggerUpdate?.();
    });

    const onScrollTop = () => lenis.scrollTo(0, { immediate: true });
    window.addEventListener('scroll-to-top', onScrollTop);

    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };

    frame = requestAnimationFrame(raf);

    return () => {
      window.removeEventListener('scroll-to-top', onScrollTop);
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [pathname]);

  return null;
}
