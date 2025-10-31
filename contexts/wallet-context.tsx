"use client"

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { walletService, WalletState } from '@/lib/wallet'

interface WalletContextType extends WalletState {
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  switchToMainnet: () => Promise<void>
}

const initialState: WalletState = {
  isConnected: false,
  address: null,
  balance: null,
  chainId: null,
  isLoading: false,
  error: null,
}

type WalletAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CONNECTED'; payload: { address: string; chainId: number } }
  | { type: 'SET_BALANCE'; payload: string }
  | { type: 'SET_DISCONNECTED' }
  | { type: 'SET_CHAIN_CHANGED'; payload: number }

function walletReducer(state: WalletState, action: WalletAction): WalletState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload, error: null }
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false }
    case 'SET_CONNECTED':
      return {
        ...state,
        isConnected: true,
        address: action.payload.address,
        chainId: action.payload.chainId,
        isLoading: false,
        error: null,
      }
    case 'SET_BALANCE':
      return { ...state, balance: action.payload }
    case 'SET_DISCONNECTED':
      return {
        ...initialState,
      }
    case 'SET_CHAIN_CHANGED':
      return { ...state, chainId: action.payload }
    default:
      return state
  }
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(walletReducer, initialState)

  const connect = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      const { address, chainId } = await walletService.connect()
      dispatch({ type: 'SET_CONNECTED', payload: { address, chainId } })

      // Get balance
      const balance = await walletService.getBalance(address)
      dispatch({ type: 'SET_BALANCE', payload: balance })

      // Store connection in localStorage
      localStorage.setItem('wallet_connected', 'true')
      localStorage.setItem('wallet_address', address)
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
    }
  }

  const disconnect = async () => {
    try {
      await walletService.disconnect()
      dispatch({ type: 'SET_DISCONNECTED' })
      
      // Clear localStorage
      localStorage.removeItem('wallet_connected')
      localStorage.removeItem('wallet_address')
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
    }
  }

  const switchToMainnet = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      await walletService.switchToMainnet()
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
    }
  }

  // Check for existing connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      const wasConnected = localStorage.getItem('wallet_connected')
      const savedAddress = localStorage.getItem('wallet_address')
      
      if (wasConnected && savedAddress) {
        try {
          const provider = await walletService.detectProvider()
          const accounts = await provider.request({ method: 'eth_accounts' })
          
          if (accounts && accounts.length > 0 && accounts[0] === savedAddress) {
            const chainId = await provider.request({ method: 'eth_chainId' })
            dispatch({ 
              type: 'SET_CONNECTED', 
              payload: { 
                address: accounts[0], 
                chainId: parseInt(chainId, 16) 
              } 
            })

            // Get balance
            const balance = await walletService.getBalance(accounts[0])
            dispatch({ type: 'SET_BALANCE', payload: balance })
          } else {
            // Clear stale data
            localStorage.removeItem('wallet_connected')
            localStorage.removeItem('wallet_address')
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error)
          localStorage.removeItem('wallet_connected')
          localStorage.removeItem('wallet_address')
        }
      }
    }

    checkConnection()
  }, [])

  // Set up event listeners
  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect()
      } else if (accounts[0] !== state.address) {
        dispatch({ 
          type: 'SET_CONNECTED', 
          payload: { 
            address: accounts[0], 
            chainId: state.chainId || 1 
          } 
        })
        localStorage.setItem('wallet_address', accounts[0])
        
        // Update balance
        walletService.getBalance(accounts[0]).then(balance => {
          dispatch({ type: 'SET_BALANCE', payload: balance })
        })
      }
    }

    const handleChainChanged = (chainId: string) => {
      const newChainId = parseInt(chainId, 16)
      dispatch({ type: 'SET_CHAIN_CHANGED', payload: newChainId })
    }

    if (state.isConnected) {
      walletService.onAccountsChanged(handleAccountsChanged)
      walletService.onChainChanged(handleChainChanged)
    }

    return () => {
      walletService.removeAllListeners()
    }
  }, [state.isConnected, state.address, state.chainId])

  const value: WalletContextType = {
    ...state,
    connect,
    disconnect,
    switchToMainnet,
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}
