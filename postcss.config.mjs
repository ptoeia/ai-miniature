import path from 'path';

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {
      config: path.join(process.cwd(), 'tailwind.config.ts')
    },
    autoprefixer: {}, // Added autoprefixer
  },
};

export default config;
