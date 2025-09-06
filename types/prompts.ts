// Types for Nano Banana prompts
// Keep code in English as per project rules

export type PromptDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface PromptCategory {
  id: string; // machine-friendly key, e.g., 'all', 'generation', 'editing'
  name: string; // human-readable name
  icon?: string; // optional emoji or short text used in UI badges
}

export interface PromptData {
  id: string;
  title: string;
  description: string;
  promptText: string; // the actual prompt text users will copy
  exampleImage: string; // path to an image in /public
  category: string; // should match one of PromptCategory.id (except 'all')
  difficulty: PromptDifficulty;
  tags?: string[]; // optional tags to help searching and filtering
}
