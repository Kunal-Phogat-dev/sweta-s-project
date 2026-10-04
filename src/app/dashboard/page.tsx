import Link from 'next/link';
import { ArrowRight, Plus, Receipt, LogOut } from 'lucide-react';
import { CashflowChart } from '@/components/dashboard/cashflow-chart';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#fafaf9] text-[#1c1917] selection:bg-pink-200">
      
      {/* Ultra Clean Topbar */}
      <header className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 md:px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black rounded-lg"></div>
            <h1 className="text-xl font-bold tracking-tight">LedgerLite</h1>
          </div>
          <Link 
            href="/"
            className="text-sm font-semibold text-gray-500 hover:text-black flex items-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 md:px-8 py-12">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-gray-500 mt-1">Here's what's happening today.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/expenses/new" className="hidden md:flex px-4 py-2.5 bg-white text-black font-semibold rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm items-center gap-2">
              <Receipt className="w-4 h-4" /> Log Expense
            </Link>
            <Link href="/sales/new" className="px-4 py-2.5 bg-black text-white font-semibold rounded-lg hover:bg-pink-600 transition-colors shadow-sm flex items-center gap-2">
              <Plus className="w-4 h-4" /> New Sale
            </Link>
          </div>
        </div>

        {/* Clean Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-32">
            <div className="text-sm font-semibold text-gray-500">Cash in Hand</div>
            <div className="text-3xl font-bold">₹45,200</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-32">
            <div className="text-sm font-semibold text-gray-500">Bank Balance</div>
            <div className="text-3xl font-bold">₹1,24,500</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group">
            <div className="text-sm font-semibold text-gray-500">Receivables</div>
            <div className="text-3xl font-bold">₹32,000</div>
            <div className="absolute right-0 top-0 bottom-0 w-1 bg-green-400 group-hover:w-2 transition-all"></div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group">
            <div className="text-sm font-semibold text-gray-500">Payables</div>
            <div className="text-3xl font-bold">₹15,400</div>
            <div className="absolute right-0 top-0 bottom-0 w-1 bg-pink-500 group-hover:w-2 transition-all"></div>
          </div>
        </div>

        {/* Working Graphical Area */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Cashflow Overview</h3>
              <select className="bg-gray-50 border border-gray-200 text-sm font-medium rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-black">
                <option>This Week</option>
                <option>This Month</option>
              </select>
            </div>
            <CashflowChart />
          </div>
          
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Recent Activity</h3>
              <button className="text-sm font-semibold text-pink-600 hover:text-pink-700">View All</button>
            </div>
            
            <div className="flex-1 space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500">R</div>
                  <div>
                    <div className="font-bold text-sm">Sale to Rahul</div>
                    <div className="text-xs font-medium text-gray-400">Today, 2:30 PM</div>
                  </div>
                </div>
                <div className="font-bold text-sm text-green-600">+₹5,000</div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center font-bold text-pink-600">O</div>
                  <div>
                    <div className="font-bold text-sm">Office Supplies</div>
                    <div className="text-xs font-medium text-gray-400">Yesterday</div>
                  </div>
                </div>
                <div className="font-bold text-sm">-₹1,200</div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500">X</div>
                  <div>
                    <div className="font-bold text-sm">Supplier XYZ</div>
                    <div className="text-xs font-medium text-gray-400">Oct 2, 2026</div>
                  </div>
                </div>
                <div className="font-bold text-sm">-₹15,000</div>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
