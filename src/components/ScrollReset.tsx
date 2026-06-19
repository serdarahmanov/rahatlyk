'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollReset() {
  const pathname = usePathname();

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    window.dispatchEvent(new CustomEvent('scroll-to-top'));
  }, [pathname]);

  return null;
}
