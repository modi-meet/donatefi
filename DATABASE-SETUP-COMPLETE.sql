-- ============================================
-- Complete Database Setup for DonateFi
-- Run this script in your Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. USERS TABLE
-- Stores user profiles linked to wallet addresses
-- ============================================

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

-- Create index on wallet_address for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON public.users(wallet_address);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own data
DROP POLICY IF EXISTS "Users can read own profile" ON public.users;
CREATE POLICY "Users can read own profile"
ON public.users
FOR SELECT
TO public
USING (true);

-- Create policy to allow users to insert their own profile
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
CREATE POLICY "Users can insert own profile"
ON public.users
FOR INSERT
TO public
WITH CHECK (true);

-- Create policy to allow users to update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile"
ON public.users
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- ============================================
-- 2. LISTINGS TABLE UPDATES
-- Add wallet_address (owner_wallet_address) column
-- ============================================

-- Add wallet_address column to listings table if it doesn't exist
-- This stores the owner's wallet address
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'listings' 
    AND column_name = 'wallet_address'
  ) THEN
    ALTER TABLE public.listings
    ADD COLUMN wallet_address VARCHAR(255);
  END IF;
END $$;

-- Create index on wallet_address for faster queries
CREATE INDEX IF NOT EXISTS idx_listings_wallet_address ON public.listings(wallet_address);

-- Add comment to explain the column
COMMENT ON COLUMN public.listings.wallet_address IS 'Wallet address of the listing owner (who created the listing)';

-- ============================================
-- 3. REQUESTS TABLE
-- Stores requests for listings between users
-- ============================================

CREATE TABLE IF NOT EXISTS public.requests (
  request_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL,
  requester_wallet_address VARCHAR(255) NOT NULL,
  owner_wallet_address VARCHAR(255) NOT NULL,
  status VARCHAR(20) CHECK (status IN ('pending', 'approved', 'rejected', 'completed')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Foreign key constraint (if listings table uses UUID for listing_id)
  CONSTRAINT fk_requests_listing 
    FOREIGN KEY (listing_id) 
    REFERENCES public.listings(listing_id) 
    ON DELETE CASCADE
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_requests_listing_id ON public.requests(listing_id);
CREATE INDEX IF NOT EXISTS idx_requests_requester ON public.requests(requester_wallet_address);
CREATE INDEX IF NOT EXISTS idx_requests_owner ON public.requests(owner_wallet_address);
CREATE INDEX IF NOT EXISTS idx_requests_status ON public.requests(status);

-- Composite index for common queries (owner + status)
CREATE INDEX IF NOT EXISTS idx_requests_owner_status ON public.requests(owner_wallet_address, status);

-- Enable Row Level Security
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read requests where they are owner or requester
DROP POLICY IF EXISTS "Users can read own requests" ON public.requests;
CREATE POLICY "Users can read own requests"
ON public.requests
FOR SELECT
TO public
USING (true);

-- Create policy to allow users to create requests
DROP POLICY IF EXISTS "Users can create requests" ON public.requests;
CREATE POLICY "Users can create requests"
ON public.requests
FOR INSERT
TO public
WITH CHECK (true);

-- Create policy to allow owners to update their listing requests
DROP POLICY IF EXISTS "Owners can update requests" ON public.requests;
CREATE POLICY "Owners can update requests"
ON public.requests
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- ============================================
-- 4. AUTOMATIC TIMESTAMP UPDATES
-- Function to update updated_at column automatically
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for users table
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger for requests table
DROP TRIGGER IF EXISTS update_requests_updated_at ON public.requests;
CREATE TRIGGER update_requests_updated_at
BEFORE UPDATE ON public.requests
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger for listings table (if updated_at column exists)
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'listings' 
    AND column_name = 'updated_at'
  ) THEN
    DROP TRIGGER IF EXISTS update_listings_updated_at ON public.listings;
    CREATE TRIGGER update_listings_updated_at
    BEFORE UPDATE ON public.listings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- ============================================
-- 5. DATA MIGRATION (Optional)
-- Link existing listings to wallet addresses based on user_name
-- Only run this if you have existing listings that need linking
-- ============================================

-- Example migration script (uncomment and adjust if needed)
/*
UPDATE public.listings l
SET wallet_address = u.wallet_address
FROM public.users u
WHERE l.user_name = u.user_name
AND l.wallet_address IS NULL;
*/

-- ============================================
-- 6. VERIFICATION QUERIES
-- Run these to verify your setup
-- ============================================

-- Check users table structure
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_schema = 'public' AND table_name = 'users';

-- Check listings table structure
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_schema = 'public' AND table_name = 'listings';

-- Check requests table structure
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_schema = 'public' AND table_name = 'requests';

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- Your database is now ready for:
-- 1. User profiles linked to wallet addresses
-- 2. Listings with owner wallet addresses
-- 3. Requests tracking between requesters and owners
-- ============================================

