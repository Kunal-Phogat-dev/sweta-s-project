'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createSale(formData: FormData) {
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

  const total = parseFloat(totalStr)
  const amountPaid = parseFloat(amountPaidStr || '0')
  const status = amountPaid >= total ? 'paid' : amountPaid > 0 ? 'partial' : 'credit'
  const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`

  // Insert Sale
  const { data: sale, error: saleError } = await supabase.from('sales').insert({
    business_id: businesses.id,
    contact_id: contactId || null,
    date,
    invoice_number: invoiceNumber,
    subtotal: total,
    gst_amount: 0,
    total: total,
    amount_paid: amountPaid,
    status
  }).select().single()

  if (saleError) throw new Error('Failed to create sale: ' + saleError.message)

  // Insert Sale Items (simplified: single item for lump sum)
  if (description) {
    await supabase.from('sale_items').insert({
      sale_id: sale.id,
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
      type: 'in',
      mode: 'cash',
      amount: amountPaid,
      category: 'sale_receipt',
      linked_sale_id: sale.id,
      linked_contact_id: contactId || null,
      note: `Payment for invoice ${invoiceNumber}`
    })
  }

  revalidatePath('/')
  revalidatePath('/sales')
  redirect('/')
}
