// ─── Dealio v2 API — Inventory ───────────────────────────────────────────────
// SERVER-ONLY. Checks real-time stock before add-to-cart and checkout.

import 'server-only';
import { getDealioToken, getBaseUrl } from './token';
import { dealioFetch } from './errors';
import type { DealioInventoryItem, DealioInventoryResponse } from './types';

export async function checkInventory(
  variantId: string,
  locationId: string,
): Promise<DealioInventoryItem | null> {
  const token = await getDealioToken();
  const base = getBaseUrl();

  const qs = new URLSearchParams({ variantId, locationId });

  const res = await dealioFetch<DealioInventoryResponse>(
    `${base}/inventory?${qs.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      // Never cache inventory — must always be fresh.
      cache: 'no-store',
    },
  );

  return res.data?.[0] ?? null;
}

export async function checkMultipleInventory(
  variantIds: string[],
  locationId: string,
): Promise<DealioInventoryItem[]> {
  const token = await getDealioToken();
  const base = getBaseUrl();

  const qs = new URLSearchParams({ locationId });
  variantIds.forEach(id => qs.append('variantId', id));

  const res = await dealioFetch<DealioInventoryResponse>(
    `${base}/inventory?${qs.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    },
  );

  return res.data ?? [];
}
