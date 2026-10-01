'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPurchase(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: businesses } = await supabase.from('businesses').select('id').limit(1).single()
  if (!businesses) throw new Error('No business found')

  const contactId = formData.get('contactId') as string
  const date = formData.get('date') as string
  const totalStr = formData.get('total') as string
  const amountPaidStr = formData.get('amountPaid') as string
  const description = formData.get('description') as string
  const billNumber = formData.get('billNumber') as string || `PUR-${Date.now().toString().slice(-6)}`

  const total = parseFloat(totalStr)
  const amountPaid = parseFloat(amountPaidStr || '0')
  const status = amountPaid >= total ? 'paid' : amountPaid > 0 ? 'partial' : 'credit'

  // Insert Purchase
  const { data: purchase, error: purchaseError } = await supabase.from('purchases').insert({
    business_id: businesses.id,
    contact_id: contactId || null,
    date,
    bill_number: billNumber,
    subtotal: total,
    gst_amount: 0,
    total: total,
    amount_paid: amountPaid,
    status
  }).select().single()

  if (purchaseError) throw new Error('Failed to create purchase: ' + purchaseError.message)

  // Insert Purchase Items (simplified)
  if (description) {
    await supabase.from('purchase_items').insert({
      purchase_id: purchase.id,
      description,
      quantity: 1,
      unit_price: total,
      gst_rate: 0,
      line_total: total
    })
  }

  // Insert Cashbook Entry if amountPaid > 0
  if (amountPaid > 0) {
    await supabase.from('cashbook_entries').insert({
      business_id: businesses.id,
      date,
      type: 'out',
      mode: 'cash',
      amount: amountPaid,
      category: 'purchase_payment',
      linked_purchase_id: purchase.id,
      linked_contact_id: contactId || null,
      note: `Payment for purchase ${billNumber}`
    })
  }

  revalidatePath('/')
  revalidatePath('/purchases')
  redirect('/')
}
