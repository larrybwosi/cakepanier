import { NextRequest, NextResponse } from 'next/server';
import { getLogtoContext, getOrganizationToken } from "@logto/next/server-actions";
import { logtoConfig } from "@/lib/logto.config";
import { checkout } from "@/lib/dealio/cart";
import { DealioApiError } from '@/lib/dealio/errors';

const DEALIO_ORG_ID = process.env.DEALIO_ORG_ID;

export async function POST(req: NextRequest) {
  try {
    const { isAuthenticated } = await getLogtoContext(logtoConfig);
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    }

    const payload = await req.json();

    const token = await getOrganizationToken(logtoConfig, DEALIO_ORG_ID);
    const result = await checkout(token, payload);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof DealioApiError) {
      const status = err.status >= 500 ? 502 : err.status;
      return NextResponse.json({ error: err.code, message: err.message }, { status });
    }
    console.error('[dealio/checkout]', err);
    return NextResponse.json({ error: 'INTERNAL', message: 'Failed to process checkout' }, { status: 500 });
  }
}
