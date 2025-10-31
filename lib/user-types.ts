// User profile type from Supabase
export interface DatabaseUser {
  user_id: string
  wallet_address: string
  user_name: string | null
  email: string | null
  phone_number: string | null
  location: string | null
  created_at: string
  updated_at: string
}

// Application user type
export interface User {
  userId: string
  walletAddress: string
  userName: string | null
  email: string | null
  phoneNumber: string | null
  location: string | null
  createdAt: string
  updatedAt: string
}

// Request type from Supabase
export interface DatabaseRequest {
  request_id: string
  listing_id: string
  requester_wallet_address: string
  owner_wallet_address: string
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  created_at: string
  updated_at: string
}

// Application request type
export interface Request {
  requestId: string
  listingId: string
  requesterWalletAddress: string
  ownerWalletAddress: string
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  createdAt: string
  updatedAt: string
}

// Helper functions
export function mapDatabaseUserToUser(dbUser: DatabaseUser): User {
  return {
    userId: dbUser.user_id,
    walletAddress: dbUser.wallet_address,
    userName: dbUser.user_name,
    email: dbUser.email,
    phoneNumber: dbUser.phone_number,
    location: dbUser.location,
    createdAt: dbUser.created_at,
    updatedAt: dbUser.updated_at,
  }
}

export function mapDatabaseRequestToRequest(dbRequest: DatabaseRequest): Request {
  return {
    requestId: dbRequest.request_id,
    listingId: dbRequest.listing_id,
    requesterWalletAddress: dbRequest.requester_wallet_address,
    ownerWalletAddress: dbRequest.owner_wallet_address,
    status: dbRequest.status,
    createdAt: dbRequest.created_at,
    updatedAt: dbRequest.updated_at,
  }
}

