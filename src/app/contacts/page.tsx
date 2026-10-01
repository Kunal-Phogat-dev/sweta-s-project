import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Users, Plus, ArrowRight } from 'lucide-react'
import { DeleteButton } from '@/components/ui/delete-button'

export default async function ContactsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: businesses } = await supabase.from('businesses').select('id').limit(1).single()
  if (!businesses) redirect('/onboarding')

  // Fetch all contacts
  const { data: contacts } = await supabase.from('contacts').select('*').eq('business_id', businesses.id).is('deleted_at', null).order('name')

  // For v1 speed, we aren't joining all sales and purchases here, 
  // but a real app should aggregate balance on the DB level or calculate it accurately.
  // We'll show opening balances for now in the list, and full balance in detail view.

  return (
    <div className="container mx-auto py-6 space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900 flex items-center">
          <Users className="mr-2" /> Contacts
        </h1>
        <Link href="/contacts/new" className="text-primary-600 bg-primary-50 p-2 rounded-full">
          <Plus className="w-5 h-5" />
        </Link>
      </header>

      <div className="space-y-3 mt-4">
        {contacts?.map((contact) => (
          <Link key={contact.id} href={`/contacts/${contact.id}`}>
            <Card className="hover:bg-slate-50 transition-colors">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">{contact.name}</h3>
                  <p className="text-xs text-slate-500 capitalize">{contact.type}</p>
                </div>
                <div className="flex items-center space-x-2 text-slate-400">
                  <DeleteButton tableName="contacts" id={contact.id} className="mr-2" />
                  <ArrowRight className="w-4 h-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}

        {(!contacts || contacts.length === 0) && (
          <div className="text-center py-10 text-slate-500">
            No contacts yet.
          </div>
        )}
      </div>
    </div>
  )
}
