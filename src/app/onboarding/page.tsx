'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'

export default function OnboardingPage() {
  const [name, setName] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [phone, setPhone] = useState('')
  const [gstRegistered, setGstRegistered] = useState(false)
  const [gstNumber, setGstNumber] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const router = useRouter()
  const supabase = createClient()

  // Check for pending invites on load
  useEffect(() => {
    async function checkInvites() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user && user.email) {
        const { data: invite } = await supabase.from('invites').select('*').eq('email', user.email).single()
        if (invite) {
          // Process invite
          await supabase.from('business_users').insert({
            business_id: invite.business_id,
            user_id: user.id,
            role: invite.role
          })
          await supabase.from('invites').delete().eq('id', invite.id)
          router.push('/')
          router.refresh()
          return
        }
      }
      setLoading(false)
    }
    checkInvites()
  }, [])

  async function handleCreateBusiness(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      setError('You must be logged in to create a business.')
      setLoading(false)
      return
    }

    const { data: newBusiness, error } = await supabase.from('businesses').insert({
      user_id: user.id,
      name,
      owner_name: ownerName,
      phone,
      gst_registered: gstRegistered,
      gst_number: gstRegistered ? gstNumber : null,
    }).select('id').single()

    if (error) {
      setError(error.message)
      setLoading(false)
    } else if (newBusiness) {
      // Add owner to business_users table as admin
      await supabase.from('business_users').insert({
        business_id: newBusiness.id,
        user_id: user.id,
        role: 'admin'
      })
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-slate-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-primary-600">Setup Business</CardTitle>
          <CardDescription className="text-center">Tell us about your business</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateBusiness} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Business Name</label>
              <Input
                placeholder="Sharma General Store"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Name</label>
              <Input
                placeholder="Rahul Sharma"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input
                type="tel"
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <input 
                type="checkbox" 
                id="gst" 
                checked={gstRegistered}
                onChange={(e) => setGstRegistered(e.target.checked)}
                className="w-4 h-4 text-primary-600 rounded border-slate-300 focus:ring-primary-500"
              />
              <label htmlFor="gst" className="text-sm font-medium">GST Registered?</label>
            </div>
            
            {gstRegistered && (
              <div className="space-y-2">
                <label className="text-sm font-medium">GST Number</label>
                <Input
                  placeholder="22AAAAA0000A1Z5"
                  value={gstNumber}
                  onChange={(e) => setGstNumber(e.target.value)}
                  required={gstRegistered}
                />
              </div>
            )}
            
            {error && <p className="text-sm text-danger-500">{error}</p>}
            <Button type="submit" className="w-full mt-4" disabled={loading}>
              {loading ? 'Creating...' : 'Continue to Dashboard'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
