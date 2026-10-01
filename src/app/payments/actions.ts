'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { allocatePaymentToSales } from '@/lib/services/balances'

export async function createPayment(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: businesses } = await supabase.from('businesses').select('id').limit(1).single()
  if (!businesses) throw new Error('No business found')

  const contactId = formData.get('contactId') as string
  const date = formData.get('date') as string
  const amountStr = formData.get('amount') as string
  const mode = formData.get('mode') as 'cash' | 'bank'
  const type = formData.get('type') as 'in' | 'out' // 'in' = receive payment, 'out' = make payment
  const note = formData.get('note') as string

  const amount = parseFloat(amountStr)
  if (amount <= 0 || !contactId) throw new Error('Invalid payment details')

  // 1. Insert Cashbook Entry
  const { error: cashbookError } = await supabase.from('cashbook_entries').insert({
    business_id: businesses.id,
    date,
    type,
    mode,
    amount,
    category: type === 'in' ? 'sale_receipt' : 'purchase_payment',
    linked_contact_id: contactId,
    note
  })

  if (cashbookError) throw new Error('Failed to record payment: ' + cashbookError.message)

  // 2. FIFO Allocation for Sales/Purchases
  if (type === 'in') {
    // We received money, allocate against unpaid sales
    const { data: unpaidSales } = await supabase
      .from('sales')
      .select('*')
      .eq('contact_id', contactId)
      .in('status', ['partial', 'credit'])
      .order('date', { ascending: true })

    if (unpaidSales && unpaidSales.length > 0) {
      const allocations = allocatePaymentToSales(amount, unpaidSales)
      
      // Update each sale in DB
      for (const alloc of allocations) {
        const sale = unpaidSales.find(s => s.id === alloc.saleId)!
        await supabase
          .from('sales')
          .update({
            amount_paid: sale.amount_paid + alloc.amountApplied,
            status: alloc.newStatus
          })
          .eq('id', sale.id)
      }
    }
  } else {
    // We paid money, allocate against unpaid purchases
    const { data: unpaidPurchases } = await supabase
      .from('purchases')
      .select('*')
      .eq('contact_id', contactId)
      .in('status', ['partial', 'credit'])
      .order('date', { ascending: true })

    if (unpaidPurchases && unpaidPurchases.length > 0) {
      const allocations = allocatePaymentToSales(amount, unpaidPurchases)
      
      // Update each purchase in DB
      for (const alloc of allocations) {
        const purchase = unpaidPurchases.find(p => p.id === alloc.saleId)!
        await supabase
          .from('purchases')
          .update({
            amount_paid: purchase.amount_paid + alloc.amountApplied,
            status: alloc.newStatus
          })
          .eq('id', purchase.id)
      }
    }
  }

  revalidatePath('/')
  revalidatePath('/contacts')
  revalidatePath(`/contacts/${contactId}`)
  redirect(`/contacts/${contactId}`)
}
