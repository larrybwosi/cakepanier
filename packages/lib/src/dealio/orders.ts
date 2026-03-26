// ─── Dealio v2 API — Orders ──────────────────────────────────────────────────
// SERVER-ONLY. Submit and retrieve orders via the Dealio API.

import 'server-only';
import { getDealioToken, getBaseUrl } from './token';
import { dealioFetch } from './errors';
import type { DealioOrder, DealioOrderCreatePayload } from './types';

export async function createDealioOrder(
  payload: DealioOrderCreatePayload,
): Promise<DealioOrder> {
  const token = await getDealioToken();
  const base = getBaseUrl();

  const res = await dealioFetch<{ data: DealioOrder }>(
    `${base}/orders`,
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
}

export async function getDealioOrder(orderId: string): Promise<DealioOrder> {
  const token = await getDealioToken();
  const base = getBaseUrl();

  const res = await dealioFetch<{ data: DealioOrder }>(
    `${base}/orders/${orderId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    },
  );
  return res.data;
}
