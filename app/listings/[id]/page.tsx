"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  MapPin,
  Phone,
  User,
  Package,
  ShoppingCart,
  CheckCircle,
  AlertCircle,
  Hash,
  Loader2,
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { type Listing, mapDatabaseListingToListing } from "@/lib/listing-types"

export default function ListingDetailsPage() {
  const params = useParams()
  const listingId = params.id as string
  
  const [requestSent, setRequestSent] = useState(false)
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch listing from Supabase
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true)
        setError(null)

        const { data, error: fetchError } = await supabase
          .from('listings')
          .select('*')
          .eq('listing_id', listingId)
          .single()

        if (fetchError) {
          throw fetchError
        }

        if (data) {
          const mappedListing = mapDatabaseListingToListing(data)
          setListing(mappedListing)
        }
      } catch (err: any) {
        console.error('Error fetching listing:', err)
        setError(err.message || 'Unable to load listing details.')
      } finally {
        setLoading(false)
      }
    }

    if (listingId) {
      fetchListing()
    }
  }, [listingId])

  // Determine status from listing (you may need to adjust based on your schema)
  const status = listing ? ("available" as const) : ("claimed" as const)

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black p-6">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-neutral-900 border-neutral-700">
            <CardContent className="p-12 text-center">
              <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
              <p className="text-neutral-400">Loading listing details...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Error or not found state
  if (error || !listing) {
    return (
      <div className="min-h-screen bg-black p-6">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-neutral-900 border-neutral-700">
            <CardContent className="p-12 text-center">
              <AlertCircle className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">
                {error ? "Unable to Load Listing" : "Listing Not Found"}
              </h2>
              <p className="text-neutral-400 mb-6">
                {error || "The listing you're looking for doesn't exist."}
              </p>
              <Link href="/listings">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Listings
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const handleReceiveItem = () => {
    if (status === "available") {
      setRequestSent(true)
      // In a real app, this would trigger an API call or transaction
      setTimeout(() => {
        // Reset after 3 seconds for demo purposes
        // setRequestSent(false)
      }, 3000)
    }
  }

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

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="container mx-auto max-w-6xl">
        {/* Back Navigation */}
        <Link href="/listings">
          <Button
            variant="ghost"
            className="mb-6 text-neutral-400 hover:text-white hover:bg-neutral-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Listings
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Image */}
          <div className="lg:col-span-2">
            <Card className="bg-neutral-900 border-neutral-700 overflow-hidden mb-6">
              <div className="relative w-full h-96 bg-neutral-800 overflow-hidden">
                <img
                  src={listing.listing_image_url}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "https://via.placeholder.com/800x600?text=No+Image"
                  }}
                />
              </div>
            </Card>

            {/* Description Card */}
            <Card className="bg-neutral-900 border-neutral-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-3xl font-bold text-white">{listing.title}</h1>
                  <Badge className={getCategoryColor(listing.category)} variant="outline">
                    {listing.category}
                  </Badge>
                </div>
                <div className="prose prose-invert max-w-none">
                  <p className="text-neutral-300 text-lg leading-relaxed">{listing.description}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Status and Receive Button Card */}
            <Card className="bg-neutral-900 border-neutral-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-sm text-neutral-400 mb-1">Status</div>
                    <Badge
                      variant="outline"
                      className={
                        status === "available"
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : "bg-red-500/20 text-red-400 border-red-500/30"
                      }
                    >
                      {status === "available" ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Available
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Claimed
                        </>
                      )}
                    </Badge>
                  </div>
                </div>

                {requestSent ? (
                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="font-semibold text-green-400">Request Sent!</span>
                    </div>
                    <p className="text-sm text-neutral-300">
                      Your request to receive this item has been sent. The donor will contact you soon.
                    </p>
                  </div>
                ) : (
                  <Button
                    onClick={handleReceiveItem}
                    disabled={status !== "available"}
                    className={`w-full ${
                      status === "available"
                        ? "bg-orange-500 hover:bg-orange-600 text-white"
                        : "bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700"
                    }`}
                    size="lg"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Receive This Item
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Listing Details Card */}
            <Card className="bg-neutral-900 border-neutral-700">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-white mb-6">Listing Details</h2>
                <div className="space-y-4">
                  {/* Quantity */}
                  <div className="flex items-center justify-between py-3 border-b border-neutral-800">
                    <div className="flex items-center gap-2 text-neutral-400">
                      <Package className="w-4 h-4" />
                      <span>Quantity</span>
                    </div>
                    <span className="text-white font-semibold">{listing.quantity} available</span>
                  </div>

                  {/* Quality */}
                  <div className="flex items-center justify-between py-3 border-b border-neutral-800">
                    <span className="text-neutral-400">Quality</span>
                    <Badge className={getQualityColor(listing.quality)} variant="outline">
                      {listing.quality}
                    </Badge>
                  </div>

                  {/* Category */}
                  <div className="flex items-center justify-between py-3 border-b border-neutral-800">
                    <span className="text-neutral-400">Category</span>
                    <Badge className={getCategoryColor(listing.category)} variant="outline">
                      {listing.category}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pickup Information Card */}
            <Card className="bg-neutral-900 border-neutral-700">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-white mb-6">Pickup Information</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-neutral-400 mb-1">Pickup Address</div>
                      <div className="text-white">{listing.pickup_address}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-orange-500 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-neutral-400 mb-1">Contact Number</div>
                      <a
                        href={`tel:${listing.contact_number.replace(/\s/g, "")}`}
                        className="text-orange-500 hover:text-orange-400 transition-colors"
                      >
                        {listing.contact_number}
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Donor Information Card */}
            <Card className="bg-neutral-900 border-neutral-700">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-white mb-6">Donor Information</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-orange-500 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-neutral-400 mb-1">Name</div>
                      <div className="text-white font-medium">{listing.user_name}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Hash className="w-5 h-5 text-orange-500 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-neutral-400 mb-1">Profile Number</div>
                      <div className="text-white font-mono">{listing.user_profile_number}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-neutral-400 mb-1">Address</div>
                      <div className="text-white">{listing.user_address}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
