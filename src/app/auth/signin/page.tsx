'use client'

import { signIn, getSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SignIn() {
  const router = useRouter()

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        router.push('/')
      }
    })
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to PropFirm Copier
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Professional copy trading platform for forex propfirm accounts
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          <button
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign in with Google
          </button>
        </div>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Features</span>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 gap-3">
            <div className="text-sm text-gray-600">
              ✓ Copy trading across multiple propfirm accounts
            </div>
            <div className="text-sm text-gray-600">
              ✓ Advanced risk management tools
            </div>
            <div className="text-sm text-gray-600">
              ✓ Comprehensive trade journaling
            </div>
            <div className="text-sm text-gray-600">
              ✓ Real-time charts and analytics
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
