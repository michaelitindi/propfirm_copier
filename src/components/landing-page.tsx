'use client'

import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function LandingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      router.push('/dashboard')
    }
  }, [session, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">PropFirm Copier</h1>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/blog" className="text-gray-700 hover:text-gray-900">Blog</a>
              <a href="/blog/tools" className="text-gray-700 hover:text-gray-900">Free Tools</a>
              <button
                onClick={() => signIn('google')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Professional Copy Trading
            <span className="block text-blue-600">for PropFirm Accounts</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Advanced copy trading platform with risk management, trade journaling, and real-time analytics. 
            Supports FTMO, 5%ers, and other major propfirms.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => signIn('google')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Start Free Trial
            </button>
            <a
              href="/blog/tools"
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Try Free Tools
            </a>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need for PropFirm Trading</h2>
            <p className="text-xl text-gray-600">Professional tools designed specifically for propfirm traders</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Lightning Fast Copy Trading</h3>
              <p className="text-gray-600">Execute trades across multiple propfirm accounts simultaneously with minimal latency</p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-xl">🛡️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Advanced Risk Management</h3>
              <p className="text-gray-600">Emotional trading controls with lockable settings to prevent revenge trading</p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 text-xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Analytics</h3>
              <p className="text-gray-600">Win rate tracking, pattern recognition, and comprehensive trade journaling</p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-yellow-600 text-xl">🔌</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Multi-Platform Support</h3>
              <p className="text-gray-600">MetaTrader 4/5, cTrader, Match Trader, and TradeLocker integration</p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 text-xl">✅</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">PropFirm Compliant</h3>
              <p className="text-gray-600">Built-in compliance checking for FTMO, 5%ers, and other major propfirms</p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-indigo-600 text-xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Modern Interface</h3>
              <p className="text-gray-600">Clean, intuitive design with real-time charts and trade management</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Scale Your PropFirm Trading?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of traders using our platform to manage multiple propfirm accounts efficiently
          </p>
          <button
            onClick={() => signIn('google')}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Get Started Free
          </button>
        </div>
      </div>
    </div>
  )
}
