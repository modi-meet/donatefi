"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import {
  Search,
  MapPin,
  Phone,
  User,
  Package,
  TrendingUp,
  Calendar,
  Filter,
  SortAsc,
  Loader2,
  ArrowRight,
} from "lucide-react"
import { mockListings, type Listing } from "@/lib/mock-listings"

type CategoryFilter = "All" | "Food" | "Education" | "Cloth" | "Others"
type SortOption = "newest" | "quantity" | "quality"

export default function ListingsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("All")
  const [sortOption, setSortOption] = useState<SortOption>("newest")
  const [loading, setLoading] = useState(false)

  // Simulate loading state
  const handleFilterChange = (category: CategoryFilter) => {
    setLoading(true)
    setCategoryFilter(category)
    setTimeout(() => setLoading(false), 300)
  }

  // Filter and sort listings
  const filteredAndSortedListings = useMemo(() => {
    let filtered = mockListings.filter((listing) => {
      const matchesCategory = categoryFilter === "All" || listing.category === categoryFilter
      const matchesSearch =
        searchTerm === "" ||
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesCategory && matchesSearch
    })

    // Sort listings
    const sorted = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case "newest":
          // Sort by ID (newer listings have higher IDs)
          return parseInt(b.id.split("-")[1]) - parseInt(a.id.split("-")[1])
        case "quantity":
          return b.quantity - a.quantity
        case "quality":
          const qualityOrder = { New: 4, Good: 3, Used: 2, Poor: 1 }
          return qualityOrder[b.quality] - qualityOrder[a.quality]
        default:
          return 0
      }
    })

    return sorted
  }, [searchTerm, categoryFilter, sortOption])

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = {
      All: mockListings.length,
      Food: 0,
      Education: 0,
      Cloth: 0,
      Others: 0,
    }
    mockListings.forEach((listing) => {
      if (listing.category in counts) {
        counts[listing.category as keyof typeof counts]++
      }
    })
    return counts
  }, [])

  // Quality badge colors
  const getQualityColor = (quality: Listing["quality"]) => {
    switch (quality) {
      case "New":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "Good":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "Used":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      case "Poor":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-neutral-500/20 text-neutral-400 border-neutral-500/30"
    }
  }

  // Category badge colors
  const getCategoryColor = (category: Listing["category"]) => {
    switch (category) {
      case "Food":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "Education":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "Cloth":
        return "bg-pink-500/20 text-pink-400 border-pink-500/30"
      case "Others":
        return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
      default:
        return "bg-neutral-500/20 text-neutral-400 border-neutral-500/30"
    }
  }

  const categories: CategoryFilter[] = ["All", "Food", "Education", "Cloth", "Others"]

  return (
    <div className="min-h-screen bg-black p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">COMMUNITY LISTINGS</h1>
          <p className="text-sm text-neutral-400">Browse all community-contributed listings</p>
        </div>
      </div>

      {/* Search and Filters Section */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <Input
            type="text"
            placeholder="Search listings by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:border-orange-500 focus-visible:ring-orange-500/50"
            aria-label="Search listings by title or description"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => handleFilterChange(category)}
              className={`transition-all ${
                categoryFilter === category
                  ? "bg-orange-500 hover:bg-orange-600 text-white"
                  : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700"
              }`}
              variant={categoryFilter === category ? "default" : "outline"}
              aria-label={`Filter by ${category} category`}
              aria-pressed={categoryFilter === category}
            >
              {category}
              {category !== "All" && (
                <Badge
                  variant="outline"
                  className={`ml-2 ${
                    categoryFilter === category
                      ? "bg-white/20 text-white border-white/30"
                      : "bg-neutral-700 text-neutral-400 border-neutral-600"
                  }`}
                  aria-label={`${categoryCounts[category]} listings in ${category} category`}
                >
                  {categoryCounts[category]}
                </Badge>
              )}
            </Button>
          ))}
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <SortAsc className="w-4 h-4" />
            <span>Sort:</span>
          </div>
          <Button
            onClick={() => setSortOption("newest")}
            variant={sortOption === "newest" ? "default" : "outline"}
            size="sm"
            className={
              sortOption === "newest"
                ? "bg-orange-500 hover:bg-orange-600 text-white"
                : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border-neutral-700"
            }
            aria-label="Sort by newest listings"
            aria-pressed={sortOption === "newest"}
          >
            <Calendar className="w-4 h-4 mr-1" />
            Newest
          </Button>
          <Button
            onClick={() => setSortOption("quantity")}
            variant={sortOption === "quantity" ? "default" : "outline"}
            size="sm"
            className={
              sortOption === "quantity"
                ? "bg-orange-500 hover:bg-orange-600 text-white"
                : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border-neutral-700"
            }
            aria-label="Sort by quantity available"
            aria-pressed={sortOption === "quantity"}
          >
            <Package className="w-4 h-4 mr-1" />
            Quantity
          </Button>
          <Button
            onClick={() => setSortOption("quality")}
            variant={sortOption === "quality" ? "default" : "outline"}
            size="sm"
            className={
              sortOption === "quality"
                ? "bg-orange-500 hover:bg-orange-600 text-white"
                : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border-neutral-700"
            }
            aria-label="Sort by quality"
            aria-pressed={sortOption === "quality"}
          >
            <TrendingUp className="w-4 h-4 mr-1" />
            Quality
          </Button>
        </div>

        {/* Results Count */}
        <div className="text-sm text-neutral-400">
          Showing {filteredAndSortedListings.length} of {mockListings.length} listings
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        </div>
      )}

      {/* Listings Grid */}
      {!loading && (
        <>
          {filteredAndSortedListings.length === 0 ? (
            <Card className="bg-neutral-900 border-neutral-700">
              <CardContent className="p-12 text-center">
                <Filter className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Listings Found</h3>
                <p className="text-neutral-400">
                  Try adjusting your search or filter criteria to find what you're looking for.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} getQualityColor={getQualityColor} getCategoryColor={getCategoryColor} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

// Listing Card Component
interface ListingCardProps {
  listing: Listing
  getQualityColor: (quality: Listing["quality"]) => string
  getCategoryColor: (category: Listing["category"]) => string
}

function ListingCard({ listing, getQualityColor, getCategoryColor }: ListingCardProps) {
  const [expanded, setExpanded] = useState(false)
  const maxDescriptionLength = 100
  const isDescriptionLong = listing.description.length > maxDescriptionLength
  const truncatedDescription = listing.description.substring(0, maxDescriptionLength)
  const displayDescription = expanded
    ? listing.description
    : isDescriptionLong
      ? truncatedDescription + "..."
      : listing.description

  // Truncate pickup address
  const maxAddressLength = 40
  const truncatedAddress =
    listing.pickup_address.length > maxAddressLength
      ? listing.pickup_address.substring(0, maxAddressLength) + "..."
      : listing.pickup_address

  return (
    <Card
      className="bg-neutral-900 border-neutral-700 hover:border-orange-500/50 transition-all duration-300 overflow-hidden flex flex-col h-full"
      role="article"
      aria-label={`Listing: ${listing.title}`}
    >
      {/* Image */}
      <div className="relative w-full h-48 bg-neutral-800 overflow-hidden">
        <img
          src={listing.listing_image_url}
          alt={`${listing.title} - ${listing.category}`}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = "https://via.placeholder.com/400x300?text=No+Image"
          }}
        />
        <div className="absolute top-2 right-2">
          <Badge className={getCategoryColor(listing.category)} variant="outline">
            {listing.category}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4 flex flex-col flex-1">
        {/* Title */}
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{listing.title}</h3>

        {/* Description */}
        <p className="text-sm text-neutral-400 mb-4 flex-1 line-clamp-3">{displayDescription}</p>
        {isDescriptionLong && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="text-orange-500 hover:text-orange-400 hover:bg-orange-500/10 p-0 h-auto text-xs mb-4"
          >
            {expanded ? "Read less" : "Read more"}
          </Button>
        )}

        {/* Quality and Quantity */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <Badge className={getQualityColor(listing.quality)} variant="outline">
            {listing.quality}
          </Badge>
          <Badge variant="outline" className="bg-neutral-800 text-neutral-300 border-neutral-600">
            <Package className="w-3 h-3 mr-1" />
            {listing.quantity} available
          </Badge>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-2 mb-4 text-sm text-neutral-400">
          <User className="w-4 h-4" />
          <span className="truncate">{listing.user_name}</span>
        </div>

        {/* Pickup Address */}
        <div className="flex items-start gap-2 mb-4 text-sm text-neutral-400">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span className="line-clamp-2" title={listing.pickup_address}>
            {truncatedAddress}
          </span>
        </div>

        {/* Contact Number */}
        <a
          href={`tel:${listing.contact_number.replace(/\s/g, "")}`}
          className="flex items-center gap-2 text-sm text-orange-500 hover:text-orange-400 transition-colors mb-4"
          aria-label={`Call ${listing.user_name} at ${listing.contact_number}`}
        >
          <Phone className="w-4 h-4" />
          <span>{listing.contact_number}</span>
        </a>

        {/* More Details Button */}
        <Link href={`/listings/${listing.id}`}>
          <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
            More Details
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

