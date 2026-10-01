import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, Banknote } from 'lucide-react'
import { calculateContactBalance } from '@/lib/services/balances'
import { DeleteButton } from '@/components/ui/delete-button'

export default async function ContactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: contact } = await supabase.from('contacts').select('*').eq('id', id).single()
  if (!contact) redirect('/contacts')

  // Fetch all transactions to calculate true balance
  const { data: sales } = await supabase.from('sales').select('*').eq('contact_id', id).is('deleted_at', null)
  const { data: purchases } = await supabase.from('purchases').select('*').eq('contact_id', id).is('deleted_at', null)
  const { data: cashbookIn } = await supabase.from('cashbook_entries').select('*').eq('linked_contact_id', id).eq('type', 'in').is('deleted_at', null)
  const { data: cashbookOut } = await supabase.from('cashbook_entries').select('*').eq('linked_contact_id', id).eq('type', 'out').is('deleted_at', null)

  const balance = calculateContactBalance(
    contact, 
    sales || [], 
    purchases || [], 
    cashbookIn || [], 
    cashbookOut || []
  )

  const isReceivable = balance > 0
  const isPayable = balance < 0

  return (
    <div className="container mx-auto py-6 space-y-6">
      <header className="flex items-center space-x-3 mb-6">
        <Link href="/contacts" className="text-slate-500 hover:text-slate-900">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-bold text-slate-900">{contact.name}</h1>
      </header>

      <Card className="bg-white">
        <CardContent className="p-6 text-center space-y-2">
          <p className="text-sm text-slate-500 uppercase tracking-wide">Current Balance</p>
          <div className={`text-4xl font-bold ${isReceivable ? 'text-success-600' : isPayable ? 'text-danger-600' : 'text-slate-900'}`}>
            ₹{Math.abs(balance).toLocaleString('en-IN')}
          </div>
          <p className="text-sm text-slate-500">
            {isReceivable ? "They owe you" : isPayable ? "You owe them" : "Settled"}
          </p>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        {isReceivable && (
          <Link href={`/payments/new?contactId=${id}`} className="flex-1 bg-success-600 text-white p-3 rounded-xl flex items-center justify-center font-medium shadow-sm hover:bg-success-700">
            <Banknote className="w-5 h-5 mr-2" /> Receive Payment
          </Link>
        )}
        {isPayable && (
          <Link href={`/payments/new?contactId=${id}`} className="flex-1 bg-danger-600 text-white p-3 rounded-xl flex items-center justify-center font-medium shadow-sm hover:bg-danger-700">
            <Banknote className="w-5 h-5 mr-2" /> Make Payment
          </Link>
        )}
      </div>

      <div>
        <h3 className="font-bold text-slate-900 mb-4">Recent Transactions</h3>
        <div className="space-y-3">
          {/* Combine and sort transactions */}
          {[...(sales || []).map(s => ({ ...s, _tableName: 'sales', _type: 'Sale', amount: s.total, amount_paid: s.amount_paid })),
            ...(purchases || []).map(p => ({ ...p, _tableName: 'purchases', _type: 'Purchase', amount: p.total, amount_paid: p.amount_paid })),
            ...(cashbookIn || []).map(c => ({ ...c, _tableName: 'cashbook_entries', _type: 'Payment Received', amount: c.amount, date: c.date })),
            ...(cashbookOut || []).map(c => ({ ...c, _tableName: 'cashbook_entries', _type: 'Payment Made', amount: c.amount, date: c.date }))]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((t: any) => (
              <Card key={t.id} className="shadow-sm">
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-sm">{t._type}</p>
                    <p className="text-xs text-slate-500">{t.date}</p>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <p className="font-bold">₹{t.amount.toLocaleString('en-IN')}</p>
                    {t._type === 'Sale' || t._type === 'Purchase' ? (
                      <p className="text-xs text-slate-500">Paid: ₹{(t.amount_paid || 0).toLocaleString('en-IN')}</p>
                    ) : null}
                    <div className="mt-1">
                      <DeleteButton tableName={t._tableName} id={t.id} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  )
}
