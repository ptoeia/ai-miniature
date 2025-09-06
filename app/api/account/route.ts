/**
 * Account API Route
 *
 * This route provides access to a user's purchase history, including both subscriptions
 * and one-time purchases. It requires authentication and uses Supabase JS client
 * for data retrieval.
 *
 * @route GET /api/account
 */

import { NextResponse } from "next/server";
import { createClient } from '@/lib/supabase/server';
import { 
  Profile, 
  SubscriptionWithProduct, 
  OneTimePurchaseWithProduct 
} from '@/types/supabase.d';

/**
 * Response interface for user purchases endpoint
 * Contains arrays of both subscription and one-time purchase records
 */
export interface UserPurchasesResponse {
  message?: string;
  subscriptions: {
    id: string;
    product: string;
    providerCustomerId: string;
    status: string;
    created_at: string;
    updated_at: string;
  }[];
  oneTimePurchases: {
    id: string;
    product: string;
    providerCustomerId: string;
    status: string;
    created_at: string;
    updated_at: string;
  }[];
  credits: number;
}

/**
 * GET handler for retrieving user's purchase history
 *
 * @returns {Promise<NextResponse>} JSON response containing:
 *   - On success: UserPurchasesResponse with subscriptions and one-time purchases
 *   - On error: 401 Unauthorized if no valid session, or 500 for other errors
 */
export async function GET() {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch subscriptions, one-time purchases, and user profile data in parallel for efficiency.
    const [subsResponse, otpResponse, profileResponse] = await Promise.all([
      supabase
        .from('subscription')
        .select(`
          id,
          status,
          created_at,
          updated_at,
          creem_subscription_id,
          product_id,
          creem_product (
            name,
            grants_credits
          )
        `)
        .eq('profile_id', user.id)
        .order('created_at', { ascending: false }),
      supabase
        .from('one_time_purchases')
        .select(`
          id,
          status,
          created_at,
          updated_at,
          creem_payment_intent_id,
          product_id,
          creem_product (
            name,
            price,
            description
          )
        `)
        .eq('profile_id', user.id)
        .order('created_at', { ascending: false }),
      supabase
        .from('profiles')
        .select('credit_balance')
        .eq('id', user.id)
        .single()
    ]) as [
      { data: SubscriptionWithProduct[] | null, error: any },
      { data: OneTimePurchaseWithProduct[] | null, error: any },
      { data: Profile | null, error: any }
    ];

    // Centralized error handling for all parallel requests.
    if (subsResponse.error) throw new Error(`Subscription fetch error: ${subsResponse.error.message}`);
    if (otpResponse.error) throw new Error(`One-time purchase fetch error: ${otpResponse.error.message}`);
    if (profileResponse.error) throw new Error(`Profile fetch error: ${profileResponse.error.message}`);

    // Map subscription data to a clean format
    const subscriptions = (subsResponse.data || []).map(s => ({
      id: s.id,
      product: (s as any).creem_product?.name || 'Unknown Product',
      providerCustomerId: (s as any).creem_subscription_id,
      status: s.status,
      created_at: (s as any).created_at,
      updated_at: (s as any).updated_at,
      price_id: (s as any).creem_subscription_id, // For compatibility with existing code
    }));

    // Get current active subscription plan details
    const activeSubscription = subsResponse.data?.find(s => s.status === 'active');
    const currentPlan = activeSubscription ? {
      name: (activeSubscription as any).creem_product?.name || 'Standard Monthly',
      credits: (activeSubscription as any).creem_product?.grants_credits || 3000
    } : null;

    // Map one-time purchase data
    const oneTimePurchases = (otpResponse.data || []).map(o => ({
      id: o.id,
      product: (o as any).creem_product?.name || 'Unknown Product',
      providerCustomerId: o.creem_payment_intent_id,
      status: o.status,
      created_at: o.created_at,
      updated_at: o.updated_at,
      // Frontend expects cents and divides by 100; DB price is in dollars -> convert to cents
      amount: Math.round(Number((o as any).creem_product?.price ?? 0) * 100),
      description: (o as any).creem_product?.description || 'One-time purchase',
    }));

    // Safely extract credits, defaulting to 0 if the profile or credits are not found.
    const credits = profileResponse.data?.credit_balance ?? 0;

    // Ensure we have valid data before proceeding
    if (!Array.isArray(subscriptions) || !Array.isArray(oneTimePurchases)) {
      throw new Error('Invalid data structure returned from database');
    }

    return NextResponse.json({
      subscriptions,
      oneTimePurchases,
      credits,
      currentPlan,
    });

  } catch (error: any) {
    console.error('Error fetching account data:', error);
    return NextResponse.json({ message: 'Error fetching account data', error: error.message }, { status: 500 });
  }
}
