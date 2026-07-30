require('dotenv').config({path: require('path').join(__dirname, '..', '.env.local')});
const { createClient } = require('@supabase/supabase-js');

(async () => {
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  // Check content_translations
  const { data: cts } = await db.from('content_translations').select('*').eq('table_name', 'tours').eq('locale', 'ar');
  const germanWords = /ß|Uhr|Abholung|Besichtigung|Führung|Mittagessen|Abendessen|Frühstück|Stunden|Tage|Tag|inklusive|exklusive|inbegriffen|kostenlos|Preis|Teilnehmer|Fahrzeug|Limousine|Minibus|Eintritt|Reiseleiter|Schwierigkeit|Mindestalter|Verpflegung|Unterkunft|Trinkgeld|Treffpunkt|Dauer|Ausflug|Schnorchel|Rücktransfer|Wüste|vom\s+Hotel|zum\s+Hafen|im\s+Auto/i;

  let any = false;
  for (const ct of cts) {
    const content = typeof ct.content === 'string' ? JSON.parse(ct.content) : ct.content;
    const allText = [
      ct.name, ct.description, ct.short_description, ct.meeting_point, ct.duration, ct.category_label,
      ...(ct.highlights||[]), ...(ct.included||[]), ...(ct.not_included||[]),
      ...(content||[]).flatMap(c => [c?.title, c?.content]),
      ...(ct.faqs||[]).flatMap(f => [f?.question, f?.answer])
    ].filter(Boolean);
    const remaining = allText.filter(t => germanWords.test(t));
    if (remaining.length > 0) {
      any = true;
      console.log('=== CT row_id:', (ct.row_id||'').substring(0,8), 'id:', ct.id, '===');
      console.log('description:', (ct.description||'').substring(0,300));
      console.log('meeting_point:', ct.meeting_point);
      console.log(remaining.length, 'fields with German:');
      remaining.forEach((t,i) => console.log('  ['+i+']', t.substring(0,250)));
      console.log('');
    }
  }
  if (!any) console.log('No German leftovers in AR content_translations.\n');

  // Check tours for AR content
  const { data: tours } = await db.from('tours').select('id, slug, description');
  let anyTours = false;
  for (const t of tours||[]) {
    if (t.description && germanWords.test(t.description)) {
      anyTours = true;
      console.log('=== TOUR slug:', t.slug, '===');
      console.log(t.description.substring(0,300));
      console.log('');
    }
  }
  if (!anyTours) console.log('No German in tours table.');
})();
