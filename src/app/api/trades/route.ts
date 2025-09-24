import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { trades } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userTrades = await db.query.trades.findMany({
    where: eq(trades.userId, session.user.id),
    orderBy: [desc(trades.createdAt)],
    limit: 50
  })

  return NextResponse.json(userTrades)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  
  const trade = await db.insert(trades).values({
    userId: session.user.id,
    ...body
  }).returning()

  return NextResponse.json(trade[0])
}
