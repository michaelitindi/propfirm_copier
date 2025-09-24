import html2canvas from 'html2canvas'

export class ScreenshotCapture {
  static async captureElement(elementId: string): Promise<string | null> {
    try {
      const element = document.getElementById(elementId)
      if (!element) {
        console.error(`Element with id ${elementId} not found`)
        return null
      }

      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 1,
        logging: false,
        useCORS: true
      })

      return canvas.toDataURL('image/png')
    } catch (error) {
      console.error('Error capturing screenshot:', error)
      return null
    }
  }

  static async captureChart(): Promise<string | null> {
    return this.captureElement('trading-chart')
  }

  static async captureTrade(tradeId: string): Promise<string | null> {
    return this.captureElement(`trade-${tradeId}`)
  }

  static async uploadScreenshot(dataUrl: string, filename: string): Promise<string | null> {
    try {
      // Convert data URL to blob
      const response = await fetch(dataUrl)
      const blob = await response.blob()

      // Create form data
      const formData = new FormData()
      formData.append('file', blob, filename)

      // Upload to your storage service (implement based on your needs)
      const uploadResponse = await fetch('/api/upload/screenshot', {
        method: 'POST',
        body: formData
      })

      if (uploadResponse.ok) {
        const result = await uploadResponse.json()
        return result.url
      }

      return null
    } catch (error) {
      console.error('Error uploading screenshot:', error)
      return null
    }
  }

  static async captureAndSaveTrade(tradeId: string): Promise<string | null> {
    const screenshot = await this.captureTrade(tradeId)
    if (!screenshot) return null

    const filename = `trade-${tradeId}-${Date.now()}.png`
    return this.uploadScreenshot(screenshot, filename)
  }
}
