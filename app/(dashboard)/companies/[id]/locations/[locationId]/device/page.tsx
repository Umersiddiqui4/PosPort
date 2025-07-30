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
  Wifi,
  WifiOff,
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
import { useDevices } from "@/hooks/useDevices"

export default function LocationDevicesPage() {
  const params = useParams()
  const companyId = params?.companyId as string
  const locationId = params?.locationId as string

  // Fetch devices from API
  const { data, isLoading, isError } = useDevices(locationId, 1, 10)
  const devices = data?.data || []
  console.log(data, "devices" );
  

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState<any>(null)
  const [formData, setFormData] = useState({
    deviceName: "",
    deviceType: "",
  })

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
        return "bg-purple-100 text-purple-800"
      case "tablet":
        return "bg-orange-100 text-orange-800"
      case "display":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleAddDevice = () => {
    // In real app, this would make an API call
    console.log("Adding device:", formData)
    setIsAddModalOpen(false)
    resetForm()
  }

  const handleEditDevice = () => {
    // In real app, this would make an API call
    console.log("Editing device:", selectedDevice?.id, formData)
    setIsEditModalOpen(false)
    setSelectedDevice(null)
    resetForm()
  }

  const openEditModal = (device: any) => {
    setSelectedDevice(device)
    setFormData({
      deviceName: device.device?.deviceName,
      deviceType: device.device?.deviceType,
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Location Devices</h2>
          <p className="text-gray-600">Manage hardware and devices connected to this location</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="bg-[#1a72dd] hover:bg-[#1557b8] text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Device
        </Button>
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
                  {devices.filter((d: any) => (d.device?.deviceType || d.deviceType || 'pos') === "pos").length}
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
          {devices.map((device: any) => {
            const DeviceIcon = getDeviceIcon(device.device?.deviceType || device.deviceType || 'pos')
            return (
              <Card key={device.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm border">
                        <DeviceIcon className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-gray-900">{device.device?.deviceName || device.deviceName || 'Unknown Device'}</CardTitle>
                        <p className="text-sm text-gray-600">{device.device?.deviceCode || 'No Code'}</p>
                      </div>
                    </div>
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
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove Device
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    {/* <Badge className={getStatusColor(device.status)}>{device.status}</Badge> */}
                    <Badge className={getTypeColor(device.device?.deviceType || device.deviceType || 'pos')}>
                      {(device.device?.deviceType || device.deviceType || 'pos').toUpperCase()}
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
                      <span className="text-gray-900">{new Date(device.device?.createdAt || device.createdAt).toLocaleDateString()}</span>
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
          <Button
            onClick={() => setIsAddModalOpen(true)}
            variant="outline"
            className="text-[#1a72dd] border-[#1a72dd] bg-transparent"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add First Device
          </Button>
        </div>
      )}

      {/* Add Device Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Device to Location</DialogTitle>
            <DialogDescription>Register a new device for this location.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="device-name">Device Name *</Label>
              <Input
                id="device-name"
                value={formData.deviceName}
                onChange={(e) => setFormData({ ...formData, deviceName: e.target.value })}
                placeholder="e.g., POS Terminal 1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="device-type">Device Type *</Label>
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
              <Label htmlFor="device-model">Model *</Label>
              <Input
                id="device-model"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="e.g., Square Terminal"
              />
            </div> */}
            {/* <div className="space-y-2">
              <Label htmlFor="device-serial">Serial Number</Label>
              <Input
                id="device-serial"
                value={formData.serialNumber}
                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                placeholder="e.g., SQ-001-2023"
              />
            </div> */}
            {/* <div className="space-y-2">
              <Label htmlFor="device-ip">IP Address</Label>
              <Input
                id="device-ip"
                value={formData.ipAddress}
                onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                placeholder="e.g., 192.168.1.101"
              />
            </div> */}
            {/* <div className="space-y-2">
              <Label htmlFor="device-location">Physical Location</Label>
              <Input
                id="device-location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Front Counter"
              />
            </div> */}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddDevice} className="bg-[#1a72dd] hover:bg-[#1557b8]">
              Add Device
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
