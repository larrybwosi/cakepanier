'use server';

import { getBaseUrl } from './token';
import { dealioFetch } from './errors';
import { getUserToken } from './auth-utils';
import type { DealioFavorite, DealioFavoritesResponse } from './types';

/**
 * Fetches the customer's favorite products.
 */
export async function getFavorites(): Promise<DealioFavorite[]> {
  const base = getBaseUrl();
  const token = await getUserToken();
  const res = await dealioFetch<DealioFavoritesResponse>(`${base}/users/me/favorites`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res.data;
}

/**
 * Adds a product to the customer's favorites.
 */
export async function addToFavorites(productId: string): Promise<DealioFavorite> {
  const base = getBaseUrl();
  const token = await getUserToken();
  const res = await dealioFetch<{ success: boolean; data: DealioFavorite }>(`${base}/users/me/favorites`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ productId }),
  });
  return res.data;
}

/**
 * Removes a product from the customer's favorites.
 */
export async function removeFromFavorites(productId: string): Promise<void> {
  const base = getBaseUrl();
  const token = await getUserToken();
  await dealioFetch<{ success: boolean }>(
    `${base}/users/me/favorites?productId=${productId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
}
