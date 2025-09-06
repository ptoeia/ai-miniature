import { NextResponse, type NextRequest } from 'next/server';
import { UploadService } from '@/lib/upload/UploadService';
import { createClient } from '@/lib/supabase/server';

// Prevent static generation of this route
export const dynamic = 'force-dynamic';

/**
 * POST /api/uploads
 *
 * Generic upload endpoint for storage (provider-agnostic, storage-only).
 * Default provider: R2. Accepts multipart/form-data with field 'file'.
 * No provider selection is accepted from the client; server uses its own default.
 */
export async function POST(req: NextRequest) {
  try {
    // Secure: resolve user from server-side Supabase auth (cookies), not from client headers
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const form = await req.formData();
    const file = form.get('file');

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'Missing file in form-data as "file"' }, { status: 400 });
    }

    const svc = new UploadService();
    const fileName = (file as any).name || 'upload';
    const res = await svc.upload(file, { fileName });
    if (!res.success || !res.url) {
      return NextResponse.json({ error: res.errorMessage || 'Upload failed' }, { status: 502 });
    }
    return NextResponse.json({ success: true, url: res.url, provider: res.provider });
  } catch (error) {
    console.error('Generic upload error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
  }
}
