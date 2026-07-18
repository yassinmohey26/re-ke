import { cookies } from 'next/headers';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function auth() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('sb-access-token')?.value;

  if (!accessToken) return null;

  const supabase = getSupabaseAdmin();
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);

  if (error || !user) return null;

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.email,
    },
  };
}
