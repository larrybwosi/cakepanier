// ─── Dealio v2 API — Catalog ─────────────────────────────────────────────────
// SERVER-ONLY. Fetches products and categories from the Dealio catalog API.

import 'server-only';
import { getDealioToken, getBaseUrl } from './token';
import { dealioFetch } from './errors';
import type {
  DealioProduct,
  DealioProductsResponse,
  DealioCategory,
} from './types';

export interface ProductsQueryParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  inStock?: boolean;
  search?: string;
  isFeatured?: boolean;
}

export async function getCatalogProducts(
  params: ProductsQueryParams = {},
): Promise<DealioProductsResponse> {
  const token = await getDealioToken();
  const base = getBaseUrl();

  const qs = new URLSearchParams();
  if (params.page) qs.set('page', String(params.page));
  if (params.limit) qs.set('limit', String(params.limit));
  if (params.categoryId) qs.set('categoryId', params.categoryId);
  if (params.inStock !== undefined) qs.set('inStock', String(params.inStock));
  if (params.search) qs.set('search', params.search);
  if (params.isFeatured !== undefined) qs.set('isFeatured', String(params.isFeatured));

  return dealioFetch<DealioProductsResponse>(
    `${base}/catalog/products?${qs.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    },
  );
}

export async function getCatalogProduct(productId: string): Promise<DealioProduct> {
  const token = await getDealioToken();
  const base = getBaseUrl();

  const res = await dealioFetch<{ data: DealioProduct }>(
    `${base}/catalog/products/${productId}`,
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

export async function getCatalogCategories(): Promise<DealioCategory[]> {
  const token = await getDealioToken();
  const base = getBaseUrl();

  const res = await dealioFetch<{ data: DealioCategory[] }>(
    `${base}/catalog/categories`,
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
