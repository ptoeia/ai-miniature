// Data for Nano Banana Prompt Gallery
// Keep code in English as per project rules

import type { PromptCategory, PromptData } from '../../types/prompts';

export const promptCategories: PromptCategory[] = [
  { id: 'all', name: 'All', icon: '🌐' },
  { id: 'generation', name: 'Generation', icon: '✨' },
  { id: 'editing', name: 'Editing', icon: '🪄' },
  { id: 'style', name: 'Style', icon: '🎨' },
];

export const promptsData: PromptData[] = [
  {
    id: 'nbp-001',
    title: 'Clean Product Shot',
    description: 'Generate a studio-grade product photo on a seamless background with soft shadows.',
    promptText:
      'A fair elf hideout, warm, amazing, otherworldly, cyberpunk, slow motion, hard edge, precise lineart, tonemapping, trending on artstation, professional, hyperdetailed, sharp focus',
    exampleImage: '/pics-for-prompt/elf-hideout.png',
    category: 'generation',
    difficulty: 'beginner',
    tags: ['product', 'studio', 'ecommerce'],
  },
  {
    id: 'nbp-002',
    title: 'Portrait Retouch - Natural',
    description: 'Gently improve skin texture and color while preserving pores and realism.',
    promptText:
      'angelic human woman with a glass, dystopian, breathtaking, stunning, amazing, slow motion, high contrast, portrait, clean lines, highres, 8k, detailed, realistic',
    exampleImage: '/pics-for-prompt/model.png',
    category: 'editing',
    difficulty: 'intermediate',
    tags: ['portrait', 'retouch', 'skin'],
  },
  {
    id: 'nbp-003',
    title: 'Cinematic Landscape Style',
    description: 'Apply a teal-and-orange cinematic grade with lifted shadows and crisp contrast.',
    promptText:
      'battered hiker in a wondrous cave, gloomy, mysterious, incredible, vector art, chiaroscuro, thick lines, wavy, volumetric lighting, studio quality, sharp focus, detailed',
    exampleImage: '/pics-for-prompt/hiker.png',
    category: 'style',
    difficulty: 'beginner',
    tags: ['cinematic', 'color', 'landscape'],
  },
  {
    id: 'nbp-004',
    title: 'Stickman Gameplay Animation',
    description: 'Create a stickman-style animation.',
    promptText:
      'Have these two characters fight using the pose from Figure 3.Add appropriate visual backgrounds and scene interactions.',
    exampleImage: '/pics-for-prompt/stickman-gameplay-animation-by-nanobanana.webp',
    category: 'generation',
    difficulty: 'beginner',
    tags: ['animation', 'stickman', 'gameplay'],
  },
  {
    id: 'nbp-005',
    title: 'Multi-Image Fusion',
    description: 'Multi-Image Fusion.',
    promptText:
      'A model is posing and leaning against a pink bmw. She is wearing the following items, the scene is against a light grey background. The green alien is a keychain and it\'s attached to the pink handbag. The model also has a pink parrot on her shoulder. There is a pug sitting next to her wearing a pink collar and gold headphones.',
    exampleImage: '/pics-for-prompt/Multi-Image-Fusion.webp',
    category: 'generation',
    difficulty: 'beginner',
    tags: ['multi-image', 'fusion', 'image'],
  },
];
