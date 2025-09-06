"use client";

import Image from 'next/image';
import { Star } from 'lucide-react';
import { useRef, useState, useEffect } from 'react'; // Added useState just in case, though not immediately used by current testimonial logic directly
import { testimonialsData } from '../../lib/data/testimonialsData'; // Adjusted import path

const TestimonialsSection = () => {
  const testimonialsScrollContainerRef = useRef<HTMLDivElement>(null);
  const loopedTestimonials = [...testimonialsData, ...testimonialsData];

  useEffect(() => {
    const scrollContainer = testimonialsScrollContainerRef.current;
    if (!scrollContainer) return;

    let scrollInterval: NodeJS.Timeout;
    const scrollSpeed = 1;
    const intervalTime = 25;

    const startScrolling = () => {
      scrollInterval = setInterval(() => {
        if (scrollContainer) {
          scrollContainer.scrollLeft += scrollSpeed;
          if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
            scrollContainer.scrollLeft = 0;
          }
        }
      }, intervalTime);
    };

    const stopScrolling = () => {
      clearInterval(scrollInterval);
    };

    startScrolling();

    scrollContainer.addEventListener('mouseenter', stopScrolling);
    scrollContainer.addEventListener('mouseleave', startScrolling);

    return () => {
      stopScrolling();
      if (scrollContainer) {
        scrollContainer.removeEventListener('mouseenter', stopScrolling);
        scrollContainer.removeEventListener('mouseleave', startScrolling);
      }
    };
  }, [testimonialsData]); // Dependency on testimonialsData

  return (
    <section className="w-full max-w-6xl mx-auto py-16 md:py-24">
      <div className="text-center mb-12 md:mb-16 px-4">
        <h2 className="font-poppins text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 mb-4">
          AI Miniature Success Stories
        </h2>
        <p className="font-roboto text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover how photographers and creators are using our AI miniature technology to create stunning tilt-shift effects and miniature world photography.
        </p>
      </div>
      <div
        ref={testimonialsScrollContainerRef}
        className="flex overflow-x-auto space-x-6 md:space-x-8 pb-6 px-4 md:px-8 no-scrollbar"
      >
        {loopedTestimonials.map((testimonial, index) => (
          <div
            key={index} 
            className="flex-shrink-0 w-[calc(100%-2rem)] sm:w-80 md:w-96 bg-background border border-border/30 rounded-xl p-6 shadow-lg flex flex-col items-center text-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <Image
              src={testimonial.avatar}
              alt={`${testimonial.name}'s avatar`}
              width={80} // Added width for next/image
              height={80} // Added height for next/image
              className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-primary/50 shadow-md"
            />
            <p className="font-roboto text-base text-muted-foreground italic mb-4 leading-relaxed">
              &quot;{testimonial.quote}&quot;
            </p>
            <h4 className="font-poppins text-lg font-semibold text-foreground mb-1">{testimonial.name}</h4>
            <div className="flex items-center justify-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  className={`mr-1 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                />
              ))}
              <span className="font-roboto text-sm text-muted-foreground ml-1">({testimonial.rating}.0)</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection; 