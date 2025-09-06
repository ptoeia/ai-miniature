import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * A utility function to merge Tailwind CSS classes.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Constructs the absolute URL for the application.
 * It uses VERCEL_URL for production/preview environments and defaults to localhost for development.
 * @returns {string} The absolute URL of the application.
 */
export const getURL = () => {
  let url = 
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Vercel automatically sets this
    'http://localhost:3000/';
  // Make sure to include `https` in production
  url = url.includes('http') ? url : `https://${url}`;
  // Make sure to include a trailing `/`
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
  return url;
};
