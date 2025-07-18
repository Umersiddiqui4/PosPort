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
import { useQuery } from "@tanstack/react-query"
import { getCompanies } from "@/lib/Api/getCompanies"

interface Company {
  id: string
  createdAt: string
  updatedAt: string
  name: string
  ntn: string
  email: string
  phone: string
  address: string
  industry: string
  status: "accepted" | "pending" | "rejected"
}

interface CompaniesProps {
  onMobileToggle: () => void
}

const companiesData: Company[] = [
  {
    id: "5b2b5107-819c-4bce-813c-ca2f7ff064f0",
    createdAt: "2025-07-16T11:32:09.533Z",
    updatedAt: "2025-07-16T11:32:09.533Z",
    name: "Posport",
    ntn: "123564",
    email: "company@test.com",
    phone: "+00000000",
    address: "Earth",
    industry: "Food & Beverage",
    status: "accepted",
  },
  {
    id: "06f4a247-f174-4882-8749-e777751fc65e",
    createdAt: "2025-07-16T11:32:09.751Z",
    updatedAt: "2025-07-16T11:32:09.751Z",
    name: "Pizza Palace",
    ntn: "111111",
    email: "contact@pizzapalace.com",
    phone: "+1000000001",
    address: "123 Pizza St, Food City",
    industry: "Food & Beverage",
    status: "accepted",
  },
  {
    id: "84d13a9e-a1a8-4727-8905-405f6f0194dd",
    createdAt: "2025-07-16T11:32:09.773Z",
    updatedAt: "2025-07-16T11:32:09.773Z",
    name: "Burger Bistro",
    ntn: "222222",
    email: "info@burgerbistro.com",
    phone: "+1000000002",
    address: "456 Burger Ave, Food City",
    industry: "Food & Beverage",
    status: "accepted",
  },
  {
    id: "8a4e7529-7d6a-415c-b426-31b3e4025963",
    createdAt: "2025-07-16T11:32:09.773Z",
    updatedAt: "2025-07-16T11:32:09.773Z",
    name: "Sushi Central",
    ntn: "333333",
    email: "hello@sushicentral.com",
    phone: "+1000000003",
    address: "789 Sushi Rd, Food City",
    industry: "Food & Beverage",
    status: "accepted",
  },
  {
    id: "359abacf-5a9d-454c-8b5e-0f7bc8c09ef1",
    createdAt: "2025-07-16T11:32:09.773Z",
    updatedAt: "2025-07-16T11:32:09.773Z",
    name: "Taco Town",
    ntn: "444444",
    email: "support@tacotown.com",
    phone: "+1000000004",
    address: "321 Taco Blvd, Food City",
    industry: "Food & Beverage",
    status: "accepted",
  },
]

export default function Companies({ onMobileToggle }: CompaniesProps) {
  // const [companie, setCompanies] = useState<Company[]>(companiesData)
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
    const { data: companies, isLoading, error } = useQuery({
    queryKey: ['companies'],
    queryFn: getCompanies,
  });

  const filteredCompanies = companies
    ? companies.filter((company: any) => {
        const matchesSearch =
          company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company.ntn.includes(searchTerm)
        const matchesStatus = statusFilter === "all" || company.status === statusFilter
        return matchesSearch && matchesStatus
      })
    : []

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

  const handleAddCompany = () => {
    const company: Company = {
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...newCompany,
    }
    // setCompanies([company, ...companies])
    setNewCompany({
      name: "",
      ntn: "",
      email: "",
      phone: "",
      address: "",
      industry: "Food & Beverage",
      status: "pending",
    })
    setIsAddModalOpen(false)
  }

  const handleDeleteCompany = (id: string) => {
    // setCompanies(companies.filter((company:any) => company.id !== id))
  }


 
  return (
    <div className="h-screen overflow-hidden bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onMobileToggle} className="md:hidden">
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <div className="w-5 h-0.5 bg-gray-600 mb-1"></div>
                <div className="w-5 h-0.5 bg-gray-600 mb-1"></div>
                <div className="w-5 h-0.5 bg-gray-600"></div>
              </div>
            </Button>
            <div className="flex items-center gap-2">
              <Building2 className="w-6 h-6 text-[#1a72dd]" />
              <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
            </div>
          </div>

          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#1a72dd] hover:bg-[#1557b8] text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Company
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
      <div className="p-4 h-full overflow-auto ">
        <div className="grid grid-cols-1 md:grid-cols-2 mb-60 lg:grid-cols-3 gap-6 ">
          {error && (
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
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
            filteredCompanies.map((company:any) => (
              <Card key={company.id} className="hover:shadow-lg transition-shadow duration-200">
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
                        <DropdownMenuItem>
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

        
      </div>
    </div>
  )
}
