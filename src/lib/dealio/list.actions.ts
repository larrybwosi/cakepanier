'use server';
import { getCatalogProducts } from "./catalog";

export async function loadMoreProducts(
  page: number,
  categoryId?: string | null,
  search?: string | null,
) {
  try {
    const data = await getCatalogProducts({
      page,
      limit: 20,
      categoryId: categoryId ?? undefined,
      search: search ?? undefined,
    });

    return { success: true, data };
  } catch (error) {
    console.error("[loadMoreProducts] failed:", error);
    return { success: false, error: "Failed to fetch products" };
  }
}
