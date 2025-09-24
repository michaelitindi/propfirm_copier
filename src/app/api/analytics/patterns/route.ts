import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { TradeAnalyticsEngine } from '@/lib/analytics/trade-analytics'

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const analytics = new TradeAnalyticsEngine()
  const patterns = await analytics.identifyPatterns(session.user.id)

  return NextResponse.json(patterns)
}
