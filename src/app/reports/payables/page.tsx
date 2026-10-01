import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowUpRight, ArrowLeft } from 'lucide-react'
import { DeleteButton } from '@/components/ui/delete-button'

export default async function PayablesReportPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: businesses } = await supabase.from('businesses').select('id').limit(1).single()
  if (!businesses) redirect('/onboarding')

  // Fetch unpaid purchases
  const { data: unpaidPurchases } = await supabase
    .from('purchases')
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
          <ArrowUpRight className="mr-2 text-danger-600" /> Payables Report
        </h1>
      </header>

      <div className="space-y-3 mt-4">
        {unpaidPurchases?.map((purchase: any) => {
          const due = purchase.total - purchase.amount_paid
          return (
            <Link key={purchase.id} href={`/contacts/${purchase.contact_id}`}>
              <Card className="hover:bg-slate-50 transition-colors">
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-slate-900">{purchase.contacts?.name || 'Supplier'}</h3>
                    <p className="text-xs text-slate-500">{purchase.date} &bull; {purchase.bill_number}</p>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <p className="font-bold text-danger-600">₹{due.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-slate-500">Total: ₹{purchase.total.toLocaleString('en-IN')}</p>
                    <div className="mt-2">
                      <DeleteButton tableName="purchases" id={purchase.id} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}

        {(!unpaidPurchases || unpaidPurchases.length === 0) && (
          <div className="text-center py-10 text-slate-500">
            No pending payables.
          </div>
        )}
      </div>
    </div>
  )
}
