'use server';

import { getBaseUrl } from './token';
import { dealioFetch } from './errors';
import { getUserToken } from './auth-utils';
import type { DealioReview, DealioReviewsResponse } from './types';

/**
 * Fetches reviews for a specific product.
 */
export async function getProductReviews(productId: string): Promise<DealioReview[]> {
  const base = getBaseUrl();
  const res = await dealioFetch<DealioReviewsResponse>(`${base}/catalog/products/${productId}/reviews`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.data;
}

/**
 * Submits a review for a product.
 */
export async function addReview(
  productId: string,
  review: { rating: number; title?: string; comment: string }
): Promise<DealioReview> {
  const base = getBaseUrl();
  const token = await getUserToken();
  const res = await dealioFetch<{ success: boolean; data: DealioReview }>(
    `${base}/catalog/products/${productId}/reviews`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(review),
    }
  );
  return res.data;
}
