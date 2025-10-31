"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Trophy, List, Star, Wallet } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Navbar() {
  const pathname = usePathname()
  const [walletConnected, setWalletConnected] = useState(false)

  const navItems = [
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { href: "/listings", label: "Listings", icon: List },
    { href: "/karma", label: "Karma Points", icon: Star },
  ]

  const handleConnectWallet = () => {
    // Simulate wallet connection
    setWalletConnected(!walletConnected)
    // In a real app, this would trigger wallet connection (MetaMask, WalletConnect, etc.)
    console.log(walletConnected ? "Disconnecting wallet..." : "Connecting wallet...")
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-neutral-900/95 backdrop-blur supports-[backdrop-filter]:bg-neutral-900/60">
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
            <Button
              onClick={handleConnectWallet}
              className={cn(
                "bg-orange-500 hover:bg-orange-600 text-white",
                walletConnected && "bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/50"
              )}
            >
              <Wallet className="w-4 h-4 mr-2" />
              {walletConnected ? "Wallet Connected" : "Connect Wallet"}
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
          </div>
        </div>
      </div>
    </nav>
  )
}

