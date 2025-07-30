"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUsers } from "@/hooks/use-users"
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
      return "bg-green-100 text-green-800"
    case "inactive":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getRoleColor = (role: string) => {
  switch (role) {
    case "Manager":
      return "bg-blue-100 text-blue-800"
    case "Supervisor":
      return "bg-purple-100 text-purple-800"
    case "Cashier":
      return "bg-green-100 text-green-800"
    case "Staff":
      return "bg-orange-100 text-orange-800"
    case "COMPANY_OWNER":
      return "bg-red-100 text-red-800"
    case "STORE_KEEPER":
      return "bg-yellow-100 text-yellow-800"
    case "POSPORT_ADMIN":
      return "bg-indigo-100 text-indigo-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const formatRoleName = (role: string) => {
  return role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

export default function UserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params?.userId as string

  const [copiedField, setCopiedField] = useState<string | null>(null)

  const { data: usersData, isLoading } = useUsers()
  const users = usersData?.data || []
  const selectedUser = users.find((user: any) => user.id === userId)

  const handleBack = () => {
    router.push('/users')
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
          <div className="text-gray-600 mb-4">Loading user details...</div>
        </div>
      </div>
    )
  }

  if (!selectedUser) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-600 mb-4">User not found</div>
          <Button onClick={handleBack} variant="outline">
            Back to Users
          </Button>
        </div>
      </div>
    )
  }

  return (
    
    <div className="m-4 space-y-6" >
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button onClick={handleBack} variant="outline" size="icon">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Details</h1>
          <p className="text-gray-600">Complete information about the user.</p>
        </div>
      </div>

      {/* User Header */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <Avatar className="w-16 h-16">
          <AvatarFallback className={getRandomBgColor(selectedUser.firstName + selectedUser.lastName) + " text-white text-lg"}>
            {selectedUser.firstName.charAt(0)}
            {selectedUser.lastName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900">
            {selectedUser.firstName} {selectedUser.lastName}
          </h3>
          <p className="text-gray-600">{selectedUser.email}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge className={getRoleColor(selectedUser.role)}>
              {formatRoleName(selectedUser.role)}
            </Badge>
          </div>
        </div>
      </div>

      {/* User Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Full Name:</span>
              <span className="font-medium">{selectedUser.firstName} {selectedUser.lastName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Email:</span>
              <div className="flex items-center gap-2">
                <span className="font-medium">{selectedUser.email}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => copyToClipboard(selectedUser.email, 'Email')}
                >
                  {copiedField === 'Email' ? (
                    <Check className="h-3 w-3 text-green-600" />
                  ) : (
                    <Copy className="h-3 w-3 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Phone:</span>
              <div className="flex items-center gap-2">
                <span className="font-medium">{selectedUser.phone || 'Not provided'}</span>
                {selectedUser.phone && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => copyToClipboard(selectedUser.phone, 'Phone')}
                  >
                    {copiedField === 'Phone' ? (
                      <Check className="h-3 w-3 text-green-600" />
                    ) : (
                      <Copy className="h-3 w-3 text-gray-500" />
                    )}
                  </Button>
                )}
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Role:</span>
              <Badge className={getRoleColor(selectedUser.role)}>
                {formatRoleName(selectedUser.role)}
              </Badge>
            </div>
            {selectedUser.companyId && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Company ID:</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{selectedUser.companyId}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => copyToClipboard(selectedUser.companyId!, 'Company ID')}
                  >
                    {copiedField === 'Company ID' ? (
                      <Check className="h-3 w-3 text-green-600" />
                    ) : (
                      <Copy className="h-3 w-3 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-gray-600">User ID:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm">{selectedUser.id}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => copyToClipboard(selectedUser.id, 'User ID')}
                >
                  {copiedField === 'User ID' ? (
                    <Check className="h-3 w-3 text-green-600" />
                  ) : (
                    <Copy className="h-3 w-3 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Account Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Account Created:</span>
              <span className="font-medium">{new Date(selectedUser.createdAt).toLocaleString()}</span>
            </div>
            {selectedUser.updatedAt && (
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated:</span>
                <span className="font-medium">{new Date(selectedUser.updatedAt).toLocaleString()}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Company Information */}
      {selectedUser.companyId && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Company Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Company ID:</span>
              <div className="flex items-center gap-2">
                <span className="font-medium">{selectedUser.companyId}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => copyToClipboard(selectedUser.companyId!, 'Company ID')}
                >
                  {copiedField === 'Company ID' ? (
                    <Check className="h-3 w-3 text-green-600" />
                  ) : (
                    <Copy className="h-3 w-3 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Role in Company:</span>
              <Badge className={getRoleColor(selectedUser.role)}>
                {formatRoleName(selectedUser.role)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 