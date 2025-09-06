"use client";

import Image from 'next/image';
import HeroImageCarousel from '../HeroImageCarousel';
import { Edit3, Sparkles, Zap } from 'lucide-react';
import React from 'react';

interface HeroSectionProps {
  onStartCreating: () => void;
  onExploreFeatures: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onStartCreating, onExploreFeatures }) => {
  return (
    <section className="w-full relative -mt-4">
      <div className="gradient-hero pt-20 pb-16 md:pb-20 lg:pb-28 relative">
        <div className="floating-orb w-64 h-64 top-20 left-20 opacity-60"></div>
        <div className="floating-orb w-48 h-48 top-1/2 right-20 opacity-40"></div>
        <div className="floating-orb w-32 h-32 bottom-40 left-1/3 opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col items-start text-left relative z-10">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-200/30 mb-6">
                <Sparkles size={16} className="text-blue-600 mr-2" />
                <span className="text-sm font-medium gradient-text">Professional AI Miniature Technology</span>
              </div>
              <h1 className="font-poppins font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6">
                <span className="gradient-text">AI Miniature Photo Generator</span>
                <br />
                <span className="text-foreground">with Tilt-Shift Effects</span>
              </h1>
              <p className="font-roboto text-xl sm:text-2xl text-muted-foreground mb-10 max-w-xl leading-relaxed">
                Transform your photos into stunning AI miniature scenes with tilt-shift effects — professional quality, instant results.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <button
                  onClick={onStartCreating}
                  className="gradient-button text-white px-10 py-4 rounded-xl text-xl font-semibold flex items-center justify-center gap-3 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-2xl hover:shadow-blue-500/30 animate-pulse-glow"
                >
                  <Zap size={24} />
                  Start Creating
                </button>
                <button
                  onClick={onExploreFeatures}
                  className="gradient-card text-foreground px-10 py-4 rounded-xl text-xl font-semibold flex items-center justify-center gap-3 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-xl hover:shadow-lg"
                >
                  <Edit3 size={24} />
                  Explore Features
                </button>
              </div>
            </div>
            <div className="relative z-10">
              <div className="p-4">
                <div className="relative w-full aspect-[4/3] md:aspect-[5/4] rounded-2xl overflow-hidden shadow-2xl">
                  <HeroImageCarousel />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
