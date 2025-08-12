"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useCallback, memo, useRef } from "react"
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
  MapPin,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from "@/hooks/use-users"
import { useAssignedUsers } from "@/hooks/useAssignedUsers"
import PhoneInput from "react-phone-input-2"
import { useQuery } from "@tanstack/react-query"
import { getCompanies } from "@/lib/Api/getCompanies"
import { useUserDataStore } from "@/lib/store"
import { getRoles } from "@/lib/Api/getRoles"

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

// Memoized search input component to prevent re-renders
const SearchInput = memo(({ 
  searchTerm, 
  onSearchChange, 
  placeholder, 
  isLoading,
  inputRef
}: { 
  searchTerm: string
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder: string
  isLoading: boolean
  inputRef?: React.RefObject<HTMLInputElement | null>
}) => {
  // Internal state to maintain focus
  const [internalValue, setInternalValue] = useState(searchTerm)
  const [isFocused, setIsFocused] = useState(false)
  
  // Update internal value when prop changes
  useEffect(() => {
    setInternalValue(searchTerm)
  }, [searchTerm])
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInternalValue(value)
    onSearchChange(e)
  }, [onSearchChange])

  const handleFocus = useCallback(() => {
    setIsFocused(true)
  }, [])

  const handleBlur = useCallback(() => {
    setIsFocused(false)
  }, [])

  // Preserve focus after loading completes
  useEffect(() => {
    if (!isLoading && isFocused && inputRef?.current) {
      setTimeout(() => {
        inputRef.current?.focus()
        // Restore cursor position
        if (inputRef.current) {
          const length = inputRef.current.value.length
          inputRef.current.setSelectionRange(length, length)
        }
      }, 50)
    }
  }, [isLoading, isFocused, inputRef])
  
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <Input
        ref={inputRef}
        placeholder={placeholder}
        value={internalValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="pl-10"
        // Remove disabled state to prevent focus loss
      />
      {isLoading && searchTerm && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#1a72dd]"></div>
        </div>
      )}
    </div>
  )
})

SearchInput.displayName = 'SearchInput'

