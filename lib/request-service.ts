import { supabase } from '@/lib/supabase'
import { type Request, type DatabaseRequest, mapDatabaseRequestToRequest } from '@/lib/user-types'

export class RequestService {
  /**
   * Create a request for a listing
   */
  static async createRequest(
    listingId: string,
    requesterWalletAddress: string,
    ownerWalletAddress: string
  ): Promise<Request | null> {
    try {
      const { data, error } = await supabase
        .from('requests')
        .insert([
          {
            listing_id: listingId,
            requester_wallet_address: requesterWalletAddress.toLowerCase(),
            owner_wallet_address: ownerWalletAddress.toLowerCase(),
            status: 'pending',
          },
        ])
        .select()
        .single()

      if (error) {
        throw error
      }

      return data ? mapDatabaseRequestToRequest(data) : null
    } catch (error) {
      console.error('Error creating request:', error)
      throw error
    }
  }

  /**
   * Get requests for a listing owner
   */
  static async getRequestsForOwner(ownerWalletAddress: string): Promise<Request[]> {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .eq('owner_wallet_address', ownerWalletAddress.toLowerCase())
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      return data ? data.map(mapDatabaseRequestToRequest) : []
    } catch (error) {
      console.error('Error getting requests:', error)
      throw error
    }
  }

  /**
   * Get requests by requester
   */
  static async getRequestsByRequester(requesterWalletAddress: string): Promise<Request[]> {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .eq('requester_wallet_address', requesterWalletAddress.toLowerCase())
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      return data ? data.map(mapDatabaseRequestToRequest) : []
    } catch (error) {
      console.error('Error getting requests:', error)
      throw error
    }
  }

  /**
   * Update request status
   */
  static async updateRequestStatus(
    requestId: string,
    status: 'pending' | 'approved' | 'rejected' | 'completed'
  ): Promise<Request | null> {
    try {
      const { data, error } = await supabase
        .from('requests')
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq('request_id', requestId)
        .select()
        .single()

      if (error) {
        throw error
      }

      return data ? mapDatabaseRequestToRequest(data) : null
    } catch (error) {
      console.error('Error updating request:', error)
      throw error
    }
  }

  /**
   * Get requests for a specific listing
   */
  static async getRequestsForListing(listingId: string): Promise<Request[]> {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .eq('listing_id', listingId)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      return data ? data.map(mapDatabaseRequestToRequest) : []
    } catch (error) {
      console.error('Error getting listing requests:', error)
      throw error
    }
  }
}

