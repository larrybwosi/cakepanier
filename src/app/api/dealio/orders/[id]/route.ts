import { NextRequest, NextResponse } from 'next/server';
import { getDealioOrder } from '@/lib/dealio/orders';
import { DealioApiError, DealioNotFoundError } from '@/lib/dealio/errors';

// GET /api/dealio/orders/:id — fetch Dealio order status
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const order = await getDealioOrder(id);
    return NextResponse.json({ data: order });
  } catch (err) {
    if (err instanceof DealioNotFoundError) {
      return NextResponse.json({ error: 'NOT_FOUND', message: 'Order not found' }, { status: 404 });
    }
    if (err instanceof DealioApiError) {
      return NextResponse.json({ error: err.code, message: err.message }, { status: 502 });
    }
    console.error('[dealio/orders/id]', err);
    return NextResponse.json({ error: 'INTERNAL', message: 'Failed to fetch order' }, { status: 500 });
  }
}
