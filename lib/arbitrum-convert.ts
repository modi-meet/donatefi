import { ethers } from 'ethers'

// Arbitrum Sepolia testnet configuration
const ARBITRUM_SEPOLIA_CONFIG = {
  chainId: 421614,
  name: 'Arbitrum Sepolia',
  rpcUrl: 'https://sepolia-rollup.arbitrum.io/rpc',
  blockExplorer: 'https://sepolia.arbiscan.io',
}

// Conversion rate: 1 karma point = 0.000000001 ETH
const KARMA_TO_ETH_RATE = 0.000000001

export class ArbitrumConverter {
  /**
   * Switch to Arbitrum Sepolia network
   */
  static async switchToArbitrumSepolia(): Promise<void> {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('MetaMask not found. Please install MetaMask.')
    }

    try {
      // Try to switch to the network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${ARBITRUM_SEPOLIA_CONFIG.chainId.toString(16)}` }],
      })
    } catch (switchError: any) {
      // If network doesn't exist, add it
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: `0x${ARBITRUM_SEPOLIA_CONFIG.chainId.toString(16)}`,
              chainName: ARBITRUM_SEPOLIA_CONFIG.name,
              rpcUrls: [ARBITRUM_SEPOLIA_CONFIG.rpcUrl],
              blockExplorerUrls: [ARBITRUM_SEPOLIA_CONFIG.blockExplorer],
              nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18,
              },
            },
          ],
        })
      } else {
        throw switchError
      }
    }
  }

  /**
   * Convert karma points to ETH amount
   */
  static karmaToEth(karmaPoints: number): number {
    return karmaPoints * KARMA_TO_ETH_RATE
  }

  /**
   * Convert ETH amount to karma points needed
   */
  static ethToKarma(ethAmount: number): number {
    return Math.ceil(ethAmount / KARMA_TO_ETH_RATE)
  }

  /**
   * Check if currently on Arbitrum Sepolia
   */
  static async isOnArbitrumSepolia(): Promise<boolean> {
    if (typeof window === 'undefined' || !window.ethereum) {
      return false
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const network = await provider.getNetwork()
      return Number(network.chainId) === ARBITRUM_SEPOLIA_CONFIG.chainId
    } catch {
      return false
    }
  }

  // Treasury wallet that holds ETH for karma conversions
  static readonly TREASURY_WALLET = '0xb6ad1ad1637ad0f5c8dd7be68876f508e7e368f9'

  /**
   * Send ETH from treasury wallet to user's wallet on Arbitrum Sepolia
   * Calls backend API to execute the transaction
   */
  static async claimEthForKarma(
    karmaPoints: number,
    userAddress: string
  ): Promise<{ success: boolean; txHash?: string; message: string }> {
    if (typeof window === 'undefined') {
      throw new Error('This function can only be called from the browser')
    }

    try {
      // Switch to Arbitrum Sepolia for user
      if (window.ethereum) {
        await this.switchToArbitrumSepolia()
      }

      // Calculate ETH amount
      const ethAmount = this.karmaToEth(karmaPoints)

      // Call backend API to send ETH from treasury
      const response = await fetch('/api/karma/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          karmaPoints,
          userAddress,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to claim ETH')
      }

      return {
        success: true,
        txHash: data.txHash,
        message: data.message || `Successfully sent ${ethAmount} ETH to your wallet! Transaction: ${data.txHash}`,
      }
    } catch (error: any) {
      console.error('Error claiming ETH:', error)
      throw new Error(error.message || 'Failed to claim ETH')
    }
  }

  /**
   * Get ETH balance on Arbitrum Sepolia
   */
  static async getEthBalance(address: string): Promise<string> {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('MetaMask not found')
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const balance = await provider.getBalance(address)
      return ethers.formatEther(balance)
    } catch (error) {
      console.error('Error getting ETH balance:', error)
      throw error
    }
  }
}
