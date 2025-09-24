interface Account {
  id: string
  name: string
  propfirmName: string
  balance: number
  equity: number
  profit: number
  platform: string
  isMaster: boolean
}

interface AccountCardProps {
  account: Account
}

export function AccountCard({ account }: AccountCardProps) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-gray-900">{account.name}</h4>
        {account.isMaster && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Master
          </span>
        )}
      </div>
      
      <div className="text-sm text-gray-600 mb-2">
        {account.propfirmName} • {account.platform}
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-500">Balance:</span>
          <div className="font-medium">${account.balance.toLocaleString()}</div>
        </div>
        <div>
          <span className="text-gray-500">Equity:</span>
          <div className="font-medium">${account.equity.toLocaleString()}</div>
        </div>
      </div>
      
      <div className="mt-2 pt-2 border-t">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Monthly P&L:</span>
          <span className={`text-sm font-medium ${account.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${account.profit.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  )
}
