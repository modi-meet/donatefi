"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useWallet } from "@/contexts/wallet-context"
import { RequestService } from "@/lib/request-service"
import { type Request } from "@/lib/user-types"
import { supabase } from "@/lib/supabase"
import { ArrowLeft, CheckCircle, XCircle, Clock, Package, User as UserIcon, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"

export default function RequestsPage() {
  const { isConnected, address } = useWallet()
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRequests = async () => {
      if (!isConnected || !address) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        // Fetch requests where user is the owner
        const ownerRequests = await RequestService.getRequestsForOwner(address)
        
        // Also fetch listings to get listing details
        const requestsWithDetails = await Promise.all(
          ownerRequests.map(async (req) => {
            const { data: listing } = await supabase
              .from('listings')
              .select('title, listing_image_url')
              .eq('listing_id', req.listingId)
              .single()
            
            return {
              ...req,
              listingTitle: listing?.title || 'Unknown Listing',
              listingImage: listing?.listing_image_url || null,
            }
          })
        )

        setRequests(requestsWithDetails as any)
      } catch (err: any) {
        console.error('Error fetching requests:', err)
        setError(err.message || 'Unable to load requests.')
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [isConnected, address])

  const handleUpdateStatus = async (requestId: string, status: 'approved' | 'rejected') => {
    try {
      const updated = await RequestService.updateRequestStatus(requestId, status)
      if (updated) {
        setRequests((prev) =>
          prev.map((req) => (req.requestId === requestId ? updated : req))
        )
      }
    } catch (err: any) {
      console.error('Error updating request:', err)
      setError(err.message || 'Failed to update request')
    }
  }

  const getStatusColor = (status: Request['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      case 'approved':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'completed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      default:
        return 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30'
    }
  }

  const getStatusIcon = (status: Request['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'approved':
        return <CheckCircle className="w-4 h-4" />
      case 'rejected':
        return <XCircle className="w-4 h-4" />
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black p-6">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-neutral-900 border-neutral-700">
            <CardContent className="p-12 text-center">
              <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Wallet Not Connected</h2>
              <p className="text-neutral-400 mb-6">
                Please connect your wallet to view requests for your listings.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Listing Requests</h1>
          <p className="text-neutral-400">
            View and manage requests for your listed items
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
          </div>
        ) : error ? (
          <Card className="bg-red-500/10 border-red-500/30">
            <CardContent className="p-6">
              <p className="text-red-400">{error}</p>
            </CardContent>
          </Card>
        ) : requests.length === 0 ? (
          <Card className="bg-neutral-900 border-neutral-700">
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Requests Yet</h3>
              <p className="text-neutral-400 mb-6">
                You don't have any requests for your listings yet.
              </p>
              <Link href="/listings">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Listings
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <Card key={request.requestId} className="bg-neutral-900 border-neutral-700">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-white mb-1">
                            {(request as any).listingTitle}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-neutral-400">
                            <UserIcon className="w-4 h-4" />
                            <span>Requester: {request.requesterWalletAddress.slice(0, 6)}...{request.requesterWalletAddress.slice(-4)}</span>
                          </div>
                        </div>
                        <Badge className={getStatusColor(request.status)} variant="outline">
                          {getStatusIcon(request.status)}
                          <span className="ml-1 capitalize">{request.status}</span>
                        </Badge>
                      </div>
                      <div className="text-sm text-neutral-400">
                        Requested on: {new Date(request.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {request.status === 'pending' && (
                        <>
                          <Button
                            onClick={() => handleUpdateStatus(request.requestId, 'approved')}
                            className="bg-green-500 hover:bg-green-600 text-white"
                            size="sm"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleUpdateStatus(request.requestId, 'rejected')}
                            className="bg-red-500 hover:bg-red-600 text-white"
                            size="sm"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      <Link href={`/listings/${request.listingId}`}>
                        <Button variant="outline" size="sm" className="border-neutral-700 text-white hover:bg-neutral-800">
                          View Listing
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
