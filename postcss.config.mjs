import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {
      config: path.join(__dirname, 'tailwind.config.ts')
    },
    autoprefixer: {}, // Added autoprefixer
  },
};

export default config;
