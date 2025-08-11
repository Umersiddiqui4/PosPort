"use client"

import type React from "react"

import { useState } from "react"
import { Search, Plus, Edit, Trash2, Eye, Package, Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCatalogs } from "@/hooks/use-catalogs"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { useParams } from "next/navigation"
import { getCompanies, GetCompaniesResponse } from "@/lib/Api/getCompanies"
import { useQuery } from "@tanstack/react-query"
import { useLocations } from "@/hooks/useLocation"
import { useRouter } from "next/navigation"


interface Catalog {
  id: string
  name: string
  description?: string
  status?: "active" | "inactive" | "draft"
  itemCount?: number
  createdAt?: string
  updatedAt?: string
  locationId?: string
  companyId?: string
}

export default function Catalogs() {
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedCatalog, setSelectedCatalog] = useState<Catalog | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const router = useRouter();
  console.log('Selected Catalog:', selectedCatalog)
  const { catalogs, isLoading, createCatalog, updateCatalog, deleteCatalog } = useCatalogs()
  const { user } = useCurrentUser();
  const params = useParams()
  console.log('Catalogs from API:', catalogs)

  const filteredCatalogs = catalogs.filter(
    (catalog) =>
      (catalog.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (catalog.description?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (catalog.category?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  )

  const handleAddCatalog = (catalogData: Omit<Catalog, "id" | "createdAt" | "updatedAt">) => {
    createCatalog.mutate({
      ...catalogData,
      companyId: catalogData.companyId || "",
      locationId: catalogData.locationId || ""
    })
    setIsAddDialogOpen(false)
  }

  const handleEditCatalog = (catalogData: Partial<Catalog>) => {
    if (selectedCatalog) {
      updateCatalog.mutate({ id: selectedCatalog.id, ...catalogData })
      setIsEditDialogOpen(false)
      setSelectedCatalog(null)
    }
  }

  const handleDeleteCatalog = (catalogId: string) => {
    if (confirm("Are you sure you want to delete this catalog?")) {
      deleteCatalog.mutate(catalogId)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "inactive":
        return "bg-red-100 text-red-800 border-red-200"
      case "draft":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-8 bg-gray-200 rounded-lg w-1/3 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Catalogs</h1>
          <p className="text-gray-600 mt-1">Manage your product catalogs and collections</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#1a72dd] hover:bg-[#1557b8] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Catalog
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Catalog</DialogTitle>
              <DialogDescription>Create a new catalog to organize your products.</DialogDescription>
            </DialogHeader>
            <CatalogForm onSubmit={handleAddCatalog} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and View Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search catalogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
            <Grid className="w-4 h-4" />
          </Button>
          <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Catalogs Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCatalogs.map((catalog) => (
            <Card key={catalog.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-[#1a72dd]" />
                    <CardTitle className="text-lg">{catalog.name}</CardTitle>
                  </div>
                  <Badge className={getStatusColor(catalog.status || "draft")}>{catalog.status || "Draft"}</Badge>
                </div>
                <CardDescription className="text-sm text-gray-600 line-clamp-2">{catalog.description || "No description"}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Category:</span>
                    <span className="font-medium">{catalog.category || "General"}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Items:</span>
                    <span className="font-medium">{catalog.itemCount ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Updated:</span>
                    <span className="font-medium">{catalog.updatedAt ? new Date(catalog.updatedAt).toLocaleDateString() : "N/A"}</span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" onClick={() => router.push(`/catalogs/${catalog.id}/categories`)} className="flex-1 bg-transparent">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedCatalog(catalog as Catalog)
                        setIsEditDialogOpen(true)
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteCatalog(catalog.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCatalogs.map((catalog) => (
            <Card key={catalog.id} className="hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <Package className="w-8 h-8 text-[#1a72dd]" />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold">{catalog.name}</h3>
                        <Badge className={getStatusColor(catalog.status || "draft")}>{catalog.status || "Draft"}</Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{catalog.description || "No description"}</p>
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <span>Category: {catalog.category || "General"}</span>
                        <span>Items: {catalog.itemCount ?? 0}</span>
                        <span>Updated: {catalog.updatedAt ? new Date(catalog.updatedAt).toLocaleDateString() : "N/A"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedCatalog(catalog as Catalog)
                        setIsEditDialogOpen(true)
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteCatalog(catalog.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredCatalogs.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No catalogs found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? "Try adjusting your search terms" : "Get started by creating your first catalog"}
          </p>
          {!searchTerm && (
            <Button onClick={() => setIsAddDialogOpen(true)} className="bg-[#1a72dd] hover:bg-[#1557b8]">
              <Plus className="w-4 h-4 mr-2" />
              Add Catalog
            </Button>
          )}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Catalog</DialogTitle>
            <DialogDescription>Update the catalog information.</DialogDescription>
          </DialogHeader>
          {selectedCatalog && <CatalogForm initialData={selectedCatalog} onSubmit={handleEditCatalog} isEditing />}
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface CatalogFormProps {
  initialData?: Catalog
  onSubmit: (data: any) => void
  isEditing?: boolean
}

function CatalogForm({ initialData, onSubmit, isEditing = false }: CatalogFormProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const take = 100
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    locationId: initialData?.locationId || "",
    companyId: initialData?.companyId || "",
    itemCount: initialData?.itemCount || 0,
  })
  console.log('Form Data:', formData)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  // Only fetch companies if user.role === "POSPORT_ADMIN", else use user.companyId
  const { user } = useCurrentUser();
  const shouldFetchCompanies = user?.role === "POSPORT_ADMIN";
  const { data, isLoading, error, isFetching } = useQuery<GetCompaniesResponse, Error>({
    queryKey: shouldFetchCompanies
      ? ["companies", searchTerm, page, take]
      : ["company", user?.companyId],
    queryFn: async () => {
      if (shouldFetchCompanies) {
        return getCompanies(searchTerm, page, take);
      }
      // Fallback meta must match GetCompaniesResponse meta type
      return {
        data: user?.companyId
          ? [{ id: user.companyId, name: user.companyName || "My Company" }]
          : [],
        meta: {
          page: 1,
          take: 100,
          itemCount: user?.companyId ? 1 : 0,
          pageCount: 1,
          hasPreviousPage: false,
          hasNextPage: false,
        },
      };
    },
    enabled: !!user,
  })
  const companies = data?.data || []
  console.log('Companies from API:', companies)

  const { data: locationsData, isLoading:locationsLoading, error:locationsError } = useLocations(page, take, searchTerm)
  const locations = locationsData?.items || []
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Catalog Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter catalog name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter catalog description"
          rows={3}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Company</Label>
        <Select value={formData.companyId} onValueChange={(value) => setFormData({ ...formData, companyId: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select Company" />
          </SelectTrigger>
          <SelectContent>
            {companies.map((company) => (
              <SelectItem key={company.id} value={company.id}>
                {company.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Locations</Label>
        <Select
          value={formData.locationId}
          onValueChange={(value) => setFormData({ ...formData, locationId: value })}
          disabled={!formData.companyId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Location" />
          </SelectTrigger>
          <SelectContent>
            {locations
              // Only show locations if companyId is selected and location has companyId
              .filter((location: any) => !formData.companyId || location.companyId === formData.companyId)
              .map((location: any) => (
                <SelectItem key={location.id} value={location.id}>
                  {location.locationName}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>


     

      {isEditing && (
        <div className="space-y-2">
          <Label htmlFor="itemCount">Item Count</Label>
          <Input
            id="itemCount"
            type="number"
            value={formData.itemCount}
            onChange={(e) => setFormData({ ...formData, itemCount: Number.parseInt(e.target.value) || 0 })}
            placeholder="Number of items"
            min="0"
          />
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={() => {}}>
          Cancel
        </Button>
        <Button type="submit" className="bg-[#1a72dd] hover:bg-[#1557b8]">
          {isEditing ? "Update Catalog" : "Create Catalog"}
        </Button>
      </div>
    </form>
  )
}
