const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

function smartParseEav(tr) {
  if (!tr || !tr.name || typeof tr.name !== 'string' || !tr.name.includes('---')) {
    return tr;
  }

  const parts = tr.name.split(/---\s*تسيب\s*---/).map(p => p.trim()).filter(Boolean);
  if (parts.length <= 1) return tr;

  // We know:
  // parts[0] is always name
  tr.name = parts[0];

  // parts[1] is always short_description
  tr.short_description = parts[1];

  let nextIdx = 2;

  // 1. Detect Category Label (usually short, e.g. "الثقافة ومشاهدة المعالم السياحية", "الغطس والغوص", "Kultur & Sightseeing")
  // Let's check if parts[nextIdx] is a category label. Categories are typically < 50 chars and don't contain location or numbers/hours.
  if (parts[nextIdx] && parts[nextIdx].length < 60 && 
      (parts[nextIdx].includes('الثقافة') || parts[nextIdx].includes('الغطس') || parts[nextIdx].includes('مغامرة') || parts[nextIdx].includes('سفاري') || parts[nextIdx].includes('رياضة') || parts[nextIdx].includes('Kultur') || parts[nextIdx].includes('Ausflug') || parts[nextIdx].includes('Safari') || parts[nextIdx].includes('Wassersport'))) {
    tr.category_label = parts[nextIdx];
    nextIdx++;
  }

  // 2. Detect Meeting Point (e.g. "الغردقة - البحر الأحمر - مصر", "Hurghada - Rotes Meer")
  if (parts[nextIdx] && (parts[nextIdx].includes('الغردقة') || parts[nextIdx].includes('مصر') || parts[nextIdx].includes('البحر') || parts[nextIdx].includes('Hurghada') || parts[nextIdx].includes('Meer') || parts[nextIdx].includes('Aegypten'))) {
    tr.meeting_point = parts[nextIdx];
    nextIdx++;
  }

  // 3. Detect Duration (e.g. "14 ساعة", "3 ساعات", "يوم واحد", "14h", "3h")
  if (parts[nextIdx] && (parts[nextIdx].includes('ساعة') || parts[nextIdx].includes('ساعات') || parts[nextIdx].includes('يوم') || parts[nextIdx].includes('Stunden') || parts[nextIdx].includes('Tag') || /^\d+\s*h$/i.test(parts[nextIdx]))) {
    tr.duration = parts[nextIdx];
    nextIdx++;
  }

  // 4. Detect Description (contains HTML tables or is long text)
  if (parts[nextIdx] && (parts[nextIdx].includes('<table') || parts[nextIdx].length > 100)) {
    tr.description = parts[nextIdx];
    nextIdx++;
  }

  // 5. Gather remaining array parts (highlights, included, notIncluded, extra arrays)
  const arrays = [];
  while (nextIdx < parts.length) {
    if (parts[nextIdx].includes('---تقسيم---') || parts[nextIdx].includes('\n')) {
      const items = parts[nextIdx].split(/---\s*تقسيم\s*---/).map(s => s.trim()).filter(Boolean);
      if (items.length > 0) {
        arrays.push(items);
      }
    } else {
      // Single item fallback
      arrays.push([parts[nextIdx]]);
    }
    nextIdx++;
  }

  if (arrays[0]) tr.highlights = arrays[0];
  if (arrays[1]) tr.included = arrays[1];
  if (arrays[2]) tr.not_included = arrays[2];

  // If there is an array[3] and array[4], they might be FAQ questions & answers
  if (arrays[3] && arrays[4]) {
    const faqs = [];
    const qs = arrays[3];
    const as = arrays[4];
    for (let i = 0; i < Math.max(qs.length, as.length); i++) {
      faqs.push({ question: qs[i] || '', answer: as[i] || '' });
    }
    tr.faqs = faqs;
  }

  return tr;
}

(async () => {
  const { data: rows } = await supabase
    .from('content_translations')
    .select('*')
    .eq('locale', 'ar')
    .eq('table_name', 'tours');

  for (const row of rows) {
    const copy = JSON.parse(JSON.stringify(row));
    const parsed = smartParseEav(copy);
    console.log(`\n========================================`);
    console.log(`TOUR ID: ${row.row_id}`);
    console.log(`Name: ${parsed.name}`);
    console.log(`Short Desc: ${parsed.short_description ? parsed.short_description.substring(0, 50) + '...' : 'NONE'}`);
    console.log(`Category: ${parsed.category_label}`);
    console.log(`Meeting Point: ${parsed.meeting_point}`);
    console.log(`Duration: ${parsed.duration}`);
    console.log(`Description starts with table? ${parsed.description?.includes('<table')}`);
    console.log(`Highlights Count: ${parsed.highlights?.length}`);
    console.log(`Included Count: ${parsed.included?.length}`);
    console.log(`Not Included Count: ${parsed.not_included?.length}`);
    console.log(`FAQs Count: ${parsed.faqs?.length || 0}`);
  }
})();
