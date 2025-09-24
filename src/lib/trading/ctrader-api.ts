interface CTraderConfig {
  clientId: string
  clientSecret: string
  accessToken: string
  accountId: string
}

interface CTraderPosition {
  positionId: string
  symbol: string
  side: 'BUY' | 'SELL'
  volume: number
  entryPrice: number
  currentPrice: number
  unrealizedPnL: number
}

export class CTraderApiClient {
  private config: CTraderConfig
  private baseUrl = 'https://openapi.ctrader.com'

  constructor(config: CTraderConfig) {
    this.config = config
  }

  async getAccountInfo() {
    const response = await fetch(`${this.baseUrl}/v1/accounts/${this.config.accountId}`, {
      headers: {
        'Authorization': `Bearer ${this.config.accessToken}`,
        'Content-Type': 'application/json'
      }
    })
    return response.json()
  }

  async getPositions(): Promise<CTraderPosition[]> {
    const response = await fetch(`${this.baseUrl}/v1/accounts/${this.config.accountId}/positions`, {
      headers: {
        'Authorization': `Bearer ${this.config.accessToken}`,
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json()
    return data.positions || []
  }

  async createMarketOrder(symbol: string, side: 'BUY' | 'SELL', volume: number, stopLoss?: number, takeProfit?: number) {
    const orderData = {
      accountId: this.config.accountId,
      symbol,
      orderType: 'MARKET',
      tradeSide: side,
      volume,
      ...(stopLoss && { stopLoss }),
      ...(takeProfit && { takeProfit })
    }

    const response = await fetch(`${this.baseUrl}/v1/accounts/${this.config.accountId}/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    })

    return response.json()
  }

  async closePosition(positionId: string) {
    const response = await fetch(`${this.baseUrl}/v1/accounts/${this.config.accountId}/positions/${positionId}/close`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.accessToken}`,
        'Content-Type': 'application/json'
      }
    })
    return response.json()
  }
}
