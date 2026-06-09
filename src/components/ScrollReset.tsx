'use client';

import { useEffect } from 'react';

export default function ScrollReset() {
  useEffect(() => {
    // Disable browser scroll restoration so every page load starts at the top
    if (typeof window !== 'undefined' && 'scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  return null;
}
