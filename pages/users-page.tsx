"use client"

import Users from "@/components/users"

export default function UsersPage() {
  return (
    <div className="h-full flex flex-col">
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 sm:p-6 mt-16 md:mt-16">
          <Users />
        </div>
      </div>
    </div>
  )
}
