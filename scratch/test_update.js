const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '../.env.local' });
const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/^"+|"+$/g, '');
const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').replace(/^"+|"+$/g, '');
const supabase = createClient(supabaseUrl, supabaseKey);
(async () => {
  console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('Service key:', process.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data, error } = await supabase
    .from('tours')
    .update({ duration: '5h', meeting_point: 'Test Point' })
    .eq('slug', 'mega-safari-hurghada')
    .select('*')
    .single();
  console.log('Data:', data);
  console.error('Error:', error);
})();
