"use client"

import { useState } from "react"
import { Plus, Search, Shield, Users, Building2, MoreVertical, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getRoles } from "@/lib/Api/getRoles"
import { createRole } from "@/lib/Api/createRole"
import { editRole } from "@/lib/Api/editRole"
import { deleteRole } from "@/lib/Api/deleteRole"
import { useUserDataStore } from "@/lib/store";

// Mock data based on the provided API response
const mockRoles = [
  {
    id: "d1873db4-43d4-49e9-93c1-034461d87fda",
    createdAt: "2025-07-16T11:32:10.008Z",
    updatedAt: "2025-07-16T11:32:10.008Z",
    name: "COMPANY_OWNER",
    description: "Company owner with admin rights on their company",
  },
  {
    id: "60870dc2-d541-4d61-a243-3885b05c3024",
    createdAt: "2025-07-16T11:32:10.034Z",
    updatedAt: "2025-07-16T11:32:10.034Z",
    name: "POSPORT_ADMIN",
    description: "Posport admin with full access to all resources (super user)",
  },
  {
    id: "f43b7496-79db-472c-bbcd-4a8d1a1ef65c",
    createdAt: "2025-07-16T11:32:10.034Z",
    updatedAt: "2025-07-16T11:32:10.034Z",
    name: "STORE_KEEPER",
    description: "Store keeper with limited operations access",
  },
]

interface Role {
  id: string
  createdAt: string
  updatedAt: string
  name: string
  description: string
}

