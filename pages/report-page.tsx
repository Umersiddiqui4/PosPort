import { TrendingUp, DollarSign, ShoppingBag, Users } from "lucide-react"

export default function ReportPage() {
  const stats = [
    { label: "Today's Sales", value: "$1,234.56", icon: DollarSign, color: "text-green-600" },
    { label: "Orders", value: "45", icon: ShoppingBag, color: "text-blue-600" },
    { label: "Customers", value: "38", icon: Users, color: "text-purple-600" },
    { label: "Growth", value: "+12%", icon: TrendingUp, color: "text-orange-600" },
  ]

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#2a3256] mb-6">Reports & Analytics</h1>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <Icon className={`w-8 h-8 ${stat.color}`} />
                <div>
                  <div className="text-sm text-[#545454]">{stat.label}</div>
                  <div className="text-xl font-bold text-[#2a3256]">{stat.value}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#2a3256] mb-4">Sales Overview</h2>
        <div className="h-48 bg-[#f7f8fa] rounded-lg flex items-center justify-center">
          <p className="text-[#545454]">Chart visualization would go here</p>
        </div>
      </div>
    </div>
  )
}
