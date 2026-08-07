// scripts/migrate-tours-de-dryrun.js
/**
 * Dry‑run migration script for German (`de`) content_translations.
 *
 * Steps:
 *   1. Load all tours.
 *   2. Load the matching `de` translation row for each tour.
 *   3. Compare the fields that should now live on the base `tours` table.
 *   4. Print a tabular report and a short summary.
 *   5. No data is written – this is a DRY‑RUN only.
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
// Load Supabase configuration from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl) {
  console.error('❌ ERROR: NEXT_PUBLIC_SUPABASE_URL is not set in the environment.');
  process.exit(1);
}
if (!supabaseKey) {
  console.error('❌ ERROR: SUPABASE_SERVICE_ROLE_KEY is not set in the environment.');
  process.exit(1);
}
const supabase = createClient(supabaseUrl, supabaseKey);

// Helper to safely truncate strings for reporting
const truncate = (value, length = 50) => {
  if (value === null || value === undefined) return '';
  const str = String(value);
  return str.length > length ? str.slice(0, length) + '…' : str;
};

// Fields we care about (both in tours and in the translation row)
const FIELDS = [
  'short_description',
  'description',
  'category_label',
  'highlights',
  'included',
  'not_included',
  'duration',
  'meeting_point',
];

(async () => {
  // const supabase = getSupabaseAdmin();

  console.log('Fetching all tours...');
  const { data: tours, error: toursError } = await supabase.from('tours').select('*');
  if (toursError) {
    console.error('Error fetching tours:', toursError);
    process.exit(1);
  }

  let totalChecked = 0;
  let toursWithUpdates = 0;
  const reportRows = [];

  for (const tour of tours) {
    totalChecked++;
    const { data: tr, error: trError } = await supabase
      .from('content_translations')
      .select('*')
      .eq('table_name', 'tours')
      .eq('row_id', tour.id)
      .eq('locale', 'de')
      .single();

    if (trError) {
      // No German translation – skip
      continue;
    }

    // Determine if any field would change
    let hasChange = false;
    for (const field of FIELDS) {
      const baseVal = tour[field];
      const trVal = tr[field];
      const trHasValue = trVal !== null && trVal !== undefined && String(trVal).trim() !== '';
      const different = trHasValue && String(baseVal) !== String(trVal);

      if (different) hasChange = true;

      reportRows.push({
        slug: tour.slug,
        field,
        base: truncate(baseVal),
        translation: truncate(trVal),
        update: different ? 'yes' : 'no',
      });
    }

    if (hasChange) toursWithUpdates++;
  }

  // Print the table – using console.table for readability
  console.log('\n=== Migration DRY‑RUN Report ===');
  console.table(reportRows);

  // Summary
  console.log('\n--- Summary ---');
  console.log(`Total tours checked: ${totalChecked}`);
  console.log(`Tours with at least one field that would be updated: ${toursWithUpdates}`);
  console.log('\nRun the actual migration by adapting this script to perform the upserts.');
})();
