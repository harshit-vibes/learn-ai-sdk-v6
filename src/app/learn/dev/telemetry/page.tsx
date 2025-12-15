'use client'

import { LearningPage } from '@/components/educational'
import { getPageContent } from '@/lib/education-content'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Activity, Eye, EyeOff, BarChart3, Clock } from 'lucide-react'

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
  const spanTypes = [
    { name: 'ai.generateText', desc: 'Text generation operations' },
    { name: 'ai.streamText', desc: 'Streaming text operations' },
    { name: 'ai.generateObject', desc: 'Object generation' },
    { name: 'ai.streamObject', desc: 'Streaming object generation' },
    { name: 'ai.embed', desc: 'Single embedding' },
    { name: 'ai.embedMany', desc: 'Batch embeddings' },
  ]

  const attributes = [
    'ai.model.id', 'ai.model.provider', 'ai.prompt',
    'ai.response.text', 'ai.usage.promptTokens', 'ai.usage.completionTokens',
    'ai.settings.temperature', 'ai.toolCalls', 'ai.finishReason',
  ]

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-purple-500/10 border-purple-500/20">
        <div className="flex items-start gap-3">
          <Activity className="h-5 w-5 text-purple-500 mt-0.5" />
          <div>
            <h3 className="font-medium">OpenTelemetry Integration</h3>
            <p className="text-sm text-muted-foreground mt-1">
              AI SDK uses OpenTelemetry to collect observability data. Track token usage,
              latency, errors, and custom metadata. Export to any OpenTelemetry-compatible backend.
            </p>
          </div>
        </div>
      </Card>

      <div>
        <h3 className="font-medium mb-3">Span Types</h3>
        <div className="grid md:grid-cols-2 gap-2">
          {spanTypes.map((span) => (
            <Card key={span.name} className="p-2">
              <code className="text-xs text-primary">{span.name}</code>
              <p className="text-xs text-muted-foreground">{span.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Collected Attributes</h3>
        <div className="flex flex-wrap gap-1">
          {attributes.map((attr) => (
            <Badge key={attr} variant="secondary" className="text-xs font-mono">
              {attr}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Privacy Controls</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="h-4 w-4 text-green-500" />
              <code>recordInputs: true</code>
            </div>
            <p className="text-xs text-muted-foreground">
              Record prompts and messages in spans (default)
            </p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <EyeOff className="h-4 w-4 text-red-500" />
              <code>recordInputs: false</code>
            </div>
            <p className="text-xs text-muted-foreground">
              Don't record inputs (for sensitive data)
            </p>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Common Use Cases</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-3">
            <BarChart3 className="h-4 w-4 text-muted-foreground mb-2" />
            <span className="font-medium text-sm">Cost Tracking</span>
            <p className="text-xs text-muted-foreground mt-1">Monitor token usage</p>
          </Card>
          <Card className="p-3">
            <Clock className="h-4 w-4 text-muted-foreground mb-2" />
            <span className="font-medium text-sm">Performance</span>
            <p className="text-xs text-muted-foreground mt-1">Track latency</p>
          </Card>
          <Card className="p-3">
            <Activity className="h-4 w-4 text-muted-foreground mb-2" />
            <span className="font-medium text-sm">Debugging</span>
            <p className="text-xs text-muted-foreground mt-1">Trace requests</p>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function TelemetryPage() {
  return <LearningPage content={content} demo={<TelemetryDemo />} codeExamples={codeExamples} />
}
