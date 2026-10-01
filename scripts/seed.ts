import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
// For seeding we should ideally use the service_role key to bypass RLS or just use the anon key and sign up a user
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase env vars')
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function seed() {
  console.log('Starting seed...')

  let { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'test@ledgerlite.com',
    password: 'password123',
  })

  let user = authData?.user

  if (authError && authError.message.includes('Invalid login credentials')) {
    console.log('User does not exist, attempting to sign up...')
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: 'test@ledgerlite.com',
      password: 'password123',
    })
    if (signUpError) throw signUpError
    user = signUpData.user
  } else if (authError) {
    throw authError
  }

  if (!user) {
     // Fallback if email confirmation is required and no session is returned, but user object is usually returned on signUp
     console.warn('No active session, but continuing if user exists in authData')
  }

  const userId = user?.id
  if (!userId) throw new Error('No user found after auth')

  console.log('User ID:', userId)

  // 2. Create a business
  const { data: business, error: bizError } = await supabase
    .from('businesses')
    .insert({
      user_id: userId,
      name: 'Sharma General Store',
      owner_name: 'Rahul Sharma',
      phone: '9876543210',
      gst_registered: false,
    })
    .select()
    .single()

  if (bizError) {
    if (bizError.code === '23505') {
       console.log('Business already exists.')
    } else {
       throw bizError
    }
  }

  // Fetch the business to proceed
  const { data: businesses } = await supabase.from('businesses').select('*').eq('user_id', userId)
  const myBiz = businesses?.[0]
  if (!myBiz) throw new Error('Could not find business')

  console.log('Business ID:', myBiz.id)

  // 3. Create contacts
  const contactsToInsert = [
    { business_id: myBiz.id, name: 'Walk-in Customer', type: 'customer', opening_balance_type: 'receivable' },
    { business_id: myBiz.id, name: 'Ramesh Wholesale', type: 'supplier', opening_balance: 5000, opening_balance_type: 'payable' },
    { business_id: myBiz.id, name: 'Suresh (Regular)', type: 'customer', opening_balance: 200, opening_balance_type: 'receivable' },
  ]

  const { data: contacts, error: contactError } = await supabase
    .from('contacts')
    .insert(contactsToInsert)
    .select()

  if (contactError) throw contactError

  console.log('Inserted contacts:', contacts?.length)

  // 4. Create items (optional)
  const itemsToInsert = [
    { business_id: myBiz.id, name: 'Aashirvaad Atta 5kg', unit: 'bag', purchase_price: 200, sale_price: 250, current_stock: 50 },
    { business_id: myBiz.id, name: 'Amul Butter 500g', unit: 'pack', purchase_price: 240, sale_price: 260, current_stock: 20 },
  ]

  const { data: items, error: itemError } = await supabase
    .from('items')
    .insert(itemsToInsert)
    .select()

  if (itemError) throw itemError

  console.log('Inserted items:', items?.length)

  console.log('Seed completed successfully!')
}

seed().catch(console.error)
