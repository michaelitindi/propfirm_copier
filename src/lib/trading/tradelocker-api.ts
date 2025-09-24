interface TradeLockerConfig {
  email: string
  password: string
  server: string
  accountId: string
}

interface TradeLockerPosition {
  id: string
  symbol: string
  side: 'buy' | 'sell'
  lots: number
  openPrice: number
  currentPrice: number
  profit: number
  stopLoss?: number
  takeProfit?: number
}

export class TradeLockerApiClient {
  private config: TradeLockerConfig
  private baseUrl = 'https://api.tradelocker.com'
  private accessToken: string | null = null

  constructor(config: TradeLockerConfig) {
    this.config = config
  }

  async authenticate() {
    const response = await fetch(`${this.baseUrl}/auth/jwt/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: this.config.email,
        password: this.config.password,
        server: this.config.server
      })
    })

    const data = await response.json()
    this.accessToken = data.accessToken
    return data
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    if (!this.accessToken) {
      await this.authenticate()
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    })

    return response.json()
  }

  async getAccountInfo() {
    return this.makeRequest(`/trade/accounts/${this.config.accountId}`)
  }

  async getPositions(): Promise<TradeLockerPosition[]> {
    const data = await this.makeRequest(`/trade/accounts/${this.config.accountId}/positions`)
    return data.d || []
  }

  async createMarketOrder(symbol: string, side: 'buy' | 'sell', lots: number, stopLoss?: number, takeProfit?: number) {
    return this.makeRequest(`/trade/accounts/${this.config.accountId}/orders`, {
      method: 'POST',
      body: JSON.stringify({
        symbol,
        side,
        type: 'market',
        lots,
        stopLoss,
        takeProfit
      })
    })
  }

  async closePosition(positionId: string) {
    return this.makeRequest(`/trade/accounts/${this.config.accountId}/positions/${positionId}`, {
      method: 'DELETE'
    })
  }

  async modifyPosition(positionId: string, stopLoss?: number, takeProfit?: number) {
    return this.makeRequest(`/trade/accounts/${this.config.accountId}/positions/${positionId}`, {
      method: 'PUT',
      body: JSON.stringify({
        stopLoss,
        takeProfit
      })
    })
  }
}
