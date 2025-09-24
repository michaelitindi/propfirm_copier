import { db } from '../db'
import { trades } from '../db/schema'
import { eq, and, gte, lte, desc } from 'drizzle-orm'

interface TradeAnalytics {
  totalTrades: number
  winningTrades: number
  losingTrades: number
  winRate: number
  totalProfit: number
  averageWin: number
  averageLoss: number
  profitFactor: number
  largestWin: number
  largestLoss: number
  consecutiveWins: number
  consecutiveLosses: number
}

interface TradingPattern {
  pattern: string
  frequency: number
  winRate: number
  avgProfit: number
  description: string
}

export class TradeAnalyticsEngine {
  async calculateAnalytics(userId: string, startDate?: Date, endDate?: Date): Promise<TradeAnalytics> {
    const conditions = [eq(trades.userId, userId)]
    
    if (startDate) conditions.push(gte(trades.openTime, startDate))
    if (endDate) conditions.push(lte(trades.openTime, endDate))

    const userTrades = await db.query.trades.findMany({
      where: and(...conditions),
      orderBy: [desc(trades.openTime)]
    })

    const closedTrades = userTrades.filter(trade => trade.status === 'CLOSED' && trade.profit !== null)
    
    if (closedTrades.length === 0) {
      return {
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
        winRate: 0,
        totalProfit: 0,
        averageWin: 0,
        averageLoss: 0,
        profitFactor: 0,
        largestWin: 0,
        largestLoss: 0,
        consecutiveWins: 0,
        consecutiveLosses: 0
      }
    }

    const winningTrades = closedTrades.filter(trade => Number(trade.profit) > 0)
    const losingTrades = closedTrades.filter(trade => Number(trade.profit) < 0)
    
    const totalProfit = closedTrades.reduce((sum, trade) => sum + Number(trade.profit), 0)
    const totalWins = winningTrades.reduce((sum, trade) => sum + Number(trade.profit), 0)
    const totalLosses = Math.abs(losingTrades.reduce((sum, trade) => sum + Number(trade.profit), 0))
    
    const winRate = (winningTrades.length / closedTrades.length) * 100
    const averageWin = winningTrades.length > 0 ? totalWins / winningTrades.length : 0
    const averageLoss = losingTrades.length > 0 ? totalLosses / losingTrades.length : 0
    const profitFactor = totalLosses > 0 ? totalWins / totalLosses : 0
    
    const largestWin = winningTrades.length > 0 ? Math.max(...winningTrades.map(t => Number(t.profit))) : 0
    const largestLoss = losingTrades.length > 0 ? Math.min(...losingTrades.map(t => Number(t.profit))) : 0

    // Calculate consecutive wins/losses
    const { consecutiveWins, consecutiveLosses } = this.calculateConsecutiveStreaks(closedTrades)

    return {
      totalTrades: closedTrades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      winRate,
      totalProfit,
      averageWin,
      averageLoss,
      profitFactor,
      largestWin,
      largestLoss,
      consecutiveWins,
      consecutiveLosses
    }
  }

  async identifyPatterns(userId: string): Promise<TradingPattern[]> {
    const userTrades = await db.query.trades.findMany({
      where: eq(trades.userId, userId),
      orderBy: [desc(trades.openTime)]
    })

    const patterns: TradingPattern[] = []

    // Time-based patterns
    const timePatterns = this.analyzeTimePatterns(userTrades)
    patterns.push(...timePatterns)

    // Symbol-based patterns
    const symbolPatterns = this.analyzeSymbolPatterns(userTrades)
    patterns.push(...symbolPatterns)

    // Risk-based patterns
    const riskPatterns = this.analyzeRiskPatterns(userTrades)
    patterns.push(...riskPatterns)

    return patterns.sort((a, b) => b.frequency - a.frequency)
  }

