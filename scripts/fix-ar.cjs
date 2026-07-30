require('dotenv').config({path: require('path').join(__dirname, '..', '.env.local')});
const { createClient } = require('@supabase/supabase-js');

const IS_DRY_RUN = !process.argv.includes('--execute');

const AR_REPLACEMENTS = [
  // Pricing table leftovers (should be gone after migration, but just in case)
  [/\bTeilnehmer\b/g, 'المشاركون'],
  [/\bFahrzeug\b/g, 'المركبة'],
  [/\bPreis\b/g, 'السعر'],
  [/\bPrivater\b/g, 'خاص'],
  [/\bPrivates\b/g, 'خاص'],
  [/\bPrivaten\b/g, 'خاص'],
  [/\bLimousine\b/g, 'سيارة'],
  [/\bMinibus\b/g, 'حافلة صغيرة'],
  [/\bSpeedboot\b/g, 'قارب سريع'],
  [/\bkostenlos\b/g, 'مجاني'],

  // Itinerary / content
  [/\bAbholung\b/g, 'الاستقبال'],
  [/\bAbendessen\b/g, 'العشاء'],
  [/\bMittagessen\b/g, 'الغداء'],
  [/\bFrühstück\b/g, 'الإفطار'],
  [/\bBesichtigung\b/g, 'زيارة'],
  [/\bFührung\b/g, 'جولة'],
  [/\binbegriffen\b/g, 'متضمن'],
  [/\bnicht\s+inbegriffen\b/gi, 'غير متضمن'],
  [/\binklusive\b/gi, 'متضمن'],
  [/\bexklusive\b/gi, 'غير متضمن'],
  [/\bEintritt\b/g, 'الدخول'],
  [/\bEintrittskarten\b/g, 'تذاكر الدخول'],

  // Time / duration
  [/\bStunden\b/g, 'ساعات'],
  [/\bTage\b/g, 'أيام'],
  [/\bTag\b(?!e\b|s\b)/g, 'يوم'],
  [/\bNacht\b/g, 'ليلة'],

  // People
  [/\bReiseleiter\b/g, 'مرشد سياحي'],
  [/\bReiseführer\b/gi, 'مرشد سياحي'],

  // Other
  [/\bSchwierigkeit\b/g, 'الصعوبة'],
  [/\bMindestalter\b/g, 'الحد الأدنى للعمر'],
  [/\bMaximale\s+Teilnehmer\b/g, 'الحد الأقصى للمشاركين'],
  [/\bVerpflegung\b/g, 'الوجبات'],
  [/\bUnterkunft\b/g, 'الإقامة'],
  [/\bTrinkgeld\b/g, 'الإكرامية'],
  [/\bRücktransfer\b/gi, 'العودة'],
  [/\bTreffpunkt\b/g, 'نقطة الالتقاء'],
  [/\bDauer\b/g, 'المدة'],
  [/\bAusflug\b/g, 'رحلة'],
  [/\bSchnorchel\b/g, 'الغطس'],
  [/\bSchnorchelausflug\b/g, 'رحلة غطس'],
  [/\bp\.\s*P\.\b/g, 'للشخص'],
  [/\bAuf\s+Anfrage\b/g, 'حسب الطلب'],

  // Meeting point prefixes
  [/\bca\.\s*(\d{1,2}:\d{2})\s*Uhr\b/g, 'نحو الساعة $1'],
  [/\bca\.\s*(\d{1,2}:\d{2})\b/g, 'نحو الساعة $1'],
  [/\bUhr\b/g, ''],

  // German ß → ss
  [/ß/g, 'ss'],
];

