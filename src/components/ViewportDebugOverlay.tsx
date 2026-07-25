'use client';

import { useEffect, useState } from 'react';

// Temporary diagnostic overlay for the iOS "pinned section jumps behind the
// Dynamic Island" bug. Only activates with ?debug-viewport in the URL, so it
// never renders for real users. Remove once the root cause is confirmed fixed.

function readSafeAreaInsetTop(): number {
  const probe = document.createElement('div');
  probe.style.cssText =
    'position:fixed;top:0;left:0;height:env(safe-area-inset-top);width:0;visibility:hidden;pointer-events:none;';
  document.body.appendChild(probe);
  const px = probe.getBoundingClientRect().height;
  document.body.removeChild(probe);
  return px;
}

export default function ViewportDebugOverlay() {
  // Lazy initializer (not an effect) — only ever true when a developer opts
  // in via the query param, so the mismatch between the (always-false) SSR
  // pass and this client read is harmless for real users.
  const [enabled] = useState(() =>
    typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('debug-viewport')
  );
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    if (!enabled) return;
    const safeTop = readSafeAreaInsetTop();
    let raf = 0;

    const update = () => {
      const vv = window.visualViewport;
      const horiz = document.querySelector('[data-debug-pin="horizontal-scroll"]');
      const coll = document.querySelector('[data-debug-pin="collections"]');
      const hRect = horiz?.getBoundingClientRect();
      const cRect = coll?.getBoundingClientRect();

      setLines([
        `innerHeight: ${window.innerHeight}`,
        `vv.height: ${vv ? Math.round(vv.height) : '—'}`,
        `vv.offsetTop: ${vv ? Math.round(vv.offsetTop) : '—'}`,
        `vv.scale: ${vv ? vv.scale.toFixed(2) : '—'}`,
        `safe-area-inset-top: ${safeTop.toFixed(1)}`,
        `scrollY: ${Math.round(window.scrollY)}`,
        `— horizontal-scroll —`,
        `top: ${hRect ? hRect.top.toFixed(1) : '—'}  height: ${hRect ? hRect.height.toFixed(1) : '—'}`,
        `— collections —`,
        `top: ${cRect ? cRect.top.toFixed(1) : '—'}  height: ${cRect ? cRect.height.toFixed(1) : '—'}`,
      ]);

      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 'env(safe-area-inset-top)',
        left: 4,
        zIndex: 99999,
        background: 'rgba(0,0,0,0.8)',
        color: '#0f0',
        fontSize: 10,
        lineHeight: 1.5,
        padding: '6px 8px',
        borderRadius: 6,
        fontFamily: 'monospace',
        pointerEvents: 'none',
        whiteSpace: 'pre',
      }}
    >
      {lines.join('\n')}
    </div>
  );
}
