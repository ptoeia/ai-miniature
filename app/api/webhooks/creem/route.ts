import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { SupabaseClient } from '@supabase/supabase-js';
import * as crypto from 'crypto';

/**
 * Verifies the Creem webhook signature to ensure the request is authentic.
 */
function verifySignature(signature: string | null, body: string) {
  if (!signature) {
    throw new Error('Creem-Signature header is missing.');
  }
  
  const webhookSecret = process.env.CREEM_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error('CREEM_WEBHOOK_SECRET is not set in the environment variables.');
  }

  try {
    const computedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');

    if (computedSignature !== signature) {
      throw new Error('Webhook signature verification failed');
    }
    console.log('Webhook signature verified successfully.');
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown signature verification error';
    throw new Error(`Webhook signature verification failed: ${errorMessage}`);
  }
}

/**
 * Finds the internal product ID by creem_id from the database.
 */
async function getProductIdByCreemId(supabaseAdmin: SupabaseClient, creemId: string): Promise<string> {
  const { data: product, error } = await supabaseAdmin
    .from('creem_product')
    .select('id')
    .eq('creem_id', creemId)
    .single();

  if (error || !product) {
    console.error('Product lookup error:', error);
    throw new Error(`Product with creem_id ${creemId} not found in database. Please ensure products are properly seeded.`);
  }

  console.log(`Found product ID ${product.id} for creem_id ${creemId}`);
  return product.id;
}

/**
 * Syncs subscription status changes (e.g., updated, canceled) to the database.
 * This operation does NOT grant credits.
 */
