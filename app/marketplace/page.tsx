"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useWallet } from "@/contexts/wallet-context"
import { ShoppingCart, Sparkles, TrendingUp, Wallet } from "lucide-react"
import { marketplaceItems, type MarketplaceItem } from "@/lib/marketplace-items"

// Placeholder values
const CURRENT_KARMA_POINTS = 1250
const ETH_PRICE_USD = 2950
const KARMA_TO_ETH_RATE = 0.00001 // 1 Karma Point = 0.00001 ETH

export default function MarketplacePage() {
  const { isConnected } = useWallet()
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null)

  // Calculate ETH equivalent
  const karmaInETH = CURRENT_KARMA_POINTS * KARMA_TO_ETH_RATE
  const karmaValueUSD = karmaInETH * ETH_PRICE_USD

  const handleRedeem = (item: MarketplaceItem) => {
    if (CURRENT_KARMA_POINTS >= item.cost) {
      // Placeholder: In a real app, this would trigger a transaction
      alert(`Redeeming ${item.name} for ${item.cost} Karma Points...`)
      setSelectedItem(item)
    } else {
      alert(`Insufficient Karma Points. You need ${item.cost} but only have ${CURRENT_KARMA_POINTS}.`)
    }
  }

  const canAfford = (cost: number) => {
    return CURRENT_KARMA_POINTS >= cost
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 tracking-wider">Marketplace</h1>
          <p className="text-neutral-400">Spend your Karma Points on exclusive rewards and perks</p>
        </div>

        {/* Karma Points Display Card */}
        <Card className="bg-gradient-to-br from-orange-500/10 via-neutral-900 to-neutral-900 border-orange-500/30 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              {/* Left Section - Karma Points */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-orange-500/20 rounded-lg border border-orange-500/30">
                    <Sparkles className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <div className="text-sm text-neutral-400 mb-1">Your Current Balance</div>
                    <div className="text-3xl font-bold text-white">
                      {CURRENT_KARMA_POINTS.toLocaleString()} Karma Points
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle Section - ETH Price */}
              <div className="flex-1 border-l border-neutral-800 pl-6">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-neutral-400" />
                  <span className="text-sm text-neutral-400">Current ETH Price</span>
                </div>
                <div className="text-xl font-bold text-white">1 ETH = ${ETH_PRICE_USD.toLocaleString()}</div>
              </div>

              {/* Right Section - ETH Equivalent */}
              <div className="flex-1 border-l border-neutral-800 pl-6">
                <div className="flex items-center gap-2 mb-2">
                  <Wallet className="w-4 h-4 text-orange-400" />
                  <span className="text-sm text-neutral-400">ETH Equivalent</span>
                </div>
                <div className="text-xl font-bold text-orange-500">
                  ≈ {karmaInETH.toFixed(4)} ETH
                </div>
                <div className="text-sm text-neutral-500 mt-1">
                  (≈ ${karmaValueUSD.toFixed(2)} USD)
                </div>
              </div>
            </div>

            {/* Conversion Rate Info */}
            <div className="mt-4 pt-4 border-t border-neutral-800">
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <span>Conversion Rate: 1 Karma Point = {KARMA_TO_ETH_RATE} ETH</span>
                {isConnected && (
                  <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                    Wallet Connected
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Marketplace Items Grid */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Available Rewards</h2>
            <Badge variant="outline" className="bg-neutral-800 text-neutral-300 border-neutral-700">
              {marketplaceItems.length} items available
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {marketplaceItems.map((item) => (
              <MarketplaceItemCard
                key={item.id}
                item={item}
                currentKarma={CURRENT_KARMA_POINTS}
                onRedeem={handleRedeem}
                canAfford={canAfford(item.cost)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Marketplace Item Card Component
interface MarketplaceItemCardProps {
  item: MarketplaceItem
  currentKarma: number
  onRedeem: (item: MarketplaceItem) => void
  canAfford: boolean
}

function MarketplaceItemCard({ item, currentKarma, onRedeem, canAfford }: MarketplaceItemCardProps) {
  return (
    <Card className="bg-neutral-900 border-neutral-800 hover:border-orange-500/50 transition-all duration-300 overflow-hidden group h-full flex flex-col">
      {/* Image */}
      <div className="relative w-full h-48 bg-neutral-800 overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = "https://via.placeholder.com/400x300?text=No+Image"
          }}
        />
        {item.stock !== undefined && (
          <div className="absolute top-2 right-2">
            <Badge
              variant="outline"
              className={`${
                item.stock > 20
                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                  : "bg-orange-500/20 text-orange-400 border-orange-500/30"
              }`}
            >
              {item.stock} left
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4 flex flex-col flex-1">
        {/* Category Badge */}
        <div className="mb-2">
          <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
            {item.category}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{item.name}</h3>

        {/* Description */}
        <p className="text-sm text-neutral-400 mb-4 flex-1 line-clamp-2">{item.description}</p>

        {/* Cost */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs text-neutral-500 mb-1">Cost</div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span className="text-lg font-bold text-orange-500">{item.cost.toLocaleString()}</span>
              <span className="text-sm text-neutral-400">Karma Points</span>
            </div>
          </div>
        </div>

        {/* Affordability Indicator */}
        {!canAfford && (
          <div className="mb-3 p-2 bg-red-500/10 border border-red-500/30 rounded text-xs text-red-400">
            You need {item.cost - currentKarma} more Karma Points
          </div>
        )}

        {/* Redeem Button */}
        <Button
          onClick={() => onRedeem(item)}
          disabled={!canAfford}
          className={`w-full ${
            canAfford
              ? "bg-orange-500 hover:bg-orange-600 text-white"
              : "bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700"
          }`}
          size="lg"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {canAfford ? "Redeem Now" : "Insufficient Points"}
        </Button>
      </CardContent>
    </Card>
  )
}
