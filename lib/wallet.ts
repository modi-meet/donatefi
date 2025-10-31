import detectEthereumProvider from '@metamask/detect-provider'
import { ethers } from 'ethers'

export interface WalletState {
  isConnected: boolean
  address: string | null
  balance: string | null
  chainId: number | null
  isLoading: boolean
  error: string | null
}

export class WalletService {
  private provider: any = null
  private signer: ethers.JsonRpcSigner | null = null

  async detectProvider(): Promise<any> {
    const provider = await detectEthereumProvider()
    if (provider) {
      this.provider = provider
      return provider
    }
    throw new Error('MetaMask not detected. Please install MetaMask.')
  }

  async connect(): Promise<{ address: string; chainId: number }> {
    try {
      const provider = await this.detectProvider()
      
      // Request account access
      const accounts = await provider.request({
        method: 'eth_requestAccounts',
      })

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please unlock MetaMask.')
      }

      // Get chain ID
      const chainId = await provider.request({
        method: 'eth_chainId',
      })

      // Create ethers provider and signer
      const ethersProvider = new ethers.BrowserProvider(provider)
      this.signer = await ethersProvider.getSigner()

      return {
        address: accounts[0],
        chainId: parseInt(chainId, 16),
      }
    } catch (error: any) {
      console.error('Error connecting to MetaMask:', error)
      throw new Error(error.message || 'Failed to connect to MetaMask')
    }
  }

  async getBalance(address: string): Promise<string> {
    try {
      if (!this.provider) {
        await this.detectProvider()
      }

      const ethersProvider = new ethers.BrowserProvider(this.provider)
      const balance = await ethersProvider.getBalance(address)
      return ethers.formatEther(balance)
    } catch (error) {
      console.error('Error getting balance:', error)
      return '0'
    }
  }

  async switchToMainnet(): Promise<void> {
    try {
      await this.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1' }], // Mainnet
      })
    } catch (error: any) {
      console.error('Error switching to mainnet:', error)
      throw new Error('Failed to switch to Ethereum Mainnet')
    }
  }

  async disconnect(): Promise<void> {
    this.provider = null
    this.signer = null
  }

  onAccountsChanged(callback: (accounts: string[]) => void): void {
    if (this.provider) {
      this.provider.on('accountsChanged', callback)
    }
  }

  onChainChanged(callback: (chainId: string) => void): void {
    if (this.provider) {
      this.provider.on('chainChanged', callback)
    }
  }

  removeAllListeners(): void {
    if (this.provider) {
      this.provider.removeAllListeners('accountsChanged')
      this.provider.removeAllListeners('chainChanged')
    }
  }

  getSigner(): ethers.JsonRpcSigner | null {
    return this.signer
  }

  getProvider(): any {
    return this.provider
  }
}

export const walletService = new WalletService()
