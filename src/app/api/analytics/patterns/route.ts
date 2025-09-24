import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Mock patterns data - replace with actual analytics when DB is set up
  const patterns = [
    {
      pattern: 'Morning Trading (8-10 AM)',
      frequency: 15,
      winRate: 73.3,
      avgProfit: 45.20,
      description: 'Performance during morning hours shows strong results'
    },
    {
      pattern: 'EURUSD Trading',
      frequency: 12,
      winRate: 66.7,
      avgProfit: 38.50,
      description: 'EURUSD pair shows consistent profitability'
    }
  ]

  return NextResponse.json(patterns)
}
