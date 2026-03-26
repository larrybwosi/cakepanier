'use server';

import { getBaseUrl } from './token';
import { dealioFetch } from './errors';
import { getUserToken } from './auth-utils';
import type { DealioCart, DealioCartResponse, DealioCheckoutPayload } from './types';

/**
 * Fetches the current active cart for the customer.
 */
export async function getCart(): Promise<DealioCart> {
  const base = getBaseUrl();
  const token = await getUserToken();
  const res = await dealioFetch<DealioCartResponse>(`${base}/users/me/cart`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res.data;
}

/**
 * Adds a product variant to the cart.
 */
export async function addToCart(productId: string, quantity: number = 1): Promise<DealioCart> {
  const base = getBaseUrl();
  const token = await getUserToken();
  const res = await dealioFetch<DealioCartResponse>(`${base}/users/me/cart`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ productId, quantity }),
  });
  return res.data;
}

/**
 * Removes or decrements an item in the cart.
 */
export async function removeFromCart(productId: string, removeEntirely: boolean = false): Promise<DealioCart> {
  const base = getBaseUrl();
  const token = await getUserToken();
  const res = await dealioFetch<DealioCartResponse>(
    `${base}/users/me/cart?productId=${productId}&removeEntirely=${removeEntirely}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return res.data;
}

/**
 * Processes checkout for the cart.
 */
export async function checkout(payload: DealioCheckoutPayload): Promise<{ success: boolean; data: any }> {
  const base = getBaseUrl();
  const token = await getUserToken();
  const res = await dealioFetch<{ success: boolean; data: any }>(`${base}/users/me/cart/checkout`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  return res;
}
