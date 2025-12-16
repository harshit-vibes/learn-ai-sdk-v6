'use client'

import { useState, useEffect, useCallback } from 'react'
import { LearningPage } from '@/components/educational'
import { getPageContent } from '@/lib/education-content'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Terminal, ExternalLink, Eye, Zap, Bug, BarChart3, RefreshCw, Loader2, Trash2 } from 'lucide-react'

const content = getPageContent('dev/devtools')!

const codeExamples = [
  {
    title: 'Installation',
    language: 'bash',
    code: `# Install the devtools package
npm install @ai-sdk/devtools

# Run the devtools server
npx ai-sdk-devtools`,
  },
  {
    title: 'Configuration',
    language: 'typescript',
    code: `// next.config.js or app config
import { withDevtools } from '@ai-sdk/devtools'

export default withDevtools({
  // Your existing config
})

// DevTools will be available at http://localhost:4000`,
  },
  {
    title: 'With Custom Port',
    language: 'bash',
    code: `# Run on a custom port
npx ai-sdk-devtools --port 5000

# Or via environment variable
AI_SDK_DEVTOOLS_PORT=5000 npx ai-sdk-devtools`,
  },
]

interface TrackedRequest {
  id: string
  method: string
  timestamp: string
  model: string
  status: 'success' | 'error' | 'streaming'
  tokens: { prompt: number; completion: number }
  latency: number
  prompt: string
  response?: string
  metadata?: Record<string, unknown>
}

