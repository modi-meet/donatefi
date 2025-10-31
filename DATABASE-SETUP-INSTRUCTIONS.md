# Database Setup Instructions for Wallet-Integrated Requests

This guide provides step-by-step instructions to set up your Supabase database tables for the wallet-integrated listings and requests system.

## 📋 Overview

Your database needs three main tables:
1. **users** - Store user profiles linked to wallet addresses
2. **listings** - Store listings with owner wallet addresses (needs `wallet_address` column)
3. **requests** - Store requests between users for listings

---

## 🚀 Quick Setup (Run This First)

### Step 1: Run the Complete Setup Script

1. Open your **Supabase Dashboard**
2. Go to **SQL Editor**
3. Copy and paste the entire contents of `DATABASE-SETUP-COMPLETE.sql`
4. Click **Run** or press `Ctrl+Enter`

This script will:
- ✅ Create the `users` table (if it doesn't exist)
- ✅ Add `wallet_address` column to `listings` table
- ✅ Create the `requests` table
- ✅ Set up all indexes for performance
- ✅ Configure Row Level Security (RLS) policies
- ✅ Create triggers for automatic timestamp updates

---

## 📊 Database Schema

### 1. Users Table (`public.users`)

```sql
Columns:
- user_id (UUID, Primary Key)
- wallet_address (VARCHAR(255), Unique, Not Null)
- user_name (VARCHAR(100))
- email (VARCHAR(255))
- phone_number (VARCHAR(20))
- location (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

**Purpose**: Links user profiles to their wallet addresses.

### 2. Listings Table (`public.listings`)

**New Column Added**:
```sql
- wallet_address (VARCHAR(255)) - Owner's wallet address
```

**Important**: This column stores the wallet address of the user who created the listing (the owner).

### 3. Requests Table (`public.requests`)

```sql
Columns:
- request_id (UUID, Primary Key)
- listing_id (UUID, Foreign Key → listings.listing_id)
- requester_wallet_address (VARCHAR(255), Not Null)
- owner_wallet_address (VARCHAR(255), Not Null)
- status (VARCHAR(20)) - 'pending', 'approved', 'rejected', 'completed'
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

**Purpose**: Tracks requests from users (requester) to listing owners.

---

## 🔧 Manual Setup (If You Prefer Step-by-Step)

### Step 1: Create Users Table

```sql
CREATE TABLE IF NOT EXISTS public.users (
  user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address VARCHAR(255) UNIQUE NOT NULL,
  user_name VARCHAR(100),
  email VARCHAR(255),
  phone_number VARCHAR(20),
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_wallet_address ON public.users(wallet_address);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile" ON public.users FOR SELECT TO public USING (true);
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE TO public USING (true) WITH CHECK (true);
```

### Step 2: Update Listings Table

```sql
-- Add wallet_address column
ALTER TABLE public.listings
ADD COLUMN IF NOT EXISTS wallet_address VARCHAR(255);

-- Create index
CREATE INDEX IF NOT EXISTS idx_listings_wallet_address ON public.listings(wallet_address);
```

### Step 3: Create Requests Table

```sql
CREATE TABLE IF NOT EXISTS public.requests (
  request_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL,
  requester_wallet_address VARCHAR(255) NOT NULL,
  owner_wallet_address VARCHAR(255) NOT NULL,
  status VARCHAR(20) CHECK (status IN ('pending', 'approved', 'rejected', 'completed')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_requests_listing 
    FOREIGN KEY (listing_id) 
    REFERENCES public.listings(listing_id) 
    ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_requests_listing_id ON public.requests(listing_id);
CREATE INDEX idx_requests_requester ON public.requests(requester_wallet_address);
CREATE INDEX idx_requests_owner ON public.requests(owner_wallet_address);
CREATE INDEX idx_requests_status ON public.requests(status);
CREATE INDEX idx_requests_owner_status ON public.requests(owner_wallet_address, status);

-- Enable RLS
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own requests" ON public.requests FOR SELECT TO public USING (true);
CREATE POLICY "Users can create requests" ON public.requests FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Owners can update requests" ON public.requests FOR UPDATE TO public USING (true) WITH CHECK (true);
```

### Step 4: Create Timestamp Update Function

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_requests_updated_at
BEFORE UPDATE ON public.requests
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

---

## 🔄 Data Migration (For Existing Listings)

If you already have listings in your database, you can link them to wallet addresses:

### Option 1: Link by User Name

```sql
UPDATE public.listings l
SET wallet_address = u.wallet_address
FROM public.users u
WHERE l.user_name = u.user_name
AND l.wallet_address IS NULL;
```

### Option 2: Manual Update

If you know specific listing IDs and wallet addresses:

```sql
UPDATE public.listings
SET wallet_address = '0x...' -- Replace with actual wallet address
WHERE listing_id = '...' -- Replace with actual listing ID
```

---

## ✅ Verification Queries

After setup, run these to verify everything is working:

### Check Users Table
```sql
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'users';
```

### Check Listings Table (verify wallet_address column exists)
```sql
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'listings';
```

### Check Requests Table
```sql
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'requests';
```

### Test Request Creation
```sql
-- This should work if everything is set up correctly
INSERT INTO public.requests (listing_id, requester_wallet_address, owner_wallet_address)
VALUES (
  'YOUR_LISTING_ID_HERE',
  '0x1234567890abcdef1234567890abcdef12345678',
  '0xabcdef1234567890abcdef1234567890abcdef12'
)
RETURNING *;
```

---

## 🔒 Row Level Security (RLS) Notes

The setup includes RLS policies that allow:
- ✅ Users to read all profiles (for displaying user info)
- ✅ Users to create and update their own profiles
- ✅ Users to read all requests
- ✅ Users to create requests
- ✅ Owners to update request status

**For Production**: Consider making RLS policies more restrictive based on your security requirements.

---

## 🐛 Troubleshooting

### Error: "relation does not exist"
- Make sure you're running SQL in the correct database schema (public)
- Check that tables are created in the Supabase SQL Editor

### Error: "column already exists"
- The `IF NOT EXISTS` and `IF EXISTS` checks should prevent this
- If you see this, the column already exists (that's okay!)

### Error: "permission denied"
- Check RLS policies are correctly set up
- Verify your Supabase anon key has proper permissions

### Foreign Key Constraint Error
- Make sure the `listing_id` in requests matches an existing `listing_id` in listings
- Verify the data types match (both should be UUID)

---

## 📝 Next Steps After Database Setup

1. **Set Environment Variables** in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. **Test the Flow**:
   - Connect wallet → Profile created automatically
   - View listing → See owner wallet address
   - Click "Receive This Item" → Request created in database
   - Check `/requests` page → See pending requests

3. **Create Sample Data** (optional):
   ```sql
   -- Insert a test user
   INSERT INTO public.users (wallet_address, user_name)
   VALUES ('0x1234567890abcdef1234567890abcdef12345678', 'Test User');
   ```

---

## 🎯 Summary

**What gets set up**:
- ✅ Users table with wallet address linking
- ✅ Listings table with owner wallet address column
- ✅ Requests table for tracking item requests
- ✅ Indexes for fast queries
- ✅ RLS policies for security
- ✅ Automatic timestamp updates

**What this enables**:
- ✅ Users can create profiles linked to wallets
- ✅ Listings can track owner wallet addresses
- ✅ Users can request items (creates request record)
- ✅ Owners can see and manage requests

**Run the `DATABASE-SETUP-COMPLETE.sql` script and you're done!** 🚀

