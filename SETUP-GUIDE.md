# Complete Setup Guide: Wallet-Integrated User System

This guide covers everything you need to do to get the wallet-linked user profiles and listing requests system working.

## 📋 Overview

The system now includes:
- ✅ Wallet address linked to user profiles
- ✅ Profile management page (name, email, phone, location)
- ✅ Request system for listings
- ✅ Requests page for listing owners
- ✅ Automatic user profile creation on wallet connection

## 🔧 Step 1: Install Dependencies

Make sure you have the Supabase client installed:

```bash
npm install @supabase/supabase-js
```

## 🔧 Step 2: Set Up Supabase Database

### 2.1 Create Users Table

Run this SQL in your Supabase SQL Editor:

```sql
-- Create users table
CREATE TABLE public.users (
  user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address VARCHAR(255) UNIQUE NOT NULL,
  user_name VARCHAR(100),
  email VARCHAR(255),
  phone_number VARCHAR(20),
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_users_wallet_address ON public.users(wallet_address);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Allow public access (adjust based on your security needs)
CREATE POLICY "Users can read all profiles"
ON public.users FOR SELECT TO public USING (true);

CREATE POLICY "Users can insert own profile"
ON public.users FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Users can update own profile"
ON public.users FOR UPDATE TO public USING (true) WITH CHECK (true);
```

### 2.2 Create Requests Table

```sql
-- Create requests table
CREATE TABLE public.requests (
  request_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES public.listings(listing_id) ON DELETE CASCADE,
  requester_wallet_address VARCHAR(255) NOT NULL,
  owner_wallet_address VARCHAR(255) NOT NULL,
  status VARCHAR(20) CHECK (status IN ('pending', 'approved', 'rejected', 'completed')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_requests_listing_id ON public.requests(listing_id);
CREATE INDEX idx_requests_requester ON public.requests(requester_wallet_address);
CREATE INDEX idx_requests_owner ON public.requests(owner_wallet_address);
CREATE INDEX idx_requests_status ON public.requests(status);

-- Enable Row Level Security
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;

-- Allow public access (adjust based on your security needs)
CREATE POLICY "Users can read all requests"
ON public.requests FOR SELECT TO public USING (true);

CREATE POLICY "Users can create requests"
ON public.requests FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Users can update requests"
ON public.requests FOR UPDATE TO public USING (true) WITH CHECK (true);
```

### 2.3 Update Listings Table

Add a `wallet_address` column to link listings to users:

```sql
-- Add wallet_address column to listings table
ALTER TABLE public.listings
ADD COLUMN IF NOT EXISTS wallet_address VARCHAR(255);

-- Create index
CREATE INDEX IF NOT EXISTS idx_listings_wallet_address ON public.listings(wallet_address);
```

### 2.4 Optional: Auto-update Timestamps

```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for users table
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger for requests table
CREATE TRIGGER update_requests_updated_at
BEFORE UPDATE ON public.requests
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

## 🔧 Step 3: Link Existing Listings to Wallet Addresses (Optional)

If you have existing listings, you can link them to wallet addresses by matching user names:

```sql
-- Example: Link listings to users based on user_name
-- Note: This assumes users have already created profiles with matching user_name
UPDATE public.listings l
SET wallet_address = u.wallet_address
FROM public.users u
WHERE l.user_name = u.user_name
AND l.wallet_address IS NULL;
```

## 🔧 Step 4: Environment Variables

Make sure your `.env.local` file has:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these from: Supabase Dashboard → Settings → API

## 🎯 How It Works

### User Profile Creation
1. User connects wallet → User profile automatically created in Supabase
2. Profile is linked to wallet address (unique identifier)
3. User can update profile from Profile page in navbar

### Listing Requests
1. User views listing details
2. Clicks "Receive This Item" → Request created in Supabase
3. Request includes:
   - Listing ID
   - Requester wallet address (current user)
   - Owner wallet address (listing owner)
   - Status (pending by default)

### Request Management
1. Listing owners can view requests at `/requests`
2. Owners see all requests for their listings
3. Owners can approve/reject requests
4. Request status updates in real-time

## 🔍 Testing Checklist

- [ ] Connect wallet → Profile automatically created
- [ ] Navigate to Profile page → Update name, email, phone, location
- [ ] View a listing → Click "Receive This Item"
- [ ] Check Requests page → See pending requests
- [ ] Approve/Reject requests → Status updates correctly

## ⚠️ Important Notes

1. **Wallet Address Storage**: All wallet addresses are stored in lowercase for consistency
2. **User Matching**: The system tries to find listing owners by:
   - First checking `wallet_address` in listing
   - If not found, matching by `user_name` in users table
3. **Security**: RLS policies allow public access. Adjust for production needs
4. **Data Migration**: If you have existing data, run the migration SQL to link listings to users

## 🐛 Troubleshooting

### "Unable to find listing owner's wallet address"
- Make sure the listing owner has a profile in the `users` table
- Ensure `user_name` in listing matches `user_name` in users table
- Or add `wallet_address` directly to listings when creating them

### Profile not updating
- Check browser console for errors
- Verify RLS policies allow updates
- Ensure wallet is connected

### Requests not showing
- Verify you're viewing requests as the listing owner
- Check that `owner_wallet_address` in requests matches your wallet
- Ensure wallet addresses are in lowercase (system handles this)

## 📝 Next Steps (Optional Enhancements)

1. Add request notifications/badges
2. Add email notifications when requests are created
3. Add request history for requesters
4. Add filters/sorting to requests page
5. Add request details page

