"use client";

import React from 'react';
import Image from 'next/image';

interface ShowcaseItem {
  title: string;
  src: string;
  alt: string;
}

const defaultItems: ShowcaseItem[] = [
  { title: "User Showcase 1", src: "/showcase1.jpeg", alt: "User provided showcase image 1" },
  { title: "User Showcase 2", src: "/showcase2.jpeg", alt: "User provided showcase image 2" },
  { title: "User Showcase 3", src: "/showcase3.jpeg", alt: "change character on poster" },
  { title: "User Showcase 4", src: "/showcase4.jpeg", alt: "User provided showcase image 4" },
  { title: "User Showcase 5", src: "/showcase5.png", alt: "remove watermark" },
  { title: "User Showcase 6", src: "/showcase6.jpeg", alt: "User provided showcase image 6" },
  { title: "User Showcase 7", src: "/showcase7.jpeg", alt: "virtual try on" },
  { title: "User Showcase 8", src: "/showcase8.jpeg", alt: "photo style transfer" },
];

interface UserShowcaseSectionProps {
  items?: ShowcaseItem[];
  visible?: boolean;
}

const UserShowcaseSection: React.FC<UserShowcaseSectionProps> = ({ items = defaultItems, visible = true }) => {
  if (!visible) return null;
  return (
    <section id="user-showcase" className="w-full max-w-6xl mx-auto py-16 md:py-24">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="font-poppins text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-green-500 via-teal-500 to-cyan-500 mb-4">
          Banana AI Examples
        </h2>
        <p className="font-roboto text-lg text-muted-foreground max-w-2xl mx-auto">
          Browse creations from users worldwide.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {items.map((image, index) => (
          <div key={index} className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-xl group transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default UserShowcaseSection;
