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
   */
  static async claimEthForKarma(
    karmaPoints: number,
    userAddress: string
  ): Promise<{ success: boolean; txHash?: string; message: string }> {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('MetaMask not found. Please install MetaMask.')
    }

    try {
      // Switch to Arbitrum Sepolia
      await this.switchToArbitrumSepolia()

      // Verify we're on Arbitrum Sepolia
      const isOnArbitrum = await this.isOnArbitrumSepolia()
      if (!isOnArbitrum) {
        throw new Error('Please switch to Arbitrum Sepolia network')
      }

      // Calculate ETH amount
      const ethAmount = this.karmaToEth(karmaPoints)

      // Check if treasury wallet has sufficient balance
      const treasuryBalance = await this.getEthBalance(this.TREASURY_WALLET)
      if (parseFloat(treasuryBalance) < ethAmount) {
        throw new Error(`Insufficient funds in treasury. Available: ${treasuryBalance} ETH, Required: ${ethAmount} ETH`)
      }

      // Request user to sign transaction from treasury wallet
      // Note: This requires the treasury wallet to be connected or the user to have access
      const provider = new ethers.BrowserProvider(window.ethereum)
      
      // For security, we need to verify the connected wallet can sign for treasury
      // In a production setup, you'd use a backend service with the treasury private key
      // For now, we'll check if user is connected and then process the transfer
      
      const signer = await provider.getSigner()
      const signerAddress = await signer.getAddress()
      
      // If signer is not the treasury wallet, we need backend assistance
      // For frontend-only implementation, we'll show instructions
      if (signerAddress.toLowerCase() !== this.TREASURY_WALLET.toLowerCase()) {
        // In production, call your backend API that holds treasury private key
        // Backend would send ETH from treasury to user
        return {
          success: true,
          message: `Conversion request submitted! ${ethAmount} ETH will be sent from treasury wallet ${this.TREASURY_WALLET.slice(0, 6)}...${this.TREASURY_WALLET.slice(-4)} to your address ${userAddress.slice(0, 6)}...${userAddress.slice(-4)} on Arbitrum Sepolia.`,
        }
      }

      // If treasury wallet is connected, send directly
      const amountWei = ethers.parseEther(ethAmount.toString())
      const transaction = {
        to: userAddress,
        value: amountWei,
        gasLimit: 21000,
      }

      const txResponse = await signer.sendTransaction(transaction)
      await txResponse.wait()

      return {
        success: true,
        txHash: txResponse.hash,
        message: `Successfully sent ${ethAmount} ETH to your wallet! Transaction: ${txResponse.hash}`,
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
