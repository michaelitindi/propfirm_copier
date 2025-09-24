import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { propfirmAccounts } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const accounts = await db.query.propfirmAccounts.findMany({
    where: eq(propfirmAccounts.userId, session.user.id)
  })

  return NextResponse.json(accounts)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  
  const account = await db.insert(propfirmAccounts).values({
    userId: session.user.id,
    ...body
  }).returning()

  return NextResponse.json(account[0])
}
