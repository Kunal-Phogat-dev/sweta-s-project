import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowDownRight, ArrowLeft } from 'lucide-react'
import { DeleteButton } from '@/components/ui/delete-button'

export default async function ReceivablesReportPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: businesses } = await supabase.from('businesses').select('id').limit(1).single()
  if (!businesses) redirect('/onboarding')

  // Fetch unpaid sales
  const { data: unpaidSales } = await supabase
    .from('sales')
    .select('*, contacts(name)')
    .eq('business_id', businesses.id)
    .in('status', ['partial', 'credit'])
    .is('deleted_at', null)
    .order('date', { ascending: false })

  return (
    <div className="container mx-auto py-6 space-y-4">
      <header className="flex items-center space-x-3 mb-6">
        <Link href="/" className="text-slate-500 hover:text-slate-900">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-bold text-slate-900 flex items-center">
          <ArrowDownRight className="mr-2 text-success-600" /> Receivables Report
        </h1>
      </header>

      <div className="space-y-3 mt-4">
        {unpaidSales?.map((sale: any) => {
          const due = sale.total - sale.amount_paid
          return (
            <Link key={sale.id} href={`/contacts/${sale.contact_id}`}>
              <Card className="hover:bg-slate-50 transition-colors">
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-slate-900">{sale.contacts?.name || 'Walk-in'}</h3>
                    <p className="text-xs text-slate-500">{sale.date} &bull; {sale.invoice_number}</p>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <p className="font-bold text-success-600">₹{due.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-slate-500">Total: ₹{sale.total.toLocaleString('en-IN')}</p>
                    <div className="mt-2">
                      <DeleteButton tableName="sales" id={sale.id} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}

        {(!unpaidSales || unpaidSales.length === 0) && (
          <div className="text-center py-10 text-slate-500">
            No pending receivables. Great job!
          </div>
        )}
      </div>
    </div>
  )
}
