import { describe, it, expect } from 'vitest'
import { calculateContactBalance, calculateCashbookBalance, allocatePaymentToSales } from './balances'

describe('Balances Service', () => {
  describe('calculateCashbookBalance', () => {
    it('correctly calculates cash balance', () => {
      const entries: any[] = [
        { mode: 'cash', type: 'in', amount: 1000 },
        { mode: 'cash', type: 'out', amount: 300 },
        { mode: 'bank', type: 'in', amount: 5000 },
      ]
      
      expect(calculateCashbookBalance(entries, 'cash')).toBe(700)
    })
    
    it('correctly calculates bank balance', () => {
      const entries: any[] = [
        { mode: 'cash', type: 'in', amount: 1000 },
        { mode: 'bank', type: 'out', amount: 200 },
        { mode: 'bank', type: 'in', amount: 5000 },
      ]
      
      expect(calculateCashbookBalance(entries, 'bank')).toBe(4800)
    })
  })

  describe('allocatePaymentToSales (FIFO)', () => {
    it('allocates payment fully to a single sale', () => {
      const sales: any[] = [
        { id: '1', total: 1000, amount_paid: 0 },
      ]
      
      const allocations = allocatePaymentToSales(1000, sales)
      expect(allocations).toEqual([
        { saleId: '1', amountApplied: 1000, newStatus: 'paid' }
      ])
    })
    
    it('allocates payment partially to a single sale', () => {
      const sales: any[] = [
        { id: '1', total: 1000, amount_paid: 0 },
      ]
      
      const allocations = allocatePaymentToSales(400, sales)
      expect(allocations).toEqual([
        { saleId: '1', amountApplied: 400, newStatus: 'partial' }
      ])
    })
    
    it('allocates payment across multiple sales', () => {
      const sales: any[] = [
        { id: 'old', total: 1000, amount_paid: 500 }, // 500 due
        { id: 'new', total: 2000, amount_paid: 0 },   // 2000 due
      ]
      
      const allocations = allocatePaymentToSales(1500, sales)
      expect(allocations).toEqual([
        { saleId: 'old', amountApplied: 500, newStatus: 'paid' },
        { saleId: 'new', amountApplied: 1000, newStatus: 'partial' }
      ])
    })
  })
})
