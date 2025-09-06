import "client-only";
import { createBrowserClient } from "@supabase/ssr";

export const createClient = () => {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        fetch: (url, options = {}) => {
          return fetch(url, {
            ...options,
            // Add timeout to all requests
            signal: AbortSignal.timeout(10000), // 10 second timeout
          }).catch(error => {
            // Handle timeout and network errors more gracefully
            if (error.name === 'AbortError') {
              throw new Error('Request timeout - please check your connection');
            }
            if (error.message.includes('Failed to fetch')) {
              throw new Error('Network error - please check your internet connection');
            }
            throw error;
          });
        },
      },
      auth: {
        // Reduce auth token refresh attempts for faster failures
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
      },
    }
  );
  
  return supabase;
};