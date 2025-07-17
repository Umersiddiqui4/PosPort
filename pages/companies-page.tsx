"use client"
import { Suspense } from "react"
import Companies from "@/components/companies"

interface CompaniesPageProps {
  onMobileToggle?: () => void
}

function CompaniesSkeleton() {
  return (
    <div className="p-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded-lg w-1/2 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-48 bg-gray-200 rounded-xl" />
        ))}
      </div>
    </div>
  )
}

export default function CompaniesPage({ onMobileToggle }: CompaniesPageProps) {
  return (
    <Suspense fallback={<CompaniesSkeleton />}>
      {/* `onMobileToggle` keeps the behaviour consistent with other pages  */}
      <Companies onMobileToggle={onMobileToggle ?? (() => {})} />
    </Suspense>
  )
}
