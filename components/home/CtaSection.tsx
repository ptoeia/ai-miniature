"use client";

import { Zap } from "lucide-react";

const CtaSection = () => {
  const scrollToElement = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="cta" className="w-full py-12 md:py-16 relative">
      <div className="relative max-w-4xl mx-auto px-4 md:px-6">
        <div className="rounded-2xl px-6 py-10 md:px-10 md:py-14 shadow-2xl text-center bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-900">
          <div className="text-xs font-semibold uppercase tracking-wider text-primary/80 mb-2">Ready to try?</div>
          <h2 className="font-poppins text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
            Create with Banana AI in seconds
          </h2>
          <p className="font-roboto text-base md:text-lg text-muted-foreground mb-8">
            Simple prompts. Professional results. No learning curve.
          </p>
          <div className="flex items-center justify-center">
            <button
              onClick={() => scrollToElement("tool-area")}
              className="px-10 py-3.5 rounded-xl text-lg font-semibold flex items-center justify-center gap-2 transition-all duration-200 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 text-white hover:opacity-90 shadow-md"
            >
              <Zap size={18} />
              Get Started
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
