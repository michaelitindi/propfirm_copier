'use client'

import { useState, useEffect } from 'react'

interface RiskSettings {
  maxRiskPerTrade: number
  maxTradesPerDay: number
  maxDailyLoss: number
  isLocked: boolean
  emergencyContact: string
}

export function RiskSettings() {
  const [settings, setSettings] = useState<RiskSettings>({
    maxRiskPerTrade: 2,
    maxTradesPerDay: 5,
    maxDailyLoss: 5,
    isLocked: false,
    emergencyContact: ''
  })
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    const response = await fetch('/api/risk-settings')
    const data = await response.json()
    if (data) setSettings(data)
  }

  const saveSettings = async () => {
    await fetch('/api/risk-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    })
    setIsEditing(false)
  }

  const lockSettings = async () => {
    await fetch('/api/risk-settings/lock', {
      method: 'POST'
    })
    setSettings(prev => ({ ...prev, isLocked: true }))
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Risk Management</h3>
          {settings.isLocked && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Locked
            </span>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Max Risk Per Trade (%)
            </label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              max="10"
              value={settings.maxRiskPerTrade}
              onChange={(e) => setSettings(prev => ({ ...prev, maxRiskPerTrade: parseFloat(e.target.value) }))}
              disabled={settings.isLocked || !isEditing}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Max Trades Per Day
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={settings.maxTradesPerDay}
              onChange={(e) => setSettings(prev => ({ ...prev, maxTradesPerDay: parseInt(e.target.value) }))}
              disabled={settings.isLocked || !isEditing}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Max Daily Loss (%)
            </label>
            <input
              type="number"
              step="0.1"
              min="1"
              max="20"
              value={settings.maxDailyLoss}
              onChange={(e) => setSettings(prev => ({ ...prev, maxDailyLoss: parseFloat(e.target.value) }))}
              disabled={settings.isLocked || !isEditing}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Emergency Contact Email
            </label>
            <input
              type="email"
              value={settings.emergencyContact}
              onChange={(e) => setSettings(prev => ({ ...prev, emergencyContact: e.target.value }))}
              disabled={settings.isLocked || !isEditing}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm disabled:bg-gray-100"
              placeholder="support@example.com"
            />
          </div>
        </div>

        <div className="mt-6 flex space-x-3">
          {!settings.isLocked && (
            <>
              {isEditing ? (
                <>
                  <button
                    onClick={saveSettings}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded text-sm"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
                  >
                    Edit Settings
                  </button>
                  <button
                    onClick={lockSettings}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
                  >
                    Lock Settings
                  </button>
                </>
              )}
            </>
          )}
          
          {settings.isLocked && (
            <div className="text-sm text-gray-600">
              Settings are locked. Contact support at {settings.emergencyContact} to make changes.
            </div>
          )}
        </div>

        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            <strong>Warning:</strong> Once locked, these settings cannot be changed without contacting support. 
            This prevents emotional trading decisions.
          </p>
        </div>
      </div>
    </div>
  )
}
