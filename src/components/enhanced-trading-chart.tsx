'use client'

import { useEffect, useRef, useState } from 'react'
import { createChart, IChartApi } from 'lightweight-charts'

export function EnhancedTradingChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const [selectedSymbol, setSelectedSymbol] = useState('EURUSD')
  const [currentPrice, setCurrentPrice] = useState(1.0850)

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

    // Mock data for demo
    const mockData = [
      { time: '2024-01-01', open: 1.0800, high: 1.0850, low: 1.0780, close: 1.0820 },
      { time: '2024-01-02', open: 1.0820, high: 1.0870, low: 1.0810, close: 1.0850 },
      { time: '2024-01-03', open: 1.0850, high: 1.0880, low: 1.0830, close: 1.0860 },
    ]

    candlestickSeries.setData(mockData)

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

  const symbols = ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD', 'XAUUSD']

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
        
        <div id="trading-chart" ref={chartContainerRef} className="w-full" />
      </div>
    </div>
  )
}
