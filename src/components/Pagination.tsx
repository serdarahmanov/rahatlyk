'use client';

interface Props {
  page: number;
  totalPages: number;
  totalDocs: number;
  limit: number;
  onChange: (page: number) => void;
  label?: string;
}

export default function Pagination({ page, totalPages, totalDocs, limit, onChange, label = 'items' }: Props) {
  if (totalPages <= 1) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, totalDocs);

  const go = (n: number) => {
    onChange(n);
    window.dispatchEvent(new CustomEvent('scroll-to-top'));
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.scrollTo({ top: 0 });
    }
  };

  const pages: (number | null)[] =
    totalPages <= 5
      ? Array.from({ length: totalPages }, (_, i) => i + 1)
      : page <= 3
      ? [1, 2, 3, 4, null, totalPages]
      : page >= totalPages - 2
      ? [1, null, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
      : [1, null, page - 1, page, page + 1, null, totalPages];

  return (
    <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col items-center gap-3">
      <p className="text-[11px] text-slate-400 font-light tracking-wide">
        {from}&ndash;{to} of {totalDocs} {label}
      </p>

      <div className="flex items-center">
        <button
          onClick={() => go(page - 1)}
          disabled={page === 1}
          className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-slate-800 disabled:opacity-20 disabled:cursor-not-allowed transition-colors duration-150"
          aria-label="Previous page"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M8.5 2L3.5 6.5l5 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {pages.map((n, i) =>
          n === null ? (
            <span
              key={`ellipsis-${i}`}
              className="w-9 h-9 flex items-center justify-center text-slate-300 text-xs select-none"
            >
              ···
            </span>
          ) : (
            <button
              key={n}
              onClick={() => go(n)}
              className={`w-9 h-9 flex items-center justify-center text-sm transition-all duration-150 ${
                n === page
                  ? 'text-slate-900 font-medium underline underline-offset-4 decoration-slate-900/30'
                  : 'text-slate-400 hover:text-slate-700 font-light'
              }`}
            >
              {n}
            </button>
          )
        )}

        <button
          onClick={() => go(page + 1)}
          disabled={page === totalPages}
          className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-slate-800 disabled:opacity-20 disabled:cursor-not-allowed transition-colors duration-150"
          aria-label="Next page"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M4.5 2l5 4.5-5 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
