"use client";

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import ImgComparisonSlider with SSR turned off
const ImgComparisonSlider = dynamic(() => 
  import('@img-comparison-slider/react').then(mod => mod.ImgComparisonSlider),
  {
    ssr: false,
    loading: () => <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center"><p className='text-sm text-muted-foreground'>Loading comparison...</p></div>
  }
);

// R2 CDN prefix for hero images
const CDN_PREFIX = 'https://i.banana-ai.art';

interface ComparisonPair {
  id: string;
  title: string;
  before: string;
  after: string;
  description: string;
}

const HeroComparisonSliders = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(20);
  const [isSliding, setIsSliding] = useState(true);
  const sliderRefs = useRef<(HTMLElement | null)[]>([]);

  // Define the comparison pairs based on available images
  const comparisonPairs: ComparisonPair[] = [
    {
      id: 'anime-style',
      title: 'Photo to Anime Style',
      before: `${CDN_PREFIX}/anima-before.png`,
      after: `${CDN_PREFIX}/anima-after.jpg`,
      description: 'Transform real photos into stunning anime artwork'
    },
    {
      id: 'background-change',
      title: 'Smart Background Change',
      before: `${CDN_PREFIX}/bg-change-before.png`,
      after: `${CDN_PREFIX}/bg-change-after.jpg`,
      description: 'Replace backgrounds with AI precision'
    },
    {
      id: 'mountain-scene',
      title: 'Day to Night Transformation',
      before: `${CDN_PREFIX}/mountain-bg-before.jpg`,
      after: `${CDN_PREFIX}/mountain-bg-after.webp`,
      description: 'Transform daylight scenes into magical nighttime views'
    }
  ];

  // Auto-rotate between slides and sync sliding animation
  useEffect(() => {
    const slideInterval = 8000; // 8 seconds per slide
    const slideDuration = 6000; // 6 seconds to slide from right to left
    
    // Reset slider position when slide changes - start from right (showing BEFORE)
    setSliderPosition(90);
    
    // Start sliding animation
    let animationId: number;
    let startTime = Date.now();
    const minPos = 10; // left position (more AFTER visible)
    const maxPos = 90; // right position (more BEFORE visible)
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      
      if (elapsed < slideDuration) {
        // Calculate position based on elapsed time - slide from right to left
        const progress = elapsed / slideDuration;
        const newPosition = maxPos - (maxPos - minPos) * progress;
        setSliderPosition(newPosition);
      } else {
        // Hold at min position (left side - showing more AFTER)
        setSliderPosition(minPos);
      }
      
      if (elapsed < slideInterval) {
        animationId = requestAnimationFrame(animate);
      }
    };
    
    animationId = requestAnimationFrame(animate);
    
    // Set up interval for slide rotation
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % comparisonPairs.length);
    }, slideInterval);

    return () => {
      clearInterval(interval);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [currentSlide, comparisonPairs.length]);

  return (
    <div className="relative w-full h-full">
      {comparisonPairs.map((pair, index) => (
        <div
          key={pair.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Image container */}
          <div className="w-full h-11/12 rounded-2xl overflow-hidden relative">
            <ImgComparisonSlider
              value={sliderPosition}
            >
              <img
                slot="first"
                src={pair.before}
                alt={`${pair.title} - Before`}
                className="w-full h-full object-cover"
              />
              <img
                slot="second"
                src={pair.after}
                alt={`${pair.title} - After`}
                className="w-full h-full object-cover"
              />
            </ImgComparisonSlider>
            
            {/* Before label - top left */}
            <div className="absolute top-2 left-2 z-20 bg-black/20 backdrop-blur-sm px-2 py-1 rounded-md">
              <span className="text-white text-xs font-medium">BEFORE</span>
            </div>
            
            {/* After label - top right */}
            <div className="absolute top-2 right-2 z-20 bg-black/20 backdrop-blur-sm px-2 py-1 rounded-md">
              <span className="text-white text-xs font-medium">AFTER</span>
            </div>
          </div>
          
          {/* Tips below image */}
          <div className="absolute bottom-0 left-0 right-0 h-1/12 flex items-center justify-center">
            <div className="bg-black/30 backdrop-blur-sm rounded-b-2xl px-4 py-2 w-full">
              <h4 className="text-white font-semibold text-xs mb-0.5">{pair.title}</h4>
              <p className="text-white/90 text-xs leading-tight">{pair.description}</p>
            </div>
          </div>
        </div>
      ))}

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
        {comparisonPairs.map((_, index) => (
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
        onClick={() => setCurrentSlide((prev) => (prev - 1 + comparisonPairs.length) % comparisonPairs.length)}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110"
        aria-label="Previous slide"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % comparisonPairs.length)}
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

export default HeroComparisonSliders;
