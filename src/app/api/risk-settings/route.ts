import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { riskSettings } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const settings = await db.query.riskSettings.findFirst({
    where: eq(riskSettings.userId, session.user.id)
  })

  return NextResponse.json(settings)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  
  const existing = await db.query.riskSettings.findFirst({
    where: eq(riskSettings.userId, session.user.id)
  })

  if (existing) {
    if (existing.isLocked) {
      return NextResponse.json({ error: 'Settings are locked' }, { status: 403 })
    }
    
    const updated = await db.update(riskSettings)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(riskSettings.userId, session.user.id))
      .returning()
    
    return NextResponse.json(updated[0])
  } else {
    const created = await db.insert(riskSettings).values({
      userId: session.user.id,
      ...body
    }).returning()
    
    return NextResponse.json(created[0])
  }
}
