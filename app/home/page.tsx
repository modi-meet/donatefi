"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, TrendingUp, Users, Gift, Award } from "lucide-react"
import { mockListings } from "@/lib/mock-listings"

export default function HomePage() {
  // Get featured listings (first 3)
  const featuredListings = mockListings.slice(0, 3)
  
  // Get category counts
  const categoryStats = {
    Food: mockListings.filter((l) => l.category === "Food").length,
    Education: mockListings.filter((l) => l.category === "Education").length,
    Cloth: mockListings.filter((l) => l.category === "Cloth").length,
    Others: mockListings.filter((l) => l.category === "Others").length,
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-neutral-800">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 via-transparent to-transparent" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Welcome to <span className="text-orange-500">DonateFi</span>
            </h1>
            <p className="text-xl text-neutral-400 mb-8 max-w-2xl mx-auto">
              Join a thriving community where neighbors share resources, build connections, and make a positive impact
              together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                <Link href="/listings">
                  Browse Listings
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-neutral-700 text-white hover:bg-neutral-800">
                <Link href="/leaderboard">View Leaderboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-b border-neutral-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="bg-neutral-900 border-neutral-800">
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-white mb-1">{mockListings.length}</div>
                <div className="text-sm text-neutral-400">Active Listings</div>
              </CardContent>
            </Card>
            <Card className="bg-neutral-900 border-neutral-800">
              <CardContent className="p-6 text-center">
                <Gift className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-white mb-1">
                  {Object.values(categoryStats).reduce((a, b) => a + b, 0)}
                </div>
                <div className="text-sm text-neutral-400">Categories</div>
              </CardContent>
            </Card>
            <Card className="bg-neutral-900 border-neutral-800">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-white mb-1">1,234</div>
                <div className="text-sm text-neutral-400">Community Members</div>
              </CardContent>
            </Card>
            <Card className="bg-neutral-900 border-neutral-800">
              <CardContent className="p-6 text-center">
                <Award className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-white mb-1">5,678</div>
                <div className="text-sm text-neutral-400">Karma Points</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16 border-b border-neutral-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Featured Listings</h2>
              <p className="text-neutral-400">Discover popular items in your community</p>
            </div>
            <Button asChild variant="ghost" className="text-orange-500 hover:text-orange-400">
              <Link href="/listings">
                View All
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.map((listing) => (
              <Card
                key={listing.id}
                className="bg-neutral-900 border-neutral-800 hover:border-orange-500/50 transition-all overflow-hidden"
              >
                <div className="relative w-full h-48 bg-neutral-800 overflow-hidden">
                  <img
                    src={listing.listing_image_url}
                    alt={listing.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "https://via.placeholder.com/400x300?text=No+Image"
                    }}
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-white line-clamp-1">{listing.title}</h3>
                    <span className="text-xs text-orange-500 bg-orange-500/20 px-2 py-1 rounded">
                      {listing.category}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-400 mb-4 line-clamp-2">{listing.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-500">{listing.user_name}</span>
                    <Button asChild size="sm" variant="ghost" className="text-orange-500 hover:text-orange-400">
                      <Link href="/listings">View Details</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Object.entries(categoryStats).map(([category, count]) => (
              <Link key={category} href={`/listings?category=${category}`}>
                <Card className="bg-neutral-900 border-neutral-800 hover:border-orange-500/50 transition-all cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-orange-500 mb-2">{count}</div>
                    <div className="text-sm text-neutral-400">{category}</div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

