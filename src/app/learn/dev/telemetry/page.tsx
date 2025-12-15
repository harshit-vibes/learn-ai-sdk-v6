'use client'

import { useState } from 'react'
import { LearningPage } from '@/components/educational'
import { getPageContent } from '@/lib/education-content'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Activity, Copy, Check, Plus, X, RotateCcw } from 'lucide-react'

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

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-purple-500/10 border-purple-500/20">
        <div className="flex items-start gap-3">
          <Activity className="h-5 w-5 text-purple-500 mt-0.5" />
          <div>
            <h3 className="font-medium">Telemetry Config Builder</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Configure OpenTelemetry settings interactively. Toggle options and see the generated code update in real-time.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Configuration</h3>
            <Button variant="outline" size="sm" onClick={resetConfig}>
              <RotateCcw className="h-3 w-3 mr-1" />
              Reset
            </Button>
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
            <p className="text-xs text-muted-foreground mt-1">Identifies this function in traces</p>
          </Card>

          {/* Privacy Controls */}
          <Card className="p-3 space-y-3">
            <h4 className="text-sm font-medium">Privacy Controls</h4>
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-sm">Record Inputs</span>
                <p className="text-xs text-muted-foreground">Log prompts & messages</p>
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
                <p className="text-xs text-muted-foreground">Log AI responses</p>
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

        {/* Generated Code */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Generated Code</h3>
            <Button variant="outline" size="sm" onClick={copyCode}>
              {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
          <Card className="p-4 bg-zinc-950 text-zinc-100 overflow-x-auto">
            <pre className="text-xs font-mono whitespace-pre-wrap">{generateCode()}</pre>
          </Card>

          {/* Collected Spans Preview */}
          <Card className="p-3">
            <h4 className="text-sm font-medium mb-2">What Gets Collected</h4>
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
