import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Wallet, Landmark, ArrowUpRight, ArrowDownRight, Plus, Receipt, Banknote, Users } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { calculateCashbookBalance } from '@/lib/services/balances'

export default async function Dashboard() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: businesses } = await supabase.from('businesses').select('*').limit(1)
  const business = businesses?.[0]
  if (!business) redirect('/onboarding')

  // Fetch balances
  const { data: cashbook } = await supabase.from('cashbook_entries').select('*').eq('business_id', business.id).is('deleted_at', null)
  const cashBalance = calculateCashbookBalance(cashbook || [], 'cash')
  const bankBalance = calculateCashbookBalance(cashbook || [], 'bank')

  // Fetch contacts for receivables / payables
  const { data: contacts } = await supabase.from('contacts').select('*').eq('business_id', business.id).is('deleted_at', null)
  
  // Outstanding from sales (Receivables)
  const { data: sales } = await supabase.from('sales').select('total, amount_paid').eq('business_id', business.id).is('deleted_at', null)
  const salesDue = (sales || []).reduce((acc, sale) => acc + (sale.total - sale.amount_paid), 0)
  
  // Outstanding from purchases (Payables)
  const { data: purchases } = await supabase.from('purchases').select('total, amount_paid').eq('business_id', business.id).is('deleted_at', null)
  const purchasesDue = (purchases || []).reduce((acc, pur) => acc + (pur.total - pur.amount_paid), 0)

  // Opening balances
  const openingReceivables = (contacts || []).filter(c => c.opening_balance_type === 'receivable').reduce((acc, c) => acc + (c.opening_balance || 0), 0)
  const openingPayables = (contacts || []).filter(c => c.opening_balance_type === 'payable').reduce((acc, c) => acc + (c.opening_balance || 0), 0)

  const totalReceivables = salesDue + openingReceivables
  const totalPayables = purchasesDue + openingPayables

  // This Month simple P&L
  const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM
  const { data: monthlySales } = await supabase.from('sales').select('subtotal').eq('business_id', business.id).is('deleted_at', null).gte('date', `${currentMonth}-01`)
  const { data: monthlyPurchases } = await supabase.from('purchases').select('subtotal').eq('business_id', business.id).is('deleted_at', null).gte('date', `${currentMonth}-01`)
  const { data: monthlyExpenses } = await supabase.from('expenses').select('amount').eq('business_id', business.id).is('deleted_at', null).gte('date', `${currentMonth}-01`)

  const mSales = (monthlySales || []).reduce((acc, s) => acc + s.subtotal, 0)
  const mPurchases = (monthlyPurchases || []).reduce((acc, p) => acc + p.subtotal, 0)
  const mExpenses = (monthlyExpenses || []).reduce((acc, e) => acc + e.amount, 0)
  const mProfit = mSales - mPurchases - mExpenses

  return (
    <div className="container mx-auto py-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">{business.name}</h1>
      </header>

      {/* Cash & Bank Balances */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-primary-500 to-primary-600 text-white border-none shadow-md">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium flex items-center opacity-90">
              <Wallet className="w-4 h-4 mr-2" />
              Cash in Hand
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">₹{cashBalance.toLocaleString('en-IN')}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 text-white border-none shadow-md">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium flex items-center opacity-90">
              <Landmark className="w-4 h-4 mr-2" />
              Bank Balance
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">₹{bankBalance.toLocaleString('en-IN')}</div>
          </CardContent>
        </Card>
      </div>

      {/* Due Balances */}
      <div className="grid grid-cols-2 gap-4">
        <Link href="/reports/receivables">
          <Card className="hover:bg-slate-50 transition-colors cursor-pointer border-success-100 shadow-sm h-full">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center">
                <ArrowDownRight className="w-4 h-4 mr-1 text-success-600" />
                You'll Receive
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-xl font-bold text-success-600">₹{totalReceivables.toLocaleString('en-IN')}</div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/reports/payables">
          <Card className="hover:bg-slate-50 transition-colors cursor-pointer border-danger-100 shadow-sm h-full">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center">
                <ArrowUpRight className="w-4 h-4 mr-1 text-danger-600" />
                You'll Pay
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-xl font-bold text-danger-600">₹{totalPayables.toLocaleString('en-IN')}</div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 px-1">Quick Actions</h2>
        <div className="grid grid-cols-4 gap-2">
          <Link href="/sales/new" className="flex flex-col items-center p-3 bg-white rounded-xl shadow-sm border border-slate-200 active:bg-slate-50">
            <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mb-2">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-center">New Sale</span>
          </Link>
          <Link href="/purchases/new" className="flex flex-col items-center p-3 bg-white rounded-xl shadow-sm border border-slate-200 active:bg-slate-50">
            <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mb-2">
              <Receipt className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-center">New Purchase</span>
          </Link>
          <Link href="/payments/new" className="flex flex-col items-center p-3 bg-white rounded-xl shadow-sm border border-slate-200 active:bg-slate-50">
            <div className="w-10 h-10 rounded-full bg-success-100 text-success-600 flex items-center justify-center mb-2">
              <Banknote className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-center">Payment</span>
          </Link>
          <Link href="/expenses/new" className="flex flex-col items-center p-3 bg-white rounded-xl shadow-sm border border-slate-200 active:bg-slate-50">
            <div className="w-10 h-10 rounded-full bg-danger-100 text-danger-600 flex items-center justify-center mb-2">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-center">Expense</span>
          </Link>
        </div>
      </div>

      {/* This Month Overview */}
      <div>
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 px-1">This Month</h2>
        <Card className="shadow-sm">
          <CardContent className="p-0 divide-y divide-slate-100">
            <div className="flex justify-between items-center p-4">
              <span className="text-sm text-slate-600">Sales</span>
              <span className="font-medium text-slate-900">₹{mSales.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center p-4">
              <span className="text-sm text-slate-600">Purchases</span>
              <span className="font-medium text-slate-900">₹{mPurchases.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center p-4">
              <span className="text-sm text-slate-600">Expenses</span>
              <span className="font-medium text-slate-900">₹{mExpenses.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-b-xl">
              <span className="text-sm font-bold text-slate-700">Est. Profit</span>
              <span className={`font-bold ${mProfit >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                {mProfit >= 0 ? '+' : '-'}₹{Math.abs(mProfit).toLocaleString('en-IN')}
              </span>
            </div>
          </CardContent>
        </Card>
        <p className="text-[10px] text-center text-slate-400 mt-2">
          * Est. Profit is Sales - Purchases - Expenses. It is not a formal P&L statement.
        </p>
      </div>
    </div>
  )
}
