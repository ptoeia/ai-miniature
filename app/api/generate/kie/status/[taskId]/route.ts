import { NextResponse, type NextRequest } from 'next/server';
import KieClient from '@/lib/kie/KieClient';
import { createClient } from '@/lib/supabase/server';
import config from '@/config';
import { mapKieStateToUnified } from '@/lib/kie/state';

// Prevent static generation of this route
export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: { taskId: string } }) {
  try {
    const taskId = params.taskId;
    if (!taskId) {
      return NextResponse.json({ error: 'Missing taskId' }, { status: 400 });
    }

    // 1) DB-first: try to read from generation_tasks
    const supabase = createClient();
    const { data: row, error: dbError } = await supabase
      .from('generation_tasks')
      .select('state, result_json, error_code, error_message, completed_at')
      .eq('provider', 'kie')
      .eq('provider_task_id', taskId)
      .single();

    if (!dbError && row) {
      // Use shared util to map raw DB/vendor state to unified status

      let imageUrl: string | undefined;
      const rj = row.result_json as any;
      if (rj && typeof rj === 'object' && Array.isArray(rj.resultUrls)) {
        imageUrl = rj.resultUrls[0];
      }

      return NextResponse.json({
        status: mapKieStateToUnified(row.state),
        imageUrl,
        errorCode: row.error_code ?? undefined,
        errorMessage: row.error_message ?? undefined,
      });
    }

    // 2) Fallback: query vendor, then upsert back to DB
    const kie = new KieClient();
    const status = await kie.getTaskStatus(taskId);

    // Upsert minimal info back to DB for future reads
    const { error: upsertError } = await supabase
      .from('generation_tasks')
      .upsert(
        {
          provider: 'kie',
          provider_task_id: taskId,
          state: status.status,
          result_json: status.meta?.raw ?? null,
          error_code: status.errorCode ?? null,
          error_message: status.errorMessage ?? null,
          completed_at: (() => {
            const isTerminal = ['succeeded', 'failed', 'timeout', 'canceled'].includes(status.status);
            if (!isTerminal) return null;
            const raw: any = status.meta?.raw;
            const ts = raw?.completeTime;
            return ts ? new Date(Number(ts)) : new Date();
          })(),
          updated_at: new Date(),
        },
        { onConflict: 'provider,provider_task_id' }
      );

    if (upsertError) {
      console.warn('Failed to upsert generation_tasks from status fallback:', upsertError);
    }

    // Plan C: if succeeded and not yet charged, auto-consume credits as a fallback
    if (status.status === 'succeeded') {
      const { data: row2 } = await supabase
        .from('generation_tasks')
        .select('user_id, credits_consumed_at')
        .eq('provider', 'kie')
        .eq('provider_task_id', taskId)
        .single();
      if (row2 && !row2.credits_consumed_at && row2.user_id) {
        const creditCost = config.creditCosts.pro;
        const imageUrl = (status as any)?.imageUrl;
        const { error: txnErr } = await supabase.rpc('consume_credits', {
          user_id: row2.user_id,
          credits_to_consume: creditCost,
          transaction_description: 'Image generation (KIE status fallback auto-charge)',
          transaction_metadata: {
            provider: 'kie',
            task_id: taskId,
            image_url: imageUrl,
            source: 'status-fallback',
          },
        });
        if (!txnErr) {
          await supabase
            .from('generation_tasks')
            .update({ credits_consumed_at: new Date(), credits_cost: creditCost, updated_at: new Date() })
            .eq('provider', 'kie')
            .eq('provider_task_id', taskId);
        } else {
          console.warn('Auto-charge via status fallback failed:', txnErr);
        }
      }
    }

    return NextResponse.json(status);
  } catch (error) {
    console.error('KIE status error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
  }
}
