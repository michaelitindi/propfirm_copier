'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { AccountCard } from './account-card'
import { TradingChart } from './trading-chart'
import { TradeJournal } from './trade-journal'
import { RiskSettings } from './risk-settings'

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

export function Dashboard() {
  const { data: session } = useSession()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [totalBalance, setTotalBalance] = useState(0)
  const [totalProfit, setTotalProfit] = useState(0)

  useEffect(() => {
    fetchAccounts()
  }, [])

  const fetchAccounts = async () => {
    const response = await fetch('/api/accounts')
    const data = await response.json()
    setAccounts(data)
    
    const balance = data.reduce((sum: number, acc: Account) => sum + acc.balance, 0)
    const profit = data.reduce((sum: number, acc: Account) => sum + acc.profit, 0)
    
    setTotalBalance(balance)
    setTotalProfit(profit)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-semibold text-gray-900">PropFirm Copier</h1>
              <div className="hidden md:flex space-x-8">
                <a href="/dashboard" className="text-gray-900 font-medium">Dashboard</a>
                <a href="/blog" className="text-gray-700 hover:text-gray-900">Blog</a>
                <a href="/blog/tools" className="text-gray-700 hover:text-gray-900">Tools</a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {session?.user?.name}</span>
              <button
                onClick={() => signOut()}
                className="text-sm text-gray-700 hover:text-gray-900"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">{accounts.length}</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Accounts</dt>
                    <dd className="text-lg font-medium text-gray-900">{accounts.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">$</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Balance</dt>
                    <dd className="text-lg font-medium text-gray-900">${totalBalance.toLocaleString()}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 ${totalProfit >= 0 ? 'bg-green-500' : 'bg-red-500'} rounded-full flex items-center justify-center`}>
                    <span className="text-white text-sm">%</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Monthly P&L</dt>
                    <dd className={`text-lg font-medium ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${totalProfit.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Accounts */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Your Accounts</h3>
                <div className="space-y-4">
                  {accounts.map((account) => (
                    <AccountCard key={account.id} account={account} />
                  ))}
                  <button className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                    <span className="text-sm text-gray-600">+ Add New Account</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Trading Chart */}
          <div className="lg:col-span-2">
            <TradingChart />
          </div>
        </div>

        {/* Trade Journal and Risk Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <TradeJournal />
          <RiskSettings />
        </div>
      </div>
    </div>
  )
}
