import { Product } from '@/lib/data/products';

interface Props {
  product: Product;
  /** 'sm' = listing card  |  'lg' = detail hero */
  size?: 'sm' | 'lg';
  className?: string;
}

export default function ProductVisual({ product, size = 'sm', className = '' }: Props) {
  const { topColor, botColor, highlight, category, name, subtitle } = product;
  const gradId = `pv-${product.id}`;
  const hlId = `pvhl-${product.id}`;

  const sm = size === 'sm';

  /* ── Can (energy drinks) ─────────────────────────── */
  if (category === 'energy') {
    return (
      <svg
        viewBox="0 0 90 140"
        className={className || (sm ? 'w-16 h-28 mx-auto' : 'w-36 h-56 mx-auto')}
        style={{ filter: sm ? 'drop-shadow(0 4px 8px rgba(0,0,0,.12))' : 'drop-shadow(0 16px 40px rgba(0,0,0,.22))' }}
        aria-label={name}
      >
        <defs>
          <linearGradient id={gradId} x1="10%" y1="0%" x2="90%" y2="100%">
            <stop offset="0%" stopColor={topColor} />
            <stop offset="100%" stopColor={botColor} />
          </linearGradient>
          <linearGradient id={hlId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,.55)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
        {/* Body */}
        <rect x="15" y="18" width="60" height="104" rx="16" fill={`url(#${gradId})`} />
        {/* Top dome */}
        <ellipse cx="45" cy="18" rx="30" ry="8" fill={botColor} />
        {/* Bottom rim */}
        <ellipse cx="45" cy="122" rx="30" ry="7" fill={botColor} opacity=".7" />
        {/* Pull tab */}
        <rect x="39" y="9" width="12" height="9" rx="3" fill={botColor} />
        <rect x="43" y="7" width="4" height="4" rx="1.5" fill="white" opacity=".6" />
        {/* Label band */}
        <rect x="17" y="48" width="56" height="46" rx="4" fill="white" opacity=".22" />
        {/* Label text */}
        {!sm && (
          <>
            <text x="45" y="68" textAnchor="middle" fill={botColor} fontSize="6" fontWeight="bold" letterSpacing="1">RAHATLYK</text>
            <text x="45" y="78" textAnchor="middle" fill={botColor} fontSize="4" opacity=".75">{subtitle.toUpperCase()}</text>
          </>
        )}
        {/* Highlight streak */}
        <rect x="22" y="22" width="8" height="92" rx="4" fill={`url(#${hlId})`} opacity=".28" />
      </svg>
    );
  }

  /* ── Wide bottle (juices) ────────────────────────── */
  if (category === 'juices') {
    return (
      <svg
        viewBox="0 0 110 175"
        className={className || (sm ? 'w-20 h-32 mx-auto' : 'w-40 h-64 mx-auto')}
        style={{ filter: sm ? 'drop-shadow(0 4px 8px rgba(0,0,0,.12))' : 'drop-shadow(0 16px 40px rgba(0,0,0,.22))' }}
        aria-label={name}
      >
        <defs>
          <linearGradient id={gradId} x1="10%" y1="0%" x2="90%" y2="100%">
            <stop offset="0%" stopColor={topColor} />
            <stop offset="100%" stopColor={botColor} />
          </linearGradient>
          <linearGradient id={hlId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,.5)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
        {/* Cap */}
        <rect x="38" y="8" width="34" height="19" rx="5" fill={botColor} opacity=".88" />
        {/* Neck */}
        <path d="M36 24 Q32 34 22 44 L22 140 Q22 152 55 152 Q88 152 88 140 L88 44 Q78 34 74 24 Z" fill={`url(#${gradId})`} />
        {/* Shoulder highlight */}
        <path d="M36 24 Q32 34 22 44 L28 44 Q37 34 40 24 Z" fill="white" opacity=".18" />
        {/* Label */}
        <rect x="26" y="80" width="58" height="42" rx="6" fill="white" opacity=".3" />
        {!sm && (
          <>
            <text x="55" y="99" textAnchor="middle" fill={botColor} fontSize="7" fontWeight="bold" letterSpacing="1">RAHATLYK</text>
            <text x="55" y="111" textAnchor="middle" fill={botColor} fontSize="4.5" opacity=".8">{subtitle.toUpperCase()}</text>
          </>
        )}
        {/* Highlight */}
        <rect x="29" y="48" width="11" height="78" rx="5.5" fill={`url(#${hlId})`} opacity=".22" />
        {/* Shine */}
        <circle cx="81" cy="56" r="6" fill="white" opacity=".18" />
      </svg>
    );
  }

  /* ── Slim bottle (water, mineral, tea, soft) ─────── */
  return (
    <svg
      viewBox="0 0 100 175"
      className={className || (sm ? 'w-16 h-28 mx-auto' : 'w-36 h-64 mx-auto')}
      style={{ filter: sm ? 'drop-shadow(0 4px 8px rgba(0,0,0,.12))' : 'drop-shadow(0 16px 40px rgba(0,0,0,.22))' }}
      aria-label={name}
    >
      <defs>
        <linearGradient id={gradId} x1="10%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%" stopColor={topColor} />
          <stop offset="100%" stopColor={botColor} />
        </linearGradient>
        <linearGradient id={hlId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,.55)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>
      {/* Cap */}
      <rect x="38" y="8" width="24" height="19" rx="5" fill={botColor} opacity=".88" />
      {/* Neck */}
      <rect x="34" y="23" width="32" height="17" rx="4" fill={topColor} />
      {/* Body */}
      <rect x="20" y="36" width="60" height="116" rx="12" fill={`url(#${gradId})`} />
      {/* Label */}
      <rect x="23" y="76" width="54" height="44" rx="6" fill="white" opacity=".28" />
      {!sm && (
        <>
          <text x="50" y="96" textAnchor="middle" fill={botColor} fontSize="7" fontWeight="bold" letterSpacing="1">RAHATLYK</text>
          <text x="50" y="108" textAnchor="middle" fill={botColor} fontSize="4.5" opacity=".8">{subtitle.toUpperCase()}</text>
        </>
      )}
      {/* Highlight streak */}
      <rect x="27" y="40" width="10" height="86" rx="5" fill={`url(#${hlId})`} opacity=".28" />
      {/* Shine dot */}
      <circle cx="72" cy="48" r="6" fill="white" opacity=".2" />
    </svg>
  );
}
