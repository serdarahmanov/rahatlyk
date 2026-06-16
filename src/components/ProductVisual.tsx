import Image from 'next/image';

type ProductVisualPhoto = string | { url: string };

type ProductVisualProduct = {
  name: string;
  photos?: ProductVisualPhoto[] | null;
};

interface Props {
  product: ProductVisualProduct;
  /** 'sm' = listing card  |  'lg' = detail hero */
  size?: 'sm' | 'lg';
  className?: string;
}

const FALLBACK = '/products/FeatureProductImg_RTD_LT.png';

export default function ProductVisual({ product, size = 'sm', className = '' }: Props) {
  const firstPhoto = product.photos?.[0];
  const src = typeof firstPhoto === 'string' ? firstPhoto : firstPhoto?.url ?? FALLBACK;

  if (size === 'sm') {
    // Fills whatever container the card gives us (w-full h-full)
    return (
      <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
        {/* Inner div: 70% of the container height — image scales within this */}
        <div className="relative w-full h-[70%] -translate-y-[8%]">
          <Image
            src={src}
            alt={product.name}
            fill
            className="object-contain object-center"
            sizes="(max-width: 640px) 200px, 320px"
          />
        </div>
      </div>
    );
  }

  // lg — detail hero
  return (
    <div className={`relative ${className || 'w-56 h-[26rem]'} mx-auto`}>
      <Image
        src={src}
        alt={product.name}
        fill
        className="object-contain drop-shadow-2xl"
        sizes="(max-width: 1024px) 50vw, 400px"
        priority
      />
    </div>
  );
}
