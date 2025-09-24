import { NextRequest, NextResponse } from 'next/server'
import { PropFirmValidator } from '@/lib/validation/propfirm-validator'

export async function POST(request: NextRequest) {
  const { propfirmName, platform } = await request.json()
  
  if (!propfirmName || !platform) {
    return NextResponse.json({ 
      error: 'PropFirm name and platform are required' 
    }, { status: 400 })
  }

  const validator = new PropFirmValidator()
  const result = await validator.validatePropFirm(propfirmName, platform)

  return NextResponse.json(result)
}
