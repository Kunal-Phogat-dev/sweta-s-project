'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createContact(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: businesses } = await supabase.from('businesses').select('id').limit(1).single()
  if (!businesses) throw new Error('No business found')

  const name = formData.get('name') as string
  const phone = formData.get('phone') as string
  const type = formData.get('type') as 'customer' | 'supplier' | 'both'
  const openingBalanceStr = formData.get('openingBalance') as string
  const openingBalanceType = formData.get('openingBalanceType') as 'receivable' | 'payable'

  const openingBalance = parseFloat(openingBalanceStr || '0')

  const { error } = await supabase.from('contacts').insert({
    business_id: businesses.id,
    name,
    phone,
    type,
    opening_balance: openingBalance,
    opening_balance_type: openingBalanceType
  })

  if (error) throw new Error('Failed to create contact: ' + error.message)

  revalidatePath('/contacts')
  redirect('/contacts')
}
