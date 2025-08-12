"use client"

import { Menu, ChevronRight, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ReportPageProps {
  onMobileToggle?: () => void
}

export default function ReportPage({ onMobileToggle }: ReportPageProps) {
  // Sample data for the chart (representing days of the week)
  const chartData = [
    { day: "M", value: 80 },
    { day: "T", value: 95 },
    { day: "W", value: 112 },
    { day: "T", value: 85 },
    { day: "F", value: 70 },
    { day: "S", value: 60 },
    { day: "S", value: 45 },
  ]

  const maxValue = Math.max(...chartData.map((d) => d.value))
  const chartHeight = 120

  // Generate SVG path for the line chart
  // const generatePath = () => {
  //   const width = 280
  //   const padding = 20
  //   const stepX = (width - padding * 2) / (chartData.length - 1)

  //   let path = ""
  //   chartData.forEach((point, index) => {
  //     const x = padding + index * stepX
  //     const y = chartHeight - (point.value / maxValue) * (chartHeight - 40) - 20

  //     if (index === 0) {
  //       path += `M ${x} ${y}`
  //     } else {
  //       path += ` L ${x} ${y}`
  //     }
  //   })

  //   return path
  // }

  // // Generate area path (same as line but closed)
  // const generateAreaPath = () => {
  //   const width = 280
  //   const padding = 20
  //   const stepX = (width - padding * 2) / (chartData.length - 1)

  //   let path = `M ${padding} ${chartHeight - 20}`
  //   chartData.forEach((point, index) => {
  //     const x = padding + index * stepX
  //     const y = chartHeight - (point.value / maxValue) * (chartHeight - 40) - 20
  //     path += ` L ${x} ${y}`
  //   })
  //   path += ` L ${padding + (chartData.length - 1) * stepX} ${chartHeight - 20} Z`

  //   return path
  // }

  const bestSellingProducts = [
    { name: "Chicken Chilli Dry", amount: 5000.0, percentage: 60, sales: 50, color: "bg-blue-500" },
    { name: "Wagyu Black Paper", amount: 3000.0, percentage: 30, sales: 30, color: "bg-red-500" },
    { name: "Egg Salad", amount: 2000.0, percentage: 20, sales: 20, color: "bg-cyan-500" },
  ]

  const paymentMethods = [
    { method: "Cash", amount: 5000.0, percentage: 50, sales: 50, color: "text-blue-600" },
    { method: "Debit Cards", amount: 3000.0, percentage: 30, sales: 30, color: "text-red-600" },
    { method: "Other", amount: 2000.0, percentage: 20, sales: 30, color: "text-cyan-600" },
  ]

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-[#f7f8fa] to-[#e8f4fd] dark:from-[#1a1a1a] dark:to-[#2a2a2a]">
      {/* Header */}
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
          <h1 className="text-lg font-bold text-[#1a72dd] dark:text-blue-400 flex-1 text-center">Reports & Analytics</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-4 sm:p-6 space-y-6">
        {/* Filter Section */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-[#545454]" />
              <span className="font-medium text-[#2a3256]">Filter set date & time</span>
            </div>
            <ChevronRight className="w-5 h-5 text-[#545454]" />
          </div>
        </div>

        {/* Summary Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-[#2a3256]">Summary</h2>
            <ChevronRight className="w-5 h-5 text-[#545454]" />
          </div>

          {/* Chart */}
          <div className="mb-6">
            <div className="text-sm font-medium text-[#1a72dd] mb-4">112 Transaction</div>
            <div className="relative w-full">
              <svg
                width="100%"
                height={chartHeight}
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="overflow-visible w-full h-24 sm:h-32 md:h-40 lg:h-48"
              >
                {/* Grid lines */}
                <defs>
                  <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1a72dd" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#1a72dd" stopOpacity="0.1" />
                  </linearGradient>
                </defs>

                {/* Area fill */}
                <path
                  d={`M 5 95 L 5 ${95 - (chartData[0].value / maxValue) * 70} ${chartData
                    .map((point, index) => {
                      const x = 5 + index * (90 / (chartData.length - 1))
                      const y = 95 - (point.value / maxValue) * 70
                      return `L ${x} ${y}`
                    })
                    .join(" ")} L 95 95 Z`}
                  fill="url(#areaGradient)"
                />

                {/* Line */}
                <path
                  d={`M 5 ${95 - (chartData[0].value / maxValue) * 70} ${chartData
                    .map((point, index) => {
                      const x = 5 + index * (90 / (chartData.length - 1))
                      const y = 95 - (point.value / maxValue) * 70
                      return `L ${x} ${y}`
                    })
                    .join(" ")}`}
                  stroke="#1a72dd"
                  strokeWidth="0.5"
                  fill="none"
                  vectorEffect="non-scaling-stroke"
                />

                {/* Data points */}
                {chartData.map((point, index) => {
                  const x = 5 + index * (90 / (chartData.length - 1))
                  const y = 95 - (point.value / maxValue) * 70

                  return (
                    <circle
                      key={index}
                      cx={x}
                      cy={y}
                      r="1"
                      fill="#1a72dd"
                      stroke="white"
                      strokeWidth="0.3"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                      shapeRendering="geometricPrecision"
                    />
                  )
                })}
              </svg>

              {/* X-axis labels */}
              <div className="flex justify-between mt-2 px-2 sm:px-4">
                {chartData.map((point, index) => (
                  <span key={index} className="text-xs text-[#545454] font-medium">
                    {point.day}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-[#545454] mb-1">Gross sales</div>
              <div className="text-xl font-bold text-[#2a3256]">12000.00</div>
            </div>
            <div>
              <div className="text-sm text-[#545454] mb-1">Net sales</div>
              <div className="text-xl font-bold text-[#2a3256]">10000.00</div>
            </div>
            <div>
              <div className="text-sm text-[#545454] mb-1">Discount</div>
              <div className="text-xl font-bold text-[#2a3256]">3000.00</div>
            </div>
            <div>
              <div className="text-sm text-[#545454] mb-1">Cancellation</div>
              <div className="text-xl font-bold text-[#2a3256]">0.00</div>
            </div>
          </div>
        </div>

        {/* Best-Selling Product Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-[#2a3256] dark:text-gray-200">Best-Selling Product</h2>
            <ChevronRight className="w-5 h-5 text-[#545454] dark:text-gray-400" />
          </div>

          <div className="space-y-4">
            {bestSellingProducts.map((product, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-[#2a3256] dark:text-gray-200">{product.name}</div>
                    <div className="text-sm text-[#545454] dark:text-gray-400">{product.sales} Sales</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-[#2a3256] dark:text-gray-200">{product.amount.toFixed(2)}</div>
                    <div className="text-sm font-medium text-[#545454] dark:text-gray-400">{product.percentage}%</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${product.color}`}
                    style={{ width: `${product.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Method Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-[#2a3256] dark:text-gray-200">Payment Method</h2>
            <ChevronRight className="w-5 h-5 text-[#545454] dark:text-gray-400" />
          </div>

          <div className="space-y-4">
            {paymentMethods.map((method, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-[#2a3256] dark:text-gray-200">
                    {method.method} - {method.amount.toFixed(2)}
                  </div>
                  <div className="text-sm text-[#545454] dark:text-gray-400">{method.sales} Sales</div>
                </div>
                <div className={`text-2xl font-bold ${method.color}`}>{method.percentage}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
