"use client"

import { useState } from "react"
import { User, Mail, Phone, MapPin, Shield, Settings, LogOut, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { changePassword } from "@/lib/Api/auth/changePassword"
import { useToast } from "@/hooks/use-toast"
import { useLogout } from "@/hooks/useLogout"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { ThemeToggle } from "@/components/theme-toggle"

export default function AccountPage() {
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    password: "",
    newPassword: "",
    confirmPassword: ""
  })
  const { toast } = useToast()
  const handleLogout = useLogout()
  const { user, isLoggedIn } = useCurrentUser()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePasswordChange = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive"
      })
      return
    }

    if (formData.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "New password must be at least 6 characters long",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    try {
      await changePassword({
        password: formData.newPassword,
        confirmPassword: formData.confirmPassword
      })
      
      toast({
        title: "Success",
        description: "Password changed successfully"
      })
      
      setIsPasswordDialogOpen(false)
      setFormData({
        password: "",
        newPassword: "",
        confirmPassword: ""
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to change password",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 sm:p-6 mt-16 md:mt-16">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold text-[#1a72dd] dark:text-blue-400">Account Settings</h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg">Manage your profile and preferences</p>
            </div>

            {/* Profile Section */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-[#1a72dd] dark:text-blue-400" />
                    Profile Information
                  </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>
                      {user?.firstName ? `${user.firstName[0]}${user.lastName?.[0] || ''}` : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {user?.firstName && user?.lastName 
                        ? `${user.firstName} ${user.lastName}` 
                        : user?.email || 'User'
                      }
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">{user?.email || 'No email'}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user?.role || 'User'}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                    <input 
                      type="text" 
                      defaultValue={user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : ''}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-[#1a72dd] dark:focus:border-blue-400 focus:ring-1 focus:ring-[#1a72dd] dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                    <input 
                      type="email" 
                      defaultValue={user?.email || ''}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-[#1a72dd] dark:focus:border-blue-400 focus:ring-1 focus:ring-[#1a72dd] dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                    <input 
                      type="tel" 
                      defaultValue={user?.phone || ''}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-[#1a72dd] dark:focus:border-blue-400 focus:ring-1 focus:ring-[#1a72dd] dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                    <input 
                      type="text" 
                      defaultValue={user?.role || ''}
                      disabled
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 dark:text-gray-300"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Section */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#1a72dd] dark:text-blue-400" />
                    Security Settings
                  </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-[#1a72dd] hover:bg-[#1557b8]">
                      Change Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <div className="relative">
                          <Input
                            id="current-password"
                            type={showCurrentPassword ? "text" : "password"}
                            placeholder="Enter current password"
                            value={formData.password}
                            onChange={(e) => handleInputChange("password", e.target.value)}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <div className="relative">
                          <Input
                            id="new-password"
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Enter new password"
                            value={formData.newPassword}
                            onChange={(e) => handleInputChange("newPassword", e.target.value)}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <div className="relative">
                          <Input
                            id="confirm-password"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm new password"
                            value={formData.confirmPassword}
                            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsPasswordDialogOpen(false)}
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handlePasswordChange}
                        disabled={isLoading}
                        className="bg-[#1a72dd] hover:bg-[#1557b8] dark:bg-blue-600 dark:hover:bg-blue-700"
                      >
                        {isLoading ? "Changing..." : "Change Password"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" className="w-full">
                  Enable Two-Factor Authentication
                </Button>
              </CardContent>
            </Card>

            {/* Preferences Section */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-[#1a72dd] dark:text-blue-400" />
                    Preferences
                  </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Email Notifications</span>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>
                <div className="flex items-center justify-between">
                  <span>SMS Notifications</span>
                  <input type="checkbox" className="w-4 h-4" />
                </div>
                <div className="flex items-center justify-between">
                  <span>Dark Mode</span>
                  <ThemeToggle />
                </div>
              </CardContent>
            </Card>

            {/* Logout Section */}
            <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <LogOut className="w-5 h-5" />
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20"
                  onClick={handleLogout}
                >
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
