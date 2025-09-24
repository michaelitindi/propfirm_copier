interface MatchTraderConfig {
  apiKey: string
  accountId: string
  serverUrl: string
}

interface MatchTraderOrder {
  symbol: string
  side: 'BUY' | 'SELL'
  volume: number
  orderType: 'MARKET' | 'LIMIT'
  price?: number
  stopLoss?: number
  takeProfit?: number
}

export class MatchTraderApiClient {
  private config: MatchTraderConfig
  private baseUrl: string

  constructor(config: MatchTraderConfig) {
    this.config = config
    this.baseUrl = config.serverUrl || 'https://api.matchtrader.com'
  }

  async getAccountInfo() {
    const response = await fetch(`${this.baseUrl}/v1/accounts/${this.config.accountId}`, {
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      }
    })
    return response.json()
  }

  async getPositions() {
    const response = await fetch(`${this.baseUrl}/v1/accounts/${this.config.accountId}/positions`, {
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      }
    })
    return response.json()
  }

  async placeOrder(order: MatchTraderOrder) {
    const response = await fetch(`${this.baseUrl}/v1/accounts/${this.config.accountId}/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        symbol: order.symbol,
        side: order.side,
        volume: order.volume,
        type: order.orderType,
        price: order.price,
        stopLoss: order.stopLoss,
        takeProfit: order.takeProfit
      })
    })
    return response.json()
  }

  async closePosition(positionId: string) {
    const response = await fetch(`${this.baseUrl}/v1/accounts/${this.config.accountId}/positions/${positionId}/close`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      }
    })
    return response.json()
  }
}
