"use client";

import React from 'react';
import { Clock, Target, Globe, Star } from 'lucide-react';

interface BenefitItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
}

const defaultBenefits: BenefitItem[] = [
  {
    icon: <Clock size={28} className="text-sky-500" />,
    title: 'Instant AI Miniature Creation',
    description: "Generate stunning AI miniature effects in seconds. No waiting, no complex processing - just instant professional results.",
    bgColor: 'bg-sky-500/10',
  },
  {
    icon: <Target size={28} className="text-rose-500" />,
    title: 'Perfect Tilt-Shift Simulation',
    description: "Our AI miniature technology creates authentic tilt-shift effects that match expensive lens results without the equipment cost.",
    bgColor: 'bg-rose-500/10',
  },
  {
    icon: <Globe size={28} className="text-violet-500" />,
    title: 'Universal Photo Compatibility',
    description: "Works with any photo type - landscapes, cityscapes, portraits, or architecture. AI miniature effects enhance every image style.",
    bgColor: 'bg-violet-500/10',
  },
  {
    icon: <Star size={28} className="text-fuchsia-500" />,
    title: 'Social Media Ready',
    description: 'Create viral-worthy AI miniature content perfect for Instagram, TikTok, and other platforms. Stand out with unique visual effects.',
    bgColor: 'bg-fuchsia-500/10',
  },
];

const BenefitsSection: React.FC<{ items?: BenefitItem[] }> = ({ items = defaultBenefits }) => {
  return (
    <section id="benefits" className="w-full max-w-6xl mx-auto py-16 md:py-24">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="font-poppins text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 mb-4">
          Why Choose AI Miniature
        </h2>
        <p className="font-roboto text-lg text-muted-foreground max-w-3xl mx-auto">
          Experience the power of AI miniature technology that transforms ordinary photos into extraordinary tilt-shift masterpieces with professional quality and ease.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {items.map((benefit, index) => (
          <div
            key={index}
            className={`rounded-xl p-6 shadow-lg flex flex-col items-center text-center ${benefit.bgColor} border border-border/20 hover:shadow-xl transition-shadow duration-300`}
          >
            <div className="p-3 rounded-full bg-background/50 mb-4">
              {benefit.icon}
            </div>
            <h3 className="font-poppins text-xl font-semibold text-foreground mb-2">{benefit.title}</h3>
            <p className="font-roboto text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BenefitsSection;
