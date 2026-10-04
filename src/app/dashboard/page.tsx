import Link from 'next/link';
import { ArrowRight, Plus, Receipt, LogOut } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary-200 p-4 md:p-8">
      
      {/* Premium Minimalist Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b-2 border-black pb-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter">Dashboard</h1>
          <p className="text-lg font-medium text-gray-500 mt-1">Overview of your business</p>
        </div>
        <Link 
          href="/"
          className="mt-4 md:mt-0 px-5 py-2.5 bg-black text-white font-bold uppercase border-2 border-black hover:bg-primary-600 hover:border-primary-600 transition-colors flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </Link>
      </header>

      {/* Main Balances */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {/* Cash Card */}
        <div className="bg-white border-2 border-black p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
          <h2 className="text-lg font-bold uppercase text-gray-500 mb-6 tracking-widest">Cash In Hand</h2>
          <div className="text-5xl md:text-7xl font-bold tracking-tighter">₹45,200</div>
        </div>

        {/* Bank Card */}
        <div className="bg-primary-50 border-2 border-black p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between relative overflow-hidden">
          <h2 className="text-lg font-bold uppercase text-primary-900 mb-6 tracking-widest relative z-10">Bank Balance</h2>
          <div className="text-5xl md:text-7xl font-bold text-primary-900 tracking-tighter relative z-10">₹1,24,500</div>
          {/* Subtle geometric accent */}
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-primary-200 rounded-full blur-3xl opacity-50 z-0 pointer-events-none"></div>
        </div>
      </div>

      {/* Secondary Balances */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {/* Receivables */}
        <div className="bg-white border-2 border-black p-6 hover:bg-gray-50 transition-colors flex justify-between items-center group cursor-pointer">
          <div>
            <h2 className="text-sm font-bold uppercase text-gray-500 mb-1 tracking-widest">You'll Receive</h2>
            <div className="text-3xl font-bold">₹32,000</div>
          </div>
          <div className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-colors">
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>

        {/* Payables */}
        <div className="bg-white border-2 border-black p-6 hover:bg-gray-50 transition-colors flex justify-between items-center group cursor-pointer">
          <div>
            <h2 className="text-sm font-bold uppercase text-gray-500 mb-1 tracking-widest">You'll Pay</h2>
            <div className="text-3xl font-bold">₹15,400</div>
          </div>
          <div className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Actions Menu */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-xl font-bold uppercase tracking-widest mb-6 border-b-2 border-black pb-2">Actions</h3>
          
          <Link href="/sales/new" className="flex items-center justify-between p-5 bg-black text-white border-2 border-black hover:bg-primary-600 hover:border-primary-600 transition-colors group">
            <span className="text-lg font-bold uppercase">New Sale</span>
            <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
          </Link>
          
          <Link href="/purchases/new" className="flex items-center justify-between p-5 bg-white text-black border-2 border-black hover:bg-gray-100 transition-colors group">
            <span className="text-lg font-bold uppercase">New Purchase</span>
            <Receipt className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          </Link>
          
          <Link href="/expenses/new" className="flex items-center justify-between p-5 bg-white text-black border-2 border-black hover:bg-gray-100 transition-colors group">
            <span className="text-lg font-bold uppercase">Log Expense</span>
            <ArrowRight className="w-6 h-6 group-hover:-rotate-45 transition-transform" />
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <h3 className="text-xl font-bold uppercase tracking-widest mb-6 border-b-2 border-black pb-2">Recent Activity</h3>
          
          <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] divide-y-2 divide-black">
            
            <div className="flex justify-between items-center p-5 hover:bg-primary-50 transition-colors">
              <div>
                <div className="font-bold text-lg uppercase">Sale to Rahul</div>
                <div className="text-gray-500 text-sm font-medium">Today at 14:30</div>
              </div>
              <div className="text-xl font-bold text-primary-600">+₹5,000</div>
            </div>

            <div className="flex justify-between items-center p-5 hover:bg-gray-50 transition-colors">
              <div>
                <div className="font-bold text-lg uppercase">Office Supplies</div>
                <div className="text-gray-500 text-sm font-medium">Yesterday</div>
              </div>
              <div className="text-xl font-bold">-₹1,200</div>
            </div>

            <div className="flex justify-between items-center p-5 hover:bg-gray-50 transition-colors">
              <div>
                <div className="font-bold text-lg uppercase">Supplier XYZ</div>
                <div className="text-gray-500 text-sm font-medium">Oct 2, 2026</div>
              </div>
              <div className="text-xl font-bold">-₹15,000</div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
