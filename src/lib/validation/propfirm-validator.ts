import { db } from '../db'
import { propfirmWhitelist } from '../db/schema'
import { eq } from 'drizzle-orm'

interface ValidationResult {
  isValid: boolean
  message: string
  propfirm?: any
  restrictions?: string[]
}

export class PropFirmValidator {
  async validatePropFirm(propfirmName: string, platform: string): Promise<ValidationResult> {
    try {
      // Normalize propfirm name for comparison
      const normalizedName = this.normalizePropFirmName(propfirmName)
      
      // Check against whitelist
      const propfirm = await db.query.propfirmWhitelist.findFirst({
        where: eq(propfirmWhitelist.name, normalizedName)
      })

      if (!propfirm) {
        return {
          isValid: false,
          message: `PropFirm "${propfirmName}" is not in our database. Please contact support to add it.`,
          restrictions: ['Unknown propfirm - verification required']
        }
      }

      // Check if copy trading is allowed
      if (!propfirm.allowsCopyTrading) {
        return {
          isValid: false,
          message: `${propfirmName} does not allow copy trading according to their terms of service.`,
          propfirm,
          restrictions: ['Copy trading prohibited by propfirm terms']
        }
      }

      // Check platform compatibility
      const supportedPlatforms = propfirm.platforms as string[] || []
      if (supportedPlatforms.length > 0 && !supportedPlatforms.includes(platform)) {
        return {
          isValid: false,
          message: `${propfirmName} does not support ${platform} platform. Supported platforms: ${supportedPlatforms.join(', ')}`,
          propfirm,
          restrictions: [`Platform ${platform} not supported`]
        }
      }

      // Additional validation based on known propfirm rules
      const additionalValidation = this.performAdditionalValidation(normalizedName, platform)
      if (!additionalValidation.isValid) {
        return additionalValidation
      }

      return {
        isValid: true,
        message: `${propfirmName} is approved for copy trading on ${platform}`,
        propfirm
      }

    } catch (error) {
      console.error('PropFirm validation error:', error)
      return {
        isValid: false,
        message: 'Validation service temporarily unavailable. Please try again.',
        restrictions: ['Service error']
      }
    }
  }

  private normalizePropFirmName(name: string): string {
    // Normalize common propfirm name variations
    const normalizations: { [key: string]: string } = {
      'ftmo': 'FTMO',
      'f.t.m.o': 'FTMO',
      'ftmo.com': 'FTMO',
      '5%ers': '5%ers',
      'fivepercenters': '5%ers',
      'the5%ers': '5%ers',
      'myforexfunds': 'MyForexFunds',
      'mff': 'MyForexFunds',
      'the funded trader': 'The Funded Trader',
      'tft': 'The Funded Trader',
      'funded trader': 'The Funded Trader',
      'topstep': 'TopStep',
      'apex trader funding': 'Apex Trader Funding',
      'apex': 'Apex Trader Funding',
      'surge trader': 'SurgeTrader',
      'surgetrader': 'SurgeTrader',
      'e8 funding': 'E8 Funding',
      'e8': 'E8 Funding'
    }

    const normalized = name.toLowerCase().trim()
    return normalizations[normalized] || name.trim()
  }

  private performAdditionalValidation(propfirmName: string, platform: string): ValidationResult {
    // Known restrictions and special rules
    const restrictions: { [key: string]: any } = {
      'The Funded Trader': {
        copyTrading: false,
        reason: 'TFT explicitly prohibits copy trading in their terms of service'
      },
      'FTUK': {
        copyTrading: false,
        reason: 'FTUK does not allow automated trading or copy trading'
      },
      'TopStep': {
        platforms: ['MetaTrader 4', 'MetaTrader 5'],
        copyTrading: true,
        restrictions: ['Only MT4/MT5 supported', 'Must use demo accounts only']
      }
    }

    const restriction = restrictions[propfirmName]
    if (restriction && !restriction.copyTrading) {
      return {
        isValid: false,
        message: restriction.reason,
        restrictions: [restriction.reason]
      }
    }

    if (restriction && restriction.platforms && !restriction.platforms.includes(platform)) {
      return {
        isValid: false,
        message: `${propfirmName} only supports: ${restriction.platforms.join(', ')}`,
        restrictions: [`Platform ${platform} not supported by ${propfirmName}`]
      }
    }

    return { isValid: true, message: 'Additional validation passed' }
  }

  async suggestAlternatives(propfirmName: string): Promise<string[]> {
    // Get all approved propfirms
    const approvedPropfirms = await db.query.propfirmWhitelist.findMany({
      where: eq(propfirmWhitelist.allowsCopyTrading, true)
    })

    // Return top alternatives
    return approvedPropfirms
      .slice(0, 5)
      .map(p => p.name)
  }

  async checkComplianceRules(propfirmName: string): Promise<string[]> {
    const rules: { [key: string]: string[] } = {
      'FTMO': [
        'Maximum 5% daily loss limit',
        'Maximum 10% overall loss limit',
        'Minimum 10 trading days',
        'Copy trading allowed with restrictions'
      ],
      '5%ers': [
        'No daily loss limit',
        'Maximum 5% overall loss limit',
        'Minimum 6 trading days',
        'Copy trading fully allowed'
      ],
      'MyForexFunds': [
        'Maximum 5% daily loss limit',
        'Maximum 12% overall loss limit',
        'Minimum 5 trading days',
        'Copy trading allowed'
      ]
    }

    return rules[propfirmName] || [
      'Please check propfirm terms of service',
      'Verify copy trading policy',
      'Confirm platform compatibility'
    ]
  }
}
