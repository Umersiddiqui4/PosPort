"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import {
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDevices, useAllDevices, useAssignDeviceToLocation, useUnassignDeviceFromLocation } from "@/hooks/useDevices"
import { toast } from "@/components/ui/use-toast"
import { useUserDataStore } from "@/lib/store"

// Define proper types for device data
interface DeviceData {
  id: string;
  deviceName: string;
  deviceType: string;
  deviceCode: string;
  createdAt: string;
  updatedAt: string;
}

interface LocationData {
  id: string;
  locationName: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone: string;
  email: string;
  qrCode: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

interface AssignedDevice {
  id: string;
  assignedAt: string;
  assignedById: string;
  unassignedAt: string | null;
  unassignedById: string | null;
  device: DeviceData;
  location: LocationData;
}

interface GetDevicesResponse {
  data: AssignedDevice[];
  meta: {
    page: number;
    take: number;
    itemCount: number;
    pageCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export default function LocationDevicesPage() {
  const params = useParams()
  const locationId = params?.locationId as string

  // Get user data to check permissions
  const user = useUserDataStore((state) => state.user)
  const isAdmin = user?.role === "POSPORT_ADMIN"

  // Fetch devices from API
  const { data, isLoading, isError } = useDevices(locationId, 1, 10)
  const devices = data?.data || []
  console.log(data, "devices" );
  
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState<AssignedDevice | null>(null)
  const [selectedDeviceId, setSelectedDeviceId] = useState("")
  const [formData, setFormData] = useState({
    deviceName: "",
    deviceType: "",
  })

  // Fetch all available devices for assignment - only when modal is open
  const { data: allDevicesData } = useAllDevices(1, 100, true, {
    enabled: isAssignModalOpen,
  })
  const allDevices = allDevicesData?.items || []
  console.log(allDevicesData, "allDevices");

  // Assign device mutation
  const assignDeviceMutation = useAssignDeviceToLocation()
  const unassignDeviceMutation = useUnassignDeviceFromLocation()

  // Filter out devices that are already assigned to this location
  const assignedDeviceIds = devices.map((device: AssignedDevice) => device.device?.id || device.id)
  const availableDevices = allDevices.filter((device: DeviceData) => !assignedDeviceIds.includes(device.id))

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "pos":
        return Monitor
      case "mobile":
        return Smartphone
      case "tablet":
        return Tablet
      case "display":
        return Laptop
      default:
        return Monitor
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-100 text-green-800"
      case "offline":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "pos":
        return "bg-blue-100 text-blue-800"
      case "mobile":
        return "bg-green-100 text-green-800"
      case "tablet":
        return "bg-purple-100 text-purple-800"
      case "display":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleAssignDevice = async () => {
    if (!selectedDeviceId) return

    try {
      await assignDeviceMutation.mutateAsync({
        deviceId: selectedDeviceId,
        locationId: locationId,
      })
      toast({
        title: "Success",
        description: "Device assigned to location successfully",
      })
      setIsAssignModalOpen(false)
      setSelectedDeviceId("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign device to location",
        variant: "destructive",
      })
    }
  }

  const handleUnassignDevice = async (deviceId: string) => {
    try {
      await unassignDeviceMutation.mutateAsync({ deviceId })
      toast({
        title: "Success",
        description: "Device unassigned from location successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to unassign device from location",
        variant: "destructive",
      })
    }
  }

  const handleEditDevice = () => {
    // In real app, this would make an API call
    console.log("Editing device:", selectedDevice?.id, formData)
    setIsEditModalOpen(false)
    setSelectedDevice(null)
    resetForm()
  }

  const openEditModal = (device: AssignedDevice) => {
    setSelectedDevice(device)
    setFormData({
      deviceName: device.device?.deviceName || "",
      deviceType: device.device?.deviceType || "",
    })
    setIsEditModalOpen(true)
  }

  const resetForm = () => {
    setFormData({
      deviceName: "",
      deviceType: "",
    })
  }

  // Remove all references to mockLocationDevices and duplicate onlineDevices/offlineDevices
  // (No mockLocationDevices, only use devices from API)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Devices</h1>
          <p className="text-gray-600">Manage devices connected to this location</p>
        </div>
        {isAdmin && (
          <Button
            onClick={() => setIsAssignModalOpen(true)}
            className="bg-[#1a72dd] hover:bg-[#1557b8]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Assign Device
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Monitor className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Devices</p>
                <p className="text-2xl font-bold text-gray-900">{devices.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Monitor className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">POS Terminals</p>
                <p className="text-2xl font-bold text-gray-900">
                  {devices.filter((d: AssignedDevice) => (d.device?.deviceType || 'pos') === "pos").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Devices Grid */}
      {isLoading ? (
        <div className="text-center py-12">Loading devices...</div>
      ) : isError ? (
        <div className="text-center py-12 text-red-600">Failed to load devices.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devices.map((device: AssignedDevice) => {
            const DeviceIcon = getDeviceIcon(device.device?.deviceType || 'pos')
            return (
              <Card key={device.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm border">
                        <DeviceIcon className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-gray-900">{device.device?.deviceName || 'Unknown Device'}</CardTitle>
                        <p className="text-sm text-gray-600">{device.device?.deviceCode || 'No Code'}</p>
                      </div>
                    </div>
                    {isAdmin && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditModal(device)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Device
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleUnassignDevice(device.device?.id || device.id)}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove Device
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    {/* <Badge className={getStatusColor(device.status)}>{device.status}</Badge> */}
                    <Badge className={getTypeColor(device.device?.deviceType || 'pos')}>
                      {(device.device?.deviceType || 'pos').toUpperCase()}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Assigned:</span>
                      <span className="text-gray-900">{new Date(device.assignedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium text-gray-900">{device.location?.locationName || 'Unknown Location'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Device Code:</span>
                      <span className="font-mono text-gray-900">{device.device?.deviceCode || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span className="text-gray-900">{new Date(device.device?.createdAt || '').toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Show empty state if no devices and not loading */}
      {!isLoading && devices.length === 0 && (
        <div className="text-center py-12">
          <Monitor className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No devices connected</h3>
          <p className="text-gray-600 mb-4">Add devices to this location to monitor their status.</p>
          {isAdmin && (
            <Button
              onClick={() => setIsAssignModalOpen(true)}
              variant="outline"
              className="text-[#1a72dd] border-[#1a72dd] bg-transparent"
            >
              <Plus className="w-4 h-4 mr-2" />
              Assign Device
            </Button>
          )}
        </div>
      )}

      {/* Assign Device Modal */}
      <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Assign Device to Location</DialogTitle>
            <DialogDescription>Select a device to assign to this location.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="device-select">Select Device *</Label>
              <Select value={selectedDeviceId} onValueChange={setSelectedDeviceId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a device to assign" />
                </SelectTrigger>
                <SelectContent>
                  {availableDevices.map((device: DeviceData) => (
                    <SelectItem key={device.id} value={device.id}>
                      {device.deviceName} - {device.deviceType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAssignDevice} 
              className="bg-[#1a72dd] hover:bg-[#1557b8]"
              disabled={!selectedDeviceId}
            >
              Assign Device
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Device Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Device</DialogTitle>
            <DialogDescription>Update device information and settings.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-device-name">Device Name *</Label>
              <Input
                id="edit-device-name"
                value={formData.deviceName}
                onChange={(e) => setFormData({ ...formData, deviceName: e.target.value })}
                placeholder="e.g., POS Terminal 1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-device-type">Device Type *</Label>
              <Select value={formData.deviceType} onValueChange={(value) => setFormData({ ...formData, deviceType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select device type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pos">POS Terminal</SelectItem>
                  <SelectItem value="mobile">Mobile Device</SelectItem>
                  <SelectItem value="tablet">Tablet</SelectItem>
                  <SelectItem value="display">Display Screen</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* <div className="space-y-2">
              <Label htmlFor="edit-device-model">Model *</Label>
              <Input
                id="edit-device-model"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="e.g., Square Terminal"
              />
            </div> */}
            {/* <div className="space-y-2">
              <Label htmlFor="edit-device-serial">Serial Number</Label>
              <Input
                id="edit-device-serial"
                value={formData.serialNumber}
                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                placeholder="e.g., SQ-001-2023"
              />
            </div> */}
            {/* <div className="space-y-2">
              <Label htmlFor="edit-device-ip">IP Address</Label>
              <Input
                id="edit-device-ip"
                value={formData.ipAddress}
                onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                placeholder="e.g., 192.168.1.101"
              />
            </div> */}
            {/* <div className="space-y-2">
              <Label htmlFor="edit-device-location">Physical Location</Label>
              <Input
                id="edit-device-location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Front Counter"
              />
            </div> */}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditDevice} className="bg-[#1a72dd] hover:bg-[#1557b8]">
              Update Device
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
