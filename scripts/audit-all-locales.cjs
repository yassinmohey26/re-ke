require('dotenv').config({path:require('path').join(__dirname,'..','.env.local')});
const {createClient} = require('@supabase/supabase-js');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

(async()=>{
  // Get ALL tours with their base data
  const {data: tours} = await db.from('tours').select('id, slug, duration, meeting_point, name').order('slug');
  
  let issues = [];
  
  for (const t of tours || []) {
    const {data: trs} = await db.from('content_translations')
      .select('locale, duration, meeting_point')
      .eq('table_name', 'tours')
      .eq('row_id', t.id)
      .in('locale', ['de', 'en', 'fr', 'ru', 'hu', 'ar']);
    
    const deRow = (trs||[]).find(r => r.locale === 'de');
    const deDuration = deRow?.duration || t.duration;
    const deMeeting = deRow?.meeting_point || t.meeting_point;
    
    // Duration should be a duration-like value (contains "Stunden", "hours", "h", "ساعة", etc.)
    // Meeting point should be a pickup time (contains "ca.", "Uhr", ":", "around", "approximately", etc.)
    const durationKeywords = /Stunden|hours|h\b|час|ساعة|Tag|day|hour|óra|godzin/;
    const timeKeywords = /Uhr|ca\.|approx|окол|حوالي|kb\.|vers|env\.|примерно/;
    
    for (const r of trs || []) {
      if (r.locale === 'de') continue;
      
      // Check if duration looks like a time/location rather than a duration
      if (r.duration && t.duration && !durationKeywords.test(r.duration) && durationKeywords.test(t.duration)) {
        issues.push({ slug: t.slug, locale: r.locale, field: 'duration', base: t.duration, value: r.duration });
      }
      // Check if meeting_point looks like a location rather than a pickup time
      if (r.meeting_point && t.meeting_point && !timeKeywords.test(r.meeting_point) && timeKeywords.test(t.meeting_point)) {
        issues.push({ slug: t.slug, locale: r.locale, field: 'meeting_point', base: t.meeting_point, value: r.meeting_point });
      }
    }
  }
  
  console.log('\n=== ISSUES FOUND ===');
  if (issues.length === 0) {
    console.log('None found.');
  } else {
    for (const i of issues) {
      console.log(i.slug + ' [' + i.locale + '] ' + i.field + ': "' + i.value + '" (expected duration-like, got something else). Base: "' + i.base + '"');
    }
  }
  
  console.log('\n=== DETAILED DUMP OF ALL AFFECTED ===');
  // Re-query just the problematic ones for full detail
  const badSlugs = [...new Set(issues.map(i => i.slug))];
  if (badSlugs.length > 0) {
    const {data: btours} = await db.from('tours').select('id, slug, duration, meeting_point').in('slug', badSlugs);
    for (const t of btours || []) {
      console.log('\n--- ' + t.slug + ' ---');
      console.log('BASE_DUR: ' + JSON.stringify(t.duration));
      console.log('BASE_MP: ' + JSON.stringify(t.meeting_point));
      const {data: trs} = await db.from('content_translations')
        .select('locale, duration, meeting_point')
        .eq('table_name', 'tours')
        .eq('row_id', t.id)
        .in('locale', ['en', 'fr', 'ru', 'hu', 'ar', 'de']);
      for (const r of trs || []) {
        console.log('  [' + r.locale + '] DUR: ' + JSON.stringify(r.duration) + ' | MP: ' + JSON.stringify(r.meeting_point));
      }
    }
  }
})();
