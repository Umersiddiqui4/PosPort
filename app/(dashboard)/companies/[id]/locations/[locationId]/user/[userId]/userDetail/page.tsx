"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useLocationUsers } from "@/hooks/useLocation"
import { toast } from "@/hooks/use-toast"

// Add a helper function for random background color
function getRandomBgColor(str: string) {
  const colors = [
    'bg-red-500', 'bg-green-500', 'bg-blue-500', 'bg-yellow-500',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500',
    'bg-orange-500', 'bg-cyan-500', 'bg-lime-500', 'bg-amber-500',
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = Math.abs(hash) % colors.length;
  return colors[idx];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400"
    case "inactive":
      return "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400"
    default:
      return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
  }
}

const getRoleColor = (role: string) => {
  switch (role) {
    case "Manager":
      return "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400"
    case "Supervisor":
      return "bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-400"
    case "Cashier":
      return "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400"
    case "Staff":
      return "bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400"
    case "COMPANY_OWNER":
      return "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400"
    default:
      return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
  }
}

export default function UserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const companyId = params?.id as string
  const locationId = params?.locationId as string
  const userId = params?.userId as string

  const [copiedField, setCopiedField] = useState<string | null>(null)

  const { data, isLoading } = useLocationUsers(locationId, 1, 100);
  const locationUsers = data?.data || [];
  const selectedUserDetails = locationUsers.find((u: any) => u.user.id === userId)

  const handleBack = () => {
    router.push(`/companies/${companyId}/locations/${locationId}/user`)
  }

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(fieldName)
      toast({
        title: "Copied!",
        description: `${fieldName} copied to clipboard`,
      })
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-gray-600 dark:text-gray-300 mb-4">Loading user details...</div>
        </div>
      </div>
    )
  }

  if (!selectedUserDetails) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 mb-4">User not found</div>
          <Button onClick={handleBack} variant="outline" className="dark:border-gray-600 dark:text-gray-300 dark:hover:text-gray-100">
            Back to Users
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 px-4 py-16 md:py-16">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button onClick={handleBack} variant="outline" size="icon" className="dark:border-gray-600 dark:text-gray-300 dark:hover:text-gray-100">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 truncate">User Details</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Complete information about the user and their location assignment.</p>
        </div>
      </div>

      {/* User Header */}
      <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <Avatar className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0">
          <AvatarImage src={selectedUserDetails.user.avatar} alt={`${selectedUserDetails.user.firstName} ${selectedUserDetails.user.lastName}`} />
          <AvatarFallback className={getRandomBgColor(selectedUserDetails.user.firstName + selectedUserDetails.user.lastName) + " text-white text-sm sm:text-lg"}>
            {selectedUserDetails.user.firstName.charAt(0)}
            {selectedUserDetails.user.lastName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 truncate">
            {selectedUserDetails.user.firstName} {selectedUserDetails.user.lastName}
          </h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 truncate">{selectedUserDetails.user.email}</p>
          <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-2">
            <Badge className={`${getStatusColor(selectedUserDetails.user.status)} text-xs`}>
              {selectedUserDetails.user.status}
            </Badge>
            <Badge className={`${getRoleColor(selectedUserDetails.user.role)} text-xs`}>
              {selectedUserDetails.user.role}
            </Badge>
          </div>
        </div>
      </div>

      {/* User Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg dark:text-gray-100">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
              <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Full Name:</span>
              <span className="font-medium text-sm sm:text-base truncate dark:text-gray-200">{selectedUserDetails.user.firstName} {selectedUserDetails.user.lastName}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
              <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Email:</span>
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-medium text-sm sm:text-base truncate dark:text-gray-200">{selectedUserDetails.user.email}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 flex-shrink-0 dark:text-gray-400 dark:hover:text-gray-300"
                  onClick={() => copyToClipboard(selectedUserDetails.user.email, 'Email')}
                >
                  {copiedField === 'Email' ? (
                    <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                  ) : (
                    <Copy className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                  )}
                </Button>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
              <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Phone:</span>
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-medium text-sm sm:text-base truncate dark:text-gray-200">{selectedUserDetails.user.phone || 'Not provided'}</span>
                {selectedUserDetails.user.phone && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 flex-shrink-0 dark:text-gray-400 dark:hover:text-gray-300"
                    onClick={() => copyToClipboard(selectedUserDetails.user.phone, 'Phone')}
                  >
                    {copiedField === 'Phone' ? (
                      <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                    ) : (
                      <Copy className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                    )}
                  </Button>
                )}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
              <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Role:</span>
              <span className="font-medium text-sm sm:text-base truncate dark:text-gray-200">{selectedUserDetails.user.role}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
              <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Status:</span>
              <Badge className={`${getStatusColor(selectedUserDetails.user.status)} text-xs`}>
                {selectedUserDetails.user.status}
              </Badge>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
              <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Company ID:</span>
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-medium text-sm sm:text-base truncate dark:text-gray-200">{selectedUserDetails.user.companyId}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 flex-shrink-0 dark:text-gray-400 dark:hover:text-gray-300"
                  onClick={() => copyToClipboard(selectedUserDetails.user.companyId, 'Company ID')}
                >
                  {copiedField === 'Company ID' ? (
                    <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                  ) : (
                    <Copy className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                  )}
                </Button>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
              <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">User ID:</span>
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-mono text-xs sm:text-sm truncate dark:text-gray-200">{selectedUserDetails.user.id}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 flex-shrink-0 dark:text-gray-400 dark:hover:text-gray-300"
                  onClick={() => copyToClipboard(selectedUserDetails.user.id, 'User ID')}
                >
                  {copiedField === 'User ID' ? (
                    <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                  ) : (
                    <Copy className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg dark:text-gray-100">Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
              <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Account Created:</span>
              <span className="font-medium text-sm sm:text-base truncate dark:text-gray-200">{new Date(selectedUserDetails.user.createdAt).toLocaleString()}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
              <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Last Updated:</span>
              <span className="font-medium text-sm sm:text-base truncate dark:text-gray-200">{new Date(selectedUserDetails.user.updatedAt).toLocaleString()}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
              <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Assigned to Location:</span>
              <span className="font-medium text-sm sm:text-base truncate dark:text-gray-200">{new Date(selectedUserDetails.assignedAt).toLocaleString()}</span>
            </div>
            {selectedUserDetails.assignedById && (
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Assigned By:</span>
                <span className="font-mono text-xs sm:text-sm truncate dark:text-gray-200">{selectedUserDetails.assignedById}</span>
              </div>
            )}
            {selectedUserDetails.unassignedAt && (
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Unassigned:</span>
                <span className="font-medium text-sm sm:text-base truncate dark:text-gray-200">{new Date(selectedUserDetails.unassignedAt).toLocaleString()}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Location Information */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg dark:text-gray-100">Location Assignment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">Location Details</h4>
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                  <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Location Name:</span>
                  <span className="font-medium text-sm sm:text-base truncate dark:text-gray-200">{selectedUserDetails.location.locationName}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                  <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Location ID:</span>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono text-xs sm:text-sm truncate dark:text-gray-200">{selectedUserDetails.location.id}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 flex-shrink-0 dark:text-gray-400 dark:hover:text-gray-300"
                      onClick={() => copyToClipboard(selectedUserDetails.location.id, 'Location ID')}
                    >
                      {copiedField === 'Location ID' ? (
                        <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                      ) : (
                        <Copy className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                  <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">QR Code:</span>
                  <span className="font-medium text-sm sm:text-base truncate dark:text-gray-200">{selectedUserDetails.location.qrCode}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">Contact Information</h4>
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                  <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Phone:</span>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-medium text-sm sm:text-base truncate dark:text-gray-200">{selectedUserDetails.location.phone}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 flex-shrink-0 dark:text-gray-400 dark:hover:text-gray-300"
                      onClick={() => copyToClipboard(selectedUserDetails.location.phone, 'Location Phone')}
                    >
                      {copiedField === 'Location Phone' ? (
                        <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                      ) : (
                        <Copy className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                  <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Email:</span>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-medium text-sm sm:text-base truncate dark:text-gray-200">{selectedUserDetails.location.email}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 flex-shrink-0 dark:text-gray-400 dark:hover:text-gray-300"
                      onClick={() => copyToClipboard(selectedUserDetails.location.email, 'Location Email')}
                    >
                      {copiedField === 'Location Email' ? (
                        <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                      ) : (
                        <Copy className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                  <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Company ID:</span>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-medium text-sm sm:text-base truncate dark:text-gray-200">{selectedUserDetails.location.companyId}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 flex-shrink-0 dark:text-gray-400 dark:hover:text-gray-300"
                      onClick={() => copyToClipboard(selectedUserDetails.location.companyId, 'Location Company ID')}
                    >
                      {copiedField === 'Location Company ID' ? (
                        <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                      ) : (
                        <Copy className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">Address</h4>
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <p className="text-xs sm:text-sm dark:text-gray-200">
                {selectedUserDetails.location.address}<br />
                {selectedUserDetails.location.city}, {selectedUserDetails.location.state} {selectedUserDetails.location.postalCode}<br />
                {selectedUserDetails.location.country}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">Location Timeline</h4>
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                <span className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Location Created:</span>
                <span className="font-medium text-sm sm:text-base dark:text-gray-200">{new Date(selectedUserDetails.location.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                <span className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Location Updated:</span>
                <span className="font-medium text-sm sm:text-base dark:text-gray-200">{new Date(selectedUserDetails.location.updatedAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 