'use client'

import { useState } from 'react'
import { AVAILABLE_INTEGRATIONS, IntegrationManager } from '@/app/utils/integrations'

export function IntegrationsPanel() {
  const [manager] = useState(() => new IntegrationManager())
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null)
  const [apiKey, setApiKey] = useState('')

  const handleConnect = async (integrationId: string) => {
    if (!apiKey) {
      alert('Please enter API key')
      return
    }

    const success = await manager.connect(integrationId, { apiKey })
    if (success) {
      alert(`✅ ${integrationId} connected!`)
      setApiKey('')
      setSelectedIntegration(null)
    } else {
      alert(`❌ Failed to connect ${integrationId}`)
    }
  }

  const handleDisconnect = (integrationId: string) => {
    if (window.confirm(`Disconnect from ${integrationId}?`)) {
      manager.disconnect(integrationId)
    }
  }

  const connected = manager.getConnected()

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-gray-200 mb-3">🔗 Integrations (Coming Soon)</h3>
        <p className="text-xs text-gray-400 mb-4">Connect external services to auto-track expenses</p>
      </div>

      {/* Connected Integrations */}
      {connected.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-green-400 mb-2">✅ Connected</h4>
          <div className="space-y-2">
            {connected.map((integration) => (
              <div key={integration.id} className="bg-green-900/20 border border-green-500/30 rounded-lg p-3 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-sm">{integration.icon} {integration.name}</p>
                  <p className="text-xs text-gray-400">{integration.description}</p>
                </div>
                <button
                  onClick={() => handleDisconnect(integration.id)}
                  className="text-xs bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg transition"
                >
                  Disconnect
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Integrations */}
      <div>
        <h4 className="text-sm font-semibold text-gray-300 mb-2">
          🔌 Available {AVAILABLE_INTEGRATIONS.filter((i) => !i.isConnected).length}
        </h4>
        <div className="space-y-2">
          {AVAILABLE_INTEGRATIONS.filter((i) => !i.isConnected).map((integration) => (
            <div key={integration.id} className="bg-gray-800/50 border border-gray-600/30 rounded-lg p-3">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-sm">{integration.icon} {integration.name}</p>
                  <p className="text-xs text-gray-400">{integration.description}</p>
                </div>
                <button
                  onClick={() => setSelectedIntegration(integration.id)}
                  className="text-xs bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded-lg transition"
                >
                  Connect
                </button>
              </div>

              {selectedIntegration === integration.id && (
                <div className="mt-3 pt-3 border-t border-gray-600/30 space-y-2">
                  <input
                    type="password"
                    placeholder="API Key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full px-2 py-1 bg-gray-900 border border-gray-600 rounded text-sm focus:outline-none focus:border-indigo-500"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleConnect(integration.id)}
                      className="flex-1 text-xs bg-green-600 hover:bg-green-700 px-3 py-1 rounded-lg transition"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setSelectedIntegration(null)}
                      className="flex-1 text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-lg transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Roadmap */}
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
        <p className="text-xs text-blue-300 mb-2 font-semibold">📋 Planned Integrations:</p>
        <ul className="text-xs text-blue-200 space-y-1">
          <li>🏦 Bank APIs - Automatic transaction sync</li>
          <li>💳 Credit card companies - Real-time tracking</li>
          <li>🎬 Subscription services - Auto-detect recurring</li>
          <li>📊 Analytics platforms - Advanced reports</li>
        </ul>
      </div>

      <p className="text-xs text-gray-500 text-center">
        Integrations coming in next phase
      </p>
    </div>
  )
}
