import { z } from 'zod';

export const imageGenerationSchema = z.object({
  prompt: z
    .string()
    .min(1, 'Please enter a prompt to generate an image.')
    .max(1000, 'Prompt is too long. Please keep it under 1000 characters.')
    .trim(),
  model: z.enum(['pro', 'max'], {
    required_error: 'Please select a model.',
  }),
});

export type ImageGenerationFormData = z.infer<typeof imageGenerationSchema>; 