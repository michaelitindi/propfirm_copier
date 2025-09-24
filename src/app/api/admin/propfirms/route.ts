import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { propfirmWhitelist } from '@/lib/db/schema'

export async function GET() {
  const session = await getServerSession(authOptions)
  
  // Simple admin check - implement proper role-based access in production
  if (!session?.user?.email?.includes('admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const propfirms = await db.query.propfirmWhitelist.findMany({
    orderBy: (propfirms, { asc }) => [asc(propfirms.name)]
  })

  return NextResponse.json(propfirms)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email?.includes('admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  
  const propfirm = await db.insert(propfirmWhitelist).values({
    name: body.name,
    allowsCopyTrading: body.allowsCopyTrading,
    platforms: body.platforms,
    notes: body.notes
  }).returning()

  return NextResponse.json(propfirm[0])
}
