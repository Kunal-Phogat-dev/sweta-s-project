'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function deleteRecord(tableName: string, id: string, redirectPath?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: businesses } = await supabase.from('businesses').select('id').limit(1).single()
  if (!businesses) throw new Error('No business found')

  // Validate tableName to prevent SQL injection or arbitrary table updates
  const allowedTables = ['sales', 'purchases', 'cashbook_entries', 'expenses', 'contacts']
  if (!allowedTables.includes(tableName)) {
    throw new Error('Invalid table name')
  }

  // Soft delete by setting deleted_at to current timestamp
  const { error } = await supabase
    .from(tableName)
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
    .eq('business_id', businesses.id) // Ensure they only delete their own records

  if (error) {
    throw new Error(`Failed to delete record: ${error.message}`)
  }

  // Revalidate common paths
  revalidatePath('/')
  revalidatePath('/cashbook')
  revalidatePath('/contacts')
  revalidatePath('/reports/receivables')
  revalidatePath('/reports/payables')
  
  if (redirectPath) {
    redirect(redirectPath)
  }
}
