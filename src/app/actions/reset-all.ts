'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function resetAllData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data: businesses } = await supabase.from('businesses').select('*').limit(1);
  const business = businesses?.[0];
  if (!business) return;

  // Delete all data for this business across all tables
  await Promise.all([
    supabase.from('cashbook_entries').delete().eq('business_id', business.id),
    supabase.from('sales').delete().eq('business_id', business.id),
    supabase.from('purchases').delete().eq('business_id', business.id),
    supabase.from('expenses').delete().eq('business_id', business.id)
  ]);

  revalidatePath('/dashboard');
}
