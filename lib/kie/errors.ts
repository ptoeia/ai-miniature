// Normalized error classes for KIE integration
// Language: English (per project preference)

export class KieError extends Error {
  public readonly code: string;
  public readonly status?: number;
  public readonly causeRaw?: unknown;

  constructor(message: string, code = 'KIE_ERROR', status?: number, causeRaw?: unknown) {
    super(message);
    this.name = 'KieError';
    this.code = code;
    this.status = status;
    this.causeRaw = causeRaw;
  }
}

export class AuthError extends KieError {
  constructor(message = 'Authentication failed', status = 401, causeRaw?: unknown) {
    super(message, 'AUTH_ERROR', status, causeRaw);
    this.name = 'AuthError';
  }
}

export class RateLimitError extends KieError {
  public readonly retryAfterSec?: number;
  constructor(message = 'Rate limited', status = 429, retryAfterSec?: number, causeRaw?: unknown) {
    super(message, 'RATE_LIMIT_ERROR', status, causeRaw);
    this.name = 'RateLimitError';
    this.retryAfterSec = retryAfterSec;
  }
}

export class ValidationError extends KieError {
  constructor(message = 'Invalid request', status = 400, causeRaw?: unknown) {
    super(message, 'VALIDATION_ERROR', status, causeRaw);
    this.name = 'ValidationError';
  }
}

export class ServiceError extends KieError {
  constructor(message = 'Service unavailable', status = 503, causeRaw?: unknown) {
    super(message, 'SERVICE_ERROR', status, causeRaw);
    this.name = 'ServiceError';
  }
}

export class TimeoutError extends KieError {
  constructor(message = 'Operation timed out', status = 504, causeRaw?: unknown) {
    super(message, 'TIMEOUT_ERROR', status, causeRaw);
    this.name = 'TimeoutError';
  }
}
