import { NextRequest, NextResponse } from 'next/server';
import { syncDealioCustomer } from '@/lib/dealio/customers';
import { DealioApiError } from '@/lib/dealio/errors';
import { createClient } from '@supabase/supabase-js';

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
}

// POST /api/dealio/customers/sync
// Body: { userId, firstName, lastName, email, phone? }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, firstName, lastName, email, phone } = body;

    if (!userId || !email) {
      return NextResponse.json(
        { error: 'VALIDATION', message: 'userId and email are required' },
        { status: 400 },
      );
    }

    const dealioCustomerId = await syncDealioCustomer({
      firstName: firstName ?? '',
      lastName: lastName ?? '',
      email,
      phone: phone ?? undefined,
      customerType: 'retail',
    });

    // Persist dealio_customer_id in Supabase customer_profiles
    const supabase = getSupabaseAdmin();
    await supabase
      .from('customer_profiles')
      .upsert(
        { user_id: userId, dealio_customer_id: dealioCustomerId },
        { onConflict: 'user_id', ignoreDuplicates: false },
      );

    return NextResponse.json({ dealioCustomerId });
  } catch (err) {
    if (err instanceof DealioApiError) {
      return NextResponse.json({ error: err.code, message: err.message }, { status: 502 });
    }
    console.error('[dealio/customers/sync]', err);
    return NextResponse.json({ error: 'INTERNAL', message: 'Customer sync failed' }, { status: 500 });
  }
}
