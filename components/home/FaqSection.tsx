"use client";

import { ChevronRight } from 'lucide-react';
import { aiMiniaturFaqData } from '../../lib/data/aiMiniaturFaqData';

const FaqSection = () => {
  return (
    <section id="faq" className="w-full max-w-5xl mx-auto py-16 md:py-24">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="font-poppins text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 mb-4">
          Frequently Asked Questions
        </h2>
        <p className="font-roboto text-lg text-muted-foreground max-w-2xl mx-auto">
          Answers to common questions about AI Miniature effects and usage.
        </p>
      </div>
      <div className="space-y-6 max-w-3xl mx-auto">
        {aiMiniaturFaqData.map((item, index) => (
          <details key={index} className="group bg-card border border-border rounded-xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <summary className="font-poppins font-medium text-foreground list-none flex justify-between items-center cursor-pointer">
              {item.q}
              <ChevronRight className="h-5 w-5 text-muted-foreground group-open:rotate-90 transition-transform duration-300" />
            </summary>
            <p className="font-roboto text-muted-foreground mt-3 pt-3 border-t border-border/40">
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
};

export default FaqSection; 