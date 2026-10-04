import Link from 'next/link';
import { ArrowRight, Plus, Receipt, LogOut } from 'lucide-react';
import { CashflowChart } from '@/components/dashboard/cashflow-chart';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { DeleteButton } from '@/components/ui/delete-button';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: businesses } = await supabase.from('businesses').select('*').limit(1);
  const business = businesses?.[0];
  if (!business) redirect('/onboarding');

  // Fetch parallel metrics
  const [
    { data: cashbook },
    { data: sales },
    { data: purchases },
    { data: contacts }
  ] = await Promise.all([
    supabase.from('cashbook_entries').select('*').eq('business_id', business.id).is('deleted_at', null),
    supabase.from('sales').select('*').eq('business_id', business.id).is('deleted_at', null),
    supabase.from('purchases').select('*').eq('business_id', business.id).is('deleted_at', null),
    supabase.from('contacts').select('*').eq('business_id', business.id).is('deleted_at', null)
  ]);

  // Calculate Balances
  const cashBalance = (cashbook || []).filter(e => e.payment_mode === 'cash').reduce((acc, e) => acc + (e.type === 'in' ? e.amount : -e.amount), 0);
  const bankBalance = (cashbook || []).filter(e => e.payment_mode === 'bank').reduce((acc, e) => acc + (e.type === 'in' ? e.amount : -e.amount), 0);
  
  const salesDue = (sales || []).reduce((acc, s) => acc + (s.total - (s.amount_paid || 0)), 0);
  const purchasesDue = (purchases || []).reduce((acc, p) => acc + (p.total - (p.amount_paid || 0)), 0);

  // Combine recent activity
  const recentSales = (sales || []).map(s => ({ id: s.id, type: 'sale', amount: s.total, date: s.date, title: 'Sale' }));
  const recentPurchases = (purchases || []).map(p => ({ id: p.id, type: 'purchase', amount: p.total, date: p.date, title: 'Purchase' }));
  const allActivity = [...recentSales, ...recentPurchases].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const recentActivity = allActivity.slice(0, 5);

  // Calculate Real Chart Data (Last 7 Days)
  const chartData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const shortName = d.toLocaleDateString('en-US', { weekday: 'short' });
    
    const daySales = allActivity.filter(a => a.type === 'sale' && a.date.startsWith(dateStr)).reduce((sum, a) => sum + a.amount, 0);
    const dayPurchases = allActivity.filter(a => a.type === 'purchase' && a.date.startsWith(dateStr)).reduce((sum, a) => sum + a.amount, 0);
    
    chartData.push({ name: shortName, In: daySales, Out: dayPurchases });
  }

  return (
    <div className="min-h-screen bg-[#fafaf9] text-[#1c1917] selection:bg-pink-200">
      
      {/* Ultra Clean Topbar */}
      <header className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 md:px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black rounded-lg text-white flex items-center justify-center font-bold">{business.name.charAt(0)}</div>
            <h1 className="text-xl font-bold tracking-tight">{business.name}</h1>
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
            <div className="text-3xl font-bold">₹{cashBalance.toLocaleString('en-IN')}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-32">
            <div className="text-sm font-semibold text-gray-500">Bank Balance</div>
            <div className="text-3xl font-bold">₹{bankBalance.toLocaleString('en-IN')}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group">
            <div className="text-sm font-semibold text-gray-500">Receivables</div>
            <div className="text-3xl font-bold">₹{salesDue.toLocaleString('en-IN')}</div>
            <div className="absolute right-0 top-0 bottom-0 w-1 bg-green-400 group-hover:w-2 transition-all"></div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group">
            <div className="text-sm font-semibold text-gray-500">Payables</div>
            <div className="text-3xl font-bold">₹{purchasesDue.toLocaleString('en-IN')}</div>
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
              </select>
            </div>
            <CashflowChart data={chartData} />
          </div>
          
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Recent Activity</h3>
            </div>
            
            <div className="flex-1 space-y-6">
              {recentActivity.length === 0 ? (
                <div className="text-gray-400 text-sm">No recent activity yet.</div>
              ) : (
                recentActivity.map(act => (
                  <div key={act.id} className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${act.type === 'sale' ? 'bg-green-50 text-green-600' : 'bg-pink-50 text-pink-600'}`}>
                        {act.type === 'sale' ? 'S' : 'P'}
                      </div>
                      <div>
                        <div className="font-bold text-sm">{act.title}</div>
                        <div className="text-xs font-medium text-gray-400">{new Date(act.date).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`font-bold text-sm ${act.type === 'sale' ? 'text-green-600' : ''}`}>
                        {act.type === 'sale' ? '+' : '-'}₹{act.amount.toLocaleString('en-IN')}
                      </div>
                      <DeleteButton id={act.id} type={act.type} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
