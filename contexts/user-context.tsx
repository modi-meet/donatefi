"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { UserService, type User } from '@/lib/user-service'
import { useWallet } from './wallet-context'

interface UserContextType {
  user: User | null
  loading: boolean
  updateProfile: (updates: {
    userName?: string | null
    email?: string | null
    phoneNumber?: string | null
    location?: string | null
  }) => Promise<void>
  refreshUser: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const { isConnected, address } = useWallet()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  // Load or create user when wallet connects
  useEffect(() => {
    const loadUser = async () => {
      if (isConnected && address) {
        try {
          setLoading(true)
          const userData = await UserService.getOrCreateUser(address)
          setUser(userData)
        } catch (error) {
          console.error('Error loading user:', error)
        } finally {
          setLoading(false)
        }
      } else {
        setUser(null)
      }
    }

    loadUser()
  }, [isConnected, address])

  const updateProfile = async (updates: {
    userName?: string | null
    email?: string | null
    phoneNumber?: string | null
    location?: string | null
  }) => {
    if (!address) {
      throw new Error('Wallet not connected')
    }

    try {
      setLoading(true)
      const updatedUser = await UserService.updateUser(address, {
        user_name: updates.userName,
        email: updates.email,
        phone_number: updates.phoneNumber,
        location: updates.location,
      })

      if (updatedUser) {
        setUser(updatedUser)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const refreshUser = async () => {
    if (!address) return

    try {
      setLoading(true)
      const userData = await UserService.getUserByWalletAddress(address)
      setUser(userData)
    } catch (error) {
      console.error('Error refreshing user:', error)
    } finally {
      setLoading(false)
    }
  }

  const value: UserContextType = {
    user,
    loading,
    updateProfile,
    refreshUser,
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

