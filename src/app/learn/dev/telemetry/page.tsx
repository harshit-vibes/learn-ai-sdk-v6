'use client'

import { useState } from 'react'
import { LearningPage } from '@/components/educational'
import { getPageContent } from '@/lib/education-content'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Activity, Copy, Check, Plus, X, RotateCcw, Play, Loader2, ChevronRight, ChevronDown } from 'lucide-react'

const content = getPageContent('dev/telemetry')!

const codeExamples = [
  {
    title: 'Enable Telemetry',
    language: 'typescript',
    code: `const result = await generateText({
  model: gateway('anthropic/claude-sonnet-4'),
  prompt: 'Hello!',
  experimental_telemetry: {
    isEnabled: true,
  },
})`,
  },
  {
    title: 'With Metadata',
    language: 'typescript',
    code: `const result = await generateText({
  model,
  prompt: '...',
  experimental_telemetry: {
    isEnabled: true,
    functionId: 'chat-completion',  // Identify this function
    metadata: {
      userId: 'user_123',
      sessionId: 'session_456',
      feature: 'customer-support',
    },
  },
})`,
  },
  {
    title: 'Privacy Controls',
    language: 'typescript',
    code: `const result = await generateText({
  model,
  prompt: '...',
  experimental_telemetry: {
    isEnabled: true,
    // Don't record sensitive data
    recordInputs: false,   // Don't log prompts
    recordOutputs: false,  // Don't log responses
  },
})`,
  },
  {
    title: 'Next.js Setup',
    language: 'typescript',
    code: `// instrumentation.ts
import { registerOTel } from '@vercel/otel'

export function register() {
  registerOTel({ serviceName: 'my-ai-app' })
}

// next.config.js
module.exports = {
  experimental: {
    instrumentationHook: true,
  },
}`,
  },
  {
    title: 'Custom Tracer',
    language: 'typescript',
    code: `import { trace } from '@opentelemetry/api'

const customTracer = trace.getTracer('my-custom-tracer')

const result = await generateText({
  model,
  prompt: '...',
  experimental_telemetry: {
    isEnabled: true,
    tracer: customTracer, // Use custom tracer
  },
})`,
  },
]

interface Span {
  id: string
  name: string
  startTime: number
  endTime?: number
  duration?: number
  attributes: Record<string, unknown>
  status: 'running' | 'success' | 'error'
  children?: Span[]
}

interface TelemetryResult {
  success: boolean
  text?: string
  spans?: Span[]
  usage?: { promptTokens: number; completionTokens: number }
  duration?: number
  error?: string
}

