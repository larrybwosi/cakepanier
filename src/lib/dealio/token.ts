// ─── Dealio v2 API — Token Manager ───────────────────────────────────────────
// SERVER-ONLY. Manages OAuth2 Client Credentials token with in-process caching.

import 'server-only';
import type { DealioTokenResponse } from './types';
import { DealioAuthError } from './errors';

interface TokenCache {
  token: string;
  expiresAt: number; // unix ms
}

// Module-level cache — survives across requests within the same server process.
let cache: TokenCache | null = null;

// Refresh 60 seconds before actual expiry to avoid boundary races.
const BUFFER_MS = 60_000;

function getBaseUrl(): string {
  const base = process.env.DEALIO_API_BASE;
  if (!base) throw new Error('DEALIO_API_BASE env var is not set');
  return base.replace(/\/$/, '');
}

export async function getDealioToken(): Promise<string> {
  const now = Date.now();

  if (cache && now < cache.expiresAt - BUFFER_MS) {
    return cache.token;
  }

  const clientId = process.env.DEALIO_CLIENT_ID;
  const clientSecret = process.env.DEALIO_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('DEALIO_CLIENT_ID or DEALIO_CLIENT_SECRET env var is not set');
  }

  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
    scope: [
      'ecommerce:catalog:read',
      'ecommerce:inventory:read',
      'ecommerce:orders:write',
      'ecommerce:orders:read',
      'ecommerce:customers:read',
      'ecommerce:customers:write',
    ].join(' '),
  });

  const res = await fetch(`${getBaseUrl()}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
    cache: 'no-store',
  });

  if (!res.ok) {
    let errMsg = res.statusText;
    try {
      const json = await res.json();
      errMsg = json.message ?? errMsg;
    } catch { /* ignore */ }
    throw new DealioAuthError('TOKEN_FETCH_FAILED', errMsg, res.status);
  }

  const data: DealioTokenResponse = await res.json();

  cache = {
    token: data.access_token,
    expiresAt: now + data.expires_in * 1000,
  };

  return cache.token;
}

export { getBaseUrl };
