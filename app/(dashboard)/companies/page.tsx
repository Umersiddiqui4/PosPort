"use client"

import Companies from "@/components/companies"


export default function CompaniesPage() {
  return (
    <div className="h-screen bg-gray-50">
      <Companies onMobileToggle={() => {}} />
    </div>
  )
}
