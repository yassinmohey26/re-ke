import { NextRequest, NextResponse } from 'next/server';
import { getDestinations } from '@/lib/data/tours';

export async function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get('locale') || 'de';
  const destinations = await getDestinations(locale);
  return NextResponse.json(destinations.map(d => ({ slug: d.slug, name: d.name })));
}
