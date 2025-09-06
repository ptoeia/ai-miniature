// KIE Nano Banana API client
// Language: English (per project preference)

import config from '@/config';
import { AuthError, RateLimitError, ServiceError, TimeoutError, ValidationError } from './errors';
import type {
  GenerateImageResponseDTO,
  TaskStatusResponseDTO,
  KieCreateTaskRequestDTO,
  KieCreateTaskResponseDTO,
  KieRecordInfoResponseDTO,
  KieResultJsonParsed,
} from './dto';
import { mapKieStateToUnified } from './state';

export interface IKieClient {
  generateImage(req: KieCreateTaskRequestDTO, signal?: AbortSignal): Promise<GenerateImageResponseDTO>;
  getTaskStatus(taskId: string, signal?: AbortSignal): Promise<TaskStatusResponseDTO>;
}

export class KieClient implements IKieClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly timeoutMs: number;

  constructor() {
    this.baseUrl = config.kie.baseUrl;
    this.apiKey = config.kie.apiKey;
    this.timeoutMs = config.kie.timeoutMs;
  }

  private authHeaders(): HeadersInit {
    return {
      Authorization: `Bearer ${this.apiKey}`,
    };
  }

  private async request<T>(
    path: string,
    options: RequestInit & { timeoutMs?: number } = {}
  ): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? this.timeoutMs);
    try {
      const res = await fetch(`${this.baseUrl}${path}`, {
        ...options,
        signal: options.signal ?? controller.signal,
      });

      if (res.status === 401 || res.status === 403) throw new AuthError('Invalid or missing KIE API key', res.status);
      if (res.status === 429) {
        const retryAfter = Number(res.headers.get('Retry-After') ?? '0') || undefined;
        throw new RateLimitError('KIE rate limit exceeded', 429, retryAfter);
      }
      if (res.status >= 400 && res.status < 500) throw new ValidationError(`KIE request failed (${res.status})`, res.status);
      if (res.status >= 500) throw new ServiceError(`KIE server error (${res.status})`, res.status);

      return (await res.json()) as T;
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        throw new TimeoutError('KIE request timed out');
      }
      throw err;
    } finally {
      clearTimeout(timeout);
    }
  }

  

  async generateImage(req: KieCreateTaskRequestDTO, signal?: AbortSignal): Promise<GenerateImageResponseDTO> {
    // Directly forward Playground payload
    const body = JSON.stringify(req);
    const res = await this.request<KieCreateTaskResponseDTO>('/api/v1/playground/createTask', {
      method: 'POST',
      headers: {
        ...this.authHeaders(),
        'Content-Type': 'application/json',
      },
      body,
      signal,
    });

    if (typeof res?.code !== 'number') {
      throw new ServiceError('Unexpected KIE createTask response', 502);
    }
    if (res.code !== 200) {
      throw new ServiceError(`KIE createTask failed (${res.code}): ${res.message ?? ''}`);
    }
    const taskId = res.data?.taskId;
    if (!taskId) {
      throw new ServiceError('KIE createTask did not return taskId', 502);
    }

    // Our public type expects async union in this path
    return { success: true, taskId };
  }

  async getTaskStatus(taskId: string, signal?: AbortSignal): Promise<TaskStatusResponseDTO> {
    const res = await this.request<KieRecordInfoResponseDTO>(
      `/api/v1/playground/recordInfo?taskId=${encodeURIComponent(taskId)}`,
      {
        method: 'GET',
        headers: this.authHeaders(),
        signal,
      }
    );

    if (typeof res?.code !== 'number') {
      throw new ServiceError('Unexpected KIE recordInfo response', 502);
    }
    if (res.code !== 200) {
      throw new ServiceError(`KIE recordInfo failed (${res.code}): ${res.message ?? ''}`);
    }

    const data = res.data;
    if (!data) {
      throw new ServiceError('KIE recordInfo missing data', 502);
    }

    // Map vendor state to our unified status via shared util

    let imageUrl: string | undefined = undefined;
    if (data.resultJson) {
      try {
        const parsed = JSON.parse(data.resultJson) as KieResultJsonParsed;
        imageUrl = parsed?.resultUrls?.[0];
      } catch (_) {
        // ignore JSON parse errors; leave imageUrl undefined
      }
    }

    return {
      status: mapKieStateToUnified(data.state),
      imageUrl,
      errorCode: data.failCode,
      errorMessage: data.failMsg,
      meta: {
        raw: data,
      },
    };
  }
}

export default KieClient;
