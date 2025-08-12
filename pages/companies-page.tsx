"use client"
import { Suspense } from "react"
import Companies from "@/components/companies";
import Locations from "@/components/location";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import "/styles/globals.css"

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

export default function CompaniesPage() {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

  return selectedCompany ? (
    <div className="h-full w-full bg-gray-50 dark:bg-gray-900">
      <div className="flex items-center gap-4 p-4 border-b bg-white/80 dark:bg-gray-800/80 sticky top-0 z-10 mt-16 md:mt-16">
        <Button variant="outline" onClick={() => setSelectedCompany(null)} className="dark:border-gray-600 dark:text-gray-300 dark:hover:text-gray-100">
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span className="hidden md:inline">Back to Companies</span>
        </Button>
        <h1 className="text-xl font-bold text-[#1a72dd] dark:text-blue-400">Company Locations</h1>
      </div>
      <Locations companyId={selectedCompany} />
    </div>
  ) : (
    <div className="mt-16 md:mt-16">
      <Companies onCompanySelect={setSelectedCompany} />
    </div>
  );
}
