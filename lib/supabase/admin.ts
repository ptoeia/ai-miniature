import { createClient } from '@supabase/supabase-js';

/**
 * Creates a Supabase client with admin privileges.
 * IMPORTANT: This should only be used in a secure server-side context.
 * It uses the service role key and can bypass Row Level Security.
 */
export const createAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error('Supabase URL is not defined in environment variables.');
  }
  if (!supabaseServiceRoleKey) {
    throw new Error('Supabase service role key is not defined in environment variables.');
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
