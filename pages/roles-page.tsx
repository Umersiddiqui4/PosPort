"use client"

import Roles from "@/components/roles"

export default function RolesPage() {
  return (
    <div className="h-full flex flex-col">
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 sm:p-6 mt-16 md:mt-16">
          <Roles />
        </div>
      </div>
    </div>
  )
}
