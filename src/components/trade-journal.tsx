'use client'

import { useState, useEffect } from 'react'

interface Trade {
  id: string
  symbol: string
  type: 'BUY' | 'SELL'
  lotSize: number
  openPrice: number
  closePrice?: number
  profit?: number
  openTime: string
  closeTime?: string
  status: string
  notes?: string
  screenshot?: string
}

export function TradeJournal() {
  const [trades, setTrades] = useState<Trade[]>([])
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null)

  useEffect(() => {
    fetchTrades()
  }, [])

  const fetchTrades = async () => {
    const response = await fetch('/api/trades')
    const data = await response.json()
    setTrades(data)
  }

  const addNote = async (tradeId: string, note: string) => {
    await fetch(`/api/trades/${tradeId}/note`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note })
    })
    fetchTrades()
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Trade Journal</h3>
        
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {trades.map((trade) => (
            <div
              key={trade.id}
              className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => setSelectedTrade(trade)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{trade.symbol}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      trade.type === 'BUY' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {trade.type}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      trade.status === 'OPEN' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {trade.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Lot: {trade.lotSize} | Entry: {trade.openPrice}
                    {trade.closePrice && ` | Exit: ${trade.closePrice}`}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(trade.openTime).toLocaleString()}
                  </div>
                </div>
                
                {trade.profit !== undefined && (
                  <div className={`text-sm font-medium ${
                    trade.profit >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ${trade.profit.toFixed(2)}
                  </div>
                )}
              </div>
              
              {trade.notes && (
                <div className="mt-2 text-sm text-gray-700 bg-gray-50 p-2 rounded">
                  {trade.notes}
                </div>
              )}
            </div>
          ))}
        </div>

        {selectedTrade && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h4 className="text-lg font-medium mb-4">Trade Details</h4>
              
              <div className="space-y-2 mb-4">
                <div><strong>Symbol:</strong> {selectedTrade.symbol}</div>
                <div><strong>Type:</strong> {selectedTrade.type}</div>
                <div><strong>Lot Size:</strong> {selectedTrade.lotSize}</div>
                <div><strong>Entry Price:</strong> {selectedTrade.openPrice}</div>
                {selectedTrade.closePrice && (
                  <div><strong>Exit Price:</strong> {selectedTrade.closePrice}</div>
                )}
                {selectedTrade.profit !== undefined && (
                  <div><strong>Profit:</strong> ${selectedTrade.profit.toFixed(2)}</div>
                )}
              </div>

              {selectedTrade.screenshot && (
                <div className="mb-4">
                  <img 
                    src={selectedTrade.screenshot} 
                    alt="Trade screenshot" 
                    className="w-full rounded border"
                  />
                </div>
              )}

              <textarea
                placeholder="Add notes about this trade..."
                className="w-full border border-gray-300 rounded p-2 text-sm"
                rows={3}
                defaultValue={selectedTrade.notes || ''}
                onBlur={(e) => addNote(selectedTrade.id, e.target.value)}
              />

              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => setSelectedTrade(null)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
