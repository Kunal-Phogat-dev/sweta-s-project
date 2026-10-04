'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function deleteTransaction(id: string, type: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data: businesses } = await supabase.from('businesses').select('*').limit(1);
  const business = businesses?.[0];
  if (!business) return;

  const table = type === 'sale' ? 'sales' : type === 'purchase' ? 'purchases' : 'expenses';
  
  // We just soft delete it for safety, or hard delete it
  await supabase.from(table).delete().eq('id', id).eq('business_id', business.id);
  
  revalidatePath('/dashboard');
}
