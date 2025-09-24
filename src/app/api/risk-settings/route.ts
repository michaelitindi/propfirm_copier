import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Mock risk settings - replace with actual DB query when set up
  const settings = {
    maxRiskPerTrade: 2,
    maxTradesPerDay: 5,
    maxDailyLoss: 5,
    isLocked: false,
    emergencyContact: 'support@propfirmcopier.com'
  }

  return NextResponse.json(settings)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  
  // Mock response - replace with actual DB update when set up
  return NextResponse.json({ success: true, settings: body })
}
