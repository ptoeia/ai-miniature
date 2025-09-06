import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Prevent static generation of this route
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Get the current user session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the free trial product to know how many credits to grant
    const { data: freeTrialProduct, error: productError } = await supabase
      .from('CreemProduct')
      .select('grants_credits')
      .eq('active', true)
      .eq('price', '0.00')
      .single();

    if (productError || !freeTrialProduct) {
      console.error('Error fetching free trial product:', productError);
      return NextResponse.json({ error: 'Free trial product not found' }, { status: 500 });
    }

    const freeTrialCredits = freeTrialProduct.grants_credits;

    // Check if user already claimed free trial
    const { data: existingUser, error: fetchError } = await supabase
      .from('profiles')
      .select('credit_balance, free_trial_credits_granted')
      .eq('id', user.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching user:', fetchError);
      return NextResponse.json({ error: 'Failed to check user status' }, { status: 500 });
    }

    // If user already claimed free trial, return error
    if (existingUser?.free_trial_credits_granted) {
      return NextResponse.json({ 
        error: 'Free trial already claimed',
        credits: existingUser.credit_balance 
      }, { status: 400 });
    }

    // If user doesn't exist, they need to be created first (this should happen during auth)
    if (!existingUser) {
      return NextResponse.json({ 
        error: 'User profile not found. Please try logging out and back in.' 
      }, { status: 404 });
    }

    // Update user's credits and mark free trial as claimed
    const { data: updatedUser, error: updateError } = await supabase
      .from('profiles')
      .update({
        credit_balance: existingUser.credit_balance + freeTrialCredits,
        free_trial_credits_granted: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select('credit_balance')
      .single();

    if (updateError) {
      console.error('Error updating user:', updateError);
      return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      credits: updatedUser.credit_balance,
      message: `Free trial claimed successfully! You received ${freeTrialCredits} credits.`
    });

  } catch (error) {
    console.error('Claim free trial API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 