'use client'

import { useCompletion } from '@ai-sdk/react'
import { EducationalShell, InfoBar, CodeBlock, ApiReference, DemoCard } from '@/components/educational'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Loader2 } from 'lucide-react'

const clientCode = `'use client'

import { useCompletion } from '@ai-sdk/react'

export function CompletionDemo() {
  const {
    completion,
    input,
    setInput,
    handleSubmit,
    isLoading,
    stop,
    setCompletion,
  } = useCompletion({
    api: '/api/completion',
  })

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter a prompt..."
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Generating...' : 'Generate'}
      </button>
      <div>{completion}</div>
    </form>
  )
}`

const serverCode = `// app/api/completion/route.ts
import { streamText } from 'ai'
import { createGateway } from 'ai'

const gateway = createGateway({
  apiKey: process.env.AI_GATEWAY_API_KEY ?? '',
})

export async function POST(req: Request) {
  const { prompt } = await req.json()

  const result = streamText({
    model: gateway('anthropic/claude-sonnet-4'),
    prompt,
  })

  return result.toTextStreamResponse()
}`

const apiItems = [
  { name: 'completion', type: 'string', description: 'The current completion text, updated as it streams' },
  { name: 'input', type: 'string', description: 'The current input value' },
  { name: 'setInput', type: '(input) => void', description: 'Update the input value' },
  { name: 'handleSubmit', type: '(e) => void', description: 'Form submit handler that triggers completion' },
  { name: 'isLoading', type: 'boolean', description: 'Whether a completion is currently streaming' },
  { name: 'stop', type: '() => void', description: 'Stop the current streaming response' },
  { name: 'setCompletion', type: '(text) => void', description: 'Manually set the completion text' },
  { name: 'error', type: 'Error | undefined', description: 'Error object if an error occurred' },
  { name: 'api', type: 'string', required: true, description: 'The API endpoint for completions' },
]

export default function UseCompletionPage() {
  const {
    completion,
    input,
    setInput,
    handleSubmit,
    isLoading,
    stop,
    setCompletion,
  } = useCompletion({
    api: '/api/completion',
  })

  return (
    <EducationalShell
      title="useCompletion"
      subtitle="Single-prompt text completion with streaming support"
      category="AI SDK UI"
      docsUrl="https://v6.ai-sdk.dev/docs/ai-sdk-ui/completion"
    >
      <InfoBar
        whatIs="useCompletion is a React hook for single-prompt text generation. Unlike useChat which maintains conversation history, useCompletion is stateless - each request is independent."
        whenToUse={[
          'Text completion tasks (story continuation, code completion)',
          'Single-shot generation without conversation context',
          'Form-based generation interfaces',
          'When you need simple prompt → response flow',
        ]}
        keyConcepts={[
          { term: 'completion', definition: 'The generated text, updated in real-time as it streams' },
          { term: 'handleSubmit', definition: 'Form handler that sends the input to the API' },
          { term: 'prompt', definition: 'Server receives { prompt } instead of messages array' },
          { term: 'toTextStreamResponse', definition: 'Server returns plain text stream, not UI messages' },
        ]}
        codeExample={`const { completion, input, handleSubmit } = useCompletion({
  api: '/api/completion'
})

// In form: onSubmit={handleSubmit}`}
      />

      <DemoCard
        code={
          <div className="space-y-4">
            <CodeBlock code={clientCode} title="Client Component" language="tsx" />
            <CodeBlock code={serverCode} title="API Route" language="typescript" />
          </div>
        }
      >
        {/* Status */}
        <div className="flex items-center gap-2 mb-4">
          <Badge variant={isLoading ? 'default' : 'secondary'}>
            {isLoading ? 'Streaming' : 'Ready'}
          </Badge>
          {isLoading && (
            <Button variant="outline" size="sm" onClick={stop}>
              Stop
            </Button>
          )}
          {completion && (
            <Button variant="outline" size="sm" onClick={() => setCompletion('')}>
              Clear
            </Button>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Write a haiku about programming..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating
              </>
            ) : (
              'Generate'
            )}
          </Button>
        </form>

        {/* Output */}
        <ScrollArea className="flex-1 border rounded-lg p-4 bg-muted/30">
          {completion ? (
            <div className="whitespace-pre-wrap">{completion}</div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              Enter a prompt to generate text
            </p>
          )}
        </ScrollArea>
      </DemoCard>

      <div className="mt-4">
        <ApiReference items={apiItems} />
      </div>
    </EducationalShell>
  )
}
