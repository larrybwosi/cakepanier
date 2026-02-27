import { NextRequest, NextResponse } from 'next/server';
import { getCatalogProduct } from '@/lib/dealio/catalog';
import { DealioApiError, DealioNotFoundError } from '@/lib/dealio/errors';

// GET /api/dealio/catalog/:id
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const product = await getCatalogProduct(id);
    return NextResponse.json({ data: product });
  } catch (err) {
    if (err instanceof DealioNotFoundError) {
      return NextResponse.json({ error: 'NOT_FOUND', message: 'Product not found' }, { status: 404 });
    }
    if (err instanceof DealioApiError) {
      return NextResponse.json({ error: err.code, message: err.message }, { status: 502 });
    }
    console.error('[dealio/catalog/id]', err);
    return NextResponse.json({ error: 'INTERNAL', message: 'Failed to fetch product' }, { status: 500 });
  }
}
