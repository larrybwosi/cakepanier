import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getCatalogProduct } from '@/lib/dealio/catalog';
import { DealioApiError, DealioNotFoundError } from '@/lib/dealio/errors';

const ParamsSchema = z.object({
  id: z.string().uuid().or(z.string().min(1)), // Support both UUIDs and slug-like IDs
});

// GET /api/dealio/catalog/:id
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const rawParams = await params;
    const result = ParamsSchema.safeParse(rawParams);

    if (!result.success) {
      return NextResponse.json(
        { error: 'INVALID_ID', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { id } = result.data;
    const product = await getCatalogProduct(id);

    return NextResponse.json(
      { data: product },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=300',
        },
      }
    );
  } catch (err) {
    if (err instanceof DealioNotFoundError) {
      return NextResponse.json({ error: 'NOT_FOUND', message: 'Product not found' }, { status: 404 });
    }
    if (err instanceof DealioApiError) {
      const status = err.status >= 500 ? 502 : err.status;
      return NextResponse.json({ error: err.code, message: err.message }, { status });
    }
    console.error('[dealio/catalog/id]', err);
    return NextResponse.json({ error: 'INTERNAL', message: 'Failed to fetch product' }, { status: 500 });
  }
}
