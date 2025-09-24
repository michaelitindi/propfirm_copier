interface LemonSqueezyConfig {
  apiKey: string
  storeId: string
}

interface SubscriptionPlan {
  id: string
  name: string
  price: number
  interval: 'month' | 'year'
  features: string[]
}

export class LemonSqueezyClient {
  private config: LemonSqueezyConfig
  private baseUrl = 'https://api.lemonsqueezy.com/v1'

  constructor(config: LemonSqueezyConfig) {
    this.config = config
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.api+json',
        ...options.headers
      }
    })

    if (!response.ok) {
      throw new Error(`Lemon Squeezy API error: ${response.statusText}`)
    }

    return response.json()
  }

  async getProducts() {
    return this.makeRequest(`/stores/${this.config.storeId}/products`)
  }

  async createCheckout(productId: string, customData: any = {}) {
    const checkoutData = {
      data: {
        type: 'checkouts',
        attributes: {
          product_options: {
            enabled_variants: [productId]
          },
          checkout_options: {
            embed: true,
            media: false,
            logo: true
          },
          checkout_data: customData,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
        },
        relationships: {
          store: {
            data: {
              type: 'stores',
              id: this.config.storeId
            }
          }
        }
      }
    }

    return this.makeRequest('/checkouts', {
      method: 'POST',
      body: JSON.stringify(checkoutData)
    })
  }

  async getSubscription(subscriptionId: string) {
    return this.makeRequest(`/subscriptions/${subscriptionId}`)
  }

  async cancelSubscription(subscriptionId: string) {
    return this.makeRequest(`/subscriptions/${subscriptionId}`, {
      method: 'DELETE'
    })
  }

  async updateSubscription(subscriptionId: string, data: any) {
    const updateData = {
      data: {
        type: 'subscriptions',
        id: subscriptionId,
        attributes: data
      }
    }

    return this.makeRequest(`/subscriptions/${subscriptionId}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData)
    })
  }

  // Webhook verification
  static verifyWebhook(payload: string, signature: string, secret: string): boolean {
    const crypto = require('crypto')
    const hmac = crypto.createHmac('sha256', secret)
    hmac.update(payload)
    const computedSignature = hmac.digest('hex')
    
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(computedSignature, 'hex')
    )
  }
}

// Predefined subscription plans
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 29,
    interval: 'month',
    features: [
      'Up to 3 propfirm accounts',
      'Basic copy trading',
      'Risk management tools',
      'Trade journaling',
      'Email support'
    ]
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 79,
    interval: 'month',
    features: [
      'Up to 10 propfirm accounts',
      'Advanced copy trading',
      'Advanced analytics',
      'Custom risk settings',
      'Priority support',
      'API access'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    interval: 'month',
    features: [
      'Unlimited propfirm accounts',
      'White-label solution',
      'Custom integrations',
      'Dedicated support',
      'Advanced reporting',
      'Multi-user access'
    ]
  }
]
