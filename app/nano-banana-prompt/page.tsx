import type { Metadata } from 'next';
import PromptsClientContent from '../../components/prompts/PromptsClientContent';

export const metadata: Metadata = {
  title: 'Nano Banana Prompt Gallery | Banana AI Prompts',
  description:
    'Discover curated Nano Banana prompts for Banana AI image generation and editing. Search, filter, copy, and try prompts instantly.',
  keywords: ['banana ai', 'nano banana', 'prompts', 'image generation', 'prompt gallery'],
  alternates: {
    canonical: 'https://banana-ai.art/nano-banana-prompt/',
  },
  openGraph: {
    title: 'Nano Banana Prompt Gallery | Banana AI Prompts',
    description:
      'Curated gallery of Nano Banana prompts for Banana AI. Search, filter and copy prompts for instant use.',
    url: 'https://your-domain.com/nano-banana-prompt',
    type: 'website',
  },
};

export default function PromptsPage() {
  return <PromptsClientContent />;
}
