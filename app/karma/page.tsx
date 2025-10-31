"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useWallet } from "@/contexts/wallet-context"
import { ArbitrumConverter } from "@/lib/arbitrum-convert"
import { 
  Coins, 
  Loader2, 
  AlertCircle,
  ExternalLink,
  Zap,
  CheckCircle
} from "lucide-react"

export default function KarmaPage() {
  const { isConnected, address } = useWallet()
  const [karmaAmount, setKarmaAmount] = useState(1000)
  const [claiming, setClaiming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleClaimEth = async () => {
    if (!isConnected || !address) {
      setError("Please connect your wallet first")
      return
    }

    if (karmaAmount <= 0) {
      setError("Please enter a valid karma amount")
      return
    }

    try {
      setClaiming(true)
      setError(null)
      setSuccess(null)

      // Switch to Arbitrum Sepolia and claim ETH
      const result = await ArbitrumConverter.claimEthForKarma(karmaAmount, address)
      
      if (result.success) {
        setSuccess(result.message)
      }
    } catch (err: any) {
      console.error('Error claiming ETH:', err)
      setError(err.message || 'Failed to claim ETH. Please try again.')
    } finally {
      setClaiming(false)
    }
  }

  const ethAmount = ArbitrumConverter.karmaToEth(karmaAmount)

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black p-6">
        <div className="container mx-auto max-w-2xl">
          <Card className="bg-neutral-900 border-neutral-700">
            <CardContent className="p-12 text-center">
              <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Wallet Not Connected</h2>
              <p className="text-neutral-400 mb-6">
                Please connect your wallet to convert karma points to ETH.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Convert Karma to ETH</h1>
          <p className="text-neutral-400">
            Exchange your karma points for ETH on Arbitrum Sepolia testnet
          </p>
        </div>

        {/* Exchange Card */}
        <Card className="bg-gradient-to-br from-orange-500/10 to-neutral-900 border-orange-500/30">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-8 h-8 text-orange-500" />
              <h2 className="text-2xl font-bold text-white">Karma Exchange</h2>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <div className="flex items-center gap-2 text-red-400">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="flex items-center gap-2 text-green-400 mb-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Success!</span>
                </div>
                <p className="text-sm text-neutral-300">{success}</p>
              </div>
            )}

            <div className="space-y-6">
              {/* Karma Amount Input */}
              <div>
                <label className="text-sm font-medium text-neutral-300 mb-2 block">
                  Karma Points to Convert
                </label>
                <input
                  type="number"
                  value={karmaAmount}
                  onChange={(e) => {
                    const value = Number(e.target.value)
                    if (value >= 0) {
                      setKarmaAmount(value)
                      setError(null)
                      setSuccess(null)
                    }
                  }}
                  min="1"
                  step="1"
                  className="w-full p-4 bg-neutral-800 border border-neutral-700 rounded-lg text-white text-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50"
                  placeholder="Enter karma amount"
                />
              </div>

              {/* Conversion Rate Info */}
              <div className="p-4 bg-neutral-800/50 rounded-lg border border-neutral-700">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-neutral-400">Exchange Rate:</span>
                  <span className="text-white font-medium">1 Karma = 0.000000001 ETH</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">You'll receive:</span>
                  <span className="text-orange-400 font-bold text-xl">
                    {ethAmount.toFixed(9)} ETH
                  </span>
                </div>
              </div>

              {/* Network Badge */}
              <div className="flex items-center justify-center">
                <Badge variant="outline" className="py-2 px-4 bg-blue-500/20 text-blue-400 border-blue-500/30">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Arbitrum Sepolia Testnet
                </Badge>
              </div>

              {/* Claim Button */}
              <Button
                onClick={handleClaimEth}
                disabled={claiming || karmaAmount <= 0}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white text-lg py-6"
                size="lg"
              >
                {claiming ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Coins className="w-5 h-5 mr-2" />
                    Claim ETH on Arbitrum Sepolia
                  </>
                )}
              </Button>

              {/* Treasury Info */}
              <div className="p-3 bg-neutral-800/30 rounded-lg border border-neutral-700/50">
                <div className="text-xs text-neutral-400 mb-1">ETH will be sent from:</div>
                <div className="text-xs font-mono text-orange-400 break-all">
                  0xb6ad1ad1637ad0f5c8dd7be68876f508e7e368f9
                </div>
              </div>

              {/* Info Note */}
              <div className="text-xs text-neutral-500 text-center space-y-1">
                <p>• MetaMask will switch to Arbitrum Sepolia network</p>
                <p>• ETH will be sent from treasury wallet to your address</p>
                <p>• Transaction may take a few moments to process</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How it Works */}
        <Card className="bg-neutral-900 border-neutral-700 mt-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-white mb-4">How It Works</h3>
            <div className="space-y-3 text-sm text-neutral-400">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs font-bold mt-0.5">
                  1
                </div>
                <div>
                  <div className="text-white font-medium mb-1">Enter Karma Amount</div>
                  <div>Specify how many karma points you want to convert to ETH</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs font-bold mt-0.5">
                  2
                </div>
                <div>
                  <div className="text-white font-medium mb-1">Switch Network</div>
                  <div>MetaMask will automatically switch to Arbitrum Sepolia testnet</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs font-bold mt-0.5">
                  3
                </div>
                <div>
                  <div className="text-white font-medium mb-1">Receive ETH</div>
                  <div>ETH will be sent to your wallet address on Arbitrum Sepolia</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}