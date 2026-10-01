import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { createContact } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function NewContactPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="container mx-auto py-6 space-y-6">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-slate-900">Add New Contact</h1>
      </header>

      <Card>
        <CardContent className="p-4">
          <form action={createContact} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input type="text" name="name" placeholder="Contact Name" required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <Input type="tel" name="phone" placeholder="Phone Number" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <select 
                name="type"
                className="flex h-12 w-full rounded-md border border-slate-300 bg-transparent px-3 py-1 text-base shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                required
              >
                <option value="customer">Customer</option>
                <option value="supplier">Supplier</option>
                <option value="both">Both</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Opening Balance (₹)</label>
              <Input type="number" name="openingBalance" placeholder="0" min="0" step="0.01" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Balance Type</label>
              <select 
                name="openingBalanceType"
                className="flex h-12 w-full rounded-md border border-slate-300 bg-transparent px-3 py-1 text-base shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                <option value="receivable">They owe me (Receivable)</option>
                <option value="payable">I owe them (Payable)</option>
              </select>
            </div>

            <Button type="submit" className="w-full h-12 text-lg font-medium">
              Save Contact
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
