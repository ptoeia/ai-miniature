"use client";

import React from 'react';
import { Zap } from 'lucide-react';

interface VideoShowcaseSectionProps {
  onTry: () => void;
}

const VideoShowcaseSection: React.FC<VideoShowcaseSectionProps> = ({ onTry }) => {
  return (
    <section id="video-demos" className="w-full max-w-6xl mx-auto py-16 md:py-24">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="font-poppins text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 mb-4">
          Banana AI in Action
        </h2>
        <p className="font-roboto text-lg text-muted-foreground max-w-2xl mx-auto">
          Watch Banana AI transform your photos with revolutionary one-shot editing precision. See real examples of character consistency, scene blending, and professional enhancement capabilities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        <div className="bg-card border border-border rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted">
            <video className="w-full h-full object-cover" controls preload="metadata" poster="/video-poster-1.jpeg">
              <source src="https://s.sprunki.run/banana-ai-indoor-design.webm" type="video/webm" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="mt-4">
            <h3 className="font-poppins text-lg font-semibold text-foreground mb-2">AI Image Editing</h3>
            <p className="font-roboto text-sm text-muted-foreground">
              See how Banana AI enhances and transforms photos with intelligent editing capabilities and natural language commands.
            </p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted">
            <video className="w-full h-full object-cover" controls preload="metadata" poster="/video-poster-2.jpeg">
              <source src="https://s.sprunki.run/Character_consistency_banana_ai.webm" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="mt-4">
            <h3 className="font-poppins text-lg font-semibold text-foreground mb-2">Character Consistency</h3>
            <p className="font-roboto text-sm text-muted-foreground">
              Maintain character identity across multiple images with consistent AI generation.
            </p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted">
            <video className="w-full h-full object-cover" controls preload="metadata" poster="/video-poster-3.jpeg">
              <source src="https://s.sprunki.run/Blend_photos_together_banana_ai.webm" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="mt-4">
            <h3 className="font-poppins text-lg font-semibold text-foreground mb-2">Photo Blending</h3>
            <p className="font-roboto text-sm text-muted-foreground">
              Seamlessly blend multiple photos together with AI-powered photo merging.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center mt-12">
        <button
          onClick={onTry}
          className="font-roboto bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white hover:from-purple-700 hover:via-pink-600 hover:to-red-600 px-8 py-3 rounded-lg text-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-purple-500/30 mx-auto"
        >
          <Zap size={20} />
          Try Banana AI Now
        </button>
      </div>
    </section>
  );
};

export default VideoShowcaseSection;
