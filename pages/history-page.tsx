"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HistoryPageProps {
  onMobileToggle?: () => void
}

export default function HistoryPage({ onMobileToggle }: HistoryPageProps) {
  const transactions = [
    { id: 1, date: "2023-11-23", time: "14:30", amount: 89.0, items: 3, status: "Completed" },
    { id: 2, date: "2023-11-23", time: "13:15", amount: 45.5, items: 2, status: "Completed" },
    { id: 3, date: "2023-11-23", time: "12:00", amount: 67.25, items: 4, status: "Completed" },
    { id: 4, date: "2023-11-22", time: "18:45", amount: 123.75, items: 5, status: "Completed" },
  ]

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-[#f7f8fa] to-[#e8f4fd] dark:from-[#1a1a1a] dark:to-[#2a2a2a]">
      {/* Mobile Header */}
      <header className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md p-3 sm:p-4 border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onMobileToggle && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onMobileToggle}
                className="text-[#1a72dd] hover:bg-[#1a72dd]/10 rounded-xl transition-all duration-200"
                aria-label="Toggle menu"
              >
                <Menu className="w-5 h-5" />
              </Button>
            )}
          </div>
          <h1 className="text-lg font-bold text-[#1a72dd] flex-1 text-center">Transaction History</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-4 sm:p-6">
        <h1 className="text-2xl font-bold text-[#2a3256] dark:text-gray-200 mb-6 hidden md:block">Transaction History</h1>

        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium text-[#2a3256] dark:text-gray-200">Transaction #{transaction.id}</div>
                  <div className="text-sm text-[#545454] dark:text-gray-400 mt-1">
                    {transaction.date} at {transaction.time}
                  </div>
                  <div className="text-sm text-[#545454] dark:text-gray-400">{transaction.items} items</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-[#1a72dd] dark:text-blue-400">${transaction.amount}</div>
                  <div className="text-sm text-green-600 dark:text-green-400 mt-1">{transaction.status}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
