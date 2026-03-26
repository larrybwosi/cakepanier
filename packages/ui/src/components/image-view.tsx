// components/image-lightbox.tsx
'use client';

import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import sanityLoader from '@repo/lib/sanity-loader';

interface ImageLightboxProps {
  images: { url: string; alt?: string | null }[];
  startIndex: number;
  onClose: () => void;
}

export function ImageLightbox({ images, startIndex, onClose }: ImageLightboxProps) {
  const [idx, setIdx] = useState(startIndex);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setIdx(p => (p + 1) % images.length);
      if (e.key === 'ArrowLeft') setIdx(p => (p - 1 + images.length) % images.length);
    };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handler);
    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('keydown', handler);
    };
  }, [images.length, onClose]);

  return (
    <div className="fixed inset-0 z-70 bg-black/98 flex flex-col items-center justify-center animate-in fade-in duration-200">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-3 rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors"
      >
        <X className="h-6 w-6" />
      </button>

      <div className="relative w-full h-full max-w-7xl max-h-[90vh] px-4 md:px-16 flex items-center justify-center">
        {images.length > 1 && (
          <>
            <button
              onClick={() => setIdx(p => (p - 1 + images.length) % images.length)}
              className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 p-3 rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
            >
              <ChevronLeft className="h-6 w-6 md:h-8 md:w-8" />
            </button>
            <button
              onClick={() => setIdx(p => (p + 1) % images.length)}
              className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 p-3 rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
            >
              <ChevronRight className="h-6 w-6 md:h-8 md:w-8" />
            </button>
          </>
        )}

        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src={images[idx].url}
            alt={images[idx].alt ?? 'Product image'}
            fill
            className="object-contain"
            sizes="100vw"
            priority
            loader={sanityLoader}
          />
        </div>
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-3">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`transition-all duration-300 rounded-sm ${
                i === idx ? 'w-8 h-2 bg-white' : 'w-2 h-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
