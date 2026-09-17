// Integration Manager - Prepare for third-party integrations

export interface Integration {
  id: string
  name: string
  description: string
  category: 'bank' | 'payment' | 'subscription' | 'investment' | 'analytics'
  isConnected: boolean
  icon: string
}

export interface IntegrationConfig {
  apiKey?: string
  webhookUrl?: string
  refreshToken?: string
  syncInterval?: number
  lastSyncTime?: Date
}

// Available integrations (future)
export const AVAILABLE_INTEGRATIONS: Integration[] = [
  {
    id: 'leumi',
    name: 'בנק לאומי',
    description: 'סנכרן עסקאות בנק אוטומטית',
    category: 'bank',
    isConnected: false,
    icon: '🏦',
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'סנכרן תשלומים מPayPal',
    category: 'payment',
    isConnected: false,
    icon: '💳',
  },
  {
    id: 'netflix',
    name: 'Netflix',
    description: 'עקוב אחרי מנוי Netflix',
    category: 'subscription',
    isConnected: false,
    icon: '🎬',
  },
  {
    id: 'spotify',
    name: 'Spotify',
    description: 'עקוב אחרי מנוי Spotify',
    category: 'subscription',
    isConnected: false,
    icon: '🎵',
  },
  {
    id: 'waze',
    name: 'Waze',
    description: 'עקוב אחרי הוצאות דלק',
    category: 'analytics',
    isConnected: false,
    icon: '🗺️',
  },
]

// Integration Manager
export class IntegrationManager {
  private config: Map<string, IntegrationConfig> = new Map()
  private integrations: Map<string, Integration> = new Map()

  constructor() {
    this.loadFromStorage()
  }

  // Load configuration from localStorage
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('integration_config')
      if (stored) {
        const config = JSON.parse(stored)
        Object.entries(config).forEach(([key, value]) => {
          this.config.set(key, value as IntegrationConfig)
        })
      }
    } catch (error) {
      console.error('Failed to load integration config:', error)
    }
  }

  // Save configuration to localStorage
  private saveToStorage(): void {
    try {
      const config = Object.fromEntries(this.config)
      localStorage.setItem('integration_config', JSON.stringify(config))
    } catch (error) {
      console.error('Failed to save integration config:', error)
    }
  }

  // Connect an integration
  public async connect(integrationId: string, credentials: IntegrationConfig): Promise<boolean> {
    try {
      // Validate credentials
      if (!this.validateCredentials(integrationId, credentials)) {
        throw new Error('Invalid credentials')
      }

      // Store configuration
      this.config.set(integrationId, credentials)
      this.saveToStorage()

      // Update integration status
      const integration = AVAILABLE_INTEGRATIONS.find((i) => i.id === integrationId)
      if (integration) {
        integration.isConnected = true
      }

      console.log(`✅ Integration ${integrationId} connected`)
      return true
    } catch (error) {
      console.error(`Failed to connect integration ${integrationId}:`, error)
      return false
    }
  }

  // Disconnect an integration
  public disconnect(integrationId: string): boolean {
    try {
      this.config.delete(integrationId)
      this.saveToStorage()

      const integration = AVAILABLE_INTEGRATIONS.find((i) => i.id === integrationId)
      if (integration) {
        integration.isConnected = false
      }

      console.log(`✅ Integration ${integrationId} disconnected`)
      return true
    } catch (error) {
      console.error(`Failed to disconnect integration ${integrationId}:`, error)
      return false
    }
  }

  // Get connected integrations
  public getConnected(): Integration[] {
    return AVAILABLE_INTEGRATIONS.filter((i) => i.isConnected)
  }

  // Validate credentials based on integration type
  private validateCredentials(integrationId: string, credentials: IntegrationConfig): boolean {
    switch (integrationId) {
      case 'leumi':
      case 'paypal':
        return !!(credentials.apiKey && credentials.refreshToken)
      case 'netflix':
      case 'spotify':
        return !!credentials.apiKey
      default:
        return !!credentials.apiKey
    }
  }

  // Sync data from integration (future)
  public async syncData(integrationId: string): Promise<any[]> {
    const config = this.config.get(integrationId)
    if (!config) {
      throw new Error(`Integration ${integrationId} not connected`)
    }

    // This would be implemented with actual API calls
    console.log(`🔄 Syncing data from ${integrationId}...`)
    // TODO: Implement actual sync logic
    return []
  }

  // Get sync status
  public getSyncStatus(integrationId: string): { lastSync?: Date; nextSync?: Date; status: string } {
    const config = this.config.get(integrationId)
    if (!config) {
      return { status: 'not_connected' }
    }

    return {
      lastSync: config.lastSyncTime,
      nextSync: config.syncInterval ? new Date(Date.now() + config.syncInterval) : undefined,
      status: 'connected',
    }
  }
}

// Export singleton instance
export const integrationManager = new IntegrationManager()

// Webhook handler for real-time updates
export interface WebhookPayload {
  integrationId: string
  eventType: string
  data: any
  timestamp: Date
}

export function handleWebhook(payload: WebhookPayload): void {
  console.log(`📨 Webhook received from ${payload.integrationId}:`, payload)

  // Validate webhook signature (implement per integration)
  // Process event
  // Update local data
}

// API Request helper for integrations
export async function makeIntegrationRequest(
  integrationId: string,
  endpoint: string,
  method: 'GET' | 'POST' = 'GET',
  data?: any
): Promise<any> {
  const config = integrationManager['config'].get(integrationId)

  if (!config?.apiKey) {
    throw new Error(`No API key configured for ${integrationId}`)
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${config.apiKey}`,
  }

  const options: RequestInit = {
    method,
    headers,
  }

  if (data && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(data)
  }

  try {
    const response = await fetch(endpoint, options)

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Integration API request failed:`, error)
    throw error
  }
}
