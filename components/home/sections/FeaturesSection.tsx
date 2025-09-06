"use client";

import React from 'react';
import { Wand2, Users, Layers, Shield } from 'lucide-react';

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
}

const defaultFeatures: FeatureItem[] = [
  {
    icon: <Wand2 size={28} className="text-primary" />,
    title: 'AI Miniature Magic',
    description: 'Create stunning AI miniature effects with advanced tilt-shift simulation. Transform ordinary photos into captivating miniature worlds instantly.',
    bgColor: 'bg-blue-500/10',
  },
  {
    icon: <Users size={28} className="text-green-500" />,
    title: 'Professional Quality',
    description: 'Our AI miniature technology delivers professional-grade results that rival expensive tilt-shift lenses and manual editing techniques.',
    bgColor: 'bg-green-500/10',
  },
  {
    icon: <Layers size={28} className="text-purple-500" />,
    title: 'Smart Focus Detection',
    description: 'Advanced AI automatically detects optimal focus areas for AI miniature effects, creating natural depth-of-field transitions.',
    bgColor: 'bg-purple-500/10',
  },
  {
    icon: <Shield size={28} className="text-yellow-500" />,
    title: 'Instant Processing',
    description: 'Generate AI miniature photos in seconds, not hours. No complex software or technical expertise required for stunning results.',
    bgColor: 'bg-yellow-500/10',
  }
];

const FeaturesSection: React.FC<{ items?: FeatureItem[] }> = ({ items = defaultFeatures }) => {
  return (
    <section id="features" className="w-full max-w-6xl mx-auto py-16 md:py-24">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="font-poppins text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 mb-4">
          AI Miniature Features
        </h2>
        <p className="font-roboto text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover the powerful features that make our AI miniature generator the perfect tool for creating stunning tilt-shift photography effects.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {items.map((feature, index) => (
          <div
            key={index}
            className={`p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-border/20 ${feature.bgColor}`}
          >
            <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-full bg-background shadow-md">
              {feature.icon}
            </div>
            <h3 className="font-poppins text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
            <p className="font-roboto text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
