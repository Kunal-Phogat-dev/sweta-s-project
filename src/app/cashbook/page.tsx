import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Receipt, ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { DeleteButton } from '@/components/ui/delete-button'

export default async function CashbookPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: businesses } = await supabase.from('businesses').select('id').limit(1).single()
  if (!businesses) redirect('/onboarding')

  // Fetch all cashbook entries
  const { data: entries } = await supabase
    .from('cashbook_entries')
    .select('*, contacts(name)')
    .eq('business_id', businesses.id)
    .is('deleted_at', null)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })

  return (
    <div className="container mx-auto py-6 space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900 flex items-center">
          <Receipt className="mr-2" /> Cashbook
        </h1>
      </header>

      <div className="space-y-3 mt-4">
        {entries?.map((entry: any) => (
          <Card key={entry.id} className="shadow-sm">
            <CardContent className="p-4 flex justify-between items-center relative group">
              <div className="flex items-start space-x-3 pr-8">
                <div className={`mt-1 p-1.5 rounded-full flex-shrink-0 ${entry.type === 'in' ? 'bg-success-100 text-success-600' : 'bg-danger-100 text-danger-600'}`}>
                  {entry.type === 'in' ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                </div>
                <div className="overflow-hidden">
                  <p className="font-semibold text-slate-900 capitalize truncate">{entry.category.replace('_', ' ')}</p>
                  <p className="text-xs text-slate-500">{entry.date} &bull; {entry.mode.toUpperCase()}</p>
                  {(entry.note || entry.contacts?.name) && (
                    <p className="text-xs text-slate-600 mt-1 truncate">
                      {entry.contacts?.name ? `${entry.contacts.name} ` : ''}
                      {entry.note ? `(${entry.note})` : ''}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right flex flex-col items-end">
                <p className={`font-bold ${entry.type === 'in' ? 'text-success-600' : 'text-danger-600'}`}>
                  {entry.type === 'in' ? '+' : '-'}₹{entry.amount.toLocaleString('en-IN')}
                </p>
                <div className="mt-2">
                  <DeleteButton tableName="cashbook_entries" id={entry.id} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {(!entries || entries.length === 0) && (
          <div className="text-center py-10 text-slate-500">
            No transactions yet.
          </div>
        )}
      </div>
    </div>
  )
}
