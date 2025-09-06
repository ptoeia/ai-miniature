import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import config from '@/config';
import type { KieCallbackResponseDTO, KieResultJsonParsed } from '@/lib/kie/dto';

// Prevent static generation of this route
export const dynamic = 'force-dynamic';

/**
 * POST /api/generate/kie/callback
 * Minimal handler to accept KIE async callbacks.
 * Body Example (subject to vendor spec):
 *  {
 *    taskId: string,
 *    state: string,
 *    resultJson?: string,
 *    failCode?: string,
 *    failMsg?: string
 *  }
 *
 * NOTE:
 * - For production, add verification (HMAC/signature/IP allowlist) as per vendor.
 * - Persist to DB and notify front-end via Realtime/SSE if needed.
 */
export async function POST(req: NextRequest) {
  try {
    // Expect strict JSON body per vendor spec: { code, data: { ... }, msg }
    const parsed = (await req.json()) as unknown as KieCallbackResponseDTO;
    const data = (parsed && typeof (parsed as any).data === 'object') ? (parsed as any).data : null;
    const taskId = data?.taskId ?? null;
    const state = data?.state ?? null;
    const resultJson = data?.resultJson ?? null;
    const failCode = parsed?.code ?? null;
    const failMsg = parsed?.msg ?? null;
    const completeTime = data?.completeTime ?? null;

    // Log incoming payload summary (server-side only)
    try {
      const ct = req.headers.get('content-type') || '';
      const preview = (() => {
        try { return JSON.stringify(parsed).slice(0, 800); } catch { return '[unserializable]'; }
      })();
      console.log('[KIE_CALLBACK] Incoming', { contentType: ct, keys: Object.keys(parsed || {}), dataKeys: Object.keys(data || {}), preview });
    } catch {}

    if (!taskId) {
      try {
        console.warn('[KIE_CALLBACK] 400 Missing taskId', { keys: Object.keys((parsed as any) || {}), dataKeys: Object.keys((data as any) || {}) });
      } catch {}
      return NextResponse.json({ error: 'Missing taskId', receivedKeys: Object.keys((parsed as any) || {}) }, { status: 400 });
    }

    // TODO: add auth verification for the callback origin (signature/HMAC/IP allowlist)

    // Persist/update into generic table generation_tasks
    const supabase = createClient();
    const completedAt = completeTime ? new Date(Number(completeTime)) : null;
    const isTerminal = (s?: string) => ['success', 'succeeded', 'failed', 'timeout', 'canceled', 'cancelled'].includes((s || '').toLowerCase());
    const completedAtFinal = completedAt ?? (isTerminal(state) ? new Date() : null);
    let parsedResult: KieResultJsonParsed | { raw: string } | null = null;
    if (resultJson) {
      try {
        parsedResult = typeof resultJson === 'string' ? (JSON.parse(resultJson) as KieResultJsonParsed) : (resultJson as KieResultJsonParsed);
      } catch {
        parsedResult = { raw: String(resultJson) };
      }
    }
    const { error: upsertError } = await supabase
      .from('generation_tasks')
      .upsert({
        provider: 'kie',
        provider_task_id: String(taskId),
        state: (state as string) ?? null,
        result_json: parsedResult,
        error_code: failCode ? String(failCode) : null,
        error_message: failMsg ? String(failMsg) : null,
        completed_at: completedAtFinal,
        updated_at: new Date(),
      }, { onConflict: 'provider,provider_task_id' });

    if (upsertError) {
      console.error('Failed to upsert generation_tasks:', upsertError);
      return NextResponse.json({ error: 'Failed to persist callback' }, { status: 500 });
    }

    // Auto-consume credits on success if not already consumed (Plan B)
    const isSuccess = ['success', 'succeeded'].includes(String(state || '').toLowerCase());
    if (isSuccess) {
      const { data: taskRow, error: taskFetchErr } = await supabase
        .from('generation_tasks')
        .select('user_id, credits_consumed_at')
        .eq('provider', 'kie')
        .eq('provider_task_id', String(taskId))
        .single();

      if (!taskFetchErr && taskRow && !taskRow.credits_consumed_at && taskRow.user_id) {
        const creditCost = config.creditCosts.pro;
        const imageUrl = ((): string | undefined => {
          if (parsedResult && 'resultUrls' in (parsedResult as KieResultJsonParsed)) {
            const urls = (parsedResult as KieResultJsonParsed).resultUrls;
            if (Array.isArray(urls) && urls.length > 0) return urls[0];
          }
          return undefined;
        })();
        const { error: txnErr } = await supabase.rpc('consume_credits', {
          user_id: taskRow.user_id,
          credits_to_consume: creditCost,
          transaction_description: 'Image generation (KIE callback auto-charge)',
          transaction_metadata: {
            provider: 'kie',
            task_id: String(taskId),
            image_url: imageUrl,
            source: 'callback',
          },
        });
        if (txnErr) {
          console.error('Auto-charge on callback failed:', txnErr);
        } else {
          const { error: markErr } = await supabase
            .from('generation_tasks')
            .update({ credits_consumed_at: new Date(), credits_cost: creditCost, updated_at: new Date() })
            .eq('provider', 'kie')
            .eq('provider_task_id', String(taskId));
          if (markErr) console.warn('Failed to mark credits_consumed_at after callback charge:', markErr);
        }
      }
    }

    // Acknowledge receipt
    return NextResponse.json({ ok: true, taskId, state: state ?? 'unknown' });
  } catch (error) {
    console.error('KIE callback error:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Internal Server Error', details: msg }, { status: 500 });
  }
}
