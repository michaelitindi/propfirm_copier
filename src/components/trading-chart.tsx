'use client'

import { useEffect, useRef, useState } from 'react'
import { createChart, IChartApi, ISeriesApi } from 'lightweight-charts'

export function TradingChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const [selectedSymbol, setSelectedSymbol] = useState('EURUSD')

  useEffect(() => {
    if (!chartContainerRef.current) return

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
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

    // Fetch and set data
    fetchChartData(selectedSymbol).then(data => {
      candlestickSeries.setData(data)
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
      chart.remove()
    }
  }, [selectedSymbol])

  const fetchChartData = async (symbol: string) => {
    // Mock data - replace with real forex data API
    const data = []
    const basePrice = 1.1000
    let currentPrice = basePrice

    for (let i = 0; i < 100; i++) {
      const time = Math.floor(Date.now() / 1000) - (100 - i) * 3600
      const change = (Math.random() - 0.5) * 0.002
      currentPrice += change

      data.push({
        time,
        open: currentPrice,
        high: currentPrice + Math.random() * 0.001,
        low: currentPrice - Math.random() * 0.001,
        close: currentPrice + (Math.random() - 0.5) * 0.0005,
      })
    }

    return data
  }

  const symbols = ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD', 'XAUUSD']

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Live Chart</h3>
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
        
        <div ref={chartContainerRef} className="w-full" />
        
        <div className="mt-4 flex space-x-2">
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm">
            BUY
          </button>
          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm">
            SELL
          </button>
          <input
            type="number"
            placeholder="Risk %"
            step="0.1"
            min="0.1"
            max="5"
            className="border border-gray-300 rounded px-3 py-2 text-sm w-20"
          />
          <input
            type="number"
            placeholder="Stop Loss"
            step="0.0001"
            className="border border-gray-300 rounded px-3 py-2 text-sm w-24"
          />
          <input
            type="number"
            placeholder="Take Profit"
            step="0.0001"
            className="border border-gray-300 rounded px-3 py-2 text-sm w-24"
          />
        </div>
      </div>
    </div>
  )
}
