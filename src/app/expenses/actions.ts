'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createExpense(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: businesses } = await supabase.from('businesses').select('id').limit(1).single()
  if (!businesses) throw new Error('No business found')

  const date = formData.get('date') as string
  const amountStr = formData.get('amount') as string
  const category = formData.get('category') as string
  const mode = formData.get('mode') as 'cash' | 'bank'
  const note = formData.get('note') as string

  const amount = parseFloat(amountStr)
  if (amount <= 0) throw new Error('Invalid expense amount')

  // 1. Insert Expense
  const { error: expenseError } = await supabase.from('expenses').insert({
    business_id: businesses.id,
    date,
    category,
    amount,
    mode,
    note
  })

  if (expenseError) throw new Error('Failed to record expense: ' + expenseError.message)

  // 2. Insert Cashbook Entry
  await supabase.from('cashbook_entries').insert({
    business_id: businesses.id,
    date,
    type: 'out',
    mode,
    amount,
    category: 'expense',
    note: `${category} Expense: ${note}`
  })

  revalidatePath('/')
  redirect('/')
}
