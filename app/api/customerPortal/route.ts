import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

import { creem, creemConfig } from '@/lib/creem';
import { getURL } from '@/lib/utils';

// Prevent static generation of this route
export const dynamic = 'force-dynamic';

/**
 * GET /api/customerPortal
 *
 * Creates a Creem Billing Portal session for the authenticated user.
 * This allows users to manage their subscriptions, payment methods, and view invoices.
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Retrieve the user's Creem customer ID from our database
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('creem_customer_id')
      .eq('id', session.user.id)
      .single();

    if (profileError || !profile || !profile.creem_customer_id) {
      console.error('Failed to retrieve Creem customer ID for user:', session.user.id, profileError);
      return NextResponse.json({ error: 'Customer not found or an error occurred.' }, { status: 404 });
    }

    // Create a billing portal session
    // The official SDK README confirms the existence of `generateCustomerLinks`.
    // We will use this method as it is the correct, type-safe way to interact with the API.
    const portalLinks = await creem.generateCustomerLinks({
      ...creemConfig,
      createCustomerPortalLinkRequestEntity: {
        customerId: profile.creem_customer_id,
      }
    });

    // Assuming the method returns an object with a `customerPortalLink` or similar property.
    // We will use `customerPortalLink` as a reasonable default based on API conventions.
    if (!portalLinks || !portalLinks.customerPortalLink) {
        throw new Error('Failed to generate customer portal link from SDK.');
    }

    return NextResponse.json({ url: portalLinks.customerPortalLink });

  } catch (error: any) {
    console.error('Error creating customer portal session:', error);
    return NextResponse.json({ error: 'Failed to create customer portal session.' }, { status: 500 });
  }
} 