  private calculateConsecutiveStreaks(trades: any[]) {
    let maxConsecutiveWins = 0
    let maxConsecutiveLosses = 0
    let currentWinStreak = 0
    let currentLossStreak = 0

    for (const trade of trades) {
      const profit = Number(trade.profit)
      
      if (profit > 0) {
        currentWinStreak++
        currentLossStreak = 0
        maxConsecutiveWins = Math.max(maxConsecutiveWins, currentWinStreak)
      } else if (profit < 0) {
        currentLossStreak++
        currentWinStreak = 0
        maxConsecutiveLosses = Math.max(maxConsecutiveLosses, currentLossStreak)
      }
    }

    return {
      consecutiveWins: maxConsecutiveWins,
      consecutiveLosses: maxConsecutiveLosses
    }
  }

  private analyzeTimePatterns(trades: any[]): TradingPattern[] {
    const hourlyStats: { [hour: number]: { total: number, wins: number, profit: number } } = {}
    
    trades.forEach(trade => {
      if (trade.status !== 'CLOSED' || trade.profit === null) return
      
      const hour = new Date(trade.openTime).getHours()
      if (!hourlyStats[hour]) {
        hourlyStats[hour] = { total: 0, wins: 0, profit: 0 }
      }
      
      hourlyStats[hour].total++
      hourlyStats[hour].profit += Number(trade.profit)
      if (Number(trade.profit) > 0) hourlyStats[hour].wins++
    })

    return Object.entries(hourlyStats)
      .filter(([_, stats]) => stats.total >= 5) // Minimum 5 trades for pattern
      .map(([hour, stats]) => ({
        pattern: `Trading at ${hour}:00`,
        frequency: stats.total,
        winRate: (stats.wins / stats.total) * 100,
        avgProfit: stats.profit / stats.total,
        description: `Performance during ${hour}:00 hour`
      }))
  }

  private analyzeSymbolPatterns(trades: any[]): TradingPattern[] {
    const symbolStats: { [symbol: string]: { total: number, wins: number, profit: number } } = {}
    
    trades.forEach(trade => {
      if (trade.status !== 'CLOSED' || trade.profit === null) return
      
      if (!symbolStats[trade.symbol]) {
        symbolStats[trade.symbol] = { total: 0, wins: 0, profit: 0 }
      }
      
      symbolStats[trade.symbol].total++
      symbolStats[trade.symbol].profit += Number(trade.profit)
      if (Number(trade.profit) > 0) symbolStats[trade.symbol].wins++
    })

    return Object.entries(symbolStats)
      .filter(([_, stats]) => stats.total >= 3)
      .map(([symbol, stats]) => ({
        pattern: `${symbol} Trading`,
        frequency: stats.total,
        winRate: (stats.wins / stats.total) * 100,
        avgProfit: stats.profit / stats.total,
        description: `Performance on ${symbol} pair`
      }))
  }

  private analyzeRiskPatterns(trades: any[]): TradingPattern[] {
    const riskStats: { [risk: string]: { total: number, wins: number, profit: number } } = {}
    
    trades.forEach(trade => {
      if (trade.status !== 'CLOSED' || trade.profit === null || !trade.riskPercentage) return
      
      const riskRange = this.getRiskRange(Number(trade.riskPercentage))
      if (!riskStats[riskRange]) {
        riskStats[riskRange] = { total: 0, wins: 0, profit: 0 }
      }
      
      riskStats[riskRange].total++
      riskStats[riskRange].profit += Number(trade.profit)
      if (Number(trade.profit) > 0) riskStats[riskRange].wins++
    })

    return Object.entries(riskStats)
      .filter(([_, stats]) => stats.total >= 3)
      .map(([risk, stats]) => ({
        pattern: `${risk} Risk`,
        frequency: stats.total,
        winRate: (stats.wins / stats.total) * 100,
        avgProfit: stats.profit / stats.total,
        description: `Performance with ${risk} risk levels`
      }))
  }

  private getRiskRange(risk: number): string {
    if (risk <= 1) return 'Low (≤1%)'
    if (risk <= 2) return 'Medium (1-2%)'
    if (risk <= 3) return 'High (2-3%)'
    return 'Very High (>3%)'
  }
}
