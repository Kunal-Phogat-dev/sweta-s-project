import { Database } from '@/types/supabase'

type Contact = Database['public']['Tables']['contacts']['Row']
type Sale = Database['public']['Tables']['sales']['Row']
type Purchase = Database['public']['Tables']['purchases']['Row']
type CashbookEntry = Database['public']['Tables']['cashbook_entries']['Row']

/**
 * Calculates the current balance of a contact (customer or supplier).
 * Positive balance means they owe us (receivable).
 * Negative balance means we owe them (payable).
 */
export function calculateContactBalance(
  contact: Contact,
  sales: Sale[],
  purchases: Purchase[],
  paymentsReceived: CashbookEntry[], // where mode is 'in' and linked_contact_id = contact.id
  paymentsMade: CashbookEntry[]      // where mode is 'out' and linked_contact_id = contact.id
): number {
  let balance = 0

  // 1. Opening Balance
  if (contact.opening_balance) {
    if (contact.opening_balance_type === 'receivable') {
      balance += contact.opening_balance
    } else {
      balance -= contact.opening_balance
    }
  }

  // 2. Add total of all sales to this contact
  const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0)
  balance += totalSales

  // 3. Subtract total of all purchases from this contact
  const totalPurchases = purchases.reduce((sum, purchase) => sum + purchase.total, 0)
  balance -= totalPurchases

  // 4. Subtract payments received (reduces receivable)
  const totalReceived = paymentsReceived.reduce((sum, entry) => sum + entry.amount, 0)
  balance -= totalReceived

  // 5. Add payments made (reduces payable, thus increasing balance)
  const totalMade = paymentsMade.reduce((sum, entry) => sum + entry.amount, 0)
  balance += totalMade

  return balance
}

/**
 * Calculates the current cash or bank balance.
 */
export function calculateCashbookBalance(
  entries: CashbookEntry[],
  mode: 'cash' | 'bank'
): number {
  return entries
    .filter((entry) => entry.mode === mode)
    .reduce((balance, entry) => {
      if (entry.type === 'in') {
        return balance + entry.amount
      } else {
        return balance - entry.amount
      }
    }, 0)
}

/**
 * Helper to split a payment across multiple unpaid sales (FIFO).
 * Returns array of objects detailing how much was applied to which sale.
 */
export function allocatePaymentToSales(
  paymentAmount: number,
  unpaidItems: { id: string; total: number; amount_paid: number }[] // Must be sorted oldest first
): { saleId: string; amountApplied: number; newStatus: 'paid' | 'partial' }[] {
  let remainingPayment = paymentAmount
  const allocations = []

  for (const item of unpaidItems) {
    if (remainingPayment <= 0) break

    const dueOnSale = item.total - item.amount_paid
    if (dueOnSale <= 0) continue

    const amountToApply = Math.min(remainingPayment, dueOnSale)
    remainingPayment -= amountToApply

    allocations.push({
      saleId: item.id,
      amountApplied: amountToApply,
      newStatus: (item.amount_paid + amountToApply) >= item.total ? 'paid' : 'partial'
    })
  }

  return allocations as { saleId: string; amountApplied: number; newStatus: 'paid' | 'partial' }[]
}
