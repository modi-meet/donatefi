// Database listing type (from Supabase)
export interface DatabaseListing {
  listing_id: string
  user_name: string
  user_profile_number: string
  user_address: string
  wallet_address?: string // Optional - owner's wallet address
  category: 'Food' | 'Education' | 'Cloth' | 'Others'
  title: string
  description: string
  quantity: number
  quality: 'New' | 'Good' | 'Used' | 'Poor'
  pickup_address: string
  contact_number: string
  listing_image_url: string | null
  status: string
  created_at: string
  updated_at: string
}

// Application listing type (mapped from database)
export interface Listing {
  id: string
  user_name: string
  user_profile_number: string
  user_address: string
  walletAddress?: string // Owner's wallet address
  category: 'Food' | 'Education' | 'Cloth' | 'Others'
  title: string
  description: string
  quantity: number
  quality: 'New' | 'Good' | 'Used' | 'Poor'
  pickup_address: string
  contact_number: string
  listing_image_url: string
}

// Helper function to map database listing to application listing
export function mapDatabaseListingToListing(dbListing: DatabaseListing): Listing {
  return {
    id: dbListing.listing_id,
    user_name: dbListing.user_name,
    user_profile_number: dbListing.user_profile_number,
    user_address: dbListing.user_address,
    walletAddress: dbListing.wallet_address,
    category: dbListing.category,
    title: dbListing.title,
    description: dbListing.description || '',
    quantity: dbListing.quantity || 0,
    quality: dbListing.quality,
    pickup_address: dbListing.pickup_address || '',
    contact_number: dbListing.contact_number || '',
    listing_image_url: dbListing.listing_image_url || 'https://via.placeholder.com/400x300?text=No+Image',
  }
}

