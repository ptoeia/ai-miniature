import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { creem } from '@/lib/creem';

/**
 * POST /api/checkout
 *
 * Creates a Creem Checkout Session for a one-time purchase (credit pack).
 * - Authenticates the user via Supabase using the centralized server client.
 * - Creates a checkout session with the correct product ID and user metadata.
 * - Returns the checkout URL for client-side redirection.
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    // Use getUser() for server-side validation as recommended by Supabase.
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId, creemId: providedCreemId } = await req.json();
    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    let creemProductId = providedCreemId;

    // If creemId is not provided, look it up from the database
    if (!creemProductId) {
      const { data: product, error: productError } = await supabase
        .from('creem_product')
        .select('creem_id') // This is the actual Creem Product ID (e.g., prod_xxxx)
        .eq('id', productId)
        .single();

      if (productError || !product || !product.creem_id) {
        console.error('Product not found in database or creemId is missing:', { productId, productError });
        return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
      }

      creemProductId = product.creem_id;
    }

    // Diagnostic log to verify the ID being sent to Creem.
    console.log(`Attempting to create checkout for Creem Product ID: ${creemProductId}`);

    // Create a Creem Checkout Session using the correct Creem Product ID.
    const checkoutSession = await creem.createCheckout({
      xApiKey: process.env.CREEM_SECRET_KEY!,
      createCheckoutRequest: {
        productId: creemProductId, // Use the ID from Creem, not our internal one.
        units: 1,
        customer: {
          email: user.email!,
        },
        // Pass our internal IDs in metadata for the webhook to correctly attribute credits.
        metadata: {
          profileId: user.id, // Supabase user ID
          app_product_id: productId, // Our internal product ID
        },
        // Redirect user to the dashboard after a successful payment for a seamless experience.
        successUrl: `${new URL(req.url).origin}/profile`,
      },
    });

    if (!checkoutSession.checkoutUrl) {
      throw new Error('Failed to create checkout session: No URL returned.');
    }

    // Return the URL for the frontend to redirect to.
    return NextResponse.json({ checkoutUrl: checkoutSession.checkoutUrl });

  } catch (error) {
    console.error('Checkout error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
  }
}

// Prevent static generation of this route
export const dynamic = 'force-dynamic';
