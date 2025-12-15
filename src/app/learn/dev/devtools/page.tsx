'use client'

import { useState } from 'react'
import { LearningPage } from '@/components/educational'
import { getPageContent } from '@/lib/education-content'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Terminal, ExternalLink, Eye, Zap, Bug, BarChart3, Clock, MessageSquare, Wrench, ChevronRight } from 'lucide-react'

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

interface MockRequest {
  id: string
  method: string
  timestamp: string
  model: string
  status: 'success' | 'error' | 'streaming'
  tokens: { prompt: number; completion: number }
  latency: number
  prompt: string
  response?: string
}

const mockRequests: MockRequest[] = [
  {
    id: 'req_1',
    method: 'generateText',
    timestamp: '10:32:15',
    model: 'claude-sonnet-4',
    status: 'success',
    tokens: { prompt: 45, completion: 128 },
    latency: 1240,
    prompt: 'Explain quantum computing in simple terms',
    response: 'Quantum computing uses quantum bits or qubits that can exist in multiple states...',
  },
  {
    id: 'req_2',
    method: 'streamText',
    timestamp: '10:32:08',
    model: 'gpt-4o',
    status: 'streaming',
    tokens: { prompt: 32, completion: 0 },
    latency: 0,
    prompt: 'Write a haiku about programming',
  },
  {
    id: 'req_3',
    method: 'generateObject',
    timestamp: '10:31:52',
    model: 'claude-sonnet-4',
    status: 'success',
    tokens: { prompt: 89, completion: 234 },
    latency: 2100,
    prompt: 'Extract user data from this text...',
    response: '{ "name": "John", "email": "john@example.com" }',
  },
  {
    id: 'req_4',
    method: 'generateText',
    timestamp: '10:31:41',
    model: 'claude-sonnet-4',
    status: 'error',
    tokens: { prompt: 156, completion: 0 },
    latency: 450,
    prompt: 'This request exceeded the context limit...',
  },
]

function DevToolsDemo() {
  const [selectedRequest, setSelectedRequest] = useState<MockRequest | null>(mockRequests[0])
  const [activeTab, setActiveTab] = useState<'request' | 'response' | 'metadata'>('request')

  const getStatusColor = (status: MockRequest['status']) => {
    switch (status) {
      case 'success': return 'bg-green-500'
      case 'error': return 'bg-red-500'
      case 'streaming': return 'bg-blue-500 animate-pulse'
    }
  }

  const getMethodColor = (method: string) => {
    if (method.includes('stream')) return 'text-blue-400'
    if (method.includes('Object')) return 'text-purple-400'
    return 'text-green-400'
  }

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-blue-500/10 border-blue-500/20">
        <div className="flex items-start gap-3">
          <Terminal className="h-5 w-5 text-blue-500 mt-0.5" />
          <div>
            <h3 className="font-medium">DevTools Preview</h3>
            <p className="text-sm text-muted-foreground mt-1">
              This is a simulated preview of AI SDK DevTools. The real DevTools provides
              a visual debugging interface for inspecting AI SDK operations in your app.
            </p>
          </div>
        </div>
      </Card>

      {/* Mock DevTools UI */}
      <Card className="overflow-hidden border-2">
        {/* Header */}
        <div className="bg-zinc-900 px-4 py-2 flex items-center justify-between border-b border-zinc-700">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium text-white">AI SDK DevTools</span>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-xs text-zinc-400 border-zinc-600">
              localhost:4000
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
          <div className="bg-zinc-950">
            <div className="px-4 py-2 border-b border-zinc-800">
              <h4 className="text-xs font-medium text-zinc-400 uppercase">Requests</h4>
            </div>
            <div className="divide-y divide-zinc-800">
              {mockRequests.map((req) => (
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
                      {req.prompt.slice(0, 40)}...
                    </span>
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      {req.latency > 0 && <span>{req.latency}ms</span>}
                      <ChevronRight className="h-3 w-3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Request Details */}
          <div className="bg-zinc-900">
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
                        <span className="text-xs text-zinc-500">Prompt</span>
                        <p className="text-sm text-white mt-1">{selectedRequest.prompt}</p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'response' && (
                    <div className="space-y-3">
                      {selectedRequest.response ? (
                        <div>
                          <span className="text-xs text-zinc-500">Output</span>
                          <p className="text-sm text-white mt-1 font-mono bg-zinc-950 p-2 rounded">
                            {selectedRequest.response}
                          </p>
                        </div>
                      ) : selectedRequest.status === 'streaming' ? (
                        <div className="text-center py-4">
                          <div className="inline-flex items-center gap-2 text-blue-400">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                            <span className="text-sm">Streaming...</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-4 text-red-400 text-sm">
                          Request failed
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'metadata' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-500">Status</span>
                        <Badge className={selectedRequest.status === 'success' ? 'bg-green-500/20 text-green-400' : selectedRequest.status === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}>
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
            <h4 className="font-medium">Learn More</h4>
            <p className="text-sm text-muted-foreground">
              Visit the official documentation for setup instructions.
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
