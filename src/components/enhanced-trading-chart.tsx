'use client'

import { useEffect, useRef, useState } from 'react'
import { createChart, IChartApi, ISeriesApi } from 'lightweight-charts'
import { ForexDataProvider } from '@/lib/forex/data-provider'
import { ScreenshotCapture } from '@/lib/utils/screenshot'

interface Position {
  id: string
  symbol: string
  type: 'BUY' | 'SELL'
  lotSize: number
  entryPrice: number
  currentPrice: number
  pnl: number
  stopLoss?: number
  takeProfit?: number
}

export function EnhancedTradingChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const [selectedSymbol, setSelectedSymbol] = useState('EURUSD')
  const [currentPrice, setCurrentPrice] = useState(0)
  const [positions, setPositions] = useState<Position[]>([])
  const [tradeForm, setTradeForm] = useState({
    type: 'BUY' as 'BUY' | 'SELL',
    riskPercent: 2,
    stopLoss: '',
    takeProfit: ''
  })

  const forexProvider = new ForexDataProvider()

  useEffect(() => {
    if (!chartContainerRef.current) return

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 500,
      layout: {
        background: { color: '#ffffff' },
        textColor: '#333',
      },
      grid: {
        vertLines: { color: '#f0f0f0' },
        horzLines: { color: '#f0f0f0' },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: {
        mode: 1,
      },
    })

    chartRef.current = chart

    // Add candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    })

    // Load historical data
    forexProvider.getHistoricalData(selectedSymbol).then(data => {
      candlestickSeries.setData(data)
      if (data.length > 0) {
        setCurrentPrice(data[data.length - 1].close)
      }
    })

    // Subscribe to real-time updates
    const unsubscribe = forexProvider.subscribeToPrice(selectedSymbol, (price) => {
      setCurrentPrice(price.bid)
      // Update chart with new price
      candlestickSeries.update({
        time: Math.floor(Date.now() / 1000),
        open: price.bid,
        high: price.ask,
        low: price.bid,
        close: price.ask
      })
    })

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        })
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      unsubscribe()
      chart.remove()
    }
  }, [selectedSymbol])

  const placeTrade = async () => {
    try {
      const response = await fetch('/api/trades/place', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: selectedSymbol,
          type: tradeForm.type,
          riskPercent: tradeForm.riskPercent,
          stopLoss: tradeForm.stopLoss ? parseFloat(tradeForm.stopLoss) : undefined,
          takeProfit: tradeForm.takeProfit ? parseFloat(tradeForm.takeProfit) : undefined,
          entryPrice: currentPrice
        })
      })

      if (response.ok) {
        const trade = await response.json()
        
        // Add to positions
        const newPosition: Position = {
          id: trade.id,
          symbol: selectedSymbol,
          type: tradeForm.type,
          lotSize: trade.lotSize,
          entryPrice: currentPrice,
          currentPrice: currentPrice,
          pnl: 0,
          stopLoss: tradeForm.stopLoss ? parseFloat(tradeForm.stopLoss) : undefined,
          takeProfit: tradeForm.takeProfit ? parseFloat(tradeForm.takeProfit) : undefined
        }
        
        setPositions(prev => [...prev, newPosition])
        
        // Capture screenshot
        setTimeout(async () => {
          const screenshot = await ScreenshotCapture.captureChart()
          if (screenshot) {
            await fetch(`/api/trades/${trade.id}/screenshot`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ screenshot })
            })
          }
        }, 1000)
        
        // Reset form
        setTradeForm(prev => ({ ...prev, stopLoss: '', takeProfit: '' }))
      }
    } catch (error) {
      console.error('Error placing trade:', error)
    }
  }

  const closePosition = async (positionId: string) => {
    try {
      await fetch(`/api/trades/${positionId}/close`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ closePrice: currentPrice })
      })
      
      setPositions(prev => prev.filter(p => p.id !== positionId))
    } catch (error) {
      console.error('Error closing position:', error)
    }
  }

  const symbols = ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD', 'XAUUSD', 'GBPJPY', 'EURJPY']

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Live Trading Chart</h3>
            <select
              value={selectedSymbol}
              onChange={(e) => setSelectedSymbol(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              {symbols.map(symbol => (
                <option key={symbol} value={symbol}>{symbol}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Current Price:</span>
            <span className="text-lg font-semibold text-gray-900">
              {currentPrice.toFixed(5)}
            </span>
          </div>
        </div>
        
        <div id="trading-chart" ref={chartContainerRef} className="w-full mb-4" />
        
        {/* Trading Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trade Entry */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-md font-medium text-gray-900 mb-4">Place Trade</h4>
            
            <div className="space-y-4">
              <div className="flex space-x-2">
                <button
                  onClick={() => setTradeForm(prev => ({ ...prev, type: 'BUY' }))}
                  className={`flex-1 py-2 px-4 rounded text-sm font-medium ${
                    tradeForm.type === 'BUY'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  BUY
                </button>
                <button
                  onClick={() => setTradeForm(prev => ({ ...prev, type: 'SELL' }))}
                  className={`flex-1 py-2 px-4 rounded text-sm font-medium ${
                    tradeForm.type === 'SELL'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  SELL
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Risk %</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="5"
                  value={tradeForm.riskPercent}
                  onChange={(e) => setTradeForm(prev => ({ ...prev, riskPercent: parseFloat(e.target.value) }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stop Loss</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={tradeForm.stopLoss}
                    onChange={(e) => setTradeForm(prev => ({ ...prev, stopLoss: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Take Profit</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={tradeForm.takeProfit}
                    onChange={(e) => setTradeForm(prev => ({ ...prev, takeProfit: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    placeholder="Optional"
                  />
                </div>
              </div>
              
              <button
                onClick={placeTrade}
                className={`w-full py-2 px-4 rounded text-sm font-medium text-white ${
                  tradeForm.type === 'BUY' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {tradeForm.type} {selectedSymbol}
              </button>
            </div>
          </div>

          {/* Open Positions */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-md font-medium text-gray-900 mb-4">Open Positions</h4>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {positions.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No open positions</p>
              ) : (
                positions.map((position) => (
                  <div key={position.id} className="border border-gray-100 rounded p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{position.symbol}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          position.type === 'BUY' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {position.type}
                        </span>
                      </div>
                      <button
                        onClick={() => closePosition(position.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Close
                      </button>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <div>Lot Size: {position.lotSize}</div>
                      <div>Entry: {position.entryPrice.toFixed(5)}</div>
                      <div>Current: {position.currentPrice.toFixed(5)}</div>
                      <div className={`font-medium ${position.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        P&L: ${position.pnl.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
