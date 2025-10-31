"use client"

import { useWallet } from "@/contexts/wallet-context"
import { useCallback } from "react"

/**
 * Custom hook for wallet integration with additional utilities
 */
export function useWalletIntegration() {
  const wallet = useWallet()

  const formatAddress = useCallback((address: string, chars = 4) => {
    if (!address) return ""
    return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`
  }, [])

  const formatBalance = useCallback((balance: string, decimals = 4) => {
    if (!balance) return "0"
    return parseFloat(balance).toFixed(decimals)
  }, [])

  const getNetworkName = useCallback((chainId: number) => {
    switch (chainId) {
      case 1:
        return "Ethereum Mainnet"
      case 5:
        return "Goerli Testnet"
      case 11155111:
        return "Sepolia Testnet"
      case 137:
        return "Polygon Mainnet"
      case 80001:
        return "Polygon Mumbai"
      case 56:
        return "BSC Mainnet"
      case 97:
        return "BSC Testnet"
      default:
        return `Chain ${chainId}`
    }
  }, [])

  const getExplorerUrl = useCallback((address: string, chainId: number) => {
    switch (chainId) {
      case 1:
        return `https://etherscan.io/address/${address}`
      case 5:
        return `https://goerli.etherscan.io/address/${address}`
      case 11155111:
        return `https://sepolia.etherscan.io/address/${address}`
      case 137:
        return `https://polygonscan.com/address/${address}`
      case 80001:
        return `https://mumbai.polygonscan.com/address/${address}`
      case 56:
        return `https://bscscan.com/address/${address}`
      case 97:
        return `https://testnet.bscscan.com/address/${address}`
      default:
        return null
    }
  }, [])

  const isMainnet = wallet.chainId === 1
  const isTestnet = wallet.chainId && wallet.chainId !== 1

  const connectWithErrorHandling = useCallback(async () => {
    try {
      await wallet.connect()
      return { success: true, error: null }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }, [wallet])

  const disconnectWithErrorHandling = useCallback(async () => {
    try {
      await wallet.disconnect()
      return { success: true, error: null }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }, [wallet])

  return {
    ...wallet,
    // Utility functions
    formatAddress,
    formatBalance,
    getNetworkName,
    getExplorerUrl,
    // Status helpers
    isMainnet,
    isTestnet,
    // Enhanced connection methods
    connectWithErrorHandling,
    disconnectWithErrorHandling,
  }
}
