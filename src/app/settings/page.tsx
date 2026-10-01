import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Settings as SettingsIcon, LogOut, User, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { UserManagement } from '@/components/settings/user-management'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: businesses } = await supabase.from('businesses').select('*').limit(1).single()
  if (!businesses) redirect('/onboarding')

  return (
    <div className="container mx-auto py-6 space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900 flex items-center">
          <SettingsIcon className="mr-2" /> Settings
        </h1>
        <ThemeToggle />
      </header>

      <div className="space-y-4 mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <User className="mr-2 w-5 h-5" /> Business Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm text-slate-500">Business Name</p>
              <p className="font-medium">{businesses?.name}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Owner Name</p>
              <p className="font-medium">{businesses?.owner_name}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Phone</p>
              <p className="font-medium">{businesses?.phone}</p>
            </div>
            {businesses?.gst_registered && (
              <div>
                <p className="text-sm text-slate-500">GST Number</p>
                <p className="font-medium uppercase">{businesses?.gst_number}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <UserManagement businessId={businesses.id} isOwner={businesses.user_id === user.id} />

        <Card>
          <CardContent className="p-4">
            <form action="/auth/signout" method="post">
              <Button type="submit" variant="danger" className="w-full flex items-center justify-center">
                <LogOut className="mr-2 w-4 h-4" /> Sign Out
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
