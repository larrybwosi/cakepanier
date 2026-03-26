import { NextRequest, NextResponse } from 'next/server';
import { createDealioOrder } from '@repo/lib/dealio/orders';
import { DealioApiError, DealioInventoryError } from '@repo/lib/dealio/errors';

const LOCATION_ID = process.env.DEALIO_LOCATION_ID ?? '';

// POST /api/dealio/orders
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { supabaseOrderId, customerId, items, notes, shippingTotal, discountTotal } = body;

    if (!supabaseOrderId || !items?.length) {
      return NextResponse.json(
        { error: 'VALIDATION', message: 'supabaseOrderId and items are required' },
        { status: 400 }
      );
    }

    if (!LOCATION_ID) {
      return NextResponse.json({ error: 'CONFIG', message: 'Location ID not configured' }, { status: 500 });
    }

    // Submit to Dealio — externalOrderId ensures idempotency
    const dealioOrder = await createDealioOrder({
      externalOrderId: supabaseOrderId,
      locationId: LOCATION_ID,
      customerId: customerId ?? undefined,
      items,
      shippingTotal: shippingTotal ?? 0,
      discountTotal: discountTotal ?? 0,
      notes: notes ?? undefined,
      channel: 'ECOMMERCE_STORE',
    });

    return NextResponse.json({ data: dealioOrder }, { status: 201 });
  } catch (err) {
    if (err instanceof DealioInventoryError) {
      return NextResponse.json(
        { error: 'INSUFFICIENT_INVENTORY', message: err.message, details: err.details },
        { status: 409 }
      );
    }
    if (err instanceof DealioApiError) {
      return NextResponse.json({ error: err.code, message: err.message }, { status: 502 });
    }
    console.error('[dealio/orders POST]', err);
    return NextResponse.json({ error: 'INTERNAL', message: 'Order submission failed' }, { status: 500 });
  }
}
