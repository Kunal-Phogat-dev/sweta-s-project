'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function fixBalances() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data: businesses } = await supabase.from('businesses').select('*').limit(1);
  const business = businesses?.[0];
  if (!business) return;

  // 1. Delete all cashbook entries for this business
  await supabase.from('cashbook_entries').delete().eq('business_id', business.id);

  // 2. Fetch all current valid transactions
  const { data: sales } = await supabase.from('sales').select('*').eq('business_id', business.id);
  const { data: purchases } = await supabase.from('purchases').select('*').eq('business_id', business.id);
  const { data: expenses } = await supabase.from('expenses').select('*').eq('business_id', business.id);

  // 3. Re-insert cashbook entries
  const newEntries = [];

  for (const s of (sales || [])) {
    newEntries.push({
      business_id: business.id,
      type: 'in',
      amount: s.total,
      mode: 'cash',
      category: 'Sales',
      date: s.date,
      note: 'Auto-recovered'
    });
  }

  for (const p of (purchases || [])) {
    newEntries.push({
      business_id: business.id,
      type: 'out',
      amount: p.total,
      mode: 'cash',
      category: 'Purchases',
      date: p.date,
      note: 'Auto-recovered'
    });
  }

  for (const e of (expenses || [])) {
    newEntries.push({
      business_id: business.id,
      type: 'out',
      amount: e.amount,
      mode: 'cash',
      category: e.category,
      date: e.date,
      note: e.note || 'Auto-recovered'
    });
  }

  if (newEntries.length > 0) {
    await supabase.from('cashbook_entries').insert(newEntries);
  }

  revalidatePath('/dashboard');
}
