'use client';

import { forwardRef, useState, useEffect, useRef, useCallback } from 'react';

type Filter = { key: string; label: string };

interface FilterBarProps {
  filters: Filter[];
  active: string;
  onChange: (key: string) => void;
}

const FilterBar = forwardRef<HTMLDivElement, FilterBarProps>(
  ({ filters, active, onChange }, desktopRef) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const activeButtonRef = useRef<HTMLButtonElement | null>(null);
    const [canScrollLeft,  setCanScrollLeft]  = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const check = useCallback(() => {
      const el = scrollRef.current;
      if (!el) return;
      setCanScrollLeft(el.scrollLeft > 2);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
    }, []);

    useEffect(() => {
      check();
      const el = scrollRef.current;
      if (!el) return;
      el.addEventListener('scroll', check, { passive: true });
      window.addEventListener('resize', check);
      const resizeObserver = new ResizeObserver(check);
      resizeObserver.observe(el);
      Array.from(el.children).forEach((child) => resizeObserver.observe(child));
      return () => {
        el.removeEventListener('scroll', check);
        window.removeEventListener('resize', check);
        resizeObserver.disconnect();
      };
    }, [check, filters]);

    useEffect(() => {
      const activeButton = activeButtonRef.current;
      const scrollContainer = scrollRef.current;
      if (!activeButton || !scrollContainer) return;

      activeButton.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });

      const timeout = window.setTimeout(check, 350);
      return () => window.clearTimeout(timeout);
    }, [active, check]);

    const scroll = (dir: -1 | 1) => {
      scrollRef.current?.scrollBy({ left: dir * 160, behavior: 'smooth' });
    };

    const pill = (key: string) =>
      `filter-bar-pill-enter flex-shrink-0 rounded-[3px] border px-5 py-3 text-xs font-normal tracking-[0.05em] transition-[background-color,border-color,color] duration-200 ${
        active === key
          ? 'border-gray-900 bg-gray-900 text-white'
          : 'border-gray-300 bg-transparent text-gray-500 hover:border-gray-900 hover:text-gray-900'
      }`;

    return (
      <div className="mb-8">

        {/* Mobile: scrollable strip with floating arrow overlays */}
        <div className="filter-bar-enter relative md:hidden">
          <div
            ref={scrollRef}
            className="mx-0.5 flex items-center gap-2 overflow-x-auto"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {filters.map((f, index) => (
              <button
                key={f.key}
                ref={active === f.key ? activeButtonRef : undefined}
                onClick={() => onChange(f.key)}
                className={pill(f.key)}
                style={{ '--filter-entry-index': index } as React.CSSProperties}
              >
                {f.label}
              </button>
            ))}
          </div>

          {canScrollLeft && (
            <div
              className="pointer-events-none absolute left-0 -top-2 -bottom-2 w-14 flex items-center"
              style={{ background: 'linear-gradient(to right, white 35%, transparent)' }}
            >
              <button
                onClick={() => scroll(-1)}
                aria-label="Scroll categories left"
                className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-md text-gray-500 transition-colors duration-200 hover:bg-white hover:text-gray-900"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          )}

          {canScrollRight && (
            <div
              className="pointer-events-none absolute right-0 -top-2 -bottom-2 w-14 flex items-center justify-end"
              style={{ background: 'linear-gradient(to left, white 35%, transparent)' }}
            >
              <button
                onClick={() => scroll(1)}
                aria-label="Scroll categories right"
                className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-md text-gray-500 transition-colors duration-200 hover:bg-white hover:text-gray-900"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Desktop: all pills visible */}
        <div
          key={`desktop-${active}`}
          ref={desktopRef}
          className="filter-bar-enter hidden md:flex items-center gap-2"
        >
          {filters.map((f, index) => (
            <button
              key={f.key}
              onClick={() => onChange(f.key)}
              className={pill(f.key)}
              style={{ '--filter-entry-index': index } as React.CSSProperties}
            >
              {f.label}
            </button>
          ))}
        </div>

      </div>
    );
  }
);

FilterBar.displayName = 'FilterBar';
export default FilterBar;
