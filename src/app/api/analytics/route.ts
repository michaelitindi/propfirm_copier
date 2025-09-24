import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { TradeAnalyticsEngine } from '@/lib/analytics/trade-analytics'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const timeframe = searchParams.get('timeframe') || '30d'
  
  // Calculate date range
  const endDate = new Date()
  const startDate = new Date()
  
  switch (timeframe) {
    case '7d':
      startDate.setDate(endDate.getDate() - 7)
      break
    case '30d':
      startDate.setDate(endDate.getDate() - 30)
      break
    case '90d':
      startDate.setDate(endDate.getDate() - 90)
      break
    case '1y':
      startDate.setFullYear(endDate.getFullYear() - 1)
      break
  }

  const analytics = new TradeAnalyticsEngine()
  const data = await analytics.calculateAnalytics(session.user.id, startDate, endDate)

  return NextResponse.json(data)
}
