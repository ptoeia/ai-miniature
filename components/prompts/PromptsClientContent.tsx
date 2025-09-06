"use client";

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { promptsData, promptCategories } from '../../lib/data/promptsData';
import { PromptData } from '../../types/prompts';
import PromptCard from './PromptCard';

const PromptsClientContent = () => {
  const [query, setQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filtered: PromptData[] = useMemo(() => {
    const q = query.toLowerCase().trim();
    return promptsData.filter((p) => {
      const inCategory = activeCategory === 'all' || p.category === activeCategory;
      const inQuery = !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.promptText.toLowerCase().includes(q) ||
        p.tags?.some(t => t.toLowerCase().includes(q));
      return inCategory && inQuery;
    });
  }, [query, activeCategory]);

  // Note: render directly from filtered (no dedup), per user's request

  return (
    <div className="min-h-screen flex flex-col text-foreground">
      {/* Hero */}
      <section className="w-full relative -mt-4">
        <div className="gradient-hero pt-16 pb-10">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-200/30 mb-4">
              <span className="text-sm font-medium">Curated by Banana AI</span>
            </div>
            <h1 className="font-poppins font-bold text-4xl sm:text-5xl tracking-tight mb-3">
              <span className="gradient-text">Nano Banana</span> Prompt Gallery
            </h1>
            <p className="font-roboto text-lg text-muted-foreground max-w-2xl">
              Discover, filter and copy prompts for Banana AI image generation and editing.
            </p>
          </div>
        </div>
      </section>

      {/* Controls */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search prompts..."
              className="w-full bg-input border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          {/* Quick action */}
          <div className="flex items-center gap-3">
            <Link href="/#tool-area" className="gradient-button px-5 py-3 rounded-lg text-white text-sm font-medium">
              Try in Banana AI
            </Link>
          </div>
        </div>

        {/* Categories */}
        <div className="mt-5 flex flex-wrap gap-2">
          {promptCategories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`${activeCategory === c.id ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground border border-border'} px-3 py-1.5 rounded-full text-sm`}
            >
              <span className="mr-1" aria-hidden>{c.icon}</span>
              {c.name}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pb-16">
        {filtered.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-10 text-center">
            <Image src="/empty.png" alt="No results" width={64} height={64} className="mx-auto opacity-70" />
            <p className="mt-3 text-muted-foreground">No prompts found. Try another keyword or category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <PromptCard key={item.id} data={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default PromptsClientContent;
