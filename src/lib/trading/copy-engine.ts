import { MetaApiClient } from './meta-api'
import { db } from '../db'
import { propfirmAccounts, trades, copyTradingGroups, copyTradingSlaves } from '../db/schema'
import { eq } from 'drizzle-orm'

interface CopyTradeParams {
  symbol: string
  type: 'BUY' | 'SELL'
  riskPercentage: number
  stopLoss?: number
  takeProfit?: number
}

export class CopyTradingEngine {
  async executeCopyTrade(masterAccountId: string, tradeParams: CopyTradeParams) {
    // Get copy trading group
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

    if (!group || !group.isActive) return

    // Get master account
    const masterAccount = await db.query.propfirmAccounts.findFirst({
      where: eq(propfirmAccounts.id, masterAccountId)
    })

    if (!masterAccount) return

    // Calculate lot size for master account
    const masterLotSize = this.calculateLotSize(
      Number(masterAccount.balance),
      tradeParams.riskPercentage,
      tradeParams.symbol,
      tradeParams.stopLoss
    )

    // Execute trade on master account
    const masterClient = new MetaApiClient({
      token: masterAccount.apiCredentials?.token,
      accountId: masterAccount.accountNumber
    })

    const masterTrade = await masterClient.placeTrade({
      symbol: tradeParams.symbol,
      type: tradeParams.type,
      volume: masterLotSize,
      stopLoss: tradeParams.stopLoss,
      takeProfit: tradeParams.takeProfit
    })

    // Execute on slave accounts
    for (const slave of group.slaves) {
      if (!slave.isActive) continue

      const slaveLotSize = this.calculateLotSize(
        Number(slave.account.balance),
        tradeParams.riskPercentage,
        tradeParams.symbol,
        tradeParams.stopLoss
      ) * Number(slave.multiplier)

      const slaveClient = new MetaApiClient({
        token: slave.account.apiCredentials?.token,
        accountId: slave.account.accountNumber
      })

      await slaveClient.placeTrade({
        symbol: tradeParams.symbol,
        type: tradeParams.type,
        volume: slaveLotSize,
        stopLoss: tradeParams.stopLoss,
        takeProfit: tradeParams.takeProfit
      })
    }

    return masterTrade
  }

  private calculateLotSize(
    balance: number,
    riskPercentage: number,
    symbol: string,
    stopLoss?: number
  ): number {
    if (!stopLoss) return 0.01 // Default minimum lot size

    const riskAmount = balance * (riskPercentage / 100)
    const pipValue = this.getPipValue(symbol)
    const stopLossPips = Math.abs(stopLoss) * 10000 // Assuming 4-digit broker
    
    return Math.max(0.01, riskAmount / (stopLossPips * pipValue))
  }

  private getPipValue(symbol: string): number {
    // Simplified pip value calculation
    const majorPairs = ['EURUSD', 'GBPUSD', 'AUDUSD', 'NZDUSD']
    return majorPairs.includes(symbol) ? 10 : 1
  }
}
