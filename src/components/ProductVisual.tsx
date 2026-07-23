'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

type ProductVisualPhoto = string | { url: string };

type ProductVisualProduct = {
  name: string;
  photos?: ProductVisualPhoto[] | null;
  videoUrl?: string | null;
};

interface Props {
  product: ProductVisualProduct;
  /** 'sm' = listing card  |  'lg' = detail hero */
  size?: 'sm' | 'lg';
  className?: string;
}

const photoUrl = (p: ProductVisualPhoto | undefined): string | null =>
  typeof p === 'string' ? p : p?.url ?? null;

function useCanLoadHoverMedia() {
  const [canLoad, setCanLoad] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 768px)');
    const update = () => setCanLoad(query.matches);

    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return canLoad;
}

export default function ProductVisual({ product, size = 'sm', className = '' }: Props) {
  const canLoadHoverMedia = useCanLoadHoverMedia();
  const src  = photoUrl(product.photos?.[0]);
  const src2 = photoUrl(product.photos?.[1]);

  if (size === 'sm') {
    const hoverVideo = canLoadHoverMedia ? product.videoUrl ?? null : null;
    const hoverPhoto = canLoadHoverMedia && !hoverVideo && src2 && src2 !== src ? src2 : null;
    const hasHover   = !!(hoverVideo || hoverPhoto);

    return (
      <div className="relative w-full h-full group/photo">
        {src && (
          <Image
            src={src}
            alt={product.name}
            fill
            className={`object-cover object-center transition-opacity duration-500 ${hasHover ? 'group-hover/photo:opacity-0' : ''}`}
            sizes="(max-width: 640px) 200px, 320px"
          />
        )}
        {hoverVideo && (
          <video
            src={hoverVideo}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-0 group-hover/photo:opacity-100"
          />
        )}
        {hoverPhoto && (
          <Image
            src={hoverPhoto}
            alt={product.name}
            fill
            className="object-cover object-center transition-opacity duration-500 opacity-0 group-hover/photo:opacity-100"
            sizes="(max-width: 640px) 200px, 320px"
          />
        )}
      </div>
    );
  }

  // lg — detail hero
  return (
    <div className={`relative ${className || 'w-56 h-[26rem]'} mx-auto`}>
      {src && (
        <Image
          src={src}
          alt={product.name}
          fill
          className="object-contain drop-shadow-2xl"
          sizes="(max-width: 1024px) 50vw, 400px"
          priority
        />
      )}
    </div>
  );
}
