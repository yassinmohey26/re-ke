import { getSupabaseAdmin } from '@/lib/supabase';
(async () => {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('tours')
    .update({ duration: '5h', meeting_point: 'Test Point' })
    .eq('slug', 'mega-safari-hurghada')
    .select('*')
    .single();
  console.log('Result:', data);
  console.error('Error:', error);
})();
