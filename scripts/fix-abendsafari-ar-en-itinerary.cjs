const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local', quiet: true });

const ROW_ID = '5a9c2e86-9d98-41de-a4c4-54523b45cf13';

const arItinerary = [
  { title: '1. الاستقبال من الفندق', content: 'نقل مريح من فندقك إلى محطة السفاري في الغردقة.' },
  { title: '2. الإرشاد والتحضير', content: 'قبل الانطلاق ستتلقى إرشادات السلامة ومعلومات مهمة حول التعامل مع المركبات.' },
  { title: '3. جولة رباعية عبر الصحراء', content: 'استمتع بنحو 30 إلى 40 دقيقة من متعة القيادة بالدراجة الرباعية عبر المناظر الصحراوية الرائعة حول الغردقة.' },
  { title: '4. جولة سيارة سبايدر', content: 'بعد ذلك تنتظرك جولة بسيارة سبايدر لمدة تتراوح بين 10 و15 دقيقة، لتكون بذلك تجربة القيادة الثانية في السفاري.' },
  { title: '5. العشاء', content: 'بعد أنشطة القيادة استمتع بعشاء جماعي واسترخِ بعد مغامرتك في الصحراء.' },
  { title: '6. عرض ترفيهي', content: 'استمتع بعرض يضمن لك ختاماً ترفيهياً ممتعاً لسفاري العائلة.' },
  { title: '7. العودة إلى الفندق', content: 'بعد انتهاء البرنامج يتم نقلك براحة تامة إلى فندقك.' },
];

const enItinerary = [
  { title: '1. Hotel Pick-Up', content: 'Comfortable transfer from your hotel to the safari station in Hurghada.' },
  { title: '2. Safety Briefing & Preparation', content: 'Before the start, you will receive a safety briefing and important information on how to handle the vehicles.' },
  { title: '3. Quad Ride through the Desert', content: 'Experience around 30 to 40 minutes of riding fun on the quad through the impressive desert landscape around Hurghada.' },
  { title: '4. Spider Car Ride', content: 'Afterwards, a 10 to 15 minute Spider Car ride awaits you — the second driving experience of the safari.' },
  { title: '5. Dinner', content: 'After the driving activities, enjoy a shared dinner and recover from your desert adventure.' },
  { title: '6. Entertaining Show', content: 'Look forward to a show that provides an entertaining finale to your Family Safari.' },
  { title: '7. Return Transfer to the Hotel', content: 'After the program, you will be comfortably taken back to your hotel.' },
];

(async () => {
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  const updates = [
    { locale: 'ar', expectedId: 1056, itinerary: arItinerary },
    { locale: 'en', expectedId: 1052, itinerary: enItinerary },
  ];

  for (const u of updates) {
    const { data: rows } = await db
      .from('content_translations')
      .select('id, row_id, locale, name')
      .eq('row_id', ROW_ID)
      .eq('locale', u.locale)
      .eq('table_name', 'tours');

    const row = rows?.[0];
    if (!row) {
      console.log(`[skip] no ${u.locale} row found for ${ROW_ID}`);
      continue;
    }
    if (row.id !== u.expectedId) {
      console.log(`[skip] ${u.locale} row id mismatch: expected ${u.expectedId}, got ${row.id}`);
      continue;
    }

    const { error } = await db
      .from('content_translations')
      .update({ itinerary: u.itinerary })
      .eq('id', row.id);

    if (error) {
      console.log(`[error] ${u.locale} (id ${row.id}): ${error.message}`);
    } else {
      console.log(`[ok] ${u.locale} (id ${row.id}) itinerary set (${u.itinerary.length} steps)`);
    }
  }

  const { data: verify } = await db
    .from('content_translations')
    .select('id, locale, itinerary')
    .eq('row_id', ROW_ID)
    .eq('table_name', 'tours')
    .in('locale', ['ar', 'en'])
    .order('id', { ascending: true });

  fs.writeFileSync('scripts/_abendsafari-verify.json', JSON.stringify(verify, null, 2));
  console.log('verify dump written to scripts/_abendsafari-verify.json');
})();
