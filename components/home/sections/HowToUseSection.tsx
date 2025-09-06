"use client";

import React from 'react';
import { Upload, MessageSquare, Wand2, Download } from 'lucide-react';

const HowToUseSection: React.FC = () => {
  return (
    <section id="how-to-use" className="w-full max-w-6xl mx-auto py-16 md:py-24">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="font-poppins text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 mb-4">
          How to Create AI Miniature Photos
        </h2>
        <p className="font-roboto text-lg text-muted-foreground max-w-2xl mx-auto">
          Transform your photos into stunning AI miniature scenes with professional tilt-shift effects in just four simple steps. Our AI miniature technology makes creating miniature world photography effortless and accessible to everyone.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
        <div tabIndex={0} role="article" className="group rounded-xl p-6 shadow-lg border border-border/40 bg-blue-50 dark:bg-blue-950/20 transition-transform transition-shadow duration-200 hover:-translate-y-0.5 hover:shadow-xl outline-none focus-visible:ring-1 focus-visible:ring-primary/20">
          <Upload className="w-6 h-6 text-primary mb-3 transition-colors duration-300 group-hover:text-primary/90" aria-hidden="true" />
          <div className="text-sm font-semibold text-primary mb-2">Step 1</div>
          <h3 className="font-poppins text-xl font-semibold mb-2">Upload Your Photo</h3>
          <p className="font-roboto text-muted-foreground">Upload any photo you want to transform into an AI miniature scene. Our AI miniature technology works with JPG/PNG/WEBP formats, up to 5MB per image.</p>
        </div>
        <div tabIndex={0} role="article" className="group rounded-xl p-6 shadow-lg border border-border/40 bg-purple-50 dark:bg-purple-950/20 transition-transform transition-shadow duration-200 hover:-translate-y-0.5 hover:shadow-xl outline-none focus-visible:ring-1 focus-visible:ring-primary/20">
          <MessageSquare className="w-6 h-6 text-primary mb-3 transition-colors duration-300 group-hover:text-primary/90" aria-hidden="true" />
          <div className="text-sm font-semibold text-primary mb-2">Step 2</div>
          <h3 className="font-poppins text-xl font-semibold mb-2">Describe AI Miniature Style</h3>
          <p className="font-roboto text-muted-foreground">Specify your desired AI miniature effect: tilt-shift intensity, focus area, color enhancement, and miniature world atmosphere. Our AI miniature engine understands detailed style descriptions.</p>
        </div>
        <div tabIndex={0} role="article" className="group rounded-xl p-6 shadow-lg border border-border/40 bg-emerald-50 dark:bg-emerald-950/20 transition-transform transition-shadow duration-200 hover:-translate-y-0.5 hover:shadow-xl outline-none focus-visible:ring-1 focus-visible:ring-primary/20">
          <Wand2 className="w-6 h-6 text-primary mb-3 transition-colors duration-300 group-hover:text-primary/90" aria-hidden="true" />
          <div className="text-sm font-semibold text-primary mb-2">Step 3</div>
          <h3 className="font-poppins text-xl font-semibold mb-2">Generate AI Miniature</h3>
          <p className="font-roboto text-muted-foreground">Click Generate and watch our AI miniature technology transform your photo in seconds. Advanced algorithms create professional tilt-shift effects with perfect depth control.</p>
        </div>
        <div tabIndex={0} role="article" className="group rounded-xl p-6 shadow-lg border border-border/40 bg-amber-50 dark:bg-amber-950/20 transition-transform transition-shadow duration-200 hover:-translate-y-0.5 hover:shadow-xl outline-none focus-visible:ring-1 focus-visible:ring-primary/20">
          <Download className="w-6 h-6 text-primary mb-3 transition-colors duration-300 group-hover:text-primary/90" aria-hidden="true" />
          <div className="text-sm font-semibold text-primary mb-2">Step 4</div>
          <h3 className="font-poppins text-xl font-semibold mb-2">Download & Share</h3>
          <p className="font-roboto text-muted-foreground">Preview your stunning AI miniature creation at full resolution and download instantly. Perfect for social media, print, or creating your own miniature world gallery.</p>
        </div>
      </div>
    </section>
  );
};

export default HowToUseSection;
