import { NextResponse } from 'next/server';
import { getBaseUrl } from '@/lib/dealio/token';

export async function GET() {
  try {
    const base = getBaseUrl();
    const res = await fetch(`${base}/health`, { cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json({ status: 'unhealthy', error: String(err) }, { status: 503 });
  }
}
