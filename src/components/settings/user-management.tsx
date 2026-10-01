'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Users, Mail, Trash2 } from 'lucide-react'
import { deleteRecord } from '@/app/actions/delete'

export function UserManagement({ businessId, isOwner }: { businessId: string, isOwner: boolean }) {
  const [users, setUsers] = useState<any[]>([])
  const [invites, setInvites] = useState<any[]>([])
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    const { data: bUsers } = await supabase.from('business_users').select('*, user_id').eq('business_id', businessId)
    const { data: bInvites } = await supabase.from('invites').select('*').eq('business_id', businessId)
    setUsers(bUsers || [])
    setInvites(bInvites || [])
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    
    const { error } = await supabase.from('invites').insert({
      business_id: businessId,
      email: email.toLowerCase(),
      role: 'staff'
    })
    
    if (error) {
      alert(error.message)
    } else {
      setEmail('')
      fetchUsers()
    }
    setLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Users className="mr-2 w-5 h-5" /> Team Members
        </CardTitle>
        <CardDescription>Manage who has access to this business.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing Users */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Active Staff</h4>
          {users.map((u) => (
            <div key={u.id} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div>
                <p className="font-medium text-sm">User ID: {u.user_id.slice(0,8)}...</p>
                <p className="text-xs text-slate-500 uppercase">{u.role}</p>
              </div>
              {isOwner && u.role !== 'admin' && (
                <button className="p-1 text-danger-500 hover:text-danger-700" onClick={async () => {
                  if(confirm('Remove staff?')) {
                    await supabase.from('business_users').delete().eq('id', u.id)
                    fetchUsers()
                  }
                }}>
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Pending Invites */}
        {invites.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Pending Invites</h4>
            {invites.map((inv) => (
              <div key={inv.id} className="flex justify-between items-center p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                <div>
                  <p className="font-medium text-sm">{inv.email}</p>
                  <p className="text-xs text-primary-500 uppercase">{inv.role} (Pending)</p>
                </div>
                {isOwner && (
                  <button className="p-1 text-danger-500 hover:text-danger-700" onClick={async () => {
                    await supabase.from('invites').delete().eq('id', inv.id)
                    fetchUsers()
                  }}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Invite Form */}
        {isOwner && (
          <form onSubmit={handleInvite} className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex-1">
              <Input
                type="email"
                placeholder="staff@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={loading}>
              <Mail className="w-4 h-4 mr-2" /> Invite
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
