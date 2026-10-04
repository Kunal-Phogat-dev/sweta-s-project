import Link from 'next/link';
import { ArrowRight, Plus, Receipt, LogOut } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-white text-black selection:bg-pink-200 p-4 md:p-8">
      
      {/* Brutalist Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b-4 border-black pb-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Dashboard</h1>
          <p className="text-xl font-bold mt-2">Welcome back, Boss.</p>
        </div>
        <Link 
          href="/"
          className="mt-4 md:mt-0 px-4 py-2 bg-pink-500 text-white font-black uppercase border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-none flex items-center gap-2"
        >
          <LogOut className="w-5 h-5" /> Logout
        </Link>
      </header>

      {/* Main Balances */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Cash Card - Yellow */}
        <div className="bg-yellow-300 border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-2xl font-black uppercase border-b-4 border-black inline-block mb-6">Cash In Hand</h2>
          <div className="text-5xl md:text-7xl font-black">₹45,200</div>
        </div>

        {/* Bank Card - Blue */}
        <div className="bg-cyan-300 border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-2xl font-black uppercase border-b-4 border-black inline-block mb-6">Bank Balance</h2>
          <div className="text-5xl md:text-7xl font-black">₹1,24,500</div>
        </div>
      </div>

      {/* Secondary Balances */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Receivables - Green */}
        <div className="bg-green-400 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black uppercase mb-2">You'll Receive</h2>
            <div className="text-4xl font-black">₹32,000</div>
          </div>
          <ArrowRight className="w-12 h-12" />
        </div>

        {/* Payables - Pink */}
        <div className="bg-pink-400 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black uppercase mb-2">You'll Pay</h2>
            <div className="text-4xl font-black">₹15,400</div>
          </div>
          <ArrowRight className="w-12 h-12" />
        </div>
      </div>

      {/* Quick Actions & Recent */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Actions Menu */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-3xl font-black uppercase mb-6">Actions</h3>
          
          <Link href="/sales/new" className="flex items-center justify-between p-4 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-300 hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-none group">
            <span className="text-xl font-black uppercase">New Sale</span>
            <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform" />
          </Link>
          
          <Link href="/purchases/new" className="flex items-center justify-between p-4 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-cyan-300 hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-none group">
            <span className="text-xl font-black uppercase">New Purchase</span>
            <Receipt className="w-8 h-8 group-hover:rotate-12 transition-transform" />
          </Link>
          
          <Link href="/expenses/new" className="flex items-center justify-between p-4 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-pink-400 hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-none group">
            <span className="text-xl font-black uppercase">Log Expense</span>
            <ArrowRight className="w-8 h-8 group-hover:-rotate-45 transition-transform" />
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <h3 className="text-3xl font-black uppercase mb-6">Recent Activity</h3>
          <div className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-0">
            
            <div className="flex justify-between items-center p-4 border-b-4 border-black hover:bg-gray-100">
              <div>
                <div className="font-black text-lg uppercase">Sale to Rahul</div>
                <div className="text-gray-600 font-bold">Today</div>
              </div>
              <div className="text-2xl font-black text-green-600">+₹5,000</div>
            </div>

            <div className="flex justify-between items-center p-4 border-b-4 border-black hover:bg-gray-100">
              <div>
                <div className="font-black text-lg uppercase">Office Supplies</div>
                <div className="text-gray-600 font-bold">Yesterday</div>
              </div>
              <div className="text-2xl font-black text-pink-600">-₹1,200</div>
            </div>

            <div className="flex justify-between items-center p-4 hover:bg-gray-100">
              <div>
                <div className="font-black text-lg uppercase">Purchase from Supplier XYZ</div>
                <div className="text-gray-600 font-bold">Oct 2, 2026</div>
              </div>
              <div className="text-2xl font-black text-pink-600">-₹15,000</div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
