import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Prevent static generation of this route
export const dynamic = 'force-dynamic';

/**
 * GET /api/user/credits
 *
 * Retrieves the credit information for the authenticated user.
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Get the current user session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user data from Supabase profiles table
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('credit_balance, free_trial_credits_granted')
      .eq('id', user.id)
      .single();

    if (userError) {
      console.error('Error fetching user data:', userError);
      return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
    }

    return NextResponse.json({
      credits: userData?.credit_balance || 0,
      hasClaimedFreeTrial: userData?.free_trial_credits_granted || false
    });

  } catch (error) {
    console.error('Credits API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 