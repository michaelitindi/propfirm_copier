import { db } from '../db'
import { riskSettings, trades } from '../db/schema'
import { eq, and, gte } from 'drizzle-orm'

export class RiskManager {
  async validateTrade(userId: string, riskPercentage: number): Promise<{ allowed: boolean; reason?: string }> {
    const settings = await db.query.riskSettings.findFirst({
      where: eq(riskSettings.userId, userId)
    })

    if (!settings) {
      return { allowed: false, reason: 'No risk settings configured' }
    }

    // Check if risk settings are locked
    if (settings.isLocked) {
      return { allowed: false, reason: 'Risk settings are locked. Contact support for changes.' }
    }

    // Check max risk per trade
    if (riskPercentage > Number(settings.maxRiskPerTrade)) {
      return { 
        allowed: false, 
        reason: `Risk percentage (${riskPercentage}%) exceeds maximum allowed (${settings.maxRiskPerTrade}%)` 
      }
    }

    // Check daily trade limit
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const todayTrades = await db.query.trades.findMany({
      where: and(
        eq(trades.userId, userId),
        gte(trades.createdAt, today)
      )
    })

    if (todayTrades.length >= settings.maxTradesPerDay) {
      return { 
        allowed: false, 
        reason: `Daily trade limit reached (${settings.maxTradesPerDay} trades)` 
      }
    }

    // Check daily loss limit
    const todayLoss = todayTrades.reduce((total, trade) => {
      return total + (Number(trade.profit) || 0)
    }, 0)

    if (todayLoss < -Number(settings.maxDailyLoss)) {
      return { 
        allowed: false, 
        reason: `Daily loss limit reached (${settings.maxDailyLoss}%)` 
      }
    }

    return { allowed: true }
  }

  async lockRiskSettings(userId: string) {
    await db.update(riskSettings)
      .set({ isLocked: true, updatedAt: new Date() })
      .where(eq(riskSettings.userId, userId))
  }

  async calculatePositionSize(balance: number, riskPercentage: number, stopLossPips: number): Promise<number> {
    const riskAmount = balance * (riskPercentage / 100)
    const pipValue = 10 // USD per pip for standard lot
    
    return Math.max(0.01, riskAmount / (stopLossPips * pipValue))
  }
}
