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
  
  // First, fetch the transaction to get its amount and date
  const { data: transaction } = await supabase.from(table).select('*').eq('id', id).single();
  
  if (transaction) {
    const amount = table === 'expenses' ? transaction.amount : transaction.total;
    const cbType = type === 'sale' ? 'in' : 'out';
    const category = type === 'sale' ? 'Sales' : type === 'purchase' ? 'Purchases' : transaction.category;

    // Delete the linked cashbook entry
    await supabase.from('cashbook_entries')
      .delete()
      .eq('business_id', business.id)
      .eq('amount', amount)
      .eq('type', cbType)
      .eq('category', category)
      .eq('date', transaction.date);
  }

  // Delete the actual transaction
  await supabase.from(table).delete().eq('id', id).eq('business_id', business.id);
  
  revalidatePath('/dashboard');
}
