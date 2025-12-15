'use client'

import { EducationalShell, InfoBar, CodeBlock, ApiReference, DemoCard } from '@/components/educational'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Waves, FileJson, ArrowRight, Scissors } from 'lucide-react'

const createStreamCode = `import { createUIMessageStream, createUIMessageStreamResponse } from 'ai'

// Create a custom UI message stream
const stream = createUIMessageStream({
  execute: async (writer) => {
    // Write text content
    writer.writeText('Hello, ')
    await delay(100)
    writer.writeText('world!')

    // Write tool call
    writer.writeToolCall({
      toolName: 'weather',
      toolCallId: 'call_123',
      args: { location: 'Paris' },
    })

    // Write tool result
    writer.writeToolResult({
      toolCallId: 'call_123',
      result: { temperature: 22 },
    })
  },
})

// Convert to Response
return createUIMessageStreamResponse({ stream })`

const readStreamCode = `import { readUIMessageStream } from 'ai'

// Read and process a UI message stream
const response = await fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({ messages }),
})

for await (const event of readUIMessageStream(response)) {
  switch (event.type) {
    case 'text':
      console.log('Text:', event.text)
      break
    case 'tool-call':
      console.log('Tool call:', event.toolName, event.args)
      break
    case 'tool-result':
      console.log('Tool result:', event.result)
      break
    case 'finish':
      console.log('Stream complete')
      break
  }
}`

const pruneMessagesCode = `import { pruneMessages } from 'ai'

// Prune messages to fit within token limit
const prunedMessages = pruneMessages(messages, {
  maxTokens: 4000,
  tokenizer: 'cl100k_base', // or custom tokenizer
  strategy: 'summarize', // or 'truncate'
})

// Use in API route
const result = streamText({
  model: gateway('anthropic/claude-sonnet-4'),
  messages: convertToModelMessages(prunedMessages),
})`

const pipeStreamCode = `import { pipeUIMessageStreamToResponse } from 'ai'

// For Node.js (non-edge) environments
export async function POST(req: Request, res: Response) {
  const stream = createUIMessageStream({
    execute: async (writer) => {
      // ... write to stream
    },
  })

  // Pipe directly to Node.js response
  pipeUIMessageStreamToResponse(stream, res)
}`

const utilities = [
  {
    name: 'createUIMessageStream',
    icon: Waves,
    description: 'Create a custom UI message stream with fine-grained control over what gets sent to the client.',
    use: 'Custom streaming scenarios, manual stream construction',
  },
  {
    name: 'createUIMessageStreamResponse',
    icon: FileJson,
    description: 'Convert a UI message stream into a Response object for API routes.',
    use: 'Edge runtime API routes, custom streaming responses',
  },
  {
    name: 'readUIMessageStream',
    icon: ArrowRight,
    description: 'Parse and iterate over a UI message stream on the client side.',
    use: 'Custom client implementations, stream processing',
  },
  {
    name: 'pruneMessages',
    icon: Scissors,
    description: 'Trim message history to fit within token limits while preserving context.',
    use: 'Long conversations, token limit management',
  },
]

const apiItems = [
  { name: 'createUIMessageStream', type: '(options) => ReadableStream', description: 'Creates a stream with execute callback for writing events' },
  { name: 'createUIMessageStreamResponse', type: '(options) => Response', description: 'Wraps a stream in a Response with correct headers' },
  { name: 'readUIMessageStream', type: '(response) => AsyncIterable', description: 'Reads and parses stream events from a Response' },
  { name: 'pruneMessages', type: '(messages, options) => UIMessage[]', description: 'Prunes messages to fit maxTokens limit' },
  { name: 'pipeUIMessageStreamToResponse', type: '(stream, res) => void', description: 'Pipes stream to Node.js response (non-edge)' },
]

export default function StreamUtilitiesPage() {
  return (
    <EducationalShell
      title="Stream Utilities"
      subtitle="Low-level utilities for custom stream management and message handling"
      category="AI SDK UI"
      docsUrl="https://v6.ai-sdk.dev/docs/ai-sdk-ui/streaming"
    >
      <InfoBar
        whatIs="Stream utilities provide low-level control over UI message streams. While useChat and useCompletion handle streaming automatically, these utilities let you build custom streaming experiences."
        whenToUse={[
          'Building custom streaming UI without useChat',
          'Processing streams outside React (vanilla JS, other frameworks)',
          'Managing token limits in long conversations',
          'Creating custom stream formats or transformations',
        ]}
        keyConcepts={[
          { term: 'UIMessageStream', definition: 'A ReadableStream containing structured UI events (text, tool calls, etc.)' },
          { term: 'writer', definition: 'Interface for writing events to the stream (writeText, writeToolCall, etc.)' },
          { term: 'pruning', definition: 'Removing old messages to fit within model token limits' },
          { term: 'streaming events', definition: 'text, tool-call, tool-result, finish, error' },
        ]}
        codeExample={`const stream = createUIMessageStream({
  execute: async (writer) => {
    writer.writeText('Hello!')
  }
})`}
      />

      <DemoCard
        code={
          <div className="space-y-4">
            <CodeBlock code={createStreamCode} title="Creating Streams" language="typescript" />
            <CodeBlock code={readStreamCode} title="Reading Streams" language="typescript" />
            <CodeBlock code={pruneMessagesCode} title="Pruning Messages" language="typescript" />
            <CodeBlock code={pipeStreamCode} title="Node.js Piping" language="typescript" />
          </div>
        }
      >
        {/* Utilities Overview */}
        <div className="space-y-4">
          <h3 className="font-medium">Available Utilities</h3>
          <div className="grid gap-3">
            {utilities.map((util) => (
              <Card key={util.name} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <util.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <code className="font-mono text-sm font-medium">{util.name}</code>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{util.description}</p>
                    <div className="mt-2">
                      <Badge variant="secondary" className="text-xs">{util.use}</Badge>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Stream Event Types */}
          <div className="mt-6">
            <h3 className="font-medium mb-3">Stream Event Types</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {['text', 'tool-call', 'tool-result', 'finish', 'error'].map((type) => (
                <div key={type} className="p-2 rounded-lg bg-muted text-center">
                  <code className="text-sm">{type}</code>
                </div>
              ))}
            </div>
          </div>

          {/* Note */}
          <Card className="p-4 bg-blue-500/10 border-blue-500/20">
            <p className="text-sm">
              <strong>Note:</strong> Most applications don't need these utilities directly.{' '}
              <code className="text-primary">useChat</code> and <code className="text-primary">useCompletion</code>{' '}
              handle streaming automatically. Use these when you need custom behavior.
            </p>
          </Card>
        </div>
      </DemoCard>

      <div className="mt-4">
        <ApiReference items={apiItems} />
      </div>
    </EducationalShell>
  )
}
