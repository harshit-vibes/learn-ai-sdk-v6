'use client'

import { useState } from 'react'
import { LearningPage } from '@/components/educational'
import { getPageContent } from '@/lib/education-content'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { TestTube, Play, Copy, Check, RotateCcw } from 'lucide-react'

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
  const [mockText, setMockText] = useState('Hello! This is a mocked response from the AI.')
  const [promptTokens, setPromptTokens] = useState('10')
  const [completionTokens, setCompletionTokens] = useState('25')
  const [finishReason, setFinishReason] = useState<'stop' | 'length' | 'tool-calls'>('stop')
  const [testPrompt, setTestPrompt] = useState('Write a haiku')
  const [testResult, setTestResult] = useState<{
    text: string
    usage: { promptTokens: number; completionTokens: number }
    finishReason: string
  } | null>(null)
  const [copied, setCopied] = useState(false)

  const generatedCode = `import { MockLanguageModelV3 } from 'ai/test'
import { generateText } from 'ai'

const mockModel = new MockLanguageModelV3({
  doGenerate: async () => ({
    text: ${JSON.stringify(mockText)},
    finishReason: '${finishReason}',
    usage: {
      promptTokens: ${promptTokens},
      completionTokens: ${completionTokens},
    },
  }),
})

// Use in your test
const result = await generateText({
  model: mockModel,
  prompt: ${JSON.stringify(testPrompt)},
})

// Assertions
expect(result.text).toBe(${JSON.stringify(mockText)})
expect(result.finishReason).toBe('${finishReason}')`

  function simulateTest() {
    // Simulate running the test with the mock
    setTestResult({
      text: mockText,
      usage: {
        promptTokens: parseInt(promptTokens) || 10,
        completionTokens: parseInt(completionTokens) || 20,
      },
      finishReason,
    })
  }

  function copyCode() {
    navigator.clipboard.writeText(generatedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function reset() {
    setTestResult(null)
    setMockText('Hello! This is a mocked response from the AI.')
    setPromptTokens('10')
    setCompletionTokens('25')
    setFinishReason('stop')
    setTestPrompt('Write a haiku')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Badge variant="outline">Mock Model Builder</Badge>
        <Button variant="ghost" size="sm" onClick={reset}>
          <RotateCcw className="h-4 w-4 mr-1" />
          Reset
        </Button>
      </div>

      {/* Mock Configuration */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Mock Response Text</label>
            <Textarea
              value={mockText}
              onChange={(e) => setMockText(e.target.value)}
              placeholder="Enter the text the mock should return..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Prompt Tokens</label>
              <Input
                type="number"
                value={promptTokens}
                onChange={(e) => setPromptTokens(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Completion Tokens</label>
              <Input
                type="number"
                value={completionTokens}
                onChange={(e) => setCompletionTokens(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Finish Reason</label>
            <div className="flex gap-2">
              {(['stop', 'length', 'tool-calls'] as const).map((reason) => (
                <Badge
                  key={reason}
                  variant={finishReason === reason ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setFinishReason(reason)}
                >
                  {reason}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Test Prompt</label>
            <Input
              value={testPrompt}
              onChange={(e) => setTestPrompt(e.target.value)}
              placeholder="The prompt you'd use in your test..."
            />
          </div>

          <Button onClick={simulateTest} className="w-full">
            <Play className="h-4 w-4 mr-2" />
            Run Mock Test
          </Button>
        </div>

        {/* Generated Code */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Generated Test Code</label>
            <Button variant="ghost" size="sm" onClick={copyCode}>
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <pre className="bg-muted p-3 rounded-lg text-xs overflow-auto max-h-[300px]">
            <code>{generatedCode}</code>
          </pre>
        </div>
      </div>

      {/* Test Result */}
      {testResult && (
        <Card className="p-4 bg-green-500/10 border-green-500/20">
          <div className="flex items-center gap-2 mb-3">
            <TestTube className="h-5 w-5 text-green-500" />
            <span className="font-medium text-green-500">Test Passed!</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="p-2 bg-background rounded">
              <code className="text-xs text-muted-foreground">result.text:</code>
              <p className="mt-1">{testResult.text}</p>
            </div>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span>promptTokens: {testResult.usage.promptTokens}</span>
              <span>completionTokens: {testResult.usage.completionTokens}</span>
              <span>finishReason: {testResult.finishReason}</span>
            </div>
          </div>
        </Card>
      )}

      {!testResult && (
        <Card className="p-6 text-center text-muted-foreground">
          <TestTube className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="font-medium">Configure your mock and run the test</p>
          <p className="text-sm">See how deterministic responses work in testing</p>
        </Card>
      )}
    </div>
  )
}

export default function TestingPage() {
  return <LearningPage content={content} demo={<TestingDemo />} codeExamples={codeExamples} />
}
