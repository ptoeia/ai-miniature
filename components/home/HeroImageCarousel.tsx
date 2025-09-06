"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

const HeroImageCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Define the hero images
  const heroImages = [
    {
      id: 'miniature-ai-hero',
      src: '/ai-miniatur/miniature-ai-hero.jpg',
      alt: 'AI Miniature Hero - Professional miniature photography with AI enhancement'
    },
    {
      id: 'miniature-workers-hero',
      src: '/ai-miniatur/Miniature-Workers-hero.webp',
      alt: 'Miniature Workers Hero - AI-generated miniature scene with workers'
    }
  ];

  // Auto-rotate between slides
  useEffect(() => {
    const slideInterval = 5000; // 5 seconds per slide
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, slideInterval);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <div className="relative w-full h-full">
      {heroImages.map((image, index) => (
        <div
          key={image.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="w-full h-full rounded-2xl overflow-hidden relative">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              priority={index === 0}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            
            {/* Gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
        </div>
      ))}

      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white shadow-lg'
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={() => setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length)}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110"
        aria-label="Previous slide"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % heroImages.length)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110"
        aria-label="Next slide"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default HeroImageCarousel;
