"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Users, UserPlus, MoreHorizontal, Edit, Trash2, Eye, Search, Loader2, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUsers } from "@/hooks/use-users"
import { useAssignUserToLocation, useLocationUsers, useUnassignUserFromLocation, useUpdateLocationUser } from "@/hooks/useLocation";
import { toast } from "@/hooks/use-toast"
import api from "@/utils/axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getLocationUsers } from "@/lib/Api/getLocationUsers";

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

export default function LocationUsersPage() {
  const params = useParams()
  const router = useRouter()
  const companyId = params?.id as string
  const locationId = params?.locationId as string

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isUnassignDialogOpen, setIsUnassignDialogOpen] = useState(false)
  const [userToUnassign, setUserToUnassign] = useState<any>(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    status: "active",
  })

  // API hooks - Get users filtered by company for assignment
  const { data: allUsersData, isLoading: isLoadingUsers, refetch: refetchUsers } = useUsers(companyId, 1, 1000)
  const assignUserMutation = useAssignUserToLocation()
  const unassignUserMutation = useUnassignUserFromLocation();
  const updateUserMutation = useUpdateLocationUser();
  const queryClient = useQueryClient();

  const { data, isLoading, refetch: refetchLocationUsers } = useLocationUsers(locationId, 1, 1000);
  const locationUsers = data?.data || [];

  console.log("Location Users Data:", locationUsers)
  console.log("Location Users Structure:", locationUsers.map((user: any) => ({
    hasUser: !!user?.user,
    userId: user?.user?.id,
    userName: user?.user?.firstName + " " + user?.user?.lastName
  })))

  // locationUsers is an array of assignments, each with a nested user object
  const assignedUserIds = locationUsers
    .filter((user: any) => user?.user?.id) // Filter out any items without user.id
    .map((user: any) => user.user.id)
  const availableUsers = allUsersData?.data || []

  // Filter available users based on search
  const filteredAvailableUsers = availableUsers.filter(
    (user: any) =>
      !assignedUserIds.includes(user.id) && (
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      ),
  )

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
        return "bg-purple-100 text-purple-800"
      case "Supervisor":
        return "bg-blue-100 text-blue-800"
      case "Cashier":
        return "bg-orange-100 text-orange-800"
      case "Staff":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleAssignUser = async (userId: string) => {
    try {
      await assignUserMutation.mutateAsync({
        userId: userId,
        locationId: locationId,
      })
      setIsAssignModalOpen(false)
      setSearchTerm("")
      
      // Explicitly refetch both users and location users data
      await Promise.all([
        refetchUsers(),
        refetchLocationUsers()
      ])
      
      toast({
        title: "Success",
        description: "User assigned to location successfully",
      })
    } catch (error) {
      console.error("Error assigning user:", error)
      toast({
        title: "Error",
        description: (error as any)?.response?.data?.message || "Failed to assign user to location",
        variant: "destructive",
      })
    }
  }

  const handleEditUser = async () => {
    try {
      await updateUserMutation.mutateAsync({
        userId: selectedUser.id,
        locationId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        role: formData.role,
        status: formData.status,
      });
      setIsEditModalOpen(false);
      setSelectedUser(null);
      resetForm();
      toast({
        title: "Success",
        description: "User updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      });
    }
  };

  const openEditModal = (user: any) => {
    setSelectedUser(user)
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      role: user.role || "",
      status: user.status || "active",
    })
    setIsEditModalOpen(true)
  }

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      role: "",
      status: "active",
    })
  }

  const handleUnassignUser = async (userId: string) => {
    try {
      await unassignUserMutation.mutateAsync({ userId, locationId })
      toast({
        title: "Success",
        description: "User unassigned from location successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to unassign user from location",
        variant: "destructive",
      })
    }
  }

  const openUnassignDialog = (user: any) => {
    setUserToUnassign(user)
    setIsUnassignDialogOpen(true)
  }

  const confirmUnassign = async () => {
    if (userToUnassign) {
      await handleUnassignUser(userToUnassign.user.id)
      setIsUnassignDialogOpen(false)
      setUserToUnassign(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Location Users</h2>
          <p className="text-gray-600 dark:text-gray-300">Manage staff members assigned to this location</p>
        </div>
        <Button onClick={() => setIsAssignModalOpen(true)} className="bg-[#1a72dd] hover:bg-[#1557b8] text-white">
          <UserPlus className="w-4 h-4 mr-2" />
          Assign User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 truncate">Total Users</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {locationUsers.filter((u: any) => u?.user?.id).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 truncate">Active</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {locationUsers.filter((u: any) => u?.user?.status === "active").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 truncate">Managers</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {locationUsers.filter((u: any) => u?.user?.role === "Manager" || u?.user?.role === "Supervisor").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 truncate">Staff</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {locationUsers.filter((u: any) => u?.user?.role === "Staff" || u?.user?.role === "Cashier").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users List */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-gray-100">Staff Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {locationUsers
              .filter((user: any) => user?.user?.id) // Filter out any items without user.id
              .map((user: any) => (
              <div
                key={user.user.id}
                className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                onClick={() => router.push(`/companies/${companyId}/locations/${locationId}/user/${user.user.id}/userDetail`)}
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  <Avatar className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                    <AvatarImage src={user.user.avatar} alt={`${user.user.firstName} ${user.user.lastName}`} />
                    <AvatarFallback className={getRandomBgColor(user.user.firstName + user.user.lastName) + " text-white"}>
                      {user.user.firstName.charAt(0)}
                      {user.user.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{user.user.firstName} {user.user.lastName}</h4>
                      <div className="flex flex-wrap gap-1">
                        <Badge className={`${getStatusColor(user.user.status)} text-xs`}>{user.user.status}</Badge>
                        <Badge className={`${getRoleColor(user.user.role)} text-xs`}>{user.user.role}</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{user.user.email}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Assigned: {new Date(user.assignedAt).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Joined: {new Date(user.user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 flex-shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/companies/${companyId}/locations/${locationId}/user/${user.user.id}/userDetail`)
                    }}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation()
                      openEditModal(user.user)
                    }}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit User
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-600" 
                      onClick={(e) => {
                        e.stopPropagation()
                        openUnassignDialog(user)
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove from Location
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>

          {locationUsers.length === 0 && (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users assigned</h3>
              <p className="text-gray-600 mb-4">Assign users to this location to get started.</p>
              <Button
                onClick={() => setIsAssignModalOpen(true)}
                variant="outline"
                className="text-[#1a72dd] border-[#1a72dd] bg-transparent"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Assign First User
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assign User Modal */}
      <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Assign User to Location</DialogTitle>
            <DialogDescription>Select a user to assign to this location.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Users List */}
            <div className="max-h-[400px] overflow-y-auto space-y-2">
              {isLoadingUsers ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-[#1a72dd]" />
                  <span className="ml-2 text-gray-600">Loading users...</span>
                </div>
              ) : filteredAvailableUsers.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No available users</h3>
                  <p className="text-gray-600">
                    {searchTerm
                      ? "No users match your search criteria."
                      : "All users are already assigned to this location."}
                  </p>
                </div>
              ) : (
                // Only show STORE_KEEPER users for assignment
                filteredAvailableUsers
                  .filter((user: any) => user.role === "STORE_KEEPER")
                  .map((user: any) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleAssignUser(user.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src="/placeholder.svg" alt={`${user.firstName} ${user.lastName}`} />
                        <AvatarFallback className="bg-[#1a72dd] text-white">
                          {user.firstName.charAt(0)}
                          {user.lastName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </h4>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <Badge className="text-xs mt-1">{user.role.replace(/_/g, " ")}</Badge>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="bg-[#1a72dd] hover:bg-[#1557b8]"
                      disabled={assignUserMutation.isPending}
                    >
                      {assignUserMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Assign"}
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAssignModalOpen(false)
                setSearchTerm("")
              }}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information and role for this location.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-first-name">First Name *</Label>
              <Input
                id="edit-first-name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="Enter first name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-last-name">Last Name *</Label>
              <Input
                id="edit-last-name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Enter last name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email *</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role *</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger>
                  <SelectValue>{formData.role ? (formData.role.charAt(0).toUpperCase() + formData.role.slice(1).toLowerCase().replace(/_/g, ' ')) : 'Select a role'}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Supervisor">Supervisor</SelectItem>
                  <SelectItem value="Cashier">Cashier</SelectItem>
                  <SelectItem value="Staff">Staff</SelectItem>
                  <SelectItem value="COMPANY_OWNER">Company Owner</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditUser} className="bg-[#1a72dd] hover:bg-[#1557b8]">
              Update User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unassign Confirmation Dialog */}
      <AlertDialog open={isUnassignDialogOpen} onOpenChange={setIsUnassignDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove{" "}
              <span className="font-semibold">{userToUnassign?.user?.firstName} {userToUnassign?.user?.lastName}</span> from this location.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setIsUnassignDialogOpen(false)
              setUserToUnassign(null)
            }}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmUnassign} className="bg-red-600 hover:bg-red-700">Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
