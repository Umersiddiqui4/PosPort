"use client"

import { useState, useCallback, Suspense } from "react"
import dynamic from "next/dynamic"
import Navbar from "../components/navbar"

// Dynamic imports for better performance
const CashierPage = dynamic(() => import("../pages/cashier-page"), {
  loading: () => <PageSkeleton />,
})
const HistoryPage = dynamic(() => import("../pages/history-page"), {
  loading: () => <PageSkeleton />,
})
const ReportPage = dynamic(() => import("../pages/report-page"), {
  loading: () => <PageSkeleton />,
})
const ManageStorePage = dynamic(() => import("../pages/manage-store-page"), {
  loading: () => <PageSkeleton />,
})
const AccountPage = dynamic(() => import("../pages/account-page"), {
  loading: () => <PageSkeleton />,
})
const SupportPage = dynamic(() => import("../pages/support-page"), {
  loading: () => <PageSkeleton />,
})

function PageSkeleton() {
  return (
    <div className="p-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded-lg w-1/3 mb-6"></div>
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-200 rounded-xl"></div>
        ))}
      </div>
    </div>
  )
}

export default function App() {
  const [currentPage, setCurrentPage] = useState("cashier")
  const [isNavbarOpen, setIsNavbarOpen] = useState(true)

  const handlePageChange = useCallback((page: string) => {
    setCurrentPage(page)
  }, [])

  const handleNavbarToggle = useCallback((isOpen: boolean) => {
    setIsNavbarOpen(isOpen)
  }, [])

  const renderPage = () => {
    switch (currentPage) {
      case "cashier":
        return <CashierPage />
      case "history":
        return <HistoryPage />
      case "report":
        return <ReportPage />
      case "manage-store":
        return <ManageStorePage />
      case "account":
        return <AccountPage />
      case "support":
        return <SupportPage />
      default:
        return <CashierPage />
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#f7f8fa] to-[#e8f4fd] overflow-hidden">
      <Navbar currentPage={currentPage} onPageChange={handlePageChange} onToggle={handleNavbarToggle} />

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isNavbarOpen ? "lg:ml-80" : "ml-0"
        } pt-16 overflow-hidden`}
        role="main"
      >
        <Suspense fallback={<PageSkeleton />}>{renderPage()}</Suspense>
      </main>
    </div>
  )
}