export default function Roles() {
  const user = useUserDataStore((state) => state.user);

  // Prevent COMPANY_OWNER from accessing roles
  if (user?.role === "COMPANY_OWNER") {
    return (
      <div className="flex items-center justify-center h-full text-xl font-bold text-red-600 dark:text-red-400">
        Access Denied: Company owners cannot access roles management
      </div>
    );
  }

  // const [roles, setRoles] = useState<Role[]>(mockRoles)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newRole, setNewRole] = useState({ name: "", description: "" })
  const { data: roles, isLoading, error } = useQuery({
    queryKey: ['roles'],
    queryFn: getRoles,
  });

  const queryClient = useQueryClient();
  const [editModal, setEditModal] = useState<{ open: boolean; role: Role | null }>({ open: false, role: null });

  // Add Role Mutation
  const addRoleMutation = useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      setNewRole({ name: "", description: "" });
      setIsAddModalOpen(false);
    },
  });

  // Edit Role Mutation
  const editRoleMutation = useMutation({
    mutationFn: editRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      setEditModal({ open: false, role: null });
    },
  });

  // Delete Role Mutation
  const deleteRoleMutation = useMutation({
    mutationFn: deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });

  // Filter roles based on search term
  const filteredRoles = roles ? roles.filter(
    (role:any) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase()),
  ) : []

  // Get role type and styling
  const getRoleType = (roleName: string) => {
    if (roleName.includes("ADMIN")) {
      return { type: "Admin", color: "bg-red-100 text-red-800", icon: Shield }
    } else if (roleName.includes("OWNER")) {
      return { type: "Owner", color: "bg-blue-100 text-blue-800", icon: Users }
    } else {
      return { type: "User", color: "bg-green-100 text-green-800", icon: Building2 }
    }
  }

  // Handle adding new role
  const handleAddRole = () => {
    if (newRole.name && newRole.description) {
      addRoleMutation.mutate({
        name: newRole.name.toUpperCase().replace(/\s+/g, "_"),
        description: newRole.description,
      });
    }
  };

  // Handle editing role
  const handleEditRole = (id: string, name: string, description: string) => {
    editRoleMutation.mutate({
      id,
      name: name.toUpperCase().replace(/\s+/g, "_"),
      description,
      companyId: user?.companyId || "",
    });
  };

  // Handle deleting role
  const handleDeleteRole = (id: string) => {
    deleteRoleMutation.mutate(id);
  };

  // Format role name for display
  const formatRoleName = (name: string) => {
    return name
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase())
  }

  // Calculate statistics
  const totalRoles = roles && roles?.length
  const adminRoles = roles && roles.filter((role:any) => role.name.includes("ADMIN")).length
  const userRoles = roles && roles.filter((role:any) => !role.name.includes("ADMIN") && !role.name.includes("OWNER")).length

  return (
    <div className="p-4 sm:p-6 h-screen mt-10 md:mt-0  overflow-x-auto  space-y-6 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="flex  flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Roles Management</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Manage user roles and permissions</p>
        </div>

        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#1a72dd] hover:bg-[#1557b8] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Role
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Role</DialogTitle>
              <DialogDescription>Create a new role with specific permissions and access levels.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Role Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Store Manager"
                  value={newRole.name}
                  onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the role responsibilities and permissions..."
                  value={newRole.description}
                  onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddRole} className="bg-[#1a72dd] hover:bg-[#1557b8]">
                Add Role
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3  gap-4">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-200">Total Roles</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-gray-100">{totalRoles}</div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">Active roles in system</p>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-200">Admin Roles</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-gray-100">{adminRoles}</div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">Administrative access</p>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-200">User Roles</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-gray-100">{userRoles}</div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">Standard user access</p>
          </CardContent>
        </Card>
      </div>

       {error && (
          <div className="text-center py-12 h-full flex flex-col items-center justify-center">
            <>
            <Building2 className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No roles found</h3>
            <p className="text-gray-500 dark:text-gray-400">Plz.. cheack your internet connection </p>
            </>
          </div>
        )}
      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 pb-40 lg:grid-cols-3 gap-6">
        {filteredRoles.map((role:any) => {
          const roleType = getRoleType(role.name)
          const IconComponent = roleType.icon

          return (
            <Card key={role.id} className="hover:shadow-lg transition-shadow duration-200 dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#1a72dd]/10 dark:bg-blue-900/20 rounded-lg">
                      <IconComponent className="w-5 h-5 text-[#1a72dd] dark:text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">{formatRoleName(role.name)}</CardTitle>
                      <Badge className={`mt-1 ${roleType.color} border-0`}>{roleType.type}</Badge>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 dark:text-gray-400 dark:hover:text-gray-300">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="dark:bg-gray-800 dark:border-gray-700">
                      <DropdownMenuItem onClick={() => setEditModal({ open: true, role })} className="dark:text-gray-200 dark:hover:bg-gray-700">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600 dark:text-red-400 dark:hover:bg-red-900/20" onClick={() => handleDeleteRole(role.id)}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{role.description}</p>
                <div className="text-xs text-gray-500 dark:text-gray-400">Created: {new Date(role.createdAt).toLocaleDateString()}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredRoles.length === 0 && (
        <div className="text-center py-12">
          <Shield className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No roles found</h3>
          <p className="text-gray-600 dark:text-gray-300">Try adjusting your search or add a new role.</p>
        </div>
      )}

      {/* Edit Role Modal */}
      <Dialog open={editModal.open} onOpenChange={(open) => setEditModal({ open, role: open ? editModal.role : null })}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>Update the role's name and description.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Role Name</Label>
              <Input
                id="edit-name"
                placeholder="e.g., Store Manager"
                value={editModal.role?.name ? editModal.role.name.replace(/_/g, " ") : ""}
                onChange={(e) => setEditModal((prev) => prev.role ? { ...prev, role: { ...prev.role, name: e.target.value } } : prev)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                placeholder="Describe the role responsibilities and permissions..."
                value={editModal.role?.description || ""}
                onChange={(e) => setEditModal((prev) => prev.role ? { ...prev, role: { ...prev.role, description: e.target.value } } : prev)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModal({ open: false, role: null })}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (editModal.role) handleEditRole(editModal.role.id, editModal.role.name, editModal.role.description);
              }}
              className="bg-[#1a72dd] hover:bg-[#1557b8]"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
