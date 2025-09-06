"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';

const ToolPreviewCarousel = () => {
    const [slideIndex, setSlideIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Define the motor preview images
  const previewImages = useMemo(() => [

    {
      id: 'motor-viral-tiktok-2-steps',
      src: '/motor/cara-buat-foto-miniatur-motor-ai-yang-viral-di-tiktok-pakai-2-langkah-ini.jpg',
      alt: 'Viral TikTok 2-step motor miniature photo style'
    },
    {
      id: 'motor-miniature-5',
      src: '/motor/motor-miniature-5.webp',
      alt: 'Motor miniature scene 5 - AI generated miniature photography'
    },
    {
      id: 'motor-miniature-7',
      src: '/motor/motor-miniature-7.webp',
      alt: 'Motor miniature scene 7 - AI generated miniature photography'
    },
    {
      id: 'motor-news-user',
      src: '/motor/IMG-Netral-News-User-10922-REHZ3A4GS5.jpg',
      alt: 'Motor news user image - AI miniature transformation example'
    }
  ], []);

  const startAutoRotate = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % previewImages.length);
    }, 4000);
  }, [previewImages.length]);

  useEffect(() => {
    if (previewImages.length > 1) {
      startAutoRotate();
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current as unknown as number);
      }
    };
  }, [previewImages.length, startAutoRotate]);

  const handleManualSlideChange = (newIndex: number) => {
    setSlideIndex(newIndex);
    startAutoRotate(); // Reset timer on manual change
  };

  return (
    <div className="w-full h-full relative group">
      {previewImages.map((image, index) => (
        <div
          key={image.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === slideIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={image.src}
            alt={image.alt}
            className="w-full h-full object-contain rounded-md"
            loading={index === 0 ? 'eager' : 'lazy'}
          />
        </div>
      ))}
      
      {/* Navigation arrows */}
      {previewImages.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => handleManualSlideChange((slideIndex - 1 + previewImages.length) % previewImages.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white shadow transition opacity-90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => handleManualSlideChange((slideIndex + 1) % previewImages.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white shadow transition opacity-90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </>
      )}
      
      {/* Progress dots */}
      {previewImages.length > 1 && (
        <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-2 opacity-80 group-hover:opacity-100 transition">
          {previewImages.map((_, idx) => {
            const isActive = idx === (slideIndex % previewImages.length);
            return (
              <button
                key={idx}
                type="button"
                aria-label={`Go to slide ${idx + 1}`}
                onClick={() => handleManualSlideChange(idx)}
                className={`w-2.5 h-2.5 rounded-full transition ${isActive ? 'bg-white shadow' : 'bg-white/40 hover:bg-white/60'}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ToolPreviewCarousel;
