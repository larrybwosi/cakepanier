import { NextRequest, NextResponse } from 'next/server';
import { getCatalogProducts, getCatalogCategories } from '@/lib/dealio/catalog';
import { DealioApiError } from '@/lib/dealio/errors';

// GET /api/dealio/catalog?page=1&limit=20&categoryId=…&search=…&inStock=true
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;

    const [productsRes, categories] = await Promise.all([
      getCatalogProducts({
        page: searchParams.has('page') ? Number(searchParams.get('page')) : 1,
        limit: searchParams.has('limit') ? Number(searchParams.get('limit')) : 20,
        categoryId: searchParams.get('categoryId') ?? undefined,
        inStock: searchParams.has('inStock')
          ? searchParams.get('inStock') === 'true'
          : undefined,
        search: searchParams.get('search') ?? undefined,
        isFeatured: searchParams.has('isFeatured')
          ? searchParams.get('isFeatured') === 'true'
          : undefined,
      }),
      getCatalogCategories(),
    ]);

    return NextResponse.json({ products: productsRes, categories });
  } catch (err) {
    if (err instanceof DealioApiError) {
      const status = err.status >= 500 ? 502 : err.status;
      return NextResponse.json({ error: err.code, message: err.message }, { status });
    }
    console.error('[dealio/catalog]', err);
    return NextResponse.json({ error: 'INTERNAL', message: 'Failed to fetch catalog' }, { status: 500 });
  }
}
