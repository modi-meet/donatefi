import { supabase } from './supabase'
import { type User, type DatabaseUser, mapDatabaseUserToUser } from './user-types'

export class UserService {
  /**
   * Get or create user profile from wallet address
   */
  static async getOrCreateUser(walletAddress: string): Promise<User | null> {
    try {
      // Try to get existing user
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('wallet_address', walletAddress.toLowerCase())
        .single()

      if (existingUser) {
        return mapDatabaseUserToUser(existingUser)
      }

      // Create new user if doesn't exist
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([
          {
            wallet_address: walletAddress.toLowerCase(),
            user_name: null,
            email: null,
            phone_number: null,
            location: null,
          },
        ])
        .select()
        .single()

      if (createError) {
        throw createError
      }

      return newUser ? mapDatabaseUserToUser(newUser) : null
    } catch (error) {
      console.error('Error getting/creating user:', error)
      throw error
    }
  }

  /**
   * Update user profile
   */
  static async updateUser(
    walletAddress: string,
    updates: {
      user_name?: string | null
      email?: string | null
      phone_number?: string | null
      location?: string | null
    }
  ): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('wallet_address', walletAddress.toLowerCase())
        .select()
        .single()

      if (error) {
        throw error
      }

      return data ? mapDatabaseUserToUser(data) : null
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  }

  /**
   * Get user by wallet address
   */
  static async getUserByWalletAddress(walletAddress: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('wallet_address', walletAddress.toLowerCase())
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No user found
          return null
        }
        throw error
      }

      return data ? mapDatabaseUserToUser(data) : null
    } catch (error) {
      console.error('Error getting user:', error)
      throw error
    }
  }

  /**
   * Get wallet address by user name (for finding listing owners)
   */
  static async getWalletAddressByUserName(userName: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('wallet_address')
        .eq('user_name', userName)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null
        }
        throw error
      }

      return data?.wallet_address || null
    } catch (error) {
      console.error('Error getting wallet by user name:', error)
      throw error
    }
  }
}

