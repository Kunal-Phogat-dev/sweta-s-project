import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { createSale } from '../actions'
import { SubmitButton } from '@/components/ui/submit-button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function NewSalePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: businesses } = await supabase.from('businesses').select('id').limit(1).single()
  if (!businesses) redirect('/onboarding')

  const { data: contacts } = await supabase.from('contacts').select('*').eq('business_id', businesses.id).in('type', ['customer', 'both'])

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="container mx-auto py-6 space-y-6">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-slate-900">New Sale</h1>
      </header>

      <Card>
        <CardContent className="p-4">
          <form action={createSale} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Customer</label>
              <select 
                name="contactId" 
                className="flex h-12 w-full rounded-md border border-slate-300 bg-transparent px-3 py-1 text-base shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                <option value="">Walk-in / Cash Customer</option>
                {contacts?.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Input type="date" name="date" defaultValue={today} required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description (Optional)</label>
              <Input type="text" name="description" placeholder="Item name or service" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Total Amount (₹)</label>
              <Input type="number" name="total" placeholder="0" min="0" step="1" required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Amount Paid Now (₹)</label>
              <Input type="number" name="amountPaid" placeholder="0" min="0" step="1" />
              <p className="text-xs text-slate-500">Leave empty or 0 if this is a credit sale.</p>
            </div>

            <SubmitButton>Save Sale</SubmitButton>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
