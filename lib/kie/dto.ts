// DTOs and type definitions for KIE Nano Banana integration
// Language: English (per project preference)

export type ModelType = 'text_to_image' | 'image_edit';

// Minimal async response we use after createTask
export interface GenerateImageAsyncResponseDTO {
  success: true;
  taskId: string; // job/task identifier for polling
  // Optional vendor-provided meta
  meta?: Record<string, unknown>;
}

export type GenerateImageResponseDTO = GenerateImageAsyncResponseDTO;

export interface TaskStatusResponseDTO {
  status: 'queued' | 'processing' | 'succeeded' | 'failed' | 'canceled' | 'timeout';
  progress?: number; // 0..100
  // When succeeded
  imageUrl?: string;
  // Error details when failed
  errorCode?: string;
  errorMessage?: string;
  meta?: Record<string, unknown>;
}
// ---------------- KIE specific DTOs ----------------

// Request body for POST /api/v1/playground/createTask
export interface KieCreateTaskRequestDTO {
  model: string; // e.g. "google/nano-banana"
  callBackUrl?: string;
  input: KieCreateTaskInputDTO;
}

// Input payload inside createTask
export interface KieCreateTaskInputDTO {
  prompt: string;
  image_urls?: string[];
}

// Response of createTask
export interface KieCreateTaskResponseDTO {
  code: number;
  message: string;
  data?: {
    taskId: string;
  };
}

// Response of GET /api/v1/playground/recordInfo?taskId=...
export interface KieRecordInfoResponseDTO {
  code: number;
  message: string;
  data?: {
    taskId: string;
    model: string;
    state: string; // e.g. 'success' | 'processing' | 'failed' | 'timeout' | 'canceled'
    param?: string; // stringified JSON of request
    resultJson?: string; // stringified JSON with resultUrls
    failCode?: string;
    failMsg?: string;
    completeTime?: number;
    createTime?: number;
    updateTime?: number;
  };
}

// Parsed structure inside data.resultJson
export interface KieResultJsonParsed {
  resultUrls?: string[];
  [key: string]: unknown;
}

// ---------------- KIE callback DTO ----------------
// Strict shape per vendor success callback example
export interface KieCallbackResponseDTO {
  code: number; // e.g. 200
  msg?: string; // e.g. "Playground task completed successfully."
  data: {
    taskId: string;
    state: string; // 'success' | 'processing' | 'failed' | 'timeout' | 'canceled' | ...
    model?: string;
    param?: string; // stringified JSON
    resultJson?: string; // stringified JSON
    completeTime?: number;
    createTime?: number;
    updateTime?: number;
    // optional vendor extras
    consumeCredits?: number;
    remainedCredits?: number;
    costTime?: number;
  };
}
