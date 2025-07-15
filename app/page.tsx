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
const ProductListPage = dynamic(() => import("../pages/product-list-page"), {
  loading: () => <PageSkeleton />,
})
const CustomerPage = dynamic(() => import("../pages/customer-page"), {
  loading: () => <PageSkeleton />,
})

function PageSkeleton() {
  return (
    <div className="p-4 sm:p-6 animate-pulse">
      <div className="h-6 sm:h-8 bg-gray-200 rounded-lg w-1/3 mb-4 sm:mb-6"></div>
      <div className="space-y-3 sm:space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 sm:h-20 bg-gray-200 rounded-xl"></div>
        ))}
      </div>
    </div>
  )
}

export default function App() {
  const [currentPage, setCurrentPage] = useState("cashier")
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const handlePageChange = useCallback((page: string) => {
    setCurrentPage(page)
  }, [])

  const handleMobileToggle = useCallback(() => {
    setIsMobileSidebarOpen((prev) => !prev)
  }, [])

  const handleSidebarToggle = useCallback((collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed)
  }, [])

  const renderPage = () => {
    switch (currentPage) {
      case "cashier":
        return <CashierPage onMobileToggle={handleMobileToggle} onSidebarToggle={handleSidebarToggle} />
      case "history":
        return <HistoryPage onMobileToggle={handleMobileToggle} />
      case "report":
        return <ReportPage onMobileToggle={handleMobileToggle} />
      // case "manage-store":
      //   return <ManageStorePage onMobileToggle={handleMobileToggle} />
      case "account":
        return <AccountPage onMobileToggle={handleMobileToggle} />
      case "support":
        return <SupportPage onMobileToggle={handleMobileToggle} />
      case "product-list":
        return <ProductListPage onMobileToggle={handleMobileToggle} />
      case "customer":
        return <CustomerPage onMobileToggle={handleMobileToggle} />
      default:
        return <CashierPage onMobileToggle={handleMobileToggle} onSidebarToggle={handleSidebarToggle} />
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#f7f8fa] to-[#e8f4fd] overflow-hidden">
      <Navbar
        currentPage={currentPage}
        onPageChange={handlePageChange}
        isMobileOpen={isMobileSidebarOpen}
        onMobileToggle={handleMobileToggle}
        isCollapsed={isSidebarCollapsed}
      />

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 ease-in-out overflow-hidden ${
          isSidebarCollapsed ? "md:ml-0 lg:ml-0" : "md:ml-80 lg:ml-80"
        }`}
        role="main"
      >
        <Suspense fallback={<PageSkeleton />}>{renderPage()}</Suspense>
      </main>
    </div>
  )
}
