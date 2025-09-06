"use client";

import React from 'react';
import ImageComparison from '@/components/ui/ImageComparison';

interface ShowcaseImage {
  title: string;
  src: string;
  alt: string;
  description?: string;
  beforeImage?: string;
  afterImage?: string;
  beforeAlt?: string;
  afterAlt?: string;
  isComparison?: boolean;
}

const defaultShowcases: ShowcaseImage[] = [
  {
    title: "Hero Miniature Result",
    src: "/1757086043082_image.jpg",
    description: "Flagship output from our miniature pipeline — clean edges, tight focus, and believable depth.",
    alt: "Featured AI miniature transformation result"
  },
  {
    title: "Portrait, Miniaturized",
    src: "/ai-miniatur/Generated Image September 06, 2025 - 5_22PM.jpeg",
    description: "Converted with tilt‑shift depth and subtle grading to achieve a convincing toy‑world look.",
    alt: "AI Miniature Showcase result"
  },
  {
    title: "Bakery, Re‑scaled",
    src: "/ai-miniatur/3D-Bakery-after.webp",
    description: "Warm tones, tiny‑world proportions, and detailed props rendered with soft depth.",
    alt: "3D Bakery miniature after transformation"
  },
  {
    title: "Night City, Toy‑Scale",
    src: "/ai-miniatur/Miniature-nightview-after.webp",
    description: "Crisp highlights with layered, dreamy bokeh for a cinematic night miniature.",
    alt: "Miniature nightview after transformation"
  },
 
];

const ImageShowcasesSection: React.FC<{ items?: ShowcaseImage[] }>=({ items = defaultShowcases })=>{
  return (
    <section id="actual-showcase" className="w-full max-w-6xl mx-auto py-16 md:py-24">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="font-poppins text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 mb-4">
          Miniature Lab: Real Results
        </h2>
        <p className="font-roboto text-lg text-muted-foreground max-w-2xl mx-auto">
          Field‑tested conversions featuring tight subject focus and dreamy depth.
        </p>
      </div>
      <div className="">
        {items.map((showcase, index) => (
          <div 
            key={index} 
            className={`grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center p-2 md:p-3`}
          >
            <div className={`relative w-full aspect-[4/3] ${index % 2 !== 0 ? 'md:order-last' : ''}`}>
              {showcase.isComparison && showcase.beforeImage && showcase.afterImage ? (
                <div className="relative w-full h-full flex items-center justify-center p-4">
                  {/* After Image - Main large image */}
                  <div className="relative w-full max-w-sm aspect-square ml-8 mt-8">
                    <div className="w-full h-full rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
                      <img
                        src={showcase.afterImage}
                        alt={showcase.afterAlt || `${showcase.title} - After`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded shadow-lg">
                      AFTER
                    </div>
                  </div>
                  
                  {/* Before Image - Partially overlapping from bottom left */}
                  <div className="absolute bottom-0 left-0 z-10">
                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-lg overflow-hidden shadow-lg border-2 border-white hover:scale-105 transition-transform duration-300">
                      <img
                        src={showcase.beforeImage}
                        alt={showcase.beforeAlt || `${showcase.title} - Before`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs px-2 py-1 rounded shadow-lg">
                      BEFORE
                    </div>
                  </div>
                  
                  {/* Arrow pointing from before to after */}
                  <div className="absolute bottom-16 left-16 md:bottom-20 md:left-20">
                    <svg 
                      className="w-6 h-6 md:w-8 md:h-8 text-blue-500 animate-pulse" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={3} 
                        d="M7 17l9.2-9.2M17 17V7h-10" 
                      />
                    </svg>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 h-full">
                  <img
                    src={showcase.src}
                    alt={showcase.title}
                    className={`w-full h-full object-cover`}
                  />
                </div>
              )}
            </div>
            <div className="flex flex-col justify-center">
              <h3 className="font-poppins text-2xl font-semibold text-foreground mb-3">{showcase.title}</h3>
              <p className="font-roboto text-base text-muted-foreground leading-relaxed">{showcase.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ImageShowcasesSection;
