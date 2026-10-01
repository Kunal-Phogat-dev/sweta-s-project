-- 1. Enable uuid extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Businesses Table
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  gst_registered BOOLEAN DEFAULT false,
  gst_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

-- 3. Business Users Table (for Team Management)
CREATE TABLE IF NOT EXISTS business_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'staff')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(business_id, user_id)
);
ALTER TABLE business_users ENABLE ROW LEVEL SECURITY;

-- 4. Invites Table
CREATE TABLE IF NOT EXISTS invites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'staff')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(business_id, email)
);
ALTER TABLE invites ENABLE ROW LEVEL SECURITY;

-- 5. Contacts Table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('customer', 'supplier')),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  gst_number TEXT,
  opening_balance NUMERIC(10, 2) DEFAULT 0,
  opening_balance_type TEXT CHECK (opening_balance_type IN ('receivable', 'payable')),
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- 6. Items Table
CREATE TABLE IF NOT EXISTS items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  unit TEXT NOT NULL,
  purchase_price NUMERIC(10, 2) NOT NULL,
  sale_price NUMERIC(10, 2) NOT NULL,
  hsn_code TEXT,
  gst_rate NUMERIC(5, 2) DEFAULT 0,
  stock_quantity NUMERIC(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- 7. Sales Table
CREATE TABLE IF NOT EXISTS sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE RESTRICT,
  invoice_number TEXT NOT NULL,
  date DATE NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL,
  gst_amount NUMERIC(10, 2) NOT NULL,
  total NUMERIC(10, 2) NOT NULL,
  amount_paid NUMERIC(10, 2) DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('paid', 'partial', 'credit')),
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

-- 8. Sale Items Table
CREATE TABLE IF NOT EXISTS sale_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sale_id UUID REFERENCES sales(id) ON DELETE CASCADE,
  item_id UUID REFERENCES items(id) ON DELETE RESTRICT,
  description TEXT,
  quantity NUMERIC(10, 2) NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL,
  gst_rate NUMERIC(5, 2) NOT NULL,
  line_total NUMERIC(10, 2) NOT NULL
);
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;

-- 9. Purchases Table
CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE RESTRICT,
  bill_number TEXT NOT NULL,
  date DATE NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL,
  gst_amount NUMERIC(10, 2) NOT NULL,
  total NUMERIC(10, 2) NOT NULL,
  amount_paid NUMERIC(10, 2) DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('paid', 'partial', 'credit')),
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- 10. Purchase Items Table
CREATE TABLE IF NOT EXISTS purchase_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  purchase_id UUID REFERENCES purchases(id) ON DELETE CASCADE,
  item_id UUID REFERENCES items(id) ON DELETE RESTRICT,
  description TEXT,
  quantity NUMERIC(10, 2) NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL,
  gst_rate NUMERIC(5, 2) NOT NULL,
  line_total NUMERIC(10, 2) NOT NULL
);
ALTER TABLE purchase_items ENABLE ROW LEVEL SECURITY;

-- 11. Cashbook Entries Table
CREATE TABLE IF NOT EXISTS cashbook_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('in', 'out')),
  mode TEXT NOT NULL CHECK (mode IN ('cash', 'bank')),
  amount NUMERIC(10, 2) NOT NULL,
  category TEXT NOT NULL,
  linked_contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  note TEXT,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE cashbook_entries ENABLE ROW LEVEL SECURITY;

-- 12. Expenses Table
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  category TEXT NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('cash', 'bank')),
  note TEXT,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Businesses
CREATE POLICY "Users can view businesses they belong to" ON businesses
FOR SELECT USING (user_id = auth.uid() OR id IN (SELECT business_id FROM business_users WHERE user_id = auth.uid()));

CREATE POLICY "Owners can manage their businesses" ON businesses
FOR ALL USING (user_id = auth.uid());

-- Business Users
CREATE POLICY "Users can view their own business_users row" ON business_users
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Owners can manage business_users" ON business_users
FOR ALL USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));

-- Invites
CREATE POLICY "Admins can manage invites" ON invites
FOR ALL USING (business_id IN (SELECT business_id FROM business_users WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users can view invites for their email" ON invites
FOR SELECT USING (email = (auth.jwt() ->> 'email'));

-- Contacts
CREATE POLICY "Users can manage contacts for their businesses" ON contacts
FOR ALL USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()) OR business_id IN (SELECT business_id FROM business_users WHERE user_id = auth.uid()));

-- Items
CREATE POLICY "Users can manage items for their businesses" ON items
FOR ALL USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()) OR business_id IN (SELECT business_id FROM business_users WHERE user_id = auth.uid()));

-- Sales
CREATE POLICY "Users can manage sales for their businesses" ON sales
FOR ALL USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()) OR business_id IN (SELECT business_id FROM business_users WHERE user_id = auth.uid()));

-- Sale Items
CREATE POLICY "Users can manage sale_items for their businesses" ON sale_items
FOR ALL USING (sale_id IN (SELECT id FROM sales WHERE business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()) OR business_id IN (SELECT business_id FROM business_users WHERE user_id = auth.uid())));

-- Purchases
CREATE POLICY "Users can manage purchases for their businesses" ON purchases
FOR ALL USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()) OR business_id IN (SELECT business_id FROM business_users WHERE user_id = auth.uid()));

-- Purchase Items
CREATE POLICY "Users can manage purchase_items for their businesses" ON purchase_items
FOR ALL USING (purchase_id IN (SELECT id FROM purchases WHERE business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()) OR business_id IN (SELECT business_id FROM business_users WHERE user_id = auth.uid())));

-- Cashbook
CREATE POLICY "Users can manage cashbook for their businesses" ON cashbook_entries
FOR ALL USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()) OR business_id IN (SELECT business_id FROM business_users WHERE user_id = auth.uid()));

-- Expenses
CREATE POLICY "Users can manage expenses for their businesses" ON expenses
FOR ALL USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()) OR business_id IN (SELECT business_id FROM business_users WHERE user_id = auth.uid()));
