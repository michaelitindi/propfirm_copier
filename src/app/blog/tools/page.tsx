'use client'

import { useState } from 'react'
import { Metadata } from 'next'

export default function ToolsPage() {
  const [riskCalc, setRiskCalc] = useState({
    balance: 10000,
    riskPercent: 2,
    stopLossPips: 20,
    result: 0
  })

  const [lotCalc, setLotCalc] = useState({
    balance: 10000,
    riskAmount: 200,
    stopLossPips: 20,
    result: 0
  })

  const calculateRisk = () => {
    const riskAmount = (riskCalc.balance * riskCalc.riskPercent) / 100
    const pipValue = 10 // USD per pip for standard lot
    const lotSize = riskAmount / (riskCalc.stopLossPips * pipValue)
    setRiskCalc(prev => ({ ...prev, result: lotSize }))
  }

  const calculateLotSize = () => {
    const pipValue = 10
    const lotSize = lotCalc.riskAmount / (lotCalc.stopLossPips * pipValue)
    setLotCalc(prev => ({ ...prev, result: lotSize }))
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Free Trading Tools</h1>
        <p className="text-xl text-gray-600">
          Professional trading calculators and tools for propfirm traders
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Risk Calculator */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Risk Calculator</h2>
          <p className="text-gray-600 mb-6">Calculate position size based on risk percentage</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Balance ($)</label>
              <input
                type="number"
                value={riskCalc.balance}
                onChange={(e) => setRiskCalc(prev => ({ ...prev, balance: Number(e.target.value) }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Risk Percentage (%)</label>
              <input
                type="number"
                step="0.1"
                value={riskCalc.riskPercent}
                onChange={(e) => setRiskCalc(prev => ({ ...prev, riskPercent: Number(e.target.value) }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stop Loss (Pips)</label>
              <input
                type="number"
                value={riskCalc.stopLossPips}
                onChange={(e) => setRiskCalc(prev => ({ ...prev, stopLossPips: Number(e.target.value) }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            
            <button
              onClick={calculateRisk}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
              Calculate Position Size
            </button>
            
            {riskCalc.result > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <p className="text-green-800 font-medium">
                  Recommended Lot Size: {riskCalc.result.toFixed(2)} lots
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Lot Size Calculator */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Lot Size Calculator</h2>
          <p className="text-gray-600 mb-6">Calculate lot size based on risk amount</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Balance ($)</label>
              <input
                type="number"
                value={lotCalc.balance}
                onChange={(e) => setLotCalc(prev => ({ ...prev, balance: Number(e.target.value) }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Risk Amount ($)</label>
              <input
                type="number"
                value={lotCalc.riskAmount}
                onChange={(e) => setLotCalc(prev => ({ ...prev, riskAmount: Number(e.target.value) }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stop Loss (Pips)</label>
              <input
                type="number"
                value={lotCalc.stopLossPips}
                onChange={(e) => setLotCalc(prev => ({ ...prev, stopLossPips: Number(e.target.value) }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            
            <button
              onClick={calculateLotSize}
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
            >
              Calculate Lot Size
            </button>
            
            {lotCalc.result > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <p className="text-blue-800 font-medium">
                  Lot Size: {lotCalc.result.toFixed(2)} lots
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Additional Tools */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Pip Calculator</h3>
          <p className="text-gray-600 mb-4">Calculate pip values for different currency pairs</p>
          <button className="text-blue-600 hover:text-blue-800 font-medium">Coming Soon</button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Profit Calculator</h3>
          <p className="text-gray-600 mb-4">Calculate potential profits and losses</p>
          <button className="text-blue-600 hover:text-blue-800 font-medium">Coming Soon</button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Correlation Matrix</h3>
          <p className="text-gray-600 mb-4">Analyze currency pair correlations</p>
          <button className="text-blue-600 hover:text-blue-800 font-medium">Coming Soon</button>
        </div>
      </div>
    </div>
  )
}
