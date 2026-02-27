// ─── Dealio v2 API — Customers ───────────────────────────────────────────────
// SERVER-ONLY. Creates or looks up a customer in the Dealio CRM.

import 'server-only';
import { getDealioToken, getBaseUrl } from './token';
import { dealioFetch, DealioConflictError, DealioNotFoundError } from './errors';
import type { DealioCustomer, DealioCustomerCreatePayload } from './types';

export async function findCustomerByEmail(email: string): Promise<DealioCustomer | null> {
  const token = await getDealioToken();
  const base = getBaseUrl();

  try {
    const res = await dealioFetch<{ data: DealioCustomer[] }>(
      `${base}/customers?q=${encodeURIComponent(email)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      },
    );
    return res.data?.[0] ?? null;
  } catch (err) {
    if (err instanceof DealioNotFoundError) return null;
    throw err;
  }
}

export async function createDealioCustomer(
  payload: DealioCustomerCreatePayload,
): Promise<DealioCustomer> {
  const token = await getDealioToken();
  const base = getBaseUrl();

  try {
    const res = await dealioFetch<{ data: DealioCustomer }>(
      `${base}/customers`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        cache: 'no-store',
      },
    );
    return res.data;
  } catch (err) {
    // 409 conflict = customer already exists — find and return existing record
    if (err instanceof DealioConflictError) {
      const existing = await findCustomerByEmail(payload.email);
      if (existing) return existing;
    }
    throw err;
  }
}

/**
 * Upserts: finds existing customer by email or creates a new one.
 * Returns the Dealio customer ID for storage in Supabase.
 */
export async function syncDealioCustomer(
  payload: DealioCustomerCreatePayload,
): Promise<string> {
  const existing = await findCustomerByEmail(payload.email);
  if (existing) return existing.id;

  const created = await createDealioCustomer(payload);
  return created.id;
}