export default function Users() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("")
  const [activeTab, setActiveTab] = useState<string>("users")
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  
  // Refs to maintain input focus
  const usersSearchRef = useRef<HTMLInputElement>(null)
  const assignedUsersSearchRef = useRef<HTMLInputElement>(null)
  
  // API hooks
  // console.log(currentUser, "currentUser");
  
  // Get current logged-in user
  const currentUser = useUserDataStore((state) => state.user)
  console.log(currentUser, "currentUser");
  
  // Use companyId filter if current user is COMPANY_OWNER
  const companyIdFilter = useMemo(() => 
    currentUser?.role === "COMPANY_OWNER" ? currentUser.companyId : undefined, 
    [currentUser?.role, currentUser?.companyId]
  )
  
  const { data: usersData, isLoading, error } = useUsers(companyIdFilter, currentPage, 10, debouncedSearchTerm)
  const { data: assignedUsersData, isLoading: isAssignedUsersLoading } = useAssignedUsers(currentPage, 10)
  const createUserMutation = useCreateUser()
  const updateUserMutation = useUpdateUser()
  const deleteUserMutation = useDeleteUser()

  // Memoize the search handler to prevent re-renders
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
  }, [])

  // Memoize the search input props to prevent re-renders
  const searchInputProps = useMemo(() => ({
    searchTerm,
    onSearchChange: handleSearchChange,
  }), [searchTerm, handleSearchChange])

  // Focus restoration effect
  useEffect(() => {
    // Restore focus to the appropriate input based on active tab
    const currentRef = activeTab === "users" ? usersSearchRef : assignedUsersSearchRef
    if (currentRef.current && document.activeElement !== currentRef.current) {
      // Only restore focus if the input has a value (user was typing)
      if (searchTerm) {
        setTimeout(() => {
          currentRef.current?.focus()
        }, 0)
      }
    }
  }, [activeTab, searchTerm])

  // Preserve focus during loading states
  useEffect(() => {
    const currentRef = activeTab === "users" ? usersSearchRef : assignedUsersSearchRef
    const wasFocused = currentRef.current === document.activeElement
    
    // If the input was focused and we have a search term, preserve focus after loading
    if (wasFocused && searchTerm && !isLoading && !isAssignedUsersLoading) {
      setTimeout(() => {
        currentRef.current?.focus()
        // Restore cursor position to end of input
        if (currentRef.current) {
          const length = currentRef.current.value.length
          currentRef.current.setSelectionRange(length, length)
        }
      }, 100) // Small delay to ensure DOM is updated
    }
  }, [isLoading, isAssignedUsersLoading, searchTerm, activeTab])

  // Debounced search effect - optimized to prevent aggressive re-rendering
  useEffect(() => {
    const timer = setTimeout(() => {
      // Only update if the search term has actually changed
      if (debouncedSearchTerm !== searchTerm) {
        setDebouncedSearchTerm(searchTerm)
        // Only reset page if we're not already on page 1
        if (currentPage !== 1) {
          setCurrentPage(1)
        }
      }
    }, 800) // Increased delay to 800ms for less aggressive updates

    return () => clearTimeout(timer)
  }, [searchTerm, debouncedSearchTerm, currentPage])

  // Reset search when tab changes - optimized
  useEffect(() => {
    const resetSearch = () => {
      setSearchTerm("")
      setDebouncedSearchTerm("")
      setCurrentPage(1)
    }
    
    // Only reset if we're actually changing tabs
    if (activeTab !== "users" && activeTab !== "assigned-users") {
      resetSearch()
    }
  }, [activeTab])

  // Fetch companies for dropdown
  const { data: companiesData, isLoading: isCompaniesLoading } = useQuery({
    queryKey: ["companies", "all-for-user-edit"],
    queryFn: () => getCompanies("", 1, 100),
  })
  const companies = companiesData?.data || []

  // Fetch roles for dropdown
  const { data: rolesData, isLoading: isRolesLoading } = useQuery({
    queryKey: ["roles", "all-for-user-edit"],
    queryFn: getRoles,
  })
  const roles = rolesData || []

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
  const assignedUsers = assignedUsersData?.data || []
  const meta = activeTab === "users" ? usersData?.meta : assignedUsersData?.meta
