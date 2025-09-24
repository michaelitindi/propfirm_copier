interface ConnectionPool {
  [platform: string]: {
    client: any
    lastUsed: number
    isHealthy: boolean
  }
}

interface LatencyMetrics {
  platform: string
  avgLatency: number
  lastLatency: number
  successRate: number
  totalRequests: number
}

export class LatencyOptimizer {
  private connectionPool: ConnectionPool = {}
  private latencyMetrics: { [platform: string]: LatencyMetrics } = {}
  private maxPoolSize = 5
  private healthCheckInterval = 30000 // 30 seconds

  constructor() {
    // Start health check interval
    setInterval(() => this.performHealthChecks(), this.healthCheckInterval)
  }

  async executeTradeWithOptimization(platform: string, tradeData: any) {
    const startTime = Date.now()
    
    try {
      // Get optimized client connection
      const client = await this.getOptimizedClient(platform, tradeData.accountId)
      
      // Execute trade with retry mechanism
      const result = await this.executeWithRetry(client, tradeData, 3)
      
      // Record successful latency
      const latency = Date.now() - startTime
      this.recordLatency(platform, latency, true)
      
      return result
    } catch (error) {
      // Record failed latency
      const latency = Date.now() - startTime
      this.recordLatency(platform, latency, false)
      throw error
    }
  }

  private async getOptimizedClient(platform: string, accountId: string) {
    const poolKey = `${platform}_${accountId}`
    
    // Check if we have a healthy connection in pool
    if (this.connectionPool[poolKey] && this.connectionPool[poolKey].isHealthy) {
      this.connectionPool[poolKey].lastUsed = Date.now()
      return this.connectionPool[poolKey].client
    }

    // Create new optimized connection
    const client = await this.createOptimizedConnection(platform, accountId)
    
    // Add to pool
    this.connectionPool[poolKey] = {
      client,
      lastUsed: Date.now(),
      isHealthy: true
    }

    return client
  }

  private async createOptimizedConnection(platform: string, accountId: string) {
    switch (platform.toLowerCase()) {
      case 'metatrader':
        const { MetaApiClient } = await import('./meta-api')
        return new MetaApiClient({
          token: process.env.META_API_TOKEN!,
          accountId
        })
      
      case 'ctrader':
        const { CTraderApiClient } = await import('./ctrader-api')
        return new CTraderApiClient({
          clientId: process.env.CTRADER_CLIENT_ID!,
          clientSecret: process.env.CTRADER_CLIENT_SECRET!,
          accessToken: process.env.CTRADER_ACCESS_TOKEN!,
          accountId
        })
      
      case 'matchtrader':
        const { MatchTraderApiClient } = await import('./match-trader-api')
        return new MatchTraderApiClient({
          apiKey: process.env.MATCH_TRADER_API_KEY!,
          accountId,
          serverUrl: process.env.MATCH_TRADER_SERVER!
        })
      
      case 'tradelocker':
        const { TradeLockerApiClient } = await import('./tradelocker-api')
        return new TradeLockerApiClient({
          email: process.env.TRADELOCKER_EMAIL!,
          password: process.env.TRADELOCKER_PASSWORD!,
          server: process.env.TRADELOCKER_SERVER!,
          accountId
        })
      
      default:
        throw new Error(`Unsupported platform: ${platform}`)
    }
  }

  private async executeWithRetry(client: any, tradeData: any, maxRetries: number): Promise<any> {
    let lastError: Error | null = null
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Add exponential backoff for retries
        if (attempt > 1) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 2), 5000)
          await new Promise(resolve => setTimeout(resolve, delay))
        }

        return await client.placeTrade({
          symbol: tradeData.symbol,
          type: tradeData.type,
          volume: tradeData.volume,
          stopLoss: tradeData.stopLoss,
          takeProfit: tradeData.takeProfit
        })
      } catch (error) {
        lastError = error as Error
        console.warn(`Trade execution attempt ${attempt} failed:`, error)
        
        // Mark connection as unhealthy on certain errors
        if (this.isConnectionError(error)) {
          this.markConnectionUnhealthy(client)
        }
      }
    }
    
    throw lastError || new Error('Max retries exceeded')
  }

  private recordLatency(platform: string, latency: number, success: boolean) {
    if (!this.latencyMetrics[platform]) {
      this.latencyMetrics[platform] = {
        platform,
        avgLatency: latency,
        lastLatency: latency,
        successRate: success ? 100 : 0,
        totalRequests: 1
      }
      return
    }

    const metrics = this.latencyMetrics[platform]
    metrics.totalRequests++
    metrics.lastLatency = latency
    
    // Calculate rolling average
    metrics.avgLatency = (metrics.avgLatency * 0.9) + (latency * 0.1)
    
    // Update success rate
    const successCount = Math.round((metrics.successRate / 100) * (metrics.totalRequests - 1))
    const newSuccessCount = successCount + (success ? 1 : 0)
    metrics.successRate = (newSuccessCount / metrics.totalRequests) * 100
  }

  private isConnectionError(error: any): boolean {
    const connectionErrors = [
      'ECONNREFUSED',
      'ENOTFOUND',
      'ETIMEDOUT',
      'ECONNRESET',
      'Network Error',
      'timeout'
    ]
    
    const errorMessage = error.message || error.toString()
    return connectionErrors.some(errType => 
      errorMessage.toLowerCase().includes(errType.toLowerCase())
    )
  }

  private markConnectionUnhealthy(client: any) {
    Object.values(this.connectionPool).forEach(connection => {
      if (connection.client === client) {
        connection.isHealthy = false
      }
    })
  }

  private async performHealthChecks() {
    const now = Date.now()
    const maxIdleTime = 300000 // 5 minutes
    
    for (const [key, connection] of Object.entries(this.connectionPool)) {
      // Remove idle connections
      if (now - connection.lastUsed > maxIdleTime) {
        delete this.connectionPool[key]
        continue
      }
      
      // Perform health check
      try {
        await connection.client.getAccountInfo()
        connection.isHealthy = true
      } catch (error) {
        connection.isHealthy = false
      }
    }
  }

  getLatencyMetrics(): LatencyMetrics[] {
    return Object.values(this.latencyMetrics)
  }

  getBestPerformingPlatform(): string | null {
    const metrics = Object.values(this.latencyMetrics)
    if (metrics.length === 0) return null
    
    // Score based on latency and success rate
    const scored = metrics.map(m => ({
      platform: m.platform,
      score: (m.successRate / 100) * (1000 / Math.max(m.avgLatency, 1))
    }))
    
    scored.sort((a, b) => b.score - a.score)
    return scored[0]?.platform || null
  }
}
