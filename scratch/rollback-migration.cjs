// ROLLBACK for the pickup_time_slots migration (Steps 1-8).
// Reverts the data footprint that the migration changed. Run only if needed.
// NOTE: CT duration/meeting_point literals are NOT restored here — they were
// overwritten in place and can only be recovered from a pre-migration DB backup.
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { createClient } = require('@supabase/supabase-js');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const MIGRATION = require('./proposed_meeting_point_migration.json');
const LOCALES = ['en', 'ru', 'fr', 'hu', 'ar'];
const FAMILY_ABENDSFARI = '5a9c2e86-9d98-41de-a4c4-54523b45cf13';

(async () => {
  // 1. Null out pickup_time_slots on the 29 tours
  let ok = 0, errs = 0;
  for (const e of MIGRATION) {
    const { error } = await db.from('tours').update({ pickup_time_slots: null }).eq('id', e.tourId);
    if (error) { console.error(`  ❌ ${e.slug}: ${error.message}`); errs++; } else { ok++; }
  }
  console.log(`pickup_time_slots nulled on ${ok} tours (${errs} errors)`);

  // 2. Delete the CT rows created for family-abendsafari (did not exist before)
  let del = 0; errs = 0;
  for (const loc of LOCALES) {
    const { error } = await db.from('content_translations')
      .delete().eq('table_name', 'tours').eq('row_id', FAMILY_ABENDSFARI).eq('locale', loc);
    if (error) { console.error(`  ❌ family-abendsafari[${loc}]: ${error.message}`); errs++; } else { del++; }
  }
  console.log(`family-abendsafari locale rows deleted: ${del} (${errs} errors)`);

  console.log('\n⚠️  CT duration/meeting_point were overwritten and are NOT restored.');
  console.log('   Restore those 145 rows from a pre-migration Supabase backup if needed,');
  console.log('   or re-run the migration (run-data-migration.cjs) to re-apply templates.');
})();
