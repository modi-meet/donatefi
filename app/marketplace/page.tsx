"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useWallet } from "@/contexts/wallet-context"
import { ShoppingCart, Sparkles, TrendingUp, Wallet, AlertCircle } from "lucide-react"
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
  // Vary background tones for visual interest
  const backgroundVariants = [
    "bg-gradient-to-br from-neutral-900 via-neutral-900/95 to-neutral-800/90",
    "bg-gradient-to-br from-neutral-800/90 via-neutral-900 to-neutral-900/95",
    "bg-gradient-to-br from-neutral-900/95 via-neutral-800/90 to-neutral-900",
    "bg-gradient-to-br from-neutral-800/95 via-neutral-900 to-neutral-900/90",
  ]
  const bgVariant = backgroundVariants[parseInt(item.id.slice(-1)) % backgroundVariants.length]

  return (
    <div
      className={`relative ${bgVariant} border-2 border-dashed border-orange-500/30 rounded-lg shadow-lg hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 group overflow-hidden transform hover:scale-[1.02] hover:-translate-y-1`}
      style={{
        // Ticket notch effects using pseudo-elements via CSS variables
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)",
      }}
    >
      {/* Perforated edges - left side */}
      <div className="absolute left-0 top-0 bottom-0 w-4 flex flex-col justify-around opacity-20">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-neutral-600"
            style={{ marginTop: i === 0 ? "0.5rem" : "0.75rem" }}
          />
        ))}
      </div>

      {/* Perforated edges - right side */}
      <div className="absolute right-0 top-0 bottom-0 w-4 flex flex-col justify-around opacity-20">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-neutral-600 ml-auto"
            style={{ marginTop: i === 0 ? "0.5rem" : "0.75rem" }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="p-6 pl-8 pr-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Section - Image/Icon */}
          <div className="lg:w-2/5 flex-shrink-0">
            <div className="relative w-full h-64 lg:h-56 xl:h-64 bg-gradient-to-br from-orange-500/10 to-neutral-800 rounded-lg overflow-hidden border border-orange-500/20">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                style={{ imageRendering: "high-quality" }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "https://via.placeholder.com/400x300?text=No+Image"
                }}
              />
              {/* Overlay gradient for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/40 to-transparent pointer-events-none" />
              
              {/* Stock Badge */}
              {item.stock !== undefined && (
                <div className="absolute top-2 right-2">
                  <Badge
                    variant="outline"
                    className={`${
                      item.stock > 20
                        ? "bg-green-500/30 text-green-300 border-green-400/50 backdrop-blur-sm"
                        : "bg-orange-500/30 text-orange-300 border-orange-400/50 backdrop-blur-sm"
                    }`}
                  >
                    {item.stock} left
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Dashed Divider Line */}
          <div className="hidden lg:block absolute left-[40%] top-0 bottom-0 w-px border-l border-dashed border-neutral-600/50" />

          {/* Right Section - Details */}
          <div className="lg:w-3/5 flex flex-col">
            {/* Category Badge */}
            <div className="mb-2">
              <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                {item.category}
              </Badge>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-white mb-2 leading-tight">{item.name}</h3>

            {/* Description */}
            <p className="text-sm text-neutral-300 mb-4 flex-1 leading-relaxed">{item.description}</p>

            {/* Cost Section */}
            <div className="mb-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              <div className="text-xs text-neutral-400 mb-1 uppercase tracking-wide">Redeem For</div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-400" />
                <span className="text-2xl font-bold text-orange-400">{item.cost.toLocaleString()}</span>
                <span className="text-sm text-neutral-400">Karma Points</span>
              </div>
            </div>

            {/* Affordability Indicator */}
            {!canAfford && (
              <div className="mb-3 p-2 bg-red-500/10 border border-red-500/30 rounded text-xs text-red-400">
                You need {item.cost - currentKarma} more Karma Points
              </div>
            )}
          </div>
        </div>

        {/* Dashed Divider before Redeem Button */}
        <div className="border-t border-dashed border-neutral-600/50 my-4" />

        {/* Tear-off Stub Section - Redeem Button */}
        <div className="relative">
          {/* Stub notch indicators */}
          <div className="absolute -left-5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-black border-2 border-dashed border-neutral-600/50" />
          <div className="absolute -right-5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-black border-2 border-dashed border-neutral-600/50" />
          
          {/* Redeem Button styled as tear-off stub */}
          <Button
            onClick={() => onRedeem(item)}
            disabled={!canAfford}
            className={`w-full relative overflow-hidden ${
              canAfford
                ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-500 text-white shadow-lg hover:shadow-orange-500/50 group/btn"
                : "bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700"
            } transition-all duration-300 hover:scale-[1.02]`}
            size="lg"
          >
            {canAfford && (
              <>
                {/* Pulsing glow effect on hover */}
                <div className="absolute inset-0 bg-orange-400 opacity-0 group-hover/btn:opacity-30 blur-xl transition-opacity duration-300 animate-pulse" />
                <div className="relative z-10 flex items-center justify-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="font-bold text-base">Redeem Voucher</span>
                </div>
              </>
            )}
            {!canAfford && (
              <div className="flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>Insufficient Points</span>
              </div>
            )}
          </Button>

          {/* Stub label */}
          <div className="text-center mt-2">
            <span className="text-xs text-neutral-500 italic">Tear along dotted line to redeem</span>
          </div>
        </div>
      </div>

      {/* Subtle shine effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg" />
    </div>
  )
}
