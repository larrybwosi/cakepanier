// ─── Dealio v2 API — Error Handling & Fetch Wrapper ─────────────────────────
// SERVER-ONLY. Provides retry logic, backoff, and normalized error classes.

import 'server-only';
import type { DealioErrorBody } from './types';

export class DealioApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'DealioApiError';
  }
}

export class DealioAuthError extends DealioApiError {}
export class DealioNotFoundError extends DealioApiError {}
export class DealioInventoryError extends DealioApiError {}
export class DealioConflictError extends DealioApiError {}
export class DealioRateLimitError extends DealioApiError {}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Classified fetch with automatic retry + exponential backoff.
 * Retries on 429 (respects Retry-After) and 5xx (up to 3 attempts).
 * Throws typed DealioApiError subclasses for all non-2xx responses.
 */
export async function dealioFetch<T>(
  url: string,
  options: RequestInit,
  maxRetries = 3,
): Promise<T> {
  let attempt = 0;

  while (attempt <= maxRetries) {
    const res = await fetch(url, options);

    if (res.ok) {
      return res.json() as Promise<T>;
    }

    let body: DealioErrorBody = { error: 'UNKNOWN', message: res.statusText };
    try {
      body = await res.json();
    } catch {
      // keep default body
    }

    const { error: code, message, details } = body;

    // 401 / 403 — auth failures — never retry
    if (res.status === 401 || res.status === 403) {
      throw new DealioAuthError(code, message, res.status, details);
    }

    // 404 — not found — never retry
    if (res.status === 404) {
      throw new DealioNotFoundError(code, message, res.status, details);
    }

    // 409 — conflict or insufficient inventory
    if (res.status === 409) {
      if (code === 'INSUFFICIENT_INVENTORY') {
        throw new DealioInventoryError(code, message, res.status, details);
      }
      throw new DealioConflictError(code, message, res.status, details);
    }

    // 429 — rate limited — retry with Retry-After or backoff
    if (res.status === 429) {
      if (attempt >= maxRetries) {
        throw new DealioRateLimitError(code, message, res.status, details);
      }
      const retryAfter = res.headers.get('Retry-After');
      const waitMs = retryAfter ? parseInt(retryAfter, 10) * 1000 : Math.pow(2, attempt) * 1000;
      await sleep(waitMs);
      attempt++;
      continue;
    }

    // 5xx — transient server errors — retry with exponential backoff
    if (res.status >= 500) {
      if (attempt >= maxRetries) {
        throw new DealioApiError(code, message, res.status, details);
      }
      await sleep(Math.pow(2, attempt) * 1000);
      attempt++;
      continue;
    }

    // Catch-all
    throw new DealioApiError(code, message, res.status, details);
  }

  // Should never reach here
  throw new DealioApiError('MAX_RETRIES', 'Max retries exceeded', 500);
}
