"use client"

import { useState } from "react"
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  User,
  Mail,
  Phone,
  Building2,
  Shield,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from "@/hooks/use-users"
import PhoneInput from "react-phone-input-2"
import { useQuery } from "@tanstack/react-query"
import { getCompanies } from "@/lib/Api/getCompanies"
import { useUserDataStore } from "@/lib/store"

// Define User type for clarity
interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: string
  companyId?: string | null
  createdAt: string
}

export default function Users() {
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const user = useUserDataStore((state) => state.user);
  // API hooks
  const { data: usersData, isLoading, error } = useUsers(currentPage, 10)
  const createUserMutation = useCreateUser()
  const updateUserMutation = useUpdateUser()
  const deleteUserMutation = useDeleteUser()

  // Fetch companies for dropdown
  const { data: companiesData, isLoading: isCompaniesLoading } = useQuery({
    queryKey: ["companies", "all-for-user-edit"],
    queryFn: () => getCompanies("", 1, 100),
  })
  const companies = companiesData?.data || []

  // Get current logged-in user
  const currentUser = useUserDataStore((state) => state.user)

  // Form state
  const [formData, setFormData] = useState<{
    firstName: string
    lastName: string
    email: string
    phone: string
    role: string
    companyId: string | null
  }>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    companyId: null,
  })

  const users = usersData?.data || []
  const meta = usersData?.meta

  // Filter users based on search term and company ownership
  const filteredUsers = users.filter((user) => {
    // If current user is COMPANY_OWNER, only show users with matching companyId
    if (currentUser?.role === "COMPANY_OWNER") {
      return user.companyId === currentUser.companyId && (
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    // Otherwise, show all users matching search
    return (
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  })

  // Get role badge color
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "POSPORT_ADMIN":
        return "bg-red-100 text-red-800 border-red-200"
      case "COMPANY_OWNER":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "STORE_KEEPER":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Format role name
  const formatRoleName = (role: string) => {
    return role
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l: string) => l.toUpperCase())
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      // Ensure companyId is always sent with the payload
      const payload = { ...formData, companyId: formData.companyId }

      if (editingUser) {
        await updateUserMutation.mutateAsync({ ...payload, id: editingUser.id })
        setIsEditModalOpen(false)
      } else {
        await createUserMutation.mutateAsync(payload)
        setIsAddModalOpen(false)
      }

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        role: "",
        companyId: null,
      })
      setEditingUser(null)
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  // Handle edit
  const handleEdit = (users: User) => {
    setEditingUser(users)
    setFormData({
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
      phone: users.phone,
      role: users.role,
      companyId: (user?.companyId as string | null) ?? null,
    })
    setIsEditModalOpen(true)
  }

  // Handle delete
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUserMutation.mutateAsync(id)
      } catch (error) {
        console.error("Error deleting user:", error)
      }
    }
  }

  // Reset form when modals close
  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "",
      companyId: null,
    })
    setEditingUser(null)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a72dd]"></div>
        <span className="ml-2 text-gray-600">Loading users...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600">Error loading users. Please try again.</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600">Manage your team members and their roles</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#1a72dd] hover:bg-[#1557b8]">
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

                <div className="w-full h-fit">
                  <PhoneInput
                    country={'pk'}
                    value={formData.phone}
                    onChange={(value: string) => {
                      // Always save with leading plus
                      let formatted = value;
                      if (formatted && !formatted.startsWith('+')) {
                        formatted = '+' + formatted.replace(/^0+/, '');
                      }
                      setFormData({ ...formData, phone: formatted });
                    }}
                    inputProps={{
                      name: 'phone',
                      required: true,
                      id: 'phone',
                    }}
                    inputClass="!w-full !h-10 !text-base !border !border-gray-300 rounded-md p-2"
                    buttonClass="!h-3"
                    containerClass="!w-full"
                    placeholder="Enter phone number"
                    enableSearch
                  />
                </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => {
                    // If COMPANY_OWNER, auto-assign companyId for STORE_KEEPER or COMPANY_OWNER
                    if ((value === "STORE_KEEPER" || value === "COMPANY_OWNER") && currentUser?.role === "COMPANY_OWNER") {
                      setFormData({ ...formData, role: value, companyId: currentUser.companyId || null });
                    } else if ((value === "STORE_KEEPER" || value === "COMPANY_OWNER") && currentUser?.role === "POSPORT_ADMIN") {
                      setFormData({ ...formData, role: value, companyId: null }); // Wait for company selection
                    } else {
                      setFormData({ ...formData, role: value, companyId: null });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="POSPORT_ADMIN">Posport Admin</SelectItem>
                    <SelectItem value="COMPANY_OWNER">Company Owner</SelectItem>
                    <SelectItem value="STORE_KEEPER">Store Keeper</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Company selection for POSPORT_ADMIN creating STORE_KEEPER or COMPANY_OWNER */}
              {currentUser?.role === "POSPORT_ADMIN" && (formData.role === "STORE_KEEPER" || formData.role === "COMPANY_OWNER") && (
                <div>
                  <Label htmlFor="companyId">Company</Label>
                  <Select
                    value={formData.companyId ?? ""}
                    onValueChange={(value) => setFormData({ ...formData, companyId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select company" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddModalOpen(false)
                    resetForm()
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createUserMutation.isPending}>
                  {createUserMutation.isPending ? "Creating..." : "Add User"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-[#1a72dd]" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{
                  currentUser?.role === "COMPANY_OWNER"
                    ? users.filter((user) => user.companyId === currentUser.companyId).length
                    : meta?.itemCount || 0
                }</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Admins</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter((user) => user.role === "POSPORT_ADMIN").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Owners</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter((user) => user.role === "COMPANY_OWNER").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Keepers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter((user) => user.role === "STORE_KEEPER").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search users by name, email, or role..."
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Users List */}
      <div className="space-y-4">
        {filteredUsers.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-600">
                {searchTerm ? "Try adjusting your search terms." : "Get started by adding your first user."}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredUsers.map((user) => (
            <Card key={user.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[#1a72dd] rounded-full flex items-center justify-center text-white font-semibold">
                      {user.firstName.charAt(0)}
                      {user.lastName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {user.firstName} {user.lastName}
                        </h3>
                        <Badge className={getRoleBadgeColor(user.role)}>{formatRoleName(user.role)}</Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="truncate">{user.email}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span>{user.phone}</span>
                        </div>
                        {user.companyId && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Building2 className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span>Company ID: {user.companyId.slice(0, 8)}...</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        Created: {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(user)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(user.id)} className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {meta && meta.pageCount > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, meta.itemCount)} of {meta.itemCount}{" "}
            users
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={!meta.hasPreviousPage}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {meta.pageCount}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={!meta.hasNextPage}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editFirstName">First Name</Label>
                <Input
                  id="editFirstName"
                  value={formData.firstName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="editLastName">Last Name</Label>
                <Input
                  id="editLastName"
                  value={formData.lastName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="editEmail">Email</Label>
              <Input
                id="editEmail"
                type="email"
                value={formData.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="editPhone">Phone</Label>
              <Input
                id="editPhone"
                value={formData.phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="editRole">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => {
                  // If COMPANY_OWNER, set companyId to current user's companyId
                  if (value === "COMPANY_OWNER" && currentUser?.companyId) {
                    setFormData({ ...formData, role: value, companyId: currentUser.companyId })
                  } else if (value === "POSPORT_ADMIN") {
                    setFormData({ ...formData, role: value, companyId: formData.companyId })
                  } else {
                    setFormData({ ...formData, role: value, companyId: null })
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="POSPORT_ADMIN">Posport Admin</SelectItem>
                  <SelectItem value="COMPANY_OWNER">Company Owner</SelectItem>
                  <SelectItem value="STORE_KEEPER">Store Keeper</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Company selection dropdown: only show for POSPORT_ADMIN */}
            {currentUser?.role === "POSPORT_ADMIN" && (
              <div>
                <Label htmlFor="editCompanyId">Company</Label>
                <Select
                  value={formData.companyId ?? "none"}
                  onValueChange={(value) => setFormData({ ...formData, companyId: value === "none" ? null : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select company (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Company</SelectItem>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditModalOpen(false)
                  resetForm()
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateUserMutation.isPending}>
                {updateUserMutation.isPending ? "Updating..." : "Update User"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
