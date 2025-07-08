"use client"

import { useState } from "react"
import { Calculator, History, FileText, Store, User, HelpCircle, RotateCcw, Plus, BarChart3, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Component() {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="flex h-screen bg-[#f7f8fa]">
      {/* Sidebar */}
      <div className={`bg-[#1a72dd] text-white transition-all duration-300 ${isOpen ? "w-80" : "w-0"} overflow-hidden`}>
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-4">Zaib Ka Dhaba</h1>

            {/* Branch Selector */}
            <div className="bg-white/20 rounded-lg p-3">
              <Select defaultValue="branch1">
                <SelectTrigger className="bg-transparent border-none text-white">
                  <SelectValue placeholder="Select Branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="branch1">Branch 1</SelectItem>
                  <SelectItem value="branch2">Branch 2</SelectItem>
                  <SelectItem value="branch3">Branch 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-2">
            <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 transition-colors">
              <Calculator className="w-6 h-6" />
              <span className="text-lg">Cashier</span>
            </div>

            <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 transition-colors">
              <History className="w-6 h-6" />
              <span className="text-lg">History Transaction</span>
            </div>

            <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 transition-colors">
              <FileText className="w-6 h-6" />
              <span className="text-lg">Report</span>
            </div>

            <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 transition-colors">
              <Store className="w-6 h-6" />
              <span className="text-lg">Manage Store</span>
            </div>

            <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 transition-colors">
              <User className="w-6 h-6" />
              <span className="text-lg">Account</span>
            </div>

            <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 transition-colors">
              <HelpCircle className="w-6 h-6" />
              <span className="text-lg">Support</span>
            </div>
          </nav>

          {/* Last Login Section */}
          <div className="mt-12 mb-8">
            <div className="flex items-start gap-3">
              <RotateCcw className="w-6 h-6 mt-1" />
              <div>
                <div className="text-lg font-medium mb-1">Last Login:</div>
                <div className="text-sm opacity-90">Saturday, 23 Nov 2023</div>
                <div className="text-sm opacity-90">(02:00 AM)</div>
              </div>
            </div>
          </div>

          {/* Upgrade Button */}
          <Button className="w-full bg-white text-[#1a72dd] hover:bg-white/90 font-semibold py-3 text-lg">
            UPGRADE TO PREMIUM
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative">
        {/* Mobile Status Bar */}
        <div className="bg-white px-6 py-2 flex justify-between items-center text-sm font-medium">
          <span>9:41</span>
          <div className="flex items-center gap-1">
            <div className="flex gap-1">
              <div className="w-1 h-3 bg-black rounded-full"></div>
              <div className="w-1 h-3 bg-black rounded-full"></div>
              <div className="w-1 h-3 bg-black rounded-full"></div>
              <div className="w-1 h-3 bg-[#545454] rounded-full"></div>
            </div>
            <div className="w-4 h-3 bg-black rounded-sm ml-2"></div>
            <div className="w-6 h-3 bg-[#545454] rounded-sm ml-1"></div>
          </div>
        </div>

        {/* Header with Menu Toggle */}
        <div className="bg-[#979797] p-4 flex justify-between items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="text-white hover:bg-white/20"
          >
            <Menu className="w-6 h-6" />
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <BarChart3 className="w-6 h-6" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <Menu className="w-6 h-6 rotate-90" />
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 space-y-6">
          {/* Food Item Cards */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex gap-4">
              <img
                src="/placeholder.svg?height=80&width=80"
                alt="Food item"
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="font-medium text-[#2a3256]">Noodles</h3>
                <p className="text-sm text-[#545454] mt-1">Spice level</p>
              </div>
              <Button size="icon" className="bg-[#1a72dd] hover:bg-[#1a72dd]/90 rounded-full">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex gap-4">
              <img
                src="/placeholder.svg?height=80&width=80"
                alt="Food item"
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="font-medium text-[#2a3256]">Black Paper</h3>
                <p className="text-sm text-[#545454] mt-1">Spice level</p>
              </div>
              <Button size="icon" className="bg-[#1a72dd] hover:bg-[#1a72dd]/90 rounded-full">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Total Section */}
          <div className="bg-[#1a72dd] text-white rounded-lg p-4">
            <div className="text-right">
              <div className="text-2xl font-bold">Total: $89.00</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
