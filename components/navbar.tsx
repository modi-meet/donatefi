"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Trophy, List, Star, Wallet, AlertCircle, CheckCircle, Loader2, ShoppingBag } from "lucide-react"
import { cn } from "@/lib/utils"
import { useWallet } from "@/contexts/wallet-context"

export default function Navbar() {
  const pathname = usePathname()
  const { isConnected, address, balance, chainId, isLoading, error, connect, disconnect } = useWallet()
  const [showError, setShowError] = useState(false)

  const navItems = [
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { href: "/listings", label: "Listings", icon: List },
    { href: "/karma", label: "Karma Points", icon: Star },
    { href: "/marketplace", label: "Marketplace", icon: ShoppingBag },
  ]

  const handleWalletAction = async () => {
    try {
      setShowError(false)
      if (isConnected) {
        await disconnect()
      } else {
        await connect()
      }
    } catch (err) {
      setShowError(true)
      setTimeout(() => setShowError(false), 5000) // Hide error after 5 seconds
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const formatBalance = (bal: string) => {
    return parseFloat(bal).toFixed(4)
  }

  const getChainName = (id: number) => {
    switch (id) {
      case 1:
        return "Ethereum"
      case 5:
        return "Goerli"
      case 11155111:
        return "Sepolia"
      default:
        return `Chain ${id}`
    }
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-neutral-900/95 backdrop-blur supports-backdrop-filter:bg-neutral-900/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="text-xl font-bold text-orange-500 tracking-wider">DonateFi</div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-orange-500 text-white"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              )
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="text-neutral-400 hover:text-orange-500"
              onClick={() => {
                // Mobile menu toggle would go here
                console.log("Mobile menu toggle")
              }}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>

          {/* Connect Wallet Button */}
          <div className="flex items-center gap-3">
            {/* Error Message */}
            {showError && error && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/50 rounded-md text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span className="max-w-48 truncate">{error}</span>
              </div>
            )}

            {/* Wallet Info */}
            {isConnected && address && (
              <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-neutral-800 border border-neutral-700 rounded-md text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-neutral-300">{formatAddress(address)}</span>
                </div>
                {balance && (
                  <div className="text-neutral-500 border-l border-neutral-700 pl-2">
                    {formatBalance(balance)} ETH
                  </div>
                )}
                {chainId && chainId !== 1 && (
                  <div className="text-orange-400 text-xs">
                    {getChainName(chainId)}
                  </div>
                )}
              </div>
            )}

            <Button
              onClick={handleWalletAction}
              disabled={isLoading}
              className={cn(
                "bg-orange-500 hover:bg-orange-600 text-white",
                isConnected && "bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/50"
              )}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Wallet className="w-4 h-4 mr-2" />
              )}
              {isLoading 
                ? "Connecting..." 
                : isConnected 
                  ? "Disconnect" 
                  : "Connect Wallet"
              }
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-neutral-800 py-2">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-orange-500 text-white"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              )
            })}
            
            {/* Mobile Wallet Info */}
            {isConnected && address && (
              <div className="px-4 py-2 mt-2 border-t border-neutral-800">
                <div className="flex items-center gap-2 text-sm text-neutral-300 mb-1">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>{formatAddress(address)}</span>
                </div>
                {balance && (
                  <div className="text-sm text-neutral-500">
                    Balance: {formatBalance(balance)} ETH
                  </div>
                )}
                {chainId && chainId !== 1 && (
                  <div className="text-xs text-orange-400 mt-1">
                    Network: {getChainName(chainId)}
                  </div>
                )}
              </div>
            )}

            {/* Mobile Error */}
            {showError && error && (
              <div className="px-4 py-2 mt-2 border-t border-neutral-800">
                <div className="flex items-center gap-2 text-sm text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

