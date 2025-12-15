'use client'

import { LearningPage } from '@/components/educational'
import { getPageContent } from '@/lib/education-content'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TestTube, CheckCircle, Zap, Clock } from 'lucide-react'

const content = getPageContent('dev/testing')!

const codeExamples = [
  {
    title: 'MockLanguageModelV3',
    language: 'typescript',
    code: `import { MockLanguageModelV3 } from 'ai/test'

const mockModel = new MockLanguageModelV3({
  doGenerate: async () => ({
    text: 'Mocked response text',
    finishReason: 'stop',
    usage: {
      promptTokens: 10,
      completionTokens: 20,
    },
  }),
})

// Use in tests
const result = await generateText({
  model: mockModel,
  prompt: 'Test prompt',
})

expect(result.text).toBe('Mocked response text')`,
  },
  {
    title: 'Streaming Mock',
    language: 'typescript',
    code: `import { MockLanguageModelV3, simulateReadableStream } from 'ai/test'

const mockModel = new MockLanguageModelV3({
  doStream: async () => ({
    stream: simulateReadableStream({
      chunks: [
        { type: 'text-delta', textDelta: 'Hello' },
        { type: 'text-delta', textDelta: ' ' },
        { type: 'text-delta', textDelta: 'World' },
        { type: 'finish', finishReason: 'stop' },
      ],
      delayInMs: 50, // Simulate realistic delays
    }),
    rawCall: { rawPrompt: '', rawSettings: {} },
  }),
})`,
  },
  {
    title: 'Mock Helpers',
    language: 'typescript',
    code: `import { mockId, mockValues } from 'ai/test'

// Generate incrementing IDs
const id = mockId() // '0', '1', '2', ...

// Cycle through values
const value = mockValues('a', 'b', 'c')
value() // 'a'
value() // 'b'
value() // 'c'
value() // 'c' (stays on last)`,
  },
  {
    title: 'MockEmbeddingModelV3',
    language: 'typescript',
    code: `import { MockEmbeddingModelV3 } from 'ai/test'

const mockEmbedding = new MockEmbeddingModelV3({
  doEmbed: async ({ values }) => ({
    embeddings: values.map(() => [0.1, 0.2, 0.3]), // Mock vectors
    usage: { tokens: values.length * 5 },
  }),
})

// Use in tests
const { embeddings } = await embedMany({
  model: mockEmbedding,
  values: ['test1', 'test2'],
})`,
  },
  {
    title: 'Integration Test Example',
    language: 'typescript',
    code: `import { describe, it, expect } from 'vitest'
import { MockLanguageModelV3 } from 'ai/test'
import { generateText } from 'ai'

describe('AI Feature', () => {
  it('should handle tool calls', async () => {
    const mockModel = new MockLanguageModelV3({
      doGenerate: async () => ({
        text: '',
        toolCalls: [{
          name: 'weather',
          args: { location: 'Paris' },
        }],
        finishReason: 'tool-calls',
      }),
    })

    const result = await generateText({
      model: mockModel,
      tools: { weather: /* ... */ },
      prompt: 'What is the weather in Paris?',
    })

    expect(result.toolCalls).toHaveLength(1)
  })
})`,
  },
]

function TestingDemo() {
  const testUtilities = [
    { name: 'MockLanguageModelV3', desc: 'Mock language model responses' },
    { name: 'MockEmbeddingModelV3', desc: 'Mock embedding generation' },
    { name: 'simulateReadableStream', desc: 'Simulate streaming with delays' },
    { name: 'mockId', desc: 'Generate incrementing IDs' },
    { name: 'mockValues', desc: 'Cycle through test values' },
  ]

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-green-500/10 border-green-500/20">
        <div className="flex items-start gap-3">
          <TestTube className="h-5 w-5 text-green-500 mt-0.5" />
          <div>
            <h3 className="font-medium">Why Mock AI?</h3>
            <p className="text-sm text-muted-foreground mt-1">
              AI models are non-deterministic and expensive to call. Mocking allows you to write
              fast, reliable, and cost-free tests that verify your application logic.
            </p>
          </div>
        </div>
      </Card>

      <div>
        <h3 className="font-medium mb-3">Test Utilities</h3>
        <div className="space-y-2">
          {testUtilities.map((util) => (
            <Card key={util.name} className="p-3">
              <code className="text-primary">{util.name}</code>
              <p className="text-xs text-muted-foreground mt-1">{util.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Benefits</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="font-medium">Fast</span>
            </div>
            <p className="text-xs text-muted-foreground">No API latency, instant results</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="font-medium">Deterministic</span>
            </div>
            <p className="text-xs text-muted-foreground">Same input = same output, every time</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="font-medium">Free</span>
            </div>
            <p className="text-xs text-muted-foreground">No API costs during testing</p>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Import Path</h3>
        <Card className="p-4 bg-muted">
          <code className="text-sm">import &#123; MockLanguageModelV3, ... &#125; from 'ai/test'</code>
        </Card>
      </div>
    </div>
  )
}

export default function TestingPage() {
  return <LearningPage content={content} demo={<TestingDemo />} codeExamples={codeExamples} />
}
