import { MetaApiClient } from './meta-api'
import { CTraderApiClient } from './ctrader-api'
import { MatchTraderApiClient } from './match-trader-api'
import { TradeLockerApiClient } from './tradelocker-api'
import { LatencyOptimizer } from './latency-optimizer'
import { db } from '../db'
import { propfirmAccounts, trades, copyTradingGroups } from '../db/schema'
import { eq } from 'drizzle-orm'

interface EnhancedTradeParams {
  symbol: string
  type: 'BUY' | 'SELL'
  riskPercentage: number
  stopLoss?: number
  takeProfit?: number
  notes?: string
}

export class EnhancedCopyTradingEngine {
  private latencyOptimizer: LatencyOptimizer

  constructor() {
    this.latencyOptimizer = new LatencyOptimizer()
  }

  async executeCopyTrade(masterAccountId: string, tradeParams: EnhancedTradeParams) {
    const startTime = Date.now()
    
    try {
      // Get copy trading group with all slave accounts
      const group = await db.query.copyTradingGroups.findFirst({
        where: eq(copyTradingGroups.masterAccountId, masterAccountId),
        with: {
          slaves: {
            with: {
              account: true
            }
          }
        }
      })

      if (!group || !group.isActive) {
        throw new Error('Copy trading group not found or inactive')
      }

      // Get master account details
      const masterAccount = await db.query.propfirmAccounts.findFirst({
        where: eq(propfirmAccounts.id, masterAccountId)
      })

      if (!masterAccount) {
        throw new Error('Master account not found')
      }

      // Execute on master account first
      const masterResult = await this.executeTradeOnAccount(masterAccount, tradeParams)
      
      // Execute on all slave accounts in parallel for minimal latency
      const slavePromises = group.slaves
        .filter(slave => slave.isActive)
        .map(slave => this.executeTradeOnAccount(
          slave.account, 
          tradeParams, 
          Number(slave.multiplier)
        ))

      const slaveResults = await Promise.allSettled(slavePromises)
      
      // Log execution time
      const executionTime = Date.now() - startTime
      console.log(`Copy trade executed in ${executionTime}ms`)

      // Record trade in database
      await this.recordTrade(masterAccount.userId, masterResult, tradeParams, executionTime)

      return {
        master: masterResult,
        slaves: slaveResults,
        executionTime
      }

    } catch (error) {
      console.error('Copy trade execution failed:', error)
      throw error
    }
  }

  private async executeTradeOnAccount(account: any, tradeParams: EnhancedTradeParams, multiplier: number = 1) {
    const client = await this.createPlatformClient(account)
    
    // Calculate position size
    const lotSize = this.calculateLotSize(
      Number(account.balance),
      tradeParams.riskPercentage,
      tradeParams.symbol,
      tradeParams.stopLoss
    ) * multiplier

    // Use latency optimizer for execution
    return this.latencyOptimizer.executeTradeWithOptimization(account.platform, {
      accountId: account.accountNumber,
      symbol: tradeParams.symbol,
      type: tradeParams.type,
      volume: lotSize,
      stopLoss: tradeParams.stopLoss,
      takeProfit: tradeParams.takeProfit
    })
  }

  private async createPlatformClient(account: any) {
    const credentials = account.apiCredentials

    switch (account.platform.toLowerCase()) {
      case 'metatrader 4':
      case 'metatrader 5':
      case 'mt4':
      case 'mt5':
        return new MetaApiClient({
          token: credentials.token,
          accountId: account.accountNumber
        })

      case 'ctrader':
        return new CTraderApiClient({
          clientId: credentials.clientId,
          clientSecret: credentials.clientSecret,
          accessToken: credentials.accessToken,
          accountId: account.accountNumber
        })

      case 'match trader':
      case 'matchtrader':
        return new MatchTraderApiClient({
          apiKey: credentials.apiKey,
          accountId: account.accountNumber,
          serverUrl: credentials.serverUrl
        })

      case 'tradelocker':
        return new TradeLockerApiClient({
          email: credentials.email,
          password: credentials.password,
          server: credentials.server,
          accountId: account.accountNumber
        })

      default:
        throw new Error(`Unsupported platform: ${account.platform}`)
    }
  }

  private calculateLotSize(balance: number, riskPercentage: number, symbol: string, stopLoss?: number): number {
    if (!stopLoss) return 0.01

    const riskAmount = balance * (riskPercentage / 100)
    const pipValue = this.getPipValue(symbol)
    const stopLossPips = Math.abs(stopLoss) * 10000
    
    return Math.max(0.01, Math.min(10, riskAmount / (stopLossPips * pipValue)))
  }

  private getPipValue(symbol: string): number {
    const majorPairs = ['EURUSD', 'GBPUSD', 'AUDUSD', 'NZDUSD']
    const jpyPairs = ['USDJPY', 'EURJPY', 'GBPJPY', 'AUDJPY']
    
    if (majorPairs.includes(symbol)) return 10
    if (jpyPairs.includes(symbol)) return 0.1
    if (symbol.includes('XAU') || symbol.includes('GOLD')) return 1
    
    return 1 // Default
  }

  private async recordTrade(userId: string, tradeResult: any, params: EnhancedTradeParams, executionTime: number) {
    await db.insert(trades).values({
      userId,
      symbol: params.symbol,
      type: params.type,
      lotSize: tradeResult.volume?.toString() || '0',
      openPrice: tradeResult.price?.toString() || '0',
      stopLoss: params.stopLoss?.toString(),
      takeProfit: params.takeProfit?.toString(),
      openTime: new Date(),
      status: 'OPEN',
      notes: params.notes,
      riskPercentage: params.riskPercentage.toString()
    })
  }

  getLatencyMetrics() {
    return this.latencyOptimizer.getLatencyMetrics()
  }
}
