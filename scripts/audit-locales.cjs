require('dotenv').config({path:require('path').join(__dirname,'..','.env.local')});
const {createClient} = require('@supabase/supabase-js');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const slugs = [
  'privater-pyramiden-ausflug-ab-hurghada-sakkara-dahschur-gizeh',
  'kairo-mit-flug-ab-hurghada-pyramiden-museum',
  'luxor-tagesausflug-ab-hurghada',
  'super-safari-hurghada',
  'privater-tagesausflug-von-hurghada-nach-kairo-pyramiden-grand-egyptian-museum',
  'mini-egypt-park-hurghada',
  'naechtliche-stadtrundfahrt-durch-hurghada-private-tour',
  'luxor-tagesausflug-heissluftballon-hoteluebernachtung',
  'mahmya-insel-ausflug-hurghada',
  'hula-hula-insel-schnorchelausflug-hurghada',
  'dendera-halbtagesausflug-ab-hurghada-der-authentische-besuch-im-hathor-tempel',
];

(async()=>{
  const {data: tours} = await db.from('tours').select('id, slug, duration, meeting_point').in('slug', slugs);
  for (const t of tours || []) {
    console.log('\n=== ' + t.slug + ' ===');
    console.log('BASE | duration: ' + JSON.stringify(t.duration) + ' | meeting_point: ' + JSON.stringify(t.meeting_point));
    const {data: trs} = await db.from('content_translations')
      .select('locale, duration, meeting_point')
      .eq('table_name', 'tours')
      .eq('row_id', t.id)
      .in('locale', ['de', 'en', 'fr', 'ru', 'hu', 'ar']);
    for (const r of trs || []) {
      console.log('  [' + r.locale + '] duration: ' + JSON.stringify(r.duration) + ' | meeting_point: ' + JSON.stringify(r.meeting_point));
    }
  }
})();
