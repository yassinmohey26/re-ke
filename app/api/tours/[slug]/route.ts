// Place at: app/api/tours/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getTourBySlug, getTourExtras } from '@/lib/data/tours';
import { getSupabaseAdmin } from '@/lib/supabase';
import { parsePricingTiers } from '@/lib/pricing-table';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const locale = request.nextUrl.searchParams.get('locale') || 'de';
  const tour = await getTourBySlug(slug);
  if (!tour) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const extras = await getTourExtras(tour.id, locale);
  const { data: participantRows } = await getSupabaseAdmin()
    .from('tour_participant_prices').select('person_type,price,currency,min_age,max_age,is_active')
    .eq('tour_id', tour.id).eq('is_active', true);

  const rawTiers = tour.discount?.pricingTiers ?? parsePricingTiers(tour.description);
  const pricingTiers = rawTiers.map((t) => {
    if ('minGuests' in t && 'pricePerPerson' in t) {
      return { minGuests: t.minGuests, maxGuests: t.maxGuests, pricePerPerson: t.pricePerPerson };
    }
    return { minGuests: t.min, maxGuests: t.max, pricePerPerson: t.price };
  });

  return NextResponse.json({
    id: tour.id,
    slug: tour.slug,
    name: tour.name,
    price: tour.price,
    maxGuests: tour.maxGuests,
    pricingTiers,
    discount: tour.discount,
    extras,
    participantPrices: Object.fromEntries((participantRows ?? []).map((p: Record<string, unknown>) => [p.person_type, {
      personType: p.person_type, price: Number(p.price), currency: p.currency ?? 'EUR',
      minAge: Number(p.min_age), maxAge: Number(p.max_age), isActive: Boolean(p.is_active),
    }])),
  });
}
