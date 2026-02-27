import { NextRequest, NextResponse } from 'next/server';
import { createDealioOrder } from '@/lib/dealio/orders';
import { DealioApiError, DealioInventoryError } from '@/lib/dealio/errors';
import { createClient } from '@supabase/supabase-js';

const LOCATION_ID = process.env.DEALIO_LOCATION_ID ?? '';

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
}

// POST /api/dealio/orders
// Body: { supabaseOrderId, customerId?, items: [{variantId, quantity, unitPrice}], notes? }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { supabaseOrderId, customerId, items, notes, shippingTotal, discountTotal } = body;

    if (!supabaseOrderId || !items?.length) {
      return NextResponse.json(
        { error: 'VALIDATION', message: 'supabaseOrderId and items are required' },
        { status: 400 },
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

    // Write Dealio reference back to Supabase orders table
    const supabase = getSupabaseAdmin();
    await supabase
      .from('orders')
      .update({
        dealio_transaction_id: dealioOrder.id,
        dealio_order_number: dealioOrder.orderNumber,
        status: 'confirmed',
      })
      .eq('id', supabaseOrderId);

    return NextResponse.json({ data: dealioOrder }, { status: 201 });
  } catch (err) {
    if (err instanceof DealioInventoryError) {
      return NextResponse.json(
        { error: 'INSUFFICIENT_INVENTORY', message: err.message, details: err.details },
        { status: 409 },
      );
    }
    if (err instanceof DealioApiError) {
      return NextResponse.json({ error: err.code, message: err.message }, { status: 502 });
    }
    console.error('[dealio/orders POST]', err);
    return NextResponse.json({ error: 'INTERNAL', message: 'Order submission failed' }, { status: 500 });
  }
}
