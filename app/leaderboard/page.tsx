"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award, Crown, Star } from "lucide-react"

interface LeaderboardUser {
  id: string
  rank: number
  name: string
  karmaPoints: number
  listingsContributed: number
  itemsShared: number
  avatar?: string
}

const mockLeaderboard: LeaderboardUser[] = [
  {
    id: "1",
    rank: 1,
    name: "Meet Modi",
    karmaPoints: 2450,
    listingsContributed: 12,
    itemsShared: 48,
  },
  {
    id: "2",
    rank: 2,
    name: "Aryan R",
    karmaPoints: 2180,
    listingsContributed: 10,
    itemsShared: 42,
  },
  {
    id: "3",
    rank: 3,
    name: "Milan Sampath",
    karmaPoints: 1950,
    listingsContributed: 9,
    itemsShared: 38,
  },
  {
    id: "4",
    rank: 4,
    name: "Mohammed Talha",
    karmaPoints: 1720,
    listingsContributed: 8,
    itemsShared: 35,
  },
  {
    id: "5",
    rank: 5,
    name: "Jessica Martinez",
    karmaPoints: 1580,
    listingsContributed: 7,
    itemsShared: 32,
  },
  {
    id: "6",
    rank: 6,
    name: "Robert Williams",
    karmaPoints: 1420,
    listingsContributed: 6,
    itemsShared: 28,
  },
  {
    id: "7",
    rank: 7,
    name: "Amanda Lee",
    karmaPoints: 1280,
    listingsContributed: 5,
    itemsShared: 25,
  },
  {
    id: "8",
    rank: 8,
    name: "Christopher Brown",
    karmaPoints: 1150,
    listingsContributed: 5,
    itemsShared: 22,
  },
  {
    id: "9",
    rank: 9,
    name: "Michelle Garcia",
    karmaPoints: 1020,
    listingsContributed: 4,
    itemsShared: 20,
  },
  {
    id: "10",
    rank: 10,
    name: "James Wilson",
    karmaPoints: 950,
    listingsContributed: 4,
    itemsShared: 18,
  },
]

export default function LeaderboardPage() {
  const [timeFilter, setTimeFilter] = useState<"all" | "month" | "week">("all")

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />
      case 2:
        return <Trophy className="w-6 h-6 text-gray-300" />
      case 3:
        return <Medal className="w-6 h-6 text-orange-400" />
      default:
        return null
    }
  }

  const getRankBadge = (rank: number) => {
    if (rank <= 3) {
      return (
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30">
          {getRankIcon(rank)}
        </div>
      )
    }
    return (
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-400 font-bold">
        {rank}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Community Leaderboard</h1>
          <p className="text-neutral-400">Top contributors making a difference in our community</p>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[2, 1, 3].map((rank) => {
            const user = mockLeaderboard.find((u) => u.rank === rank)
            if (!user) return null
            return (
              <Card
                key={user.id}
                className={`bg-neutral-900 border-neutral-800 ${
                  rank === 1 ? "md:order-2 border-orange-500/50" : rank === 2 ? "md:order-1" : "md:order-3"
                }`}
              >
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">{getRankBadge(user.rank)}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{user.name}</h3>
                  <div className="text-3xl font-bold text-orange-500 mb-2">{user.karmaPoints.toLocaleString()}</div>
                  <div className="text-sm text-neutral-400 mb-4">Karma Points</div>
                  <div className="flex justify-center gap-4 text-sm text-neutral-500">
                    <div>
                      <span className="text-neutral-400">{user.listingsContributed}</span> listings
                    </div>
                    <div>
                      <span className="text-neutral-400">{user.itemsShared}</span> shared
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Full Leaderboard */}
        <Card className="bg-neutral-900 border-neutral-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Full Rankings</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setTimeFilter("week")}
                  className={`px-3 py-1 rounded text-sm ${
                    timeFilter === "week"
                      ? "bg-orange-500 text-white"
                      : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => setTimeFilter("month")}
                  className={`px-3 py-1 rounded text-sm ${
                    timeFilter === "month"
                      ? "bg-orange-500 text-white"
                      : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                  }`}
                >
                  Month
                </button>
                <button
                  onClick={() => setTimeFilter("all")}
                  className={`px-3 py-1 rounded text-sm ${
                    timeFilter === "all"
                      ? "bg-orange-500 text-white"
                      : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                  }`}
                >
                  All Time
                </button>
              </div>
            </div>
            <div className="space-y-3">
              {mockLeaderboard.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-4 p-4 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 transition-colors"
                >
                  <div className="flex-shrink-0">{getRankBadge(user.rank)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-white">{user.name}</h3>
                      {user.rank <= 3 && (
                        <Badge variant="outline" className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                          Top {user.rank}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-neutral-400">
                      <span>{user.listingsContributed} listings</span>
                      <span>{user.itemsShared} items shared</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-orange-500" />
                    <span className="text-xl font-bold text-white">{user.karmaPoints.toLocaleString()}</span>
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

