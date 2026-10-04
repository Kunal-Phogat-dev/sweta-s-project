import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-black selection:bg-pink-200">
      
      {/* Brutalist / Minimalist Navigation */}
      <nav className="border-b border-black">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tighter uppercase">
            LedgerLite
          </div>
          
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-bold underline hover:no-underline">
              Log in
            </Link>
            <Link 
              href="/signup" 
              className="px-5 py-2 text-sm font-bold bg-black text-white hover:bg-pink-600 transition-none"
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Utilitarian Hero Section */}
      <section className="border-b border-black">
        <div className="mx-auto max-w-7xl px-4 py-24 md:py-32 grid md:grid-cols-2 gap-12 items-end">
          
          <div>
            <h1 className="text-6xl md:text-8xl font-bold leading-none tracking-tighter uppercase mb-8">
              Stop 
              <br />losing 
              <br />money.
            </h1>
            <p className="text-xl font-medium max-w-md mb-12">
              Accounting software usually sucks. We built a ledger that doesn't. 
              Just record what goes in, record what goes out, and go back to running your business.
            </p>
            
            <Link 
              href="/signup" 
              className="inline-flex items-center gap-3 px-8 py-4 text-lg font-bold bg-black text-white hover:bg-pink-600 transition-none w-full md:w-auto justify-center"
            >
              Create Account <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Stark, no-glow mockup */}
          <div className="border-4 border-black bg-pink-50 aspect-square p-8 flex flex-col justify-end relative shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-4xl font-bold mb-4">Cashflow</div>
            <div className="w-full h-1 bg-black mb-4"></div>
            <div className="flex justify-between font-bold text-xl">
              <span>IN</span>
              <span>₹45,000</span>
            </div>
            <div className="flex justify-between font-bold text-xl mt-2">
              <span>OUT</span>
              <span>₹12,000</span>
            </div>
          </div>
          
        </div>
      </section>

      {/* Direct, non-bento feature list */}
      <section className="mx-auto max-w-7xl px-4 py-24">
        <h2 className="text-4xl font-bold uppercase mb-16 border-b-4 border-black inline-block">The hard truth</h2>
        
        <div className="space-y-12 max-w-3xl font-medium text-xl">
          <div className="pl-6 border-l-4 border-pink-500">
            <strong className="block text-2xl font-bold mb-2">1. Spreadsheets break.</strong>
            You are one accidental keyboard smash away from deleting your entire customer history. LedgerLite locks down your data in a real database.
          </div>
          
          <div className="pl-6 border-l-4 border-black">
            <strong className="block text-2xl font-bold mb-2">2. You forget who owes you.</strong>
            If you don't write down exactly who took credit, you lose that money forever. We track every single unpaid invoice automatically.
          </div>
          
          <div className="pl-6 border-l-4 border-pink-500">
            <strong className="block text-2xl font-bold mb-2">3. Complex tools waste time.</strong>
            No "synergy" features. No AI chatbots. Just a raw, blazing fast form to log your daily sales and expenses.
          </div>
        </div>
      </section>

      {/* Utilitarian Footer */}
      <footer className="bg-black text-white py-12">
        <div className="mx-auto max-w-7xl px-4 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="text-2xl font-bold uppercase tracking-tighter mb-4 md:mb-0">
            LedgerLite
          </div>
          <div className="text-sm font-bold text-gray-400">
            © {new Date().getFullYear()} No Rights Reserved. Built for builders.
          </div>
        </div>
      </footer>

    </div>
  );
}
