# Supabase Database Setup Guide

This guide will help you set up the necessary database tables in Supabase to support wallet-linked user profiles and listing requests.

## Prerequisites

1. A Supabase project (create at https://supabase.com)
2. Access to your Supabase SQL Editor

## Database Tables

### 1. Users Table

This table stores user profiles linked to wallet addresses.

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

-- Create index on wallet_address for faster lookups
CREATE INDEX idx_users_wallet_address ON public.users(wallet_address);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own data
CREATE POLICY "Users can read own profile"
ON public.users
FOR SELECT
TO public
USING (true);

-- Create policy to allow users to insert their own profile
CREATE POLICY "Users can insert own profile"
ON public.users
FOR INSERT
TO public
WITH CHECK (true);

-- Create policy to allow users to update their own profile
CREATE POLICY "Users can update own profile"
ON public.users
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);
```

### 2. Requests Table

This table stores requests for listings.

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

-- Create indexes for faster queries
CREATE INDEX idx_requests_listing_id ON public.requests(listing_id);
CREATE INDEX idx_requests_requester ON public.requests(requester_wallet_address);
CREATE INDEX idx_requests_owner ON public.requests(owner_wallet_address);
CREATE INDEX idx_requests_status ON public.requests(status);

-- Enable Row Level Security
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read requests where they are owner or requester
CREATE POLICY "Users can read own requests"
ON public.requests
FOR SELECT
TO public
USING (true);

-- Create policy to allow users to create requests
CREATE POLICY "Users can create requests"
ON public.requests
FOR INSERT
TO public
WITH CHECK (true);

-- Create policy to allow owners to update their listing requests
CREATE POLICY "Owners can update requests"
ON public.requests
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);
```

### 3. Update Listings Table

Add a `wallet_address` column to link listings to user wallet addresses.

```sql
-- Add wallet_address column to listings table
ALTER TABLE public.listings
ADD COLUMN IF NOT EXISTS wallet_address VARCHAR(255);

-- Create index on wallet_address
CREATE INDEX IF NOT EXISTS idx_listings_wallet_address ON public.listings(wallet_address);

-- Optional: Add foreign key relationship (if you want referential integrity)
-- ALTER TABLE public.listings
-- ADD CONSTRAINT fk_listings_wallet_address
-- FOREIGN KEY (wallet_address) REFERENCES public.users(wallet_address);
```

### 4. Update Function (Optional)

Create a function to automatically update the `updated_at` timestamp:

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

## Migration Steps

1. **Run the SQL scripts in order:**
   - First, create the `users` table
   - Then, create the `requests` table
   - Finally, update the `listings` table

2. **Set up Row Level Security (RLS):**
   - The policies above allow public read/write access
   - Adjust policies based on your security requirements
   - For production, consider more restrictive policies

3. **Link existing listings to wallet addresses:**
   - You may want to migrate existing listings to include wallet addresses
   - You can do this by matching `user_name` in listings to `user_name` in users table

```sql
-- Example migration script (adjust based on your data)
UPDATE public.listings l
SET wallet_address = u.wallet_address
FROM public.users u
WHERE l.user_name = u.user_name
AND l.wallet_address IS NULL;
```

## Testing

After setup, test the following:

1. Connect wallet → User profile should be created automatically
2. Update profile → Changes should be saved to database
3. Create listing → Listing should include wallet_address
4. Request item → Request should be created and visible to owner
5. View requests → Owner should see all requests for their listings

## Troubleshooting

### "relation does not exist" error
- Make sure you're running SQL in the correct database schema (public)
- Check that tables are created in the Supabase SQL Editor

### "permission denied" error
- Check RLS policies are correctly set up
- Verify your Supabase anon key has proper permissions

### "unique constraint violation" for wallet_address
- Wallet addresses should be unique per user
- The app handles this automatically by checking for existing users

## Next Steps

1. Install dependencies: `npm install @supabase/supabase-js`
2. Set environment variables in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```
3. Test wallet connection and profile creation
4. Test creating listing requests

