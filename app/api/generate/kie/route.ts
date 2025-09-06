import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import config from '@/config';
import KieClient from '@/lib/kie/KieClient';
import type { ModelType, KieCreateTaskRequestDTO } from '@/lib/kie/dto';

// Prevent static generation of this route
export const dynamic = 'force-dynamic';

// Configure undici timeouts using environment variables
if (typeof globalThis.fetch !== 'undefined') {
  const { setGlobalDispatcher, Agent } = require('undici');
  
  // Set global dispatcher with consistent 30-minute timeout
  setGlobalDispatcher(new Agent({
    headersTimeout: parseInt(process.env.UNDICI_HEADERS_TIMEOUT || '1800000'), // 30 minutes
    bodyTimeout: parseInt(process.env.UNDICI_BODY_TIMEOUT || '1800000'),       // 30 minutes
    keepAliveTimeout: 10000,
    keepAliveMaxTimeout: 10000
  }));
}

/**
 * POST /api/generate-image
 *
 * Generates an image using AI and deducts credits from user's balance.
 * - User authentication is handled by middleware
 * - Checks if user has sufficient credits
 * - Calls external AI service to generate image
 * - Deducts credits and records transaction
 * - Returns generated image URL
 */
export async function POST(req: NextRequest) {
  try {
    // Get user info from middleware headers
    const userId = req.headers.get('x-user-id');
    const userEmail = req.headers.get('x-user-email');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID not found' }, { status: 401 });
    }

    const body = await req.json();
    const prompt: string = body?.prompt ?? '';
    const rawType: string = body?.type ?? 'text_to_image';
    const type: ModelType = rawType === 'image_to_image' ? 'image_edit' : (rawType as ModelType);
    const inputImages: string[] | undefined = body?.inputImages;
    // Map frontend type to KIE model
    const model = type === 'image_edit'
      ? 'google/nano-banana-edit'
      : 'google/nano-banana';
    
    // prompt is optional, can be empty for random generation

    // Use credit costs from config (map to our legacy tiers or set a default cost)
    const creditCost = config.creditCosts.pro;

    const supabase = createClient();

    // Get user's current credit balance
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('credit_balance')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
    }

    // Check if user exists and has sufficient credits
    if (!profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    if (profile.credit_balance < creditCost) {
      return NextResponse.json({ 
        error: 'Insufficient credits', 
        required: creditCost,
        available: profile.credit_balance
      }, { status: 402 }); // Payment Required
    }

    // Call KIE generate (async-first). Do not deduct credits yet if task is async.
    const kie = new KieClient();
    // Build callback URL for KIE to notify when task completes (optional optimization)
    // Prefer configured domain; fallback to request headers
    const hostFromHeaders = req.headers.get('host');
    const protoFromHeaders = req.headers.get('x-forwarded-proto') || 'https';
    const callbackBase = config.domainName
      ? `https://${config.domainName}`
      : `${protoFromHeaders}://${hostFromHeaders ?? 'localhost:3000'}`;
    const callBackUrl = `${callbackBase}/api/generate/kie/callback`;
    const payload: KieCreateTaskRequestDTO = {
      model,
      callBackUrl,
      input: {
        prompt,
        image_urls: inputImages,
      },
    };

    const genRes = await kie.generateImage(payload);

    // Upsert an initial task row with user ownership for later lookup
    try {
      await supabase
        .from('generation_tasks')
        .upsert({
          provider: 'kie',
          provider_task_id: genRes.taskId,
          user_id: userId,
          state: 'queued',
          updated_at: new Date(),
        }, { onConflict: 'provider,provider_task_id' });
    } catch (e) {
      console.warn('generation_tasks upsert (initial) failed:', e);
      // Do not fail the request; status/callback will reconcile later
    }

    // Always async with KIE createTask: return taskId and skip credit consumption here.
    return NextResponse.json({
      success: true,
      requiresPolling: true,
      taskId: genRes.taskId,
      model, // kept for client-side display only; not stored in DB
      creditCost,
    }, { status: 202 });

  } catch (error) {
    console.error('Image generation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
  }
}