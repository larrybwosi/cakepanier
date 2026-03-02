import { NextRequest, NextResponse } from 'next/server';
import { checkInventory, checkMultipleInventory } from '@/lib/dealio/inventory';
import { DealioApiError } from '@/lib/dealio/errors';

const LOCATION_ID = process.env.DEALIO_LOCATION_ID ?? '';

// POST /api/dealio/inventory/check
// Body: { variantId: string } | { variantIds: string[] }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const locationId = LOCATION_ID;

    if (!locationId) {
      console.error("[dealio/inventory/check] Location ID not configured");
      return NextResponse.json({ error: 'CONFIG', message: 'Location ID not configured' }, { status: 500 });
    }

    if (body.variantIds && Array.isArray(body.variantIds)) {
      const results = await checkMultipleInventory(body.variantIds, locationId);
      return NextResponse.json({ data: results });
    }

    if (!body.variantId) {
      return NextResponse.json({ error: 'VALIDATION', message: 'variantId is required' }, { status: 400 });
    }

    const result = await checkInventory(body.variantId, locationId);
    console.log(result)
    return NextResponse.json({ data: result });
  } catch (err) {
    console.error("[dealio/inventory/check]", err);
    if (err instanceof DealioApiError) {
      return NextResponse.json({ error: err.code, message: err.message }, { status: 502 });
    }
    return NextResponse.json({ error: 'INTERNAL', message: 'Inventory check failed' }, { status: 500 });
  }
}
