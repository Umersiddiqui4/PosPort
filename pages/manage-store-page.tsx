import { Edit, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ManageStorePage() {
  const menuItems = [
    { id: 1, name: "Noodles", category: "Main Course", price: 25.0, status: "Active" },
    { id: 2, name: "Black Paper", category: "Main Course", price: 30.0, status: "Active" },
    { id: 3, name: "Fried Rice", category: "Main Course", price: 22.0, status: "Inactive" },
    { id: 4, name: "Chicken Curry", category: "Main Course", price: 35.0, status: "Active" },
  ]

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#2a3256]">Manage Store</h1>
        <Button className="bg-[#1a72dd] hover:bg-[#1a72dd]/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      <div className="space-y-4">
        {menuItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-[#2a3256]">{item.name}</h3>
                <p className="text-sm text-[#545454] mt-1">{item.category}</p>
                <p className="text-lg font-semibold text-[#1a72dd] mt-1">${item.price}</p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    item.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {item.status}
                </span>
                <Button variant="ghost" size="icon" className="text-[#545454] hover:text-[#1a72dd]">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-[#545454] hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
