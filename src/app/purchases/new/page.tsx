import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function NewPurchasePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: businesses } = await supabase.from('businesses').select('*').limit(1);
  const business = businesses?.[0];
  if (!business) redirect('/onboarding');

  async function createPurchase(formData: FormData) {
    'use server';
    const supabase = await createClient();
    const amount = Number(formData.get('amount'));
    const description = formData.get('description');
    const date = new Date().toISOString();

    const { data: purchase, error: purchaseError } = await supabase.from('purchases').insert({
      business_id: business.id,
      bill_number: `BILL-${Date.now()}`,
      gst_amount: 0,
      total: amount,
      subtotal: amount,
      amount_paid: amount,
      date: date,
      status: 'paid'
    }).select().single();

    if (purchaseError) {
      console.error(purchaseError);
    }

    if (purchase) {
      await supabase.from('cashbook_entries').insert({
        business_id: business.id,
        type: 'out',
        amount: amount,
        mode: 'cash',
        category: 'Purchases',
        date: date,
        note: description
      });
    }
    
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-[#fafaf9] text-[#1c1917] p-4 md:p-8 flex justify-center items-center">
      <div className="w-full max-w-lg bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        
        <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
          <h1 className="text-2xl font-bold tracking-tight">New Purchase</h1>
          <Link href="/dashboard" className="text-sm font-semibold text-gray-500 hover:text-black">Cancel</Link>
        </div>

        <form action={createPurchase} className="space-y-6">
          <div>
            <label className="block text-sm font-bold mb-2">Description</label>
            <input 
              type="text" 
              name="description" 
              required
              className="w-full h-12 border border-gray-200 rounded-lg px-4 bg-gray-50 focus:bg-white focus:border-black outline-none transition-colors"
              placeholder="e.g. 10x Inventory Boxes"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Total Amount (₹)</label>
            <input 
              type="number" 
              name="amount" 
              required
              min="1"
              className="w-full h-14 border border-gray-200 rounded-lg px-4 text-2xl font-bold bg-gray-50 focus:bg-white focus:border-black outline-none transition-colors"
              placeholder="0"
            />
          </div>

          <button 
            type="submit" 
            className="w-full h-14 bg-black text-white font-bold rounded-lg hover:bg-pink-600 transition-colors mt-4 text-lg"
          >
            Record Purchase
          </button>
        </form>

      </div>
    </div>
  );
}