function applyReplacements(text) {
  if (!text || typeof text !== 'string') return text;
  let result = text;
  for (const [pattern, replacement] of AR_REPLACEMENTS) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

async function main() {
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  // Fetch all AR content_translations for tours
  const { data: cts, error } = await db.from('content_translations')
    .select('*')
    .eq('table_name', 'tours')
    .eq('locale', 'ar');
  if (error) { console.error('Fetch error:', error); process.exit(1); }

  console.log(`Fetched ${cts.length} AR content_translations\n`);

  const TEXT_FIELDS = ['name', 'description', 'short_description', 'category_label', 'meeting_point', 'duration'];
  const ARRAY_FIELDS = ['highlights', 'included', 'not_included'];
  const JSON_FIELDS = ['content', 'faqs'];

  let totalChanges = 0;
  let totalFieldsChanged = 0;
  let toursChanged = 0;
  const updates = [];

  for (const ct of cts) {
    const changes = {};
    let fieldsChanged = 0;

    // Text fields
    for (const key of TEXT_FIELDS) {
      const oldVal = ct[key] || '';
      const newVal = applyReplacements(oldVal);
      if (newVal !== oldVal) {
        changes[key] = { old: oldVal.substring(0, 100), new: newVal.substring(0, 100) };
        changes[key + '_full'] = { old: oldVal, new: newVal };
        fieldsChanged++;
      }
    }

    // Array fields
    for (const key of ARRAY_FIELDS) {
      const arr = ct[key] || [];
      const newArr = arr.map(item => applyReplacements(item));
      const hasChange = arr.some((item, i) => item !== newArr[i]);
      if (hasChange) {
        changes[key] = { old: JSON.stringify(arr).substring(0, 100), new: JSON.stringify(newArr).substring(0, 100) };
        changes[key + '_full'] = { old: arr, new: newArr };
        fieldsChanged++;
      }
    }

    // Content (itinerary JSON)
    try {
      const content = JSON.parse(ct.content || '[]');
      if (Array.isArray(content)) {
        const newContent = content.map(item => {
          const newItem = { ...item };
          if (item.title) newItem.title = applyReplacements(item.title);
          if (item.content) newItem.content = applyReplacements(item.content);
          return newItem;
        });
        const hasChange = JSON.stringify(content) !== JSON.stringify(newContent);
        if (hasChange) {
          changes['content'] = { old: JSON.stringify(content).substring(0, 100), new: JSON.stringify(newContent).substring(0, 100) };
          changes['content_full'] = { old: content, new: newContent };
          fieldsChanged++;
        }
      }
    } catch {}

    // FAQs
    try {
      const faqs = ct.faqs || [];
      if (Array.isArray(faqs)) {
        const newFaqs = faqs.map(faq => {
          const newFaq = { ...faq };
          if (faq.question) newFaq.question = applyReplacements(faq.question);
          if (faq.answer) newFaq.answer = applyReplacements(faq.answer);
          return newFaq;
        });
        const hasChange = JSON.stringify(faqs) !== JSON.stringify(newFaqs);
        if (hasChange) {
          changes['faqs'] = { old: JSON.stringify(faqs).substring(0, 100), new: JSON.stringify(newFaqs).substring(0, 100) };
          changes['faqs_full'] = { old: faqs, new: newFaqs };
          fieldsChanged++;
        }
      }
    } catch {}

    if (fieldsChanged > 0) {
      toursChanged++;
      totalFieldsChanged += fieldsChanged;
      const totalWordChanges = Object.keys(changes).filter(k => !k.endsWith('_full')).length;
      totalChanges += totalWordChanges;
      updates.push({ id: ct.id, row_id: ct.row_id, slug: ct.row_id?.substring(0, 8) || '?', fieldsChanged, changes });
    }
  }

  // === PREVIEW ===
  console.log('=== AR TRANSLATION FIX PREVIEW ===\n');
  console.log(`Mode: ${IS_DRY_RUN ? 'DRY RUN' : 'EXECUTE'}`);
  console.log(`AR translations with German leftovers: ${toursChanged}/${cts.length}`);
  console.log(`Fields to fix: ${totalFieldsChanged}`);
  console.log(`Individual word/phrase replacements: ${totalChanges}\n`);

  for (const u of updates) {
    console.log(`--- Row ${u.row_id} (${u.slug}) - ${u.fieldsChanged} fields ---`);
    for (const [key, val] of Object.entries(u.changes)) {
      if (key.endsWith('_full')) continue;
      console.log(`  ${key}:`);
      console.log(`    OLD: ${val.old}`);
      console.log(`    NEW: ${val.new}`);
    }
    console.log('');
  }

  // === EXECUTE ===
  if (!IS_DRY_RUN) {
    console.log('\n=== EXECUTING ===\n');
    let done = 0;
    let errors = 0;

    for (const u of updates) {
      const updateData = {};
      for (const [key, val] of Object.entries(u.changes)) {
        if (key.endsWith('_full')) {
          const baseKey = key.replace('_full', '');
          updateData[baseKey] = val.new;
        }
      }

      const { error: updateErr } = await db.from('content_translations')
        .update(updateData)
        .eq('id', u.id);

      if (updateErr) {
        console.error(`  ERROR updating row ${u.id}: ${updateErr.message}`);
        errors++;
      } else {
        done++;
      }
    }

    console.log(`\nDone. Updated ${done} rows, ${errors} errors.`);
  } else {
    console.log('\nDry-run complete. Run with --execute to apply changes.');
  }
}

main().catch(e => { console.error(e); process.exit(1); });
