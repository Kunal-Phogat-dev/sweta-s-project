'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function OnboardingPage() {
  const [name, setName] = useState('');
  const router = useRouter();
  const supabase = createClient();

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    const { data: business } = await supabase.from('businesses').insert({ name, user_id: user.id }).select().single();
    if (business) {
      await supabase.from('business_users').insert({ business_id: business.id, user_id: user.id, role: 'admin' });
      router.push('/dashboard');
    }
  }

  return (
    <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Name your business</h1>
        <form onSubmit={handleCreate} className="space-y-4">
          <input 
            required 
            value={name} 
            onChange={e => setName(e.target.value)}
            className="w-full h-12 border border-gray-200 rounded-lg px-4" 
            placeholder="Sharma General Store" 
          />
          <button type="submit" className="w-full h-12 bg-black text-white font-bold rounded-lg hover:bg-pink-600 transition-colors">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
