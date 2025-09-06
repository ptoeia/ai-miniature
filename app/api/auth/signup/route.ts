import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Prevent caching of this route.
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  const requestUrl = new URL(request.url);

  // Create a Supabase client with the service role key to bypass PKCE
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Use the standard signUp method which respects the email confirmation setting
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${requestUrl.origin}/auth/confirm`,
    }, 
  });

  if (error) {
    console.error('Sign-up error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // The user is signed up successfully
  console.log('Sign-up successful:', data);

  return NextResponse.json({ message: 'Account created successfully!' }, { status: 200 });
}
