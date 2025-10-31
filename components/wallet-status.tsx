"use client"

import { useWallet } from "@/contexts/wallet-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet, AlertTriangle, CheckCircle, ExternalLink } from "lucide-react"

export default function WalletStatus() {
  const { isConnected, address, balance, chainId, error, switchToMainnet } = useWallet()

  if (!isConnected) {
    return null
  }

  const isMainnet = chainId === 1
  const getChainName = (id: number) => {
    switch (id) {
      case 1:
        return "Ethereum Mainnet"
      case 5:
        return "Goerli Testnet"
      case 11155111:
        return "Sepolia Testnet"
      default:
        return `Chain ${id}`
    }
  }

  const getExplorerUrl = (addr: string, chainId: number) => {
    switch (chainId) {
      case 1:
        return `https://etherscan.io/address/${addr}`
      case 5:
        return `https://goerli.etherscan.io/address/${addr}`
      case 11155111:
        return `https://sepolia.etherscan.io/address/${addr}`
      default:
        return null
    }
  }

  const explorerUrl = address && chainId ? getExplorerUrl(address, chainId) : null

  return (
    <Card className="bg-neutral-900 border-neutral-800">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-orange-500" />
            <span className="font-semibold text-white">Wallet Connected</span>
          </div>
          <CheckCircle className="w-5 h-5 text-green-400" />
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-neutral-400">Address:</span>
            <div className="flex items-center gap-2">
              <span className="text-white font-mono">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
              {explorerUrl && (
                <a
                  href={explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-500 hover:text-orange-400"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          {balance && (
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Balance:</span>
              <span className="text-white font-mono">{parseFloat(balance).toFixed(4)} ETH</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-neutral-400">Network:</span>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={
                  isMainnet
                    ? "bg-green-500/20 text-green-400 border-green-500/30"
                    : "bg-orange-500/20 text-orange-400 border-orange-500/30"
                }
              >
                {chainId && getChainName(chainId)}
              </Badge>
            </div>
          </div>

          {!isMainnet && (
            <div className="mt-3 p-2 bg-orange-500/10 border border-orange-500/30 rounded">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-orange-400" />
                <span className="text-orange-400 text-xs font-medium">Testnet Detected</span>
              </div>
              <p className="text-xs text-neutral-400 mb-2">
                You're connected to a test network. Switch to Ethereum Mainnet for production use.
              </p>
              <Button
                size="sm"
                onClick={switchToMainnet}
                className="bg-orange-500 hover:bg-orange-600 text-white text-xs"
              >
                Switch to Mainnet
              </Button>
            </div>
          )}

          {error && (
            <div className="mt-3 p-2 bg-red-500/10 border border-red-500/30 rounded">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-red-400 text-xs">{error}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
