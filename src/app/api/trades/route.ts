import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Mock trades data - replace with actual DB query when set up
  const trades = [
    {
      id: '1',
      symbol: 'EURUSD',
      type: 'BUY',
      lotSize: '0.10',
      openPrice: '1.0850',
      closePrice: '1.0875',
      profit: '25.00',
      openTime: new Date().toISOString(),
      status: 'CLOSED'
    }
  ]

  return NextResponse.json(trades)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  
  // Mock response - replace with actual trade execution when set up
  const trade = {
    id: Date.now().toString(),
    userId: session.user.email,
    ...body,
    status: 'OPEN',
    openTime: new Date().toISOString()
  }

  return NextResponse.json(trade)
}
