"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, TrendingUp, Award, Gift, Users, Clock, Plus } from "lucide-react"

interface KarmaActivity {
  id: string
  type: "earned" | "spent"
  points: number
  description: string
  date: string
  category: "listing" | "donation" | "review" | "referral"
}

const mockKarmaActivities: KarmaActivity[] = [
  {
    id: "1",
    type: "earned",
    points: 50,
    description: "Created a new listing: Fresh Organic Vegetables",
    date: "2025-01-15",
    category: "listing",
  },
  {
    id: "2",
    type: "earned",
    points: 25,
    description: "Received positive review for your listing",
    date: "2025-01-14",
    category: "review",
  },
  {
    id: "3",
    type: "spent",
    points: -30,
    description: "Redeemed karma points for premium listing",
    date: "2025-01-13",
    category: "listing",
  },
  {
    id: "4",
    type: "earned",
    points: 100,
    description: "Successfully completed donation: 20 items shared",
    date: "2025-01-12",
    category: "donation",
  },
  {
    id: "5",
    type: "earned",
    points: 15,
    description: "Referred a new community member",
    date: "2025-01-11",
    category: "referral",
  },
]

export default function KarmaPage() {
  const [totalKarma] = useState(1280)
  const [availableKarma] = useState(980)

  const getCategoryIcon = (category: KarmaActivity["category"]) => {
    switch (category) {
      case "listing":
        return <Gift className="w-4 h-4" />
      case "donation":
        return <Users className="w-4 h-4" />
      case "review":
        return <Award className="w-4 h-4" />
      case "referral":
        return <TrendingUp className="w-4 h-4" />
      default:
        return <Star className="w-4 h-4" />
    }
  }

  const getCategoryColor = (category: KarmaActivity["category"]) => {
    switch (category) {
      case "listing":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "donation":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "review":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "referral":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      default:
        return "bg-neutral-500/20 text-neutral-400 border-neutral-500/30"
    }
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Karma Points</h1>
          <p className="text-neutral-400">Track your contributions and rewards in the community</p>
        </div>

        {/* Karma Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-neutral-900 border-neutral-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-neutral-400">Total Karma</span>
                <Star className="w-5 h-5 text-orange-500" />
              </div>
              <div className="text-3xl font-bold text-white">{totalKarma.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card className="bg-neutral-900 border-neutral-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-neutral-400">Available</span>
                <Gift className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-3xl font-bold text-white">{availableKarma.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card className="bg-neutral-900 border-neutral-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-neutral-400">Rank</span>
                <Award className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="text-3xl font-bold text-white">#7</div>
            </CardContent>
          </Card>
        </div>

        {/* How to Earn */}
        <Card className="bg-neutral-900 border-neutral-800 mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-white mb-4">How to Earn Karma Points</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-neutral-800/50 rounded-lg">
                <Gift className="w-5 h-5 text-orange-500 mt-0.5" />
                <div>
                  <div className="font-semibold text-white mb-1">Create Listings</div>
                  <div className="text-sm text-neutral-400">Earn 50 points for each listing you create</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-neutral-800/50 rounded-lg">
                <Users className="w-5 h-5 text-orange-500 mt-0.5" />
                <div>
                  <div className="font-semibold text-white mb-1">Share Items</div>
                  <div className="text-sm text-neutral-400">Get 25 points when someone claims your item</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-neutral-800/50 rounded-lg">
                <Award className="w-5 h-5 text-orange-500 mt-0.5" />
                <div>
                  <div className="font-semibold text-white mb-1">Receive Reviews</div>
                  <div className="text-sm text-neutral-400">Earn 25 points for each positive review</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-neutral-800/50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-orange-500 mt-0.5" />
                <div>
                  <div className="font-semibold text-white mb-1">Refer Friends</div>
                  <div className="text-sm text-neutral-400">Get 15 points for each successful referral</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity History */}
        <Card className="bg-neutral-900 border-neutral-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Activity History</h2>
              <Button size="sm" variant="outline" className="border-neutral-700 text-white hover:bg-neutral-800">
                <Plus className="w-4 h-4 mr-2" />
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {mockKarmaActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 p-4 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 transition-colors"
                >
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      activity.type === "earned" ? "bg-green-500/20" : "bg-red-500/20"
                    }`}
                  >
                    <Badge
                      variant="outline"
                      className={`${getCategoryColor(activity.category)} border-none`}
                    >
                      {getCategoryIcon(activity.category)}
                    </Badge>
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">{activity.description}</div>
                    <div className="flex items-center gap-2 mt-1 text-sm text-neutral-400">
                      <Clock className="w-3 h-3" />
                      {new Date(activity.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div
                    className={`text-lg font-bold ${
                      activity.type === "earned" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {activity.type === "earned" ? "+" : ""}
                    {activity.points}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