function DevToolsDemo() {
  const [requests, setRequests] = useState<TrackedRequest[]>([])
  const [selectedRequest, setSelectedRequest] = useState<TrackedRequest | null>(null)
  const [activeTab, setActiveTab] = useState<'request' | 'response' | 'metadata'>('request')
  const [isLoading, setIsLoading] = useState(true)
  const [isSimulating, setIsSimulating] = useState(false)

  const fetchRequests = useCallback(async () => {
    try {
      const response = await fetch('/api/learn/devtools')
      const data = await response.json()
      if (data.success) {
        setRequests(data.requests)
        if (!selectedRequest && data.requests.length > 0) {
          setSelectedRequest(data.requests[0])
        }
      }
    } catch (error) {
      console.error('Failed to fetch requests:', error)
    } finally {
      setIsLoading(false)
    }
  }, [selectedRequest])

  useEffect(() => {
    fetchRequests()
    // Auto-refresh every 5 seconds
    const interval = setInterval(fetchRequests, 5000)
    return () => clearInterval(interval)
  }, [fetchRequests])

  const simulateRequest = async () => {
    setIsSimulating(true)
    try {
      await fetch('/api/learn/devtools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'simulate' }),
      })
      await fetchRequests()
    } catch (error) {
      console.error('Failed to simulate request:', error)
    } finally {
      setIsSimulating(false)
    }
  }

  const clearRequests = async () => {
    try {
      await fetch('/api/learn/devtools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear' }),
      })
      setRequests([])
      setSelectedRequest(null)
    } catch (error) {
      console.error('Failed to clear requests:', error)
    }
  }

  const getStatusColor = (status: TrackedRequest['status']) => {
    switch (status) {
      case 'success': return 'bg-green-500'
      case 'error': return 'bg-red-500'
      case 'streaming': return 'bg-blue-500 animate-pulse'
    }
  }

  const getMethodColor = (method: string) => {
    if (method.includes('stream') || method.includes('Stream')) return 'text-blue-400'
    if (method.includes('Object')) return 'text-purple-400'
    if (method.includes('Chat') || method.includes('chat')) return 'text-amber-400'
    return 'text-green-400'
  }

  const totalTokens = requests.reduce((acc, req) => ({
    prompt: acc.prompt + req.tokens.prompt,
    completion: acc.completion + req.tokens.completion,
  }), { prompt: 0, completion: 0 })

  const avgLatency = requests.length > 0
    ? Math.round(requests.reduce((acc, req) => acc + req.latency, 0) / requests.length)
    : 0

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-blue-500/10 border-blue-500/20">
        <div className="flex items-start gap-3">
          <Terminal className="h-5 w-5 text-blue-500 mt-0.5" />
          <div>
            <h3 className="font-medium">Live Request Inspector</h3>
            <p className="text-sm text-muted-foreground mt-1">
              This demo tracks AI SDK API calls made in this learning hub.
              Try the demos on other pages and see the requests appear here!
            </p>
          </div>
        </div>
      </Card>

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-2">
        <Card className="p-3 text-center">
          <div className="text-2xl font-bold text-primary">{requests.length}</div>
          <div className="text-xs text-muted-foreground">Requests</div>
        </Card>
        <Card className="p-3 text-center">
          <div className="text-2xl font-bold text-green-500">
            {requests.filter(r => r.status === 'success').length}
          </div>
          <div className="text-xs text-muted-foreground">Success</div>
        </Card>
        <Card className="p-3 text-center">
          <div className="text-2xl font-bold text-amber-500">{avgLatency}ms</div>
          <div className="text-xs text-muted-foreground">Avg Latency</div>
        </Card>
        <Card className="p-3 text-center">
          <div className="text-2xl font-bold text-purple-500">
            {totalTokens.prompt + totalTokens.completion}
          </div>
          <div className="text-xs text-muted-foreground">Total Tokens</div>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button onClick={simulateRequest} disabled={isSimulating} size="sm">
          {isSimulating ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Zap className="h-4 w-4 mr-2" />
          )}
          Simulate Request
        </Button>
        <Button onClick={fetchRequests} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
        <Button onClick={clearRequests} variant="outline" size="sm">
          <Trash2 className="h-4 w-4 mr-2" />
          Clear
        </Button>
      </div>

      {/* DevTools UI */}
      <Card className="overflow-hidden border-2">
        {/* Header */}
        <div className="bg-zinc-900 px-4 py-2 flex items-center justify-between border-b border-zinc-700">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium text-white">AI SDK DevTools</span>
            <Badge variant="secondary" className="text-xs">Live</Badge>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-xs text-zinc-400 border-zinc-600">
              localhost:3000
            </Badge>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 divide-x divide-zinc-800">
          {/* Request List */}
          <div className="bg-zinc-950 max-h-[400px] overflow-auto">
            <div className="px-4 py-2 border-b border-zinc-800 sticky top-0 bg-zinc-950">
              <h4 className="text-xs font-medium text-zinc-400 uppercase">
                Requests ({requests.length})
              </h4>
            </div>
            {isLoading ? (
              <div className="p-8 text-center">
                <Loader2 className="h-6 w-6 text-zinc-500 animate-spin mx-auto" />
              </div>
            ) : requests.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 text-sm">
                No requests yet. Try other demos or click &quot;Simulate Request&quot;
              </div>
            ) : (
              <div className="divide-y divide-zinc-800">
                {requests.map((req) => (
                  <div
                    key={req.id}
                    className={`px-4 py-3 cursor-pointer transition-colors hover:bg-zinc-800/50 ${
                      selectedRequest?.id === req.id ? 'bg-zinc-800' : ''
                    }`}
                    onClick={() => setSelectedRequest(req)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(req.status)}`} />
                        <code className={`text-xs font-medium ${getMethodColor(req.method)}`}>
                          {req.method}
                        </code>
                      </div>
                      <span className="text-xs text-zinc-500">{req.timestamp}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-400 truncate max-w-[180px]">
                        {req.prompt.slice(0, 35)}...
                      </span>
                      <div className="flex items-center gap-2 text-xs text-zinc-500">
                        {req.latency > 0 && <span>{req.latency}ms</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Request Details */}
          <div className="bg-zinc-900 min-h-[400px]">
            {selectedRequest ? (
              <>
                {/* Tabs */}
                <div className="flex border-b border-zinc-800">
                  {(['request', 'response', 'metadata'] as const).map((tab) => (
                    <button
                      key={tab}
                      className={`px-4 py-2 text-xs font-medium capitalize ${
                        activeTab === tab
                          ? 'text-white border-b-2 border-blue-500'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="p-4">
                  {activeTab === 'request' && (
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs text-zinc-500">Model</span>
                        <p className="text-sm text-white font-mono">{selectedRequest.model}</p>
                      </div>
                      <div>
                        <span className="text-xs text-zinc-500">Method</span>
                        <p className={`text-sm font-mono ${getMethodColor(selectedRequest.method)}`}>
                          {selectedRequest.method}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-zinc-500">Prompt</span>
                        <p className="text-sm text-white mt-1 bg-zinc-950 p-2 rounded">
                          {selectedRequest.prompt}
                        </p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'response' && (
                    <div className="space-y-3">
                      {selectedRequest.response ? (
                        <div>
                          <span className="text-xs text-zinc-500">Output</span>
                          <pre className="text-sm text-white mt-1 font-mono bg-zinc-950 p-2 rounded whitespace-pre-wrap overflow-auto max-h-60">
                            {selectedRequest.response}
                          </pre>
                        </div>
                      ) : selectedRequest.status === 'streaming' ? (
                        <div className="text-center py-4">
                          <div className="inline-flex items-center gap-2 text-blue-400">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                            <span className="text-sm">Streaming...</span>
                          </div>
                        </div>
                      ) : selectedRequest.status === 'error' ? (
                        <div className="text-center py-4 text-red-400 text-sm">
                          Request failed
                        </div>
                      ) : (
                        <div className="text-center py-4 text-zinc-500 text-sm">
                          No response content
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'metadata' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-500">Status</span>
                        <Badge className={
                          selectedRequest.status === 'success'
                            ? 'bg-green-500/20 text-green-400'
                            : selectedRequest.status === 'error'
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-blue-500/20 text-blue-400'
                        }>
                          {selectedRequest.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-500">Latency</span>
                        <span className="text-white">{selectedRequest.latency}ms</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-500">Prompt Tokens</span>
                        <span className="text-white">{selectedRequest.tokens.prompt}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-500">Completion Tokens</span>
                        <span className="text-white">{selectedRequest.tokens.completion}</span>
                      </div>
                      {selectedRequest.metadata && (
                        <div className="mt-4">
                          <span className="text-xs text-zinc-500">Additional Metadata</span>
                          <pre className="text-xs text-zinc-300 mt-1 bg-zinc-950 p-2 rounded overflow-auto">
                            {JSON.stringify(selectedRequest.metadata, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-zinc-500">
                Select a request to view details
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Features */}
      <div>
        <h3 className="font-medium mb-3">DevTools Features</h3>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            { icon: Eye, name: 'Request Inspector', desc: 'View prompts, messages, and parameters' },
            { icon: Zap, name: 'Response Viewer', desc: 'See generated content and tool calls' },
            { icon: BarChart3, name: 'Token Usage', desc: 'Track prompt and completion tokens' },
            { icon: Bug, name: 'Error Debugging', desc: 'Inspect errors and stack traces' },
          ].map((feature) => (
            <Card key={feature.name} className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <feature.icon className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm">{feature.name}</span>
              </div>
              <p className="text-xs text-muted-foreground">{feature.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Real AI SDK DevTools</h4>
            <p className="text-sm text-muted-foreground">
              Install @ai-sdk/devtools for full debugging capabilities.
            </p>
          </div>
          <Button variant="outline" asChild>
            <a
              href="https://v6.ai-sdk.dev/docs/ai-sdk-core/devtools"
              target="_blank"
              rel="noopener noreferrer"
            >
              Docs <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default function DevToolsPage() {
  return <LearningPage content={content} demo={<DevToolsDemo />} codeExamples={codeExamples} />
}
