"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useUser } from "@/contexts/user-context"
import { useWallet } from "@/contexts/wallet-context"
import { User, Mail, Phone, MapPin, Save, Loader2, CheckCircle, AlertCircle } from "lucide-react"

export default function ProfilePage() {
  const { user, loading, updateProfile } = useUser()
  const { isConnected, address } = useWallet()
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    userName: user?.userName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    location: user?.location || "",
  })

  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        userName: user.userName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        location: user.location || "",
      })
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isConnected) {
      setError("Please connect your wallet first")
      return
    }

    try {
      setSaving(true)
      setError(null)
      setSuccess(false)

      await updateProfile({
        userName: formData.userName || null,
        email: formData.email || null,
        phoneNumber: formData.phoneNumber || null,
        location: formData.location || null,
      })

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message || "Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setSuccess(false)
    setError(null)
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
                Please connect your wallet to view and edit your profile.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
          <p className="text-neutral-400">Update your personal information</p>
        </div>

        {/* Success Message */}
        {success && (
          <Card className="bg-green-500/10 border-green-500/30 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span>Profile updated successfully!</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Message */}
        {error && (
          <Card className="bg-red-500/10 border-red-500/30 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-6">
            {/* Wallet Address Display */}
            <div className="mb-6 p-4 bg-neutral-800 rounded-lg border border-neutral-700">
              <div className="text-sm text-neutral-400 mb-1">Wallet Address</div>
              <div className="text-white font-mono text-sm break-all">{address}</div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-neutral-300 mb-2">
                  <User className="w-4 h-4" />
                  Name
                </label>
                <Input
                  type="text"
                  value={formData.userName}
                  onChange={(e) => handleChange("userName", e.target.value)}
                  placeholder="Enter your name"
                  className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:border-orange-500"
                  disabled={saving || loading}
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-neutral-300 mb-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="Enter your email"
                  className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:border-orange-500"
                  disabled={saving || loading}
                />
              </div>

              {/* Phone Number Field */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-neutral-300 mb-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </label>
                <Input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleChange("phoneNumber", e.target.value)}
                  placeholder="Enter your phone number"
                  className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:border-orange-500"
                  disabled={saving || loading}
                />
              </div>

              {/* Location Field */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-neutral-300 mb-2">
                  <MapPin className="w-4 h-4" />
                  Location
                </label>
                <Input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  placeholder="Enter your location/address"
                  className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:border-orange-500"
                  disabled={saving || loading}
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={saving || loading}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  size="lg"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Profile
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
