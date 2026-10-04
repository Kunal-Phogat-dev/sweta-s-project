'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen bg-white text-black flex flex-col selection:bg-pink-200">
      
      {/* Brutalist Nav */}
      <nav className="border-b border-black">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <Link href="/" className="text-2xl font-bold tracking-tighter uppercase hover:bg-black hover:text-white px-2 py-1 transition-none">
            LedgerLite
          </Link>
        </div>
      </nav>

      {/* Login Section */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          
          <div className="border-4 border-black bg-pink-50 p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h1 className="text-4xl font-bold uppercase mb-2 border-b-4 border-black inline-block">Access</h1>
            <p className="font-medium text-lg mb-8 mt-4">Log into your ledger.</p>

            <form onSubmit={handleLogin} className="space-y-6">
              
              <div className="space-y-2">
                <label className="block text-xl font-bold uppercase">Email</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full h-14 border-4 border-black px-4 text-lg font-medium focus:outline-none focus:bg-pink-100 transition-none"
                  placeholder="you@company.com"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xl font-bold uppercase">Password</label>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full h-14 border-4 border-black px-4 text-lg font-medium focus:outline-none focus:bg-pink-100 transition-none"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <div className="bg-black text-white p-4 font-bold border-l-4 border-pink-500">
                  ERROR: {error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full h-16 bg-black text-white text-2xl font-bold uppercase hover:bg-pink-600 active:translate-y-1 active:translate-x-1 active:shadow-none transition-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'WAIT...' : 'ENTER'}
              </button>

            </form>

            <div className="mt-8 pt-8 border-t-4 border-black text-center font-bold">
              No account? <Link href="/signup" className="underline hover:text-pink-600 hover:bg-black px-1 transition-none">Create one.</Link>
            </div>
          </div>

        </div>
      </main>

    </div>
  );
}