function TelemetryDemo() {
  const [isEnabled, setIsEnabled] = useState(true)
  const [functionId, setFunctionId] = useState('chat-completion')
  const [recordInputs, setRecordInputs] = useState(true)
  const [recordOutputs, setRecordOutputs] = useState(true)
  const [metadata, setMetadata] = useState<{ key: string; value: string }[]>([
    { key: 'userId', value: 'user_123' },
  ])
  const [newKey, setNewKey] = useState('')
  const [newValue, setNewValue] = useState('')
  const [copied, setCopied] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<TelemetryResult | null>(null)
  const [expandedSpans, setExpandedSpans] = useState<Set<string>>(new Set())
  const [prompt] = useState('What is the AI SDK in one sentence?')

  const addMetadata = () => {
    if (newKey && newValue) {
      setMetadata([...metadata, { key: newKey, value: newValue }])
      setNewKey('')
      setNewValue('')
    }
  }

  const removeMetadata = (index: number) => {
    setMetadata(metadata.filter((_, i) => i !== index))
  }

  const resetConfig = () => {
    setIsEnabled(true)
    setFunctionId('chat-completion')
    setRecordInputs(true)
    setRecordOutputs(true)
    setMetadata([{ key: 'userId', value: 'user_123' }])
    setResult(null)
  }

  const generateCode = () => {
    const metadataObj = metadata.length > 0
      ? `\n      metadata: {\n${metadata.map(m => `        ${m.key}: '${m.value}',`).join('\n')}\n      },`
      : ''

    const privacySettings = (!recordInputs || !recordOutputs)
      ? `\n      recordInputs: ${recordInputs},\n      recordOutputs: ${recordOutputs},`
      : ''

    return `const result = await generateText({
  model: gateway('anthropic/claude-sonnet-4'),
  prompt: 'Your prompt here',
  experimental_telemetry: {
    isEnabled: ${isEnabled},${functionId ? `\n      functionId: '${functionId}',` : ''}${metadataObj}${privacySettings}
  },
})`
  }

  const copyCode = () => {
    navigator.clipboard.writeText(generateCode())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const runWithTelemetry = async () => {
    setIsRunning(true)
    setResult(null)
    setExpandedSpans(new Set())

    try {
      const response = await fetch('/api/learn/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config: {
            isEnabled,
            functionId,
            recordInputs,
            recordOutputs,
            metadata,
          },
          prompt,
        }),
      })

      const data = await response.json()
      setResult(data)

      // Auto-expand root span
      if (data.spans?.[0]) {
        setExpandedSpans(new Set([data.spans[0].id]))
      }
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Request failed',
      })
    } finally {
      setIsRunning(false)
    }
  }

  const toggleSpan = (spanId: string) => {
    setExpandedSpans(prev => {
      const next = new Set(prev)
      if (next.has(spanId)) {
        next.delete(spanId)
      } else {
        next.add(spanId)
      }
      return next
    })
  }

  const renderSpan = (span: Span, depth = 0) => {
    const isExpanded = expandedSpans.has(span.id)
    const hasChildren = span.children && span.children.length > 0
    const statusColor = span.status === 'success' ? 'text-green-500' : span.status === 'error' ? 'text-red-500' : 'text-blue-500'

    return (
      <div key={span.id} className="border-l-2 border-zinc-700" style={{ marginLeft: depth * 16 }}>
        <div
          className={`flex items-center gap-2 p-2 hover:bg-zinc-800/50 cursor-pointer ${isExpanded ? 'bg-zinc-800/30' : ''}`}
          onClick={() => toggleSpan(span.id)}
        >
          {hasChildren ? (
            isExpanded ? <ChevronDown className="h-3 w-3 text-zinc-500" /> : <ChevronRight className="h-3 w-3 text-zinc-500" />
          ) : (
            <div className="w-3" />
          )}
          <div className={`w-2 h-2 rounded-full ${statusColor} ${span.status === 'running' ? 'animate-pulse' : ''}`} />
          <span className="text-xs font-mono text-zinc-300">{span.name}</span>
          {span.duration !== undefined && (
            <span className="text-xs text-zinc-500 ml-auto">{span.duration}ms</span>
          )}
        </div>
        {isExpanded && (
          <div className="px-4 py-2 bg-zinc-900/50 text-xs space-y-1">
            {Object.entries(span.attributes).map(([key, value]) => (
              value !== undefined && (
                <div key={key} className="flex gap-2">
                  <span className="text-zinc-500">{key}:</span>
                  <span className="text-zinc-300 font-mono break-all">
                    {typeof value === 'string' && value.length > 50
                      ? value.slice(0, 50) + '...'
                      : String(value)}
                  </span>
                </div>
              )
            ))}
          </div>
        )}
        {isExpanded && hasChildren && span.children?.map(child => renderSpan(child, depth + 1))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-purple-500/10 border-purple-500/20">
        <div className="flex items-start gap-3">
          <Activity className="h-5 w-5 text-purple-500 mt-0.5" />
          <div>
            <h3 className="font-medium">Live Telemetry Viewer</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Configure telemetry settings and run an API call to see real trace data.
              Click on spans to view their attributes.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Configuration</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={resetConfig}>
                <RotateCcw className="h-3 w-3 mr-1" />
                Reset
              </Button>
              <Button size="sm" onClick={runWithTelemetry} disabled={isRunning || !isEnabled}>
                {isRunning ? (
                  <>
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="h-3 w-3 mr-1" />
                    Run
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Enable/Disable */}
          <Card className="p-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium">Enable Telemetry</span>
              <button
                onClick={() => setIsEnabled(!isEnabled)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  isEnabled ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  isEnabled ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </label>
          </Card>

          {/* Function ID */}
          <Card className="p-3">
            <label className="block text-sm font-medium mb-2">Function ID</label>
            <Input
              value={functionId}
              onChange={(e) => setFunctionId(e.target.value)}
              placeholder="e.g., chat-completion"
              className="text-sm"
            />
          </Card>

          {/* Privacy Controls */}
          <Card className="p-3 space-y-3">
            <h4 className="text-sm font-medium">Privacy Controls</h4>
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-sm">Record Inputs</span>
                <p className="text-xs text-muted-foreground">Log prompts</p>
              </div>
              <button
                onClick={() => setRecordInputs(!recordInputs)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  recordInputs ? 'bg-green-500' : 'bg-red-400'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  recordInputs ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-sm">Record Outputs</span>
                <p className="text-xs text-muted-foreground">Log responses</p>
              </div>
              <button
                onClick={() => setRecordOutputs(!recordOutputs)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  recordOutputs ? 'bg-green-500' : 'bg-red-400'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  recordOutputs ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </label>
          </Card>

          {/* Custom Metadata */}
          <Card className="p-3">
            <h4 className="text-sm font-medium mb-2">Custom Metadata</h4>
            <div className="space-y-2">
              {metadata.map((m, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Badge variant="secondary" className="flex-1 justify-between text-xs">
                    <span>{m.key}: {m.value}</span>
                    <button onClick={() => removeMetadata(i)} className="ml-2 hover:text-red-500">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                </div>
              ))}
              <div className="flex gap-2 mt-2">
                <Input
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="Key"
                  className="text-xs"
                />
                <Input
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="Value"
                  className="text-xs"
                />
                <Button size="sm" onClick={addMetadata} disabled={!newKey || !newValue}>
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Trace Viewer */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Trace Viewer</h3>
            <Button variant="outline" size="sm" onClick={copyCode}>
              {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
              {copied ? 'Copied!' : 'Copy Code'}
            </Button>
          </div>

          {/* Trace visualization */}
          <Card className="p-0 bg-zinc-950 overflow-hidden">
            <div className="px-3 py-2 border-b border-zinc-800 flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-400">Spans</span>
              {result?.duration && (
                <Badge variant="outline" className="text-xs">
                  Total: {result.duration}ms
                </Badge>
              )}
            </div>
            <div className="min-h-[200px] max-h-[300px] overflow-y-auto">
              {isRunning ? (
                <div className="flex items-center justify-center h-[200px]">
                  <Loader2 className="h-6 w-6 text-primary animate-spin" />
                </div>
              ) : result?.spans ? (
                <div className="p-2">
                  {result.spans.map(span => renderSpan(span))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-[200px] text-zinc-500 text-sm">
                  Run a request to see trace data
                </div>
              )}
            </div>
          </Card>

          {/* Response */}
          {result?.success && result.text && (
            <Card className="p-3 bg-green-500/10 border-green-500/20">
              <h4 className="text-xs font-medium text-green-500 mb-2">Response</h4>
              <p className="text-sm">{result.text}</p>
              {result.usage && (
                <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                  <span>Prompt: {result.usage.promptTokens} tokens</span>
                  <span>Completion: {result.usage.completionTokens} tokens</span>
                </div>
              )}
            </Card>
          )}

          {result?.error && (
            <Card className="p-3 bg-red-500/10 border-red-500/20">
              <p className="text-sm text-red-500">{result.error}</p>
            </Card>
          )}

          {/* Collected Spans Preview */}
          <Card className="p-3">
            <h4 className="text-sm font-medium mb-2">Attributes Collected</h4>
            <div className="flex flex-wrap gap-1">
              <Badge variant="outline" className="text-xs">ai.model.id</Badge>
              <Badge variant="outline" className="text-xs">ai.model.provider</Badge>
              {recordInputs && <Badge variant="outline" className="text-xs bg-green-500/10">ai.prompt</Badge>}
              {recordOutputs && <Badge variant="outline" className="text-xs bg-green-500/10">ai.response.text</Badge>}
              <Badge variant="outline" className="text-xs">ai.usage.tokens</Badge>
              <Badge variant="outline" className="text-xs">ai.finishReason</Badge>
              {functionId && <Badge variant="outline" className="text-xs bg-blue-500/10">ai.telemetry.functionId</Badge>}
              {metadata.map(m => (
                <Badge key={m.key} variant="outline" className="text-xs bg-purple-500/10">
                  ai.telemetry.metadata.{m.key}
                </Badge>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function TelemetryPage() {
  return <LearningPage content={content} demo={<TelemetryDemo />} codeExamples={codeExamples} />
}
