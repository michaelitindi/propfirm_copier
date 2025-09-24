'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

interface PropFirm {
  id: string
  name: string
  allowsCopyTrading: boolean
  platforms: string[]
  notes: string
}

export default function AdminPage() {
  const { data: session } = useSession()
  const [propfirms, setPropfirms] = useState<PropFirm[]>([])
  const [newPropfirm, setNewPropfirm] = useState({
    name: '',
    allowsCopyTrading: true,
    platforms: [] as string[],
    notes: ''
  })

  // Simple admin check - in production, implement proper role-based access
  if (!session?.user?.email?.includes('admin')) {
    redirect('/')
  }

  useEffect(() => {
    fetchPropfirms()
  }, [])

  const fetchPropfirms = async () => {
    const response = await fetch('/api/admin/propfirms')
    const data = await response.json()
    setPropfirms(data)
  }

  const addPropfirm = async () => {
    await fetch('/api/admin/propfirms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPropfirm)
    })
    
    setNewPropfirm({ name: '', allowsCopyTrading: true, platforms: [], notes: '' })
    fetchPropfirms()
  }

  const toggleCopyTrading = async (id: string, allowsCopyTrading: boolean) => {
    await fetch(`/api/admin/propfirms/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ allowsCopyTrading })
    })
    fetchPropfirms()
  }

  const platforms = ['MetaTrader 4', 'MetaTrader 5', 'cTrader', 'Match Trader', 'TradeLocker']

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Admin Panel</h1>
            </div>
            <div className="flex items-center">
              <a href="/" className="text-blue-600 hover:text-blue-800">← Back to Dashboard</a>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">PropFirm Whitelist Management</h2>
            
            {/* Add New PropFirm */}
            <div className="mb-8 p-4 border border-gray-200 rounded-lg">
              <h3 className="text-md font-medium text-gray-900 mb-4">Add New PropFirm</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PropFirm Name</label>
                  <input
                    type="text"
                    value={newPropfirm.name}
                    onChange={(e) => setNewPropfirm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="e.g., FTMO, 5%ers"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Copy Trading Allowed</label>
                  <select
                    value={newPropfirm.allowsCopyTrading.toString()}
                    onChange={(e) => setNewPropfirm(prev => ({ ...prev, allowsCopyTrading: e.target.value === 'true' }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Supported Platforms</label>
                  <div className="flex flex-wrap gap-2">
                    {platforms.map(platform => (
                      <label key={platform} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newPropfirm.platforms.includes(platform)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewPropfirm(prev => ({ ...prev, platforms: [...prev.platforms, platform] }))
                            } else {
                              setNewPropfirm(prev => ({ ...prev, platforms: prev.platforms.filter(p => p !== platform) }))
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm">{platform}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={newPropfirm.notes}
                    onChange={(e) => setNewPropfirm(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows={3}
                    placeholder="Additional notes about copy trading policies..."
                  />
                </div>
              </div>
              
              <button
                onClick={addPropfirm}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Add PropFirm
              </button>
            </div>

            {/* PropFirm List */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      PropFirm Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Copy Trading
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Platforms
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {propfirms.map((propfirm) => (
                    <tr key={propfirm.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {propfirm.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          propfirm.allowsCopyTrading 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {propfirm.allowsCopyTrading ? 'Allowed' : 'Restricted'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {propfirm.platforms.join(', ')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {propfirm.notes}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => toggleCopyTrading(propfirm.id, !propfirm.allowsCopyTrading)}
                          className={`${
                            propfirm.allowsCopyTrading 
                              ? 'text-red-600 hover:text-red-900' 
                              : 'text-green-600 hover:text-green-900'
                          }`}
                        >
                          {propfirm.allowsCopyTrading ? 'Restrict' : 'Allow'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
