import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Mock data for now - replace with actual database query when DB is set up
  const accounts = [
    {
      id: '1',
      name: 'FTMO Account 1',
      propfirmName: 'FTMO',
      balance: 100000,
      equity: 102500,
      profit: 2500,
      platform: 'MetaTrader 5',
      isMaster: true
    }
  ]

  return NextResponse.json(accounts)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  
  // Mock response - replace with actual database insert when DB is set up
  const account = {
    id: Date.now().toString(),
    userId: session.user.email,
    ...body
  }

  return NextResponse.json(account)
}
