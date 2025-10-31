import { NextRequest, NextResponse } from 'next/server'
import { ethers } from 'ethers'

// Treasury wallet configuration
const TREASURY_WALLET_ADDRESS = '0xb6ad1ad1637ad0f5c8dd7be68876f508e7e368f9'
const TREASURY_PRIVATE_KEY = process.env.TREASURY_PRIVATE_KEY || ''

// Arbitrum Sepolia RPC
const ARBITRUM_SEPOLIA_RPC = 'https://sepolia-rollup.arbitrum.io/rpc'
const ARBITRUM_SEPOLIA_CHAIN_ID = 421614

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { karmaPoints, userAddress } = body

    if (!karmaPoints || !userAddress) {
      return NextResponse.json(
        { error: 'Missing karmaPoints or userAddress' },
        { status: 400 }
      )
    }

    if (!TREASURY_PRIVATE_KEY) {
      return NextResponse.json(
        { error: 'Treasury private key not configured. Please set TREASURY_PRIVATE_KEY environment variable.' },
        { status: 500 }
      )
    }

    // Calculate ETH amount (1 karma = 0.000000001 ETH)
    const ethAmount = karmaPoints * 0.000000001

    // Connect to Arbitrum Sepolia
    const provider = new ethers.JsonRpcProvider(ARBITRUM_SEPOLIA_RPC, {
      name: 'Arbitrum Sepolia',
      chainId: ARBITRUM_SEPOLIA_CHAIN_ID,
    })

    // Create wallet from private key
    const wallet = new ethers.Wallet(TREASURY_PRIVATE_KEY, provider)

    // Check treasury balance
    const treasuryBalance = await provider.getBalance(TREASURY_WALLET_ADDRESS)
    const ethAmountWei = ethers.parseEther(ethAmount.toString())
    
    if (treasuryBalance < ethAmountWei) {
      return NextResponse.json(
        { 
          error: `Insufficient funds in treasury. Available: ${ethers.formatEther(treasuryBalance)} ETH, Required: ${ethAmount} ETH` 
        },
        { status: 400 }
      )
    }

    // Estimate gas
    const gasPrice = await provider.getFeeData()
    const gasLimit = 21000n // Standard ETH transfer

    // Send transaction
    const tx = await wallet.sendTransaction({
      to: userAddress,
      value: ethAmountWei,
      gasLimit: gasLimit,
      gasPrice: gasPrice.gasPrice || undefined,
    })

    // Wait for transaction to be mined
    const receipt = await tx.wait()

    return NextResponse.json({
      success: true,
      txHash: tx.hash,
      blockNumber: receipt?.blockNumber,
      message: `Successfully sent ${ethAmount} ETH from treasury to ${userAddress}`,
    })
  } catch (error: any) {
    console.error('Error sending ETH:', error)
    return NextResponse.json(
      { 
        error: error.message || 'Failed to send ETH from treasury',
        details: error.toString()
      },
      { status: 500 }
    )
  }
}
