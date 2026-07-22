// Place at: app/api/tours/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getTourBySlug, getTourExtras } from '@/lib/data/tours';
import { parsePricingTiers } from '@/lib/pricing-table';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);
  if (!tour) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const extras = await getTourExtras(tour.id);

  return NextResponse.json({
    id: tour.id,
    slug: tour.slug,
    name: tour.name,
    price: tour.price,
    pricingTiers: parsePricingTiers(tour.description),
    extras,
  });
}
