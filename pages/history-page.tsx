export default function HistoryPage() {
  const transactions = [
    { id: 1, date: "2023-11-23", time: "14:30", amount: 89.0, items: 3, status: "Completed" },
    { id: 2, date: "2023-11-23", time: "13:15", amount: 45.5, items: 2, status: "Completed" },
    { id: 3, date: "2023-11-23", time: "12:00", amount: 67.25, items: 4, status: "Completed" },
    { id: 4, date: "2023-11-22", time: "18:45", amount: 123.75, items: 5, status: "Completed" },
  ]

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#2a3256] mb-6">Transaction History</h1>

      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium text-[#2a3256]">Transaction #{transaction.id}</div>
                <div className="text-sm text-[#545454] mt-1">
                  {transaction.date} at {transaction.time}
                </div>
                <div className="text-sm text-[#545454]">{transaction.items} items</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-[#1a72dd]">${transaction.amount}</div>
                <div className="text-sm text-green-600 mt-1">{transaction.status}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
