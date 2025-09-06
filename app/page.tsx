import HomeClientContent from '@/components/home/HomeClientContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Miniature Generator',
  description: 'Create stunning miniature tilt-shift effects from your photos. Professional AI-powered depth of field, toy-world aesthetics in seconds.',
  keywords: '',
  openGraph: {
    title: 'AI Miniature Generator - Transform Photos into Miniature Scenes',
    description: 'Create stunning miniature tilt-shift effects from your photos. Professional AI-powered depth of field, toy-world aesthetics, and cinematic color grading in seconds.',
    url: 'https://aiminiature.net',
    siteName: 'AI Miniature',
    images: [
      {
        url: '/ai-miniatur/3D-Bakery-after.webp',
        width: 1200,
        height: 630,
        alt: 'AI Miniature transformation example',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Miniature Generator - Transform Photos into Miniature Scenes',
    description: 'Create stunning miniature tilt-shift effects from your photos. Professional AI-powered depth of field, toy-world aesthetics, and cinematic color grading in seconds.',
    images: ['/ai-miniatur/3D-Bakery-after.webp'],
  },
};

const HomePage = () => {
  return <HomeClientContent />;
};

export default HomePage;
