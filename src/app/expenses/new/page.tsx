import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { createExpense } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function NewExpensePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="container mx-auto py-6 space-y-6">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-slate-900">Record Expense</h1>
      </header>

      <Card>
        <CardContent className="p-4">
          <form action={createExpense} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <select 
                name="category"
                className="flex h-12 w-full rounded-md border border-slate-300 bg-transparent px-3 py-1 text-base shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                required
              >
                <option value="rent">Rent</option>
                <option value="salary">Staff Salary</option>
                <option value="utilities">Utilities / Electricity</option>
                <option value="misc">Miscellaneous</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Input type="date" name="date" defaultValue={today} required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Amount (₹)</label>
              <Input type="number" name="amount" placeholder="0" min="1" step="1" required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Mode</label>
              <select 
                name="mode"
                className="flex h-12 w-full rounded-md border border-slate-300 bg-transparent px-3 py-1 text-base shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                <option value="cash">Cash</option>
                <option value="bank">Bank / UPI / Online</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Note (Optional)</label>
              <Input type="text" name="note" placeholder="E.g., October Shop Rent" />
            </div>

            <Button type="submit" className="w-full h-12 text-lg font-medium">
              Save Expense
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
