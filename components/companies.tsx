"use client"

import { useState } from "react"
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Hash,
  CheckCircle,
  Clock,
  XCircle,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getCompanies } from "@/lib/Api/getCompanies"
import { createCompany } from "@/lib/Api/createCompany"
import { editCompany } from "@/lib/Api/editCompany"
import { deleteCompany } from "@/lib/Api/deleteCompany"
import type { GetCompaniesResponse } from "@/lib/Api/getCompanies"
import { useUserDataStore } from "@/lib/store";
import Locations from "@/components/location";
import { useRouter } from "next/navigation"

interface Company {
  id: string
  name: string
  ntn: string
  email: string
  phone: string
  address: string
  industry: string
  status: "accepted" | "pending" | "rejected"
}

interface CompaniesProps {
  onCompanySelect?: (companyId: string) => void;
}

export default function Companies({ onCompanySelect }: CompaniesProps) {
  const user = useUserDataStore((state) => state.user);
  const setUser = useUserDataStore((state) => state.setUser);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newCompany, setNewCompany] = useState({
    name: "",
    ntn: "",
    email: "",
    phone: "",
    address: "",
    industry: "Food & Beverage",
    status: "pending" as const,
  })
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editCompanyData, setEditCompanyData] = useState<Company | null>(null)
  const [page, setPage] = useState(1)
  const take = 10
  const queryClient = useQueryClient()

  // Fetch companies with search and pagination
  const { data, isLoading, error, isFetching } = useQuery<GetCompaniesResponse, Error>({
    queryKey: ["companies", searchTerm, page, take],
    queryFn: () => getCompanies(searchTerm, page, take),
  })
  const companies = data?.data || []
  // Pagination meta from API (fallbacks for safety)
  const meta = data?.meta || {
    page: page,
    take: take,
    itemCount: companies.length,
    pageCount: 1,
    hasPreviousPage: page > 1,
    hasNextPage: companies.length === take, // fallback
  }
  console.log("total", meta.itemCount, "pageCount", meta.pageCount, "companies", companies.length)

  // Create company mutation
  const createMutation = useMutation({
    mutationFn: createCompany,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["companies"] })
      setIsAddModalOpen(false)
      setNewCompany({
        name: "",
        ntn: "",
        email: "",
        phone: "",
        address: "",
        industry: "Food & Beverage",
        status: "pending",
      })
      // Update user data with new companyId if present
      if (data?.data?.id) {
        setUser({ ...user, companyId: data.data.id });
      }
    },
  })

  // Edit company mutation (placeholder, needs edit modal)
  const editMutation = useMutation({
    mutationFn: editCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] })
    },
  })

  // Delete company mutation
  const deleteMutation = useMutation({
    mutationFn: deleteCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] })
    },
  })

  // Add company handler
  const handleAddCompany = () => {
    createMutation.mutate(newCompany)
  }

  // Delete company handler
  const handleDeleteCompany = (id: string) => {
    deleteMutation.mutate(id)
  }

  // Edit company handler
  const handleEditClick = (company: Company) => {
    setEditCompanyData(company)
    setIsEditModalOpen(true)
  }
  const handleEditSubmit = () => {
    if (editCompanyData) {
      editMutation.mutate(editCompanyData)
      setIsEditModalOpen(false)
    }
  }

  // Filtered companies (status only, search is server-side)
  let filteredCompanies = companies.filter((company: any) => {
    const matchesStatus = statusFilter === "all" || company.status === statusFilter;
    return matchesStatus;
  });

  // Restrict view based on role
  if (user?.role === "COMPANY_OWNER" && user?.companyId) {
    filteredCompanies = filteredCompanies.filter((company: any) => company.id === user.companyId);
  } else if (user?.role === "COMPANY_OWNER" && !user?.companyId) {
    filteredCompanies = [];
  }

  console.log(user, "user");
  console.log(filteredCompanies, "filteredCompanies");
  
  // POSPORT_ADMIN sees all, no filter needed

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="h-full overflow-auto  bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-6 h-6 text-[#1a72dd]" />
              <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
            </div>
          </div>

          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#1a72dd] hover:bg-[#1557b8] text-white">
                <Plus className="w-5 h-5 mr-2" />
                <div className="hidden sm:inline">
                  Add Company
                </div>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Company</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4 ">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newCompany.name}
                    onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                    className="col-span-3"
                    placeholder="Company name"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="ntn" className="text-right">
                    NTN
                  </Label>
                  <Input
                    id="ntn"
                    value={newCompany.ntn}
                    onChange={(e) => setNewCompany({ ...newCompany, ntn: e.target.value })}
                    className="col-span-3"
                    placeholder="National Tax Number"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={newCompany.email}
                    onChange={(e) => setNewCompany({ ...newCompany, email: e.target.value })}
                    className="col-span-3"
                    placeholder="company@example.com"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    value={newCompany.phone}
                    onChange={(e) => setNewCompany({ ...newCompany, phone: e.target.value })}
                    className="col-span-3"
                    placeholder="+1234567890"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="industry" className="text-right">
                    Industry
                  </Label>
                  <Select
                    value={newCompany.industry}
                    onValueChange={(value) => setNewCompany({ ...newCompany, industry: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Retail">Retail</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="address" className="text-right">
                    Address
                  </Label>
                  <Textarea
                    id="address"
                    value={newCompany.address}
                    onChange={(e) => setNewCompany({ ...newCompany, address: e.target.value })}
                    className="col-span-3"
                    placeholder="Company address"
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddCompany} className="bg-[#1a72dd] hover:bg-[#1557b8]">
                  Add Company
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Filters */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>


      {/* Companies Grid */}
      <div className={error ? "p-4 h-full overflow-hidden " : "p-4 h-full  "}>
        {error && (
          <div className="text-center py-12 h-full flex flex-col items-center justify-center">
            <>
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 mb-5 lg:grid-cols-3 gap-6 ">
          {isLoading ? (
            [...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                      <div>
                        <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
                        <div className="h-3 w-20 bg-gray-100 rounded" />
                      </div>
                    </div>
                    <div className="h-8 w-8 bg-gray-100 rounded-full" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-6 w-24 bg-gray-100 rounded" />
                    <div className="h-3 w-16 bg-gray-100 rounded" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-28 bg-gray-100 rounded" />
                    <div className="h-3 w-36 bg-gray-100 rounded" />
                    <div className="h-3 w-24 bg-gray-100 rounded" />
                    <div className="h-3 w-40 bg-gray-100 rounded" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            filteredCompanies.map((company: any) => (
              <Card
                key={company.id}
                className="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                onClick={() => {
                  if (user?.role === "POSPORT_ADMIN") {
                    router.push(`/companies/${company.id}/locations`);
                  } else if (onCompanySelect) {
                    onCompanySelect(company.id);
                  }
                }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#1a72dd]/10 rounded-lg flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-[#1a72dd]" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-gray-900">{company.name}</CardTitle>
                        <p className="text-sm text-gray-500">{company.industry}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditClick(company)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteCompany(company.id)}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge className={`${getStatusColor(company.status)} border`}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(company.status)}
                        <span className="capitalize">{company.status}</span>
                      </div>
                    </Badge>
                    <span className="text-xs text-gray-500">{new Date(company.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Hash className="w-4 h-4" />
                      <span>NTN: {company.ntn}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{company.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{company.phone}</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{company.address}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        {!isLoading && filteredCompanies.length > 0 && (
            <div className="flex items-center mb-6  justify-between  ">
              <div className="text-sm text-gray-600">
                Showing {filteredCompanies.length} of {meta.itemCount} companies
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setPage(page - 1)} disabled={!meta.hasPreviousPage}>
                  Previous
                </Button>
                <Button variant="outline" onClick={() => setPage(page + 1)} disabled={!meta.hasNextPage}>
                  Next
                </Button>
              </div>
            </div>
        )}

      </div>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
          </DialogHeader>
          {editCompanyData && (
            <div className="grid gap-4 py-4 ">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">Name</Label>
                <Input
                  id="edit-name"
                  value={editCompanyData.name}
                  onChange={e => setEditCompanyData({ ...editCompanyData, name: e.target.value })}
                  className="col-span-3"
                  placeholder="Company name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-ntn" className="text-right">NTN</Label>
                <Input
                  id="edit-ntn"
                  value={editCompanyData.ntn}
                  onChange={e => setEditCompanyData({ ...editCompanyData, ntn: e.target.value })}
                  className="col-span-3"
                  placeholder="National Tax Number"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editCompanyData.email}
                  onChange={e => setEditCompanyData({ ...editCompanyData, email: e.target.value })}
                  className="col-span-3"
                  placeholder="company@example.com"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-phone" className="text-right">Phone</Label>
                <Input
                  id="edit-phone"
                  value={editCompanyData.phone}
                  onChange={e => setEditCompanyData({ ...editCompanyData, phone: e.target.value })}
                  className="col-span-3"
                  placeholder="+1234567890"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-industry" className="text-right">Industry</Label>
                <Select
                  value={editCompanyData.industry}
                  onValueChange={value => setEditCompanyData({ ...editCompanyData, industry: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Retail">Retail</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-address" className="text-right">Address</Label>
                <Textarea
                  id="edit-address"
                  value={editCompanyData.address}
                  onChange={e => setEditCompanyData({ ...editCompanyData, address: e.target.value })}
                  className="col-span-3"
                  placeholder="Company address"
                  rows={3}
                />
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSubmit} className="bg-[#1a72dd] hover:bg-[#1557b8]">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

















    </div>
  )
}
