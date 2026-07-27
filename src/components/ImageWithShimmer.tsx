'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

type Props = React.ComponentProps<typeof Image>;

/** `next/image` wrapped with a shimmering skeleton shown until the image has actually loaded. */
export default function ImageWithShimmer({ className = '', onLoad, ...props }: Props) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Covers the case where the image is already cached and finishes loading
  // (or was already complete) before this effect attaches — otherwise the
  // shimmer would be stuck on-screen forever since `load` already fired.
  useEffect(() => {
    setLoaded(!!imgRef.current?.complete);
  }, [props.src]);

  return (
    <>
      {!loaded && <div className="img-shimmer pointer-events-none absolute inset-0" aria-hidden="true" />}
      <Image
        {...props}
        alt={props.alt}
        ref={imgRef}
        className={`${className} transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={(event) => {
          setLoaded(true);
          onLoad?.(event);
        }}
      />
    </>
  );
}
