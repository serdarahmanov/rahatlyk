'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { NAVIGATION_PROGRESS_START_EVENT } from '@/lib/navigationProgress';

export default function NavigationProgress() {
  const pathname = usePathname();
  const barRef   = useRef<HTMLDivElement>(null);
  const prevPath = useRef(pathname);
  const active   = useRef(false);

  const startBar = () => {
    active.current = true;

    import('gsap').then(({ gsap }) => {
      const bar = barRef.current;
      if (!bar) return;
      gsap.killTweensOf(bar);
      gsap.set(bar, { scaleX: 0, opacity: 1, transformOrigin: 'left center' });
      gsap.to(bar, { scaleX: 0.85, duration: 3, ease: 'power1.out', transformOrigin: 'left center' });
    });
  };

  // ── Start bar on internal link click ──────────────────────────────
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest('a');
      if (!a) return;
      const href = a.getAttribute('href') ?? '';
      if (!href || href.startsWith('http') || href.startsWith('#') ||
          href.startsWith('mailto') || href.startsWith('tel')) return;
      if (href === pathname) return;

      startBar();
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [pathname]);

  // ── Start bar on explicit programmatic navigation (e.g. language switch) ──
  useEffect(() => {
    const onStart = () => startBar();
    window.addEventListener(NAVIGATION_PROGRESS_START_EVENT, onStart);
    return () => window.removeEventListener(NAVIGATION_PROGRESS_START_EVENT, onStart);
  }, []);

  // ── Complete bar when route finishes changing ─────────────────────
  useEffect(() => {
    if (pathname === prevPath.current) return;
    prevPath.current = pathname;
    if (!active.current) return;
    active.current = false;

    import('gsap').then(({ gsap }) => {
      const bar = barRef.current;
      if (!bar) return;
      gsap.killTweensOf(bar);
      gsap.timeline()
        .to(bar, { scaleX: 1, duration: 0.25, ease: 'power2.out', transformOrigin: 'left center' })
        .to(bar, { opacity: 0, duration: 0.3, ease: 'power2.in' })
        .set(bar, { scaleX: 0 });
    });
  }, [pathname]);

  return (
    <div
      style={{
        position:      'fixed',
        top:           0,
        left:          0,
        right:         0,
        height:        '3px',
        zIndex:        9998,
        pointerEvents: 'none',
      }}
    >
      <div
        ref={barRef}
        style={{
          position:        'absolute',
          inset:           0,
          backgroundColor: '#0891b2',
          transform:       'scaleX(0)',
          transformOrigin: 'left center',
          opacity:         0,
        }}
      />
    </div>
  );
}
