interface ForexPrice {
  symbol: string
  bid: number
  ask: number
  timestamp: number
}

interface CandleData {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume?: number
}

export class ForexDataProvider {
  private apiKey: string
  private baseUrl = 'https://api.exchangerate-api.com/v4/latest'

  constructor(apiKey?: string) {
    this.apiKey = apiKey || ''
  }

  // Free real-time forex data from ExchangeRate-API
  async getCurrentPrices(symbols: string[]): Promise<ForexPrice[]> {
    try {
      const response = await fetch(`${this.baseUrl}/USD`)
      const data = await response.json()
      
      return symbols.map(symbol => {
        const baseCurrency = symbol.substring(0, 3)
        const quoteCurrency = symbol.substring(3, 6)
        
        let rate = 1
        if (baseCurrency !== 'USD' && quoteCurrency === 'USD') {
          rate = 1 / (data.rates[baseCurrency] || 1)
        } else if (baseCurrency === 'USD' && quoteCurrency !== 'USD') {
          rate = data.rates[quoteCurrency] || 1
        } else if (baseCurrency !== 'USD' && quoteCurrency !== 'USD') {
          rate = (data.rates[quoteCurrency] || 1) / (data.rates[baseCurrency] || 1)
        }

        const spread = rate * 0.0002 // Approximate 2 pip spread
        
        return {
          symbol,
          bid: rate - spread / 2,
          ask: rate + spread / 2,
          timestamp: Date.now()
        }
      })
    } catch (error) {
      console.error('Error fetching forex prices:', error)
      return []
    }
  }

  // Generate mock historical data for charts
  async getHistoricalData(symbol: string, timeframe: string = '1h', limit: number = 100): Promise<CandleData[]> {
    const data: CandleData[] = []
    const now = Date.now()
    const interval = this.getIntervalMs(timeframe)
    
    // Get current price as base
    const currentPrices = await this.getCurrentPrices([symbol])
    const basePrice = currentPrices[0]?.bid || 1.1000
    
    let currentPrice = basePrice
    
    for (let i = limit - 1; i >= 0; i--) {
      const time = Math.floor((now - (i * interval)) / 1000)
      
      // Generate realistic price movement
      const change = (Math.random() - 0.5) * 0.002 // ±0.2% change
      const open = currentPrice
      const close = open + change
      const high = Math.max(open, close) + Math.random() * 0.001
      const low = Math.min(open, close) - Math.random() * 0.001
      
      data.push({
        time,
        open: Number(open.toFixed(5)),
        high: Number(high.toFixed(5)),
        low: Number(low.toFixed(5)),
        close: Number(close.toFixed(5)),
        volume: Math.floor(Math.random() * 1000) + 100
      })
      
      currentPrice = close
    }
    
    return data
  }

  private getIntervalMs(timeframe: string): number {
    const intervals: { [key: string]: number } = {
      '1m': 60 * 1000,
      '5m': 5 * 60 * 1000,
      '15m': 15 * 60 * 1000,
      '1h': 60 * 60 * 1000,
      '4h': 4 * 60 * 60 * 1000,
      '1d': 24 * 60 * 60 * 1000
    }
    return intervals[timeframe] || intervals['1h']
  }

  // WebSocket-like price updates (simulated)
  subscribeToPrice(symbol: string, callback: (price: ForexPrice) => void): () => void {
    const interval = setInterval(async () => {
      const prices = await this.getCurrentPrices([symbol])
      if (prices.length > 0) {
        callback(prices[0])
      }
    }, 1000) // Update every second

    return () => clearInterval(interval)
  }
}