async function syncSubscription(supabaseAdmin: SupabaseClient, subscription: any, profileId: string, productId: string) {
  const { error: subUpsertError } = await supabaseAdmin.from('subscription').upsert({
    id: subscription.id,
    profile_id: profileId,
    product_id: productId,
    creem_subscription_id: subscription.id,
    creem_customer_id: subscription.customer?.id,
    status: subscription.status,
    current_period_start: subscription.current_period_start_date,
    current_period_end: subscription.current_period_end_date,
    cancel_at_period_end: subscription.cancel_at_period_end ?? false,
    canceled_at: subscription.canceled_at || null,
    ended_at: subscription.ended_at || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  if (subUpsertError) {
    console.error('Subscription update/cancel upsert error:', subUpsertError);
    throw subUpsertError;
  }

  console.log(`Subscription ${subscription.id} status updated to ${subscription.status}.`);
}

// --- Main Webhook Handler ---

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('creem-signature');
    verifySignature(signature, body);

    const event: any = JSON.parse(body);
    console.log('Received Creem Webhook Event Type:', event.eventType);
    console.log('Full webhook event data:', JSON.stringify(event, null, 2));

    const supabaseAdmin = createAdminClient();

    switch (event.eventType) {
      // Subscription paid: process and grant credits
      case 'subscription.paid': {
        const subscription = event.object;
        const profileId = subscription.metadata?.profileId as string;
        if (!profileId) throw new Error('No profileId in subscription metadata');

        const newPeriodStartDate = new Date(subscription.current_period_start_date);
        const { data: existingTransaction } = await supabaseAdmin
          .from('credit_transactions')
          .select('id')
          .eq('user_id', profileId)
          .eq('transaction_type', 'purchase')
          .gte('created_at', newPeriodStartDate.toISOString())
          .limit(1)
          .single();

        if (existingTransaction) {
          console.log(`Credits already granted for subscription ${subscription.id} in period starting ${newPeriodStartDate.toISOString()}, skipping.`);
          break;
        }

        const productId = await getProductIdByCreemId(supabaseAdmin, subscription.product.id);

        const subscriptionData = {
          ...subscription,
          customer_id: subscription.customer?.id,
          cancel_at_period_end: Boolean(subscription.cancel_at_period_end),
          current_period_start_date: subscription.current_period_start_date,
          current_period_end_date: subscription.current_period_end_date,
          canceled_at: subscription.canceled_at || null,
          last_transaction_id: subscription.last_transaction_id || subscription.last_transaction?.id || null,
        };

        const { error: rpcError } = await supabaseAdmin.rpc('process_paid_subscription', {
          p_profile_id: profileId,
          p_subscription_data: subscriptionData,
          p_product_id: productId,
        });

        if (rpcError) {
          console.error('Error calling process_paid_subscription RPC:', rpcError);
          throw rpcError;
        }

        console.log(`Successfully processed subscription payment ${subscription.id} for profile ${profileId}.`);
        break;
      }

      // --- Case 2: Subscription Status Changes ---
      // Only sync status, DO NOT grant credits
      case 'subscription.active':
      case 'subscription.updated':
      case 'subscription.canceled': {
        const subscription = event.object as any;
        const profileId = subscription.metadata?.profileId as string;
        if (!profileId) throw new Error('No profileId in subscription metadata');

        const productId = await getProductIdByCreemId(supabaseAdmin, subscription.product.id);
        await syncSubscription(supabaseAdmin, subscription, profileId, productId);

        console.log(`Subscription ${subscription.id} status updated to ${subscription.status}.`);
        break;
      }

      // --- Case 3: Checkout Completed ---
      // For subscriptions: just log, real processing happens in subscription.paid
      // For one-time purchases: record purchase and grant credits immediately
      case 'checkout.completed': {
        const checkout = event.object as any;
        const productFromWebhook = checkout.product;

        if (!productFromWebhook || typeof productFromWebhook === 'string') {
          console.log('Checkout completed event without expanded product. Ignoring.');
          break;
        }

        if (productFromWebhook.billing_type === 'recurring') {
          // Subscription checkout completed - just log, don't process credits yet
          console.log(`Subscription checkout completed for ${productFromWebhook.name}. Waiting for subscription.paid event to grant credits.`);
        } else if (productFromWebhook.billing_type === 'one-time' || productFromWebhook.billing_type === 'onetime') {
          // Enable one-time purchase processing
          console.log(`Processing one-time purchase. Product: ${productFromWebhook.name}`);

          const profileId = checkout.metadata?.profileId as string;
          if (!profileId) throw new Error('No profileId in one-time purchase metadata');

          const productId = await getProductIdByCreemId(supabaseAdmin, productFromWebhook.id);

          // Fetch credits from DB to avoid relying on webhook metadata
          const { data: productData, error: productError } = await supabaseAdmin
            .from('creem_product')
            .select('grants_credits')
            .eq('id', productId)
            .single();
          if (productError) {
            console.error('Failed to fetch product data:', productError);
            throw new Error(`Failed to fetch product data for ${productId}`);
          }

          const creditsToGrant = productData?.grants_credits;
          if (!creditsToGrant || creditsToGrant <= 0) {
            throw new Error(`Product ${productId} has invalid credits configuration`);
          }

          // Record the one-time purchase
          const { error: purchaseInsertError } = await supabaseAdmin
            .from('one_time_purchases')
            .insert({
              profile_id: profileId,
              product_id: productId,
              status: checkout.status,
              creem_payment_intent_id: checkout.id,
              creem_customer_id: checkout.customer?.id,
            });

          if (purchaseInsertError) {
            console.error('Error inserting one-time purchase record:', purchaseInsertError);
            throw new Error(`Failed to record one-time purchase for checkout ${checkout.id}.`);
          }

          // Grant credits immediately for one-time purchases
          const { error: rpcError } = await supabaseAdmin.rpc('add_credits_to_user', {
            p_user_id: profileId,
            p_credits: creditsToGrant,
            p_product_id: productId,
            p_charge_id: checkout.order?.transaction || checkout.id,
          });

          if (rpcError) {
            console.error(`Error granting credits for one-time purchase:`, rpcError);
            throw rpcError;
          }

          console.log(`Granted ${creditsToGrant} credits to profile ${profileId} for one-time purchase ${checkout.id}.`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.eventType}`);
    }

    return NextResponse.json({ message: 'Webhook processed successfully.' }, { status: 200 });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in webhook handler:', errorMessage);
    return NextResponse.json({ error: `Webhook Error: ${errorMessage}` }, { status: 400 });
  }
}
