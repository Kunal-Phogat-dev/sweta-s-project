import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { createPurchase } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function NewPurchasePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: businesses } = await supabase.from('businesses').select('id').limit(1).single()
  if (!businesses) redirect('/onboarding')

  const { data: contacts } = await supabase.from('contacts').select('*').eq('business_id', businesses.id).in('type', ['supplier', 'both'])

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="container mx-auto py-6 space-y-6">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-slate-900">New Purchase</h1>
      </header>

      <Card>
        <CardContent className="p-4">
          <form action={createPurchase} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Supplier</label>
              <select 
                name="contactId" 
                className="flex h-12 w-full rounded-md border border-slate-300 bg-transparent px-3 py-1 text-base shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                <option value="">Cash Purchase (No Supplier)</option>
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
              <label className="text-sm font-medium">Bill Number (Optional)</label>
              <Input type="text" name="billNumber" placeholder="Supplier invoice no." />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description (Optional)</label>
              <Input type="text" name="description" placeholder="Items purchased" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Total Amount (₹)</label>
              <Input type="number" name="total" placeholder="0" min="0" step="1" required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Amount Paid Now (₹)</label>
              <Input type="number" name="amountPaid" placeholder="0" min="0" step="1" />
              <p className="text-xs text-slate-500">Leave empty or 0 if this is a credit purchase.</p>
            </div>

            <Button type="submit" className="w-full h-12 text-lg font-medium">
              Save Purchase
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
