const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

function parseStr(val, fallback) {
  if (typeof val === 'string') return val;
  return fallback;
}

function parseArr(val, fallback) {
  if (Array.isArray(val)) return val.filter(v => typeof v === 'string');
  return fallback;
}

function parseItin(val, fallback) {
  if (Array.isArray(val)) return val;
  return fallback;
}

function parseFaqs(val, fallback) {
  if (Array.isArray(val)) return val;
  return fallback;
}

function parseEavJoinedString(tr) {
  if (!tr) return tr;
  if (tr.name && typeof tr.name === 'string' && tr.name.includes('---')) {
    const mainParts = tr.name.split(/---\s*تسيب\s*---/);
    if (mainParts.length > 1) {
      tr.name = mainParts[0].trim();
      tr.short_description = mainParts[1]?.trim() || tr.short_description;
      tr.category_label = mainParts[2]?.trim() || tr.category_label;
      tr.meeting_point = mainParts[3]?.trim() || tr.meeting_point;
      tr.duration = mainParts[4]?.trim() || tr.duration;
      
      if (mainParts[5]) {
        const parsedDesc = mainParts[5].trim();
        if (!tr.description || tr.description.includes('Teilnehmer') || tr.description.includes('Reisetyp')) {
          tr.description = parsedDesc;
        }
      }
      
      if (mainParts[6]) {
        tr.highlights = mainParts[6].split(/---\s*تقسيم\s*---/).map(s => s.trim()).filter(Boolean);
      }
      if (mainParts[7]) {
        tr.included = mainParts[7].split(/---\s*تقسيم\s*---/).map(s => s.trim()).filter(Boolean);
      }
      if (mainParts[8]) {
        tr.not_included = mainParts[8].split(/---\s*تقسيم\s*---/).map(s => s.trim()).filter(Boolean);
      }
    }
  }
  return tr;
}

function mergeTranslation(row, trRaw) {
  const tr = parseEavJoinedString(trRaw);
  const unique = (arr) => [...new Set(arr)];
  return {
    id: row.id,
    slug: row.slug,
    name: parseStr(tr?.name, row.name),
    shortDescription: parseStr(tr?.short_description, row.short_description ?? ''),
    description: parseStr(tr?.description, row.description ?? ''),
    price: row.price,
    duration: parseStr(tr?.duration, row.duration ?? ''),
    durationHours: row.duration_hours ?? 0,
    maxGuests: row.max_guests ?? 8,
    difficulty: row.difficulty ?? 'leicht',
    minAge: row.min_age ?? 6,
    destination: row.destination ?? '',
    destinationSlug: row.destination_slug ?? '',
    category: row.category ?? 'ganztag',
    categoryLabel: parseStr(tr?.category_label, row.category_label ?? ''),
    highlights: unique(parseArr(tr?.highlights, row.highlights ?? [])),
    included: unique(parseArr(tr?.included, row.included ?? [])),
    notIncluded: unique(parseArr(tr?.not_included, row.not_included ?? [])),
    itinerary: parseItin(tr?.itinerary, row.itinerary ?? []),
    faqs: parseFaqs(tr?.faqs, row.faqs ?? []),
    image: row.image ?? '',
    meetingPoint: parseStr(tr?.meeting_point, row.meeting_point ?? ''),
    featured: row.featured ?? false,
  };
}

(async () => {
  const { data: tourRows } = await supabase.from('tours').select('*').limit(1);
  if (!tourRows || tourRows.length === 0) {
    console.log('Tour not found');
    return;
  }
  const row = tourRows[0];
  console.log('Querying for tour slug:', row.slug);

  const { data: trData } = await supabase
    .from('content_translations')
    .select('*')
    .eq('table_name', 'tours')
    .eq('row_id', row.id)
    .eq('locale', 'ar')
    .limit(1)
    .maybeSingle();

  console.log('--- DB Translation Row ---');
  console.log(JSON.stringify(trData, null, 2));

  console.log('\n--- parseEavJoinedString Output ---');
  const trCopy = JSON.parse(JSON.stringify(trData));
  const trParsed = parseEavJoinedString(trCopy);
  console.log(JSON.stringify(trParsed, null, 2));

  console.log('\n--- mergeTranslation Output ---');
  const merged = mergeTranslation(row, trData);
  console.log(JSON.stringify(merged, null, 2));
})();
