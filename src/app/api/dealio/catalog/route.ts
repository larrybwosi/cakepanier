import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getCatalogProducts, getCatalogCategories } from '@/lib/dealio/catalog';
import { DealioApiError } from '@/lib/dealio/errors';

const CatalogQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  categoryId: z.string().optional(),
  inStock: z.string().optional().transform((val) => val === 'true'),
  search: z.string().optional(),
  isFeatured: z.string().optional().transform((val) => val === 'true'),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    
    // Construct an object from searchParams for validation
    // using .get() guarantees we handle them as strings or nulls (which turn to undefined in the object below if we use null coalescing correctly, or just let zod handle nullable/optional)
    const rawQuery = {
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      categoryId: searchParams.get('categoryId'),
      inStock: searchParams.get('inStock'),
      search: searchParams.get('search'),
      isFeatured: searchParams.get('isFeatured'),
    };

    // Remove nulls so Zod defaults/optionals kick in
    const cleanQuery = Object.fromEntries(
      Object.entries(rawQuery).filter(([_, v]) => v !== null)
    );

    const result = CatalogQuerySchema.safeParse(cleanQuery);

    if (!result.success) {
      return NextResponse.json(
        { error: 'INVALID_QUERY', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const params = result.data;

    const [productsRes, categories] = await Promise.all([
      getCatalogProducts({
        page: params.page,
        limit: params.limit,
        categoryId: params.categoryId,
        inStock: params.inStock || undefined, // undefined if false/null to match original logic or API expectations? Original passed boolean.
        search: params.search,
        isFeatured: params.isFeatured || undefined,
      }),
      getCatalogCategories(),
    ]);

    return NextResponse.json(
      { products: productsRes, categories },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
        },
      }
    );
  } catch (err) {
    if (err instanceof DealioApiError) {
      const status = err.status >= 500 ? 502 : err.status;
      return NextResponse.json({ error: err.code, message: err.message }, { status });
    }
    console.error('[dealio/catalog]', err);
    return NextResponse.json({ error: 'INTERNAL', message: 'Failed to fetch catalog' }, { status: 500 });
  }
}
