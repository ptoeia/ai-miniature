// Frontend utilities to interact with backend KIE-related APIs and uploads
// Language: English (code)

export type GenerateType = 'text_to_image' | 'image_to_image' | 'image_edit';

export interface GenerateWithKieRequest {
  prompt?: string;
  type?: GenerateType; // default handled by server
  inputImages?: string[]; // URLs returned from /api/uploads
}

export interface GenerateWithKieSyncResponse {
  success: true;
  imageUrl: string;
  creditsUsed: number;
  remainingCredits?: number;
}

export interface GenerateWithKieAsyncResponse {
  success: true;
  requiresPolling: true;
  taskId: string;
  creditCost: number;
}

export type GenerateWithKieResponse = GenerateWithKieSyncResponse | GenerateWithKieAsyncResponse;

export interface KieStatusResponse {
  status: 'pending' | 'running' | 'succeeded' | 'failed' | string;
  imageUrl?: string;
  errorMessage?: string;
}

// Specialized error to signal insufficient credits
export class InsufficientCreditsError extends Error {
  status = 402;
  required?: number;
  available?: number;
  constructor(message: string, required?: number, available?: number) {
    super(message);
    this.name = 'InsufficientCreditsError';
    this.required = required;
    this.available = available;
  }
}

export async function uploadToR2(file: File | Blob): Promise<{ success: boolean; url?: string; provider?: string; error?: string }>{
  const fd = new FormData();
  // ensure name for Blob in browsers
  const f = file as any;
  if (file instanceof File) {
    fd.append('file', file);
  } else {
    const name = f?.name || 'upload';
    const wrapped = new File([file], name, { type: (file as any).type || 'application/octet-stream' });
    fd.append('file', wrapped);
  }

  const res = await fetch('/api/uploads', { method: 'POST', body: fd });
  const data = await res.json();
  if (!res.ok) return { success: false, error: data?.error || 'Upload failed' };
  return data;
}

export async function generateWithKie(body: GenerateWithKieRequest): Promise<GenerateWithKieResponse>{
  const res = await fetch('/api/generate/kie', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    if (res.status === 402) {
      // payment required -> insufficient credits
      throw new InsufficientCreditsError(
        data?.error || 'Insufficient credits',
        data?.required,
        data?.available,
      );
    }
    throw new Error(data?.error || 'Generate failed');
  }
  return data as GenerateWithKieResponse;
}

export async function pollKieStatus(taskId: string): Promise<KieStatusResponse>{
  const res = await fetch(`/api/generate/kie/status/${encodeURIComponent(taskId)}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Status check failed');
  return data as KieStatusResponse;
}
