interface MetaApiConfig {
  token: string
  accountId: string
}

interface TradeRequest {
  symbol: string
  type: 'BUY' | 'SELL'
  volume: number
  stopLoss?: number
  takeProfit?: number
}

export class MetaApiClient {
  private config: MetaApiConfig
  private baseUrl = 'https://mt-client-api-v1.new-york.agiliumtrade.ai'

  constructor(config: MetaApiConfig) {
    this.config = config
  }

  async getAccountInfo() {
    const response = await fetch(`${this.baseUrl}/users/current/accounts/${this.config.accountId}/account-information`, {
      headers: {
        'auth-token': this.config.token,
        'Content-Type': 'application/json'
      }
    })
    return response.json()
  }

  async getPositions() {
    const response = await fetch(`${this.baseUrl}/users/current/accounts/${this.config.accountId}/positions`, {
      headers: {
        'auth-token': this.config.token,
        'Content-Type': 'application/json'
      }
    })
    return response.json()
  }

  async placeTrade(trade: TradeRequest) {
    const response = await fetch(`${this.baseUrl}/users/current/accounts/${this.config.accountId}/trade`, {
      method: 'POST',
      headers: {
        'auth-token': this.config.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        actionType: 'ORDER_TYPE_' + (trade.type === 'BUY' ? 'BUY' : 'SELL'),
        symbol: trade.symbol,
        volume: trade.volume,
        stopLoss: trade.stopLoss,
        takeProfit: trade.takeProfit
      })
    })
    return response.json()
  }

  async closeTrade(positionId: string) {
    const response = await fetch(`${this.baseUrl}/users/current/accounts/${this.config.accountId}/positions/${positionId}/close`, {
      method: 'POST',
      headers: {
        'auth-token': this.config.token,
        'Content-Type': 'application/json'
      }
    })
    return response.json()
  }
}