console.log(assignedUsers, "assignedUsers");

  // Get assigned user IDs for filtering - memoized
  const assignedUserIds = useMemo(() => 
    assignedUsers.map((au: any) => au.user?.id).filter(Boolean), 
    [assignedUsers]
  )

  // Filter users based on active tab - memoized to prevent unnecessary recalculations
  const filteredUsers = useMemo(() => {
    let allUsers = users
    if (activeTab === "assigned-users") {
      // Show only assigned users
      allUsers = assignedUsers.map((au: any) => au.user).filter(Boolean) // Filter out undefined users
    } else {
      // Show users who are NOT assigned (exclude assigned users)
      allUsers = users.filter((user: any) => !assignedUserIds.includes(user.id))
    }

    // For assigned users, we still need client-side filtering since the API doesn't support search for assigned users
    if (activeTab === "assigned-users" && searchTerm) {
      allUsers = allUsers.filter((user) => {
        // Add null checks to prevent errors
        if (!user || !user.firstName || !user.lastName || !user.email || !user.role) {
          return false
        }
        
        return (
          user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.role.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
    }

    return allUsers
  }, [users, assignedUsers, activeTab, searchTerm, assignedUserIds])

  // Get role badge color - memoized
  const getRoleBadgeColor = useCallback((role: string) => {
    switch (role) {
      case "POSPORT_ADMIN":
        return "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 border-red-200 dark:border-red-800"
      case "COMPANY_OWNER":
        return "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 border-blue-200 dark:border-blue-800"
      case "STORE_KEEPER":
        return "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 border-green-200 dark:border-green-800"
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600"
    }
  }, [])

  // Format role name - memoized
  const formatRoleName = useCallback((role: string) => {
    return role
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l: string) => l.toUpperCase())
  }, [])

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
      companyId: (currentUser?.companyId as string | null) ?? null,
    })
    setIsEditModalOpen(true)
  }

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      await deleteUserMutation.mutateAsync(id)
      setIsDeleteDialogOpen(false)
      setUserToDelete(null)
    } catch (error) {
      console.error("Error deleting user:", error)
    }
  }

  const openDeleteDialog = (user: User) => {
    setUserToDelete(user)
    setIsDeleteDialogOpen(true)
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

  // Show error if there's an error
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {currentUser?.role === "COMPANY_OWNER" ? "Store Keepers Management" : "Users Management"}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {currentUser?.role === "COMPANY_OWNER" 
              ? "Manage your store keepers and their assignments" 
              : "Manage your team members and their roles"
            }
          </p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#1a72dd] hover:bg-[#1557b8]">
              <Plus className="w-4 h-4 mr-2" />
              {currentUser?.role === "COMPANY_OWNER" ? "Add Store Keeper" : "Add User"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {currentUser?.role === "COMPANY_OWNER" ? "Add New Store Keeper" : "Add New User"}
              </DialogTitle>
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
                    inputClass="!w-full !h-10 !text-base !border !border-gray-300 dark:!border-gray-600 rounded-md p-2 dark:!bg-gray-700 dark:!text-gray-200"
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
                    <SelectValue placeholder={isRolesLoading ? "Loading roles..." : "Select role"} />
                  </SelectTrigger>
                  <SelectContent>
                    {roles
                      .filter(role => {
                        // For COMPANY_OWNER, only show STORE_KEEPER
                        if (currentUser?.role === "COMPANY_OWNER") {
                          return role.name === "STORE_KEEPER";
                        }
                        // Show all roles except COMPANY_OWNER and POSPORT_ADMIN by default
                        if (role.name !== "COMPANY_OWNER" && role.name !== "POSPORT_ADMIN") return true;
                        // If current user is POSPORT_ADMIN, show these roles too
                        if (currentUser?.role === "POSPORT_ADMIN") return true;
                        return false;
                      })
                      .map(role => (
                        <SelectItem key={role.name} value={role.name}>
                          {role.name.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                        </SelectItem>
                      ))}
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
                  {createUserMutation.isPending 
                    ? "Creating..." 
                    : currentUser?.role === "COMPANY_OWNER" ? "Add Store Keeper" : "Add User"
                  }
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-[#1a72dd] dark:text-blue-400" />
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">Total Users</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{meta?.itemCount || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        {currentUser?.role !== "COMPANY_OWNER" && (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 dark:text-red-400" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">Admins</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {users.filter((user) => user.role === "POSPORT_ADMIN").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {currentUser?.role !== "COMPANY_OWNER" && (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 dark:text-blue-400" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">Owners</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {users.filter((user) => user.role === "COMPANY_OWNER").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 dark:text-green-400" />
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
                  {currentUser?.role === "COMPANY_OWNER" ? "Store Keepers" : "Keepers"}
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {users.filter((user) => user.role === "STORE_KEEPER").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="assigned-users" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Assigned Users
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          {/* Search */}
          <SearchInput
            key="users-search"
            searchTerm={searchInputProps.searchTerm}
            onSearchChange={searchInputProps.onSearchChange}
            placeholder={
              currentUser?.role === "COMPANY_OWNER" 
                ? "Search store keepers by name, email, or role..." 
                : "Search users by name, email, or role..."
            }
            isLoading={isLoading}
            inputRef={usersSearchRef}
          />

          {/* Users List */}
          <div className="space-y-4 relative">
            {/* Loading overlay - only show when loading and no users */}
            {isLoading && filteredUsers.length === 0 && (
              <div className="absolute inset-0 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm flex items-center justify-center z-10 pointer-events-none">
                <div className="flex items-center space-x-2 bg-white dark:bg-gray-700 p-3 rounded-lg shadow-lg">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1a72dd] dark:border-blue-400"></div>
                  <span className="text-gray-600 dark:text-gray-300">Loading users...</span>
                </div>
              </div>
            )}
            
            {filteredUsers.length === 0 ? (
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-8 text-center">
                  <User className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    {currentUser?.role === "COMPANY_OWNER" ? "No store keepers found" : "No users found"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {searchTerm 
                      ? "Try adjusting your search terms." 
                      : currentUser?.role === "COMPANY_OWNER" 
                        ? "Get started by adding your first store keeper." 
                        : "Get started by adding your first user."
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredUsers.map((user) => (
                <Card 
                  key={user.id} 
                  className="hover:shadow-md transition-shadow cursor-pointer dark:bg-gray-800 dark:border-gray-700"
                  onClick={() => router.push(`/users/${user.id}/detail`)}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                      <div className="flex items-start space-x-3 sm:space-x-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#1a72dd] rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base flex-shrink-0">
                          {user.firstName?.charAt(0) || 'U'}
                          {user.lastName?.charAt(0) || ''}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                              {user.firstName || 'Unknown'} {user.lastName || 'User'}
                            </h3>
                            <div className="flex flex-wrap gap-1">
                              <Badge className={getRoleBadgeColor(user.role)}>{formatRoleName(user.role)}</Badge>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                              <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                              <span className="truncate">{user.email || 'No email'}</span>
                            </div>
                            <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                              <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                              <span className="truncate">{user.phone || 'No phone'}</span>
                            </div>
                            {user.companyId && (
                              <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                                <Building2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                                <span className="truncate">Company ID: {user.companyId.slice(0, 8)}...</span>
                              </div>
                            )}
                          </div>
                          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            Created: {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-end sm:justify-start">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-8 w-8 sm:h-10 sm:w-10"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="dark:bg-gray-800 dark:border-gray-700">
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation()
                              handleEdit(user)
                            }} className="dark:text-gray-200 dark:hover:bg-gray-700">
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={(e) => {
                                e.stopPropagation()
                                openDeleteDialog(user)
                              }} 
                              className="text-red-600 dark:text-red-400 dark:hover:bg-red-900/20"
                            >
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
        </TabsContent>

        <TabsContent value="assigned-users" className="space-y-4">
          {/* Search */}
          <SearchInput
            key="assigned-users-search"
            searchTerm={searchInputProps.searchTerm}
            onSearchChange={searchInputProps.onSearchChange}
            placeholder="Search assigned users by name, email, or role..."
            isLoading={isAssignedUsersLoading}
            inputRef={assignedUsersSearchRef}
          />

          {/* Assigned Users List */}
          <div className="space-y-4 relative">
            {/* Loading overlay - only show when loading and no users */}
            {isAssignedUsersLoading && filteredUsers.length === 0 && (
              <div className="absolute inset-0 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm flex items-center justify-center z-10 pointer-events-none">
                <div className="flex items-center space-x-2 bg-white dark:bg-gray-700 p-3 rounded-lg shadow-lg">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1a72dd] dark:border-blue-400"></div>
                  <span className="text-gray-600 dark:text-gray-300">Loading assigned users...</span>
                </div>
              </div>
            )}
            
            {filteredUsers.length === 0 ? (
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-8 text-center">
                  <MapPin className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No assigned users found</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {searchTerm ? "Try adjusting your search terms." : "No users are currently assigned to locations."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredUsers.map((user) => {
                // Find the assigned user data to get location information
                const assignedUserData = assignedUsers.find((au: any) => au.user?.id === user.id)
                const location = assignedUserData?.location
                
                return (
                  <Card 
                    key={user.id} 
                    className="hover:shadow-md transition-shadow cursor-pointer dark:bg-gray-800 dark:border-gray-700"
                    onClick={() => {
                      if (location) {
                        // Navigate to location-specific user detail page
                        router.push(`/companies/${location.companyId}/locations/${location.id}/user/${user.id}/userDetail`)
                      } else {
                        // Fallback to general user detail page
                        router.push(`/users/${user.id}/detail`)
                      }
                    }}
                  >
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                        <div className="flex items-start space-x-3 sm:space-x-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base flex-shrink-0">
                            {user.firstName?.charAt(0) || 'U'}
                            {user.lastName?.charAt(0) || ''}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                                {user.firstName || 'Unknown'} {user.lastName || 'User'}
                              </h3>
                              <div className="flex flex-wrap gap-1">
                                <Badge className={getRoleBadgeColor(user.role)}>{formatRoleName(user.role)}</Badge>
                                <Badge className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400">Assigned</Badge>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                                <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                                <span className="truncate">{user.email || 'No email'}</span>
                              </div>
                              <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                                <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                                <span className="truncate">{user.phone || 'No phone'}</span>
                              </div>
                              {location && (
                                <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                                  <span className="truncate">{location.locationName}</span>
                                </div>
                              )}
                              {user.companyId && (
                                <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                                  <Building2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                                  <span className="truncate">Company ID: {user.companyId.slice(0, 8)}...</span>
                                </div>
                              )}
                            </div>
                            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                              Created: {new Date(user.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-end sm:justify-start">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-8 w-8 sm:h-10 sm:w-10"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="dark:bg-gray-800 dark:border-gray-700">
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation()
                                handleEdit(user)
                              }} className="dark:text-gray-200 dark:hover:bg-gray-700">
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={(e) => {
                                  e.stopPropagation()
                                  openDeleteDialog(user)
                                }} 
                                className="text-red-600 dark:text-red-400 dark:hover:bg-red-900/20"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Pagination */}
      {meta && meta.pageCount > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
            Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, meta.itemCount)} of {meta.itemCount} {
              currentUser?.role === "COMPANY_OWNER" ? "store keepers" : "users"
            }
          </div>
          <div className="flex items-center justify-center sm:justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs px-2 sm:px-3"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={!meta.hasPreviousPage}
            >
              <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <span className="hidden sm:inline">Previous</span>
            </Button>
            <span className="text-xs sm:text-sm text-gray-600 px-2">
              {currentPage} / {meta.pageCount}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="text-xs px-2 sm:px-3"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={!meta.hasNextPage}
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentUser?.role === "COMPANY_OWNER" ? "Edit Store Keeper" : "Edit User"}
            </DialogTitle>
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
                  <SelectValue placeholder={isRolesLoading ? "Loading roles..." : "Select role"} />
                </SelectTrigger>
                <SelectContent>
                  {roles
                    .filter(role => {
                      // For COMPANY_OWNER, only show STORE_KEEPER
                      if (currentUser?.role === "COMPANY_OWNER") {
                        return role.name === "STORE_KEEPER";
                      }
                      // Show all roles except COMPANY_OWNER and POSPORT_ADMIN by default
                      if (role.name !== "COMPANY_OWNER" && role.name !== "POSPORT_ADMIN") return true;
                      // If current user is POSPORT_ADMIN, show these roles too
                      if (currentUser?.role === "POSPORT_ADMIN") return true;
                      return false;
                    })
                    .map(role => (
                      <SelectItem key={role.name} value={role.name}>
                        {role.name.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                      </SelectItem>
                    ))}
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
                {updateUserMutation.isPending 
                  ? "Updating..." 
                  : currentUser?.role === "COMPANY_OWNER" ? "Update Store Keeper" : "Update User"
                }
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              <span className="font-semibold">
                {userToDelete?.firstName} {userToDelete?.lastName}
              </span>{" "}
              and all their associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setIsDeleteDialogOpen(false)
              setUserToDelete(null)
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => userToDelete && handleDelete(userToDelete.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
