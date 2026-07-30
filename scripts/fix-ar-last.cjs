require('dotenv').config({path: require('path').join(__dirname, '..', '.env.local')});
const { createClient } = require('@supabase/supabase-js');
const IS_DRY_RUN = !process.argv.includes('--execute');

const MAP = new Map([
  ['Zwei Stopps an farbenprächtigen Riffen mit beeindruckender Unterwasserwelt.',
    'محطتان في شعاب مرجانية ملونة مع عالم تحت مائي رائع.'],
  ['Banana Boat und Sofa Boat unter professioneller Aufsicht und mit moderner Sicherheitsausrüstung.',
    ' Banana Boat و Sofa Boat تحت إشراف محترف وبمعدات سلامة حديثة.'],
  ['In der Innenstadt erwarten Sie Cafés, Boutiquen, Kunsthandwerk und kleine Plätze. Sie schlendern entspannt und geniessen das moderne Flair der Stadt.',
    'في وسط المدينة تنتظرك مقاهي وبوتيكات وحرف يدوية وساحات صغيرة. تتجول باسترخاء وتستمتع بأجواء المدينة العصرية.'],
  ['1–2 جلسات غطس an den schönsten Riffen des Roten Meeres.',
    '1–2 جلسات غطس في أجمل شعاب البحر الأحمر.'],
  ['Erleben Sie den spektakulären 24 Meter langen Unterwassertunnel und beobachten Sie Haie, Rochen und zahlreiche Fischarten aus nächster Nähe – ein unvergessliches Erlebnis für die ganze Familie.',
    'اختبر النفق تحت الماء المذهل بطول 24 متراً وشاهد أسماك القرش والراي وأنواعاً عديدة من الأسماك عن قرب – تجربة لا تنسى للعائلة بأكملها.'],
  ['الاستلام um تقريباً 06:00  مباشرة من فندقك in Hurghada. الذهاب إلى دندرة (تقريباً 230 km, klimatisiertes المركبة).',
    'الاستقبال حوالي الساعة 06:00 مباشرة من فندقك في الغردقة. الذهاب إلى دندرة (حوالي 230 كم بسيارة مكيفة).'],
]);

(async () => {
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data: cts } = await db.from('content_translations').select('*').eq('table_name', 'tours').eq('locale', 'ar');
  let updates = 0;
  for (const ct of cts) {
    const content = typeof ct.content === 'string' ? JSON.parse(ct.content) : ct.content;
    if (!Array.isArray(content)) continue;
    const newContent = content.map(item => {
      const n = { ...item };
      if (item.content && MAP.has(item.content)) n.content = MAP.get(item.content);
      return n;
    });
    if (JSON.stringify(content) !== JSON.stringify(newContent)) {
      updates++;
      if (IS_DRY_RUN) {
        for (let i = 0; i < content.length; i++) {
          if (content[i].content !== newContent[i].content) {
            console.log(`[${(ct.row_id||'').substring(0,8)}][${i}]:`);
            console.log(`  OLD: ${content[i].content.substring(0,150)}`);
            console.log(`  NEW: ${newContent[i].content.substring(0,150)}\n`);
          }
        }
      } else {
        await db.from('content_translations').update({ content: JSON.stringify(newContent) }).eq('id', ct.id);
      }
    }
  }
  console.log(`Mode: ${IS_DRY_RUN ? 'DRY RUN' : 'EXECUTE'} — ${updates} rows`);
})();
