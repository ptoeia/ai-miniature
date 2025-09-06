/**
 * Products API Route
 *
 * This route handles fetching product information from the local Supabase database.
 * It retrieves active products from the 'creem_product' table, including custom fields
 * like credits, features, plan tiers, etc.
 *
 * @module api/products
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server'; // Assuming you have a server-side Supabase client utility

// Prevent static generation of this route
export const dynamic = 'force-dynamic';

/**
 * GET /api/products
 *
 * Fetches all active products from the Supabase 'creem_product' table.
 * Products are ordered by price (ascending), with 'free_trial' tier typically appearing first if price is 0.
 *
 * @async
 * @function
 * @returns {Promise<NextResponse>} JSON response containing:
 * - On success: Array of product objects.
 * - On error: Error message with appropriate status code.
 */
export async function GET() {
  const supabase = await createClient(); // Create a Supabase client for server-side operations

  try {
    // Fetch active products from the creem_product table
    // Order by plan_tier to attempt to put 'free_trial' first, then by price.
    // You might need a more sophisticated ordering if plan_tier names don't sort naturally for 'free_trial' first.
    // A common approach is to have a dedicated 'sort_order' column or handle it in the query.
    const { data: products, error } = await supabase
      .from('creem_product')
      .select(`
        id,
        name,
        description,
        price,
        currency,
        creem_id,
        active,
        plan_tier,
        billing_period,
        grants_credits,
        display_credits_per_month,
        interval,
        interval_count,
        is_popular,
        features,
        button_text,
        created_at,
        updated_at
      `)
      .eq('active', true)
      .order('price', { ascending: true })
      .order('plan_tier', { ascending: true }); // Secondary sort, 'free_trial' might not be first

    if (error) {
      console.error('Error fetching products from Supabase:', error);
      return NextResponse.json(
        { error: 'Failed to fetch products.', details: error.message },
        { status: 500 }
      );
    }

    // If products is null (though error should catch DB issues), return empty array
    return NextResponse.json(products || []);

  } catch (error) {
    console.error('Unexpected error in /api/products:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: 'An unexpected error occurred.', details: errorMessage },
      { status: 500 }
    );
  }
}
