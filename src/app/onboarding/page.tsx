'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function OnboardingPage() {
  const [name, setName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    const { data: business, error: insertError } = await supabase.from('businesses').insert({ 
      name, 
      owner_name: ownerName,
      phone: phone,
      user_id: user.id 
    }).select().single();

    if (insertError) {
      setError(insertError.message);
      return;
    }

    if (business) {
      await supabase.from('business_users').insert({ business_id: business.id, user_id: user.id, role: 'admin' });
      router.push('/dashboard');
    }
  }

  return (
    <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Create your business</h1>
        
        {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm font-bold">{error}</div>}

        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1">Business Name</label>
            <input required value={name} onChange={e => setName(e.target.value)} className="w-full h-12 border border-gray-200 rounded-lg px-4" placeholder="Sharma General Store" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Your Name (Owner)</label>
            <input required value={ownerName} onChange={e => setOwnerName(e.target.value)} className="w-full h-12 border border-gray-200 rounded-lg px-4" placeholder="Rahul Sharma" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Phone Number</label>
            <input required value={phone} onChange={e => setPhone(e.target.value)} className="w-full h-12 border border-gray-200 rounded-lg px-4" placeholder="9876543210" />
          </div>

          <button type="submit" className="w-full h-12 bg-black text-white font-bold rounded-lg hover:bg-pink-600 transition-colors mt-4">
            Continue to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
