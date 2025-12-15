'use client'

import { useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { LearningPage } from '@/components/educational'
import { getPageContent } from '@/lib/education-content'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AlertCircle, RefreshCw, X } from 'lucide-react'

const content = getPageContent('advanced/errors')!

const codeExamples = [
  {
    title: 'Hook Error Handling',
    language: 'typescript',
    code: `const { messages, error, clearError } = useChat({
  transport: new DefaultChatTransport({ api: '/api/chat' }),
  onError: (err) => {
    console.error('Chat error:', err)
    // Show notification, log to service, etc.
  },
})

// Display error in UI
{error && (
  <div className="error-banner">
    <p>{error.message}</p>
    <button onClick={clearError}>Dismiss</button>
    <button onClick={retry}>Retry</button>
  </div>
)}`,
  },
  {
    title: 'Server-side Error Handling',
    language: 'typescript',
    code: `export async function POST(req: Request) {
  try {
    const result = streamText({
      model,
      messages,
      maxRetries: 3, // Auto-retry on failure
    })
    return result.toUIMessageStreamResponse()
  } catch (error) {
    if (error.code === 'rate_limit_exceeded') {
      return new Response('Rate limit exceeded', { status: 429 })
    }
    if (error.code === 'invalid_api_key') {
      return new Response('Invalid API key', { status: 401 })
    }
    return new Response('Server error', { status: 500 })
  }
}`,
  },
  {
    title: 'Retry with Backoff',
    language: 'typescript',
    code: `import { generateText } from 'ai'

// Built-in retry with exponential backoff
const result = await generateText({
  model,
  prompt: '...',
  maxRetries: 3, // Will retry up to 3 times
})

// Or disable retries
const result = await generateText({
  model,
  prompt: '...',
  maxRetries: 0, // No retries
})`,
  },
  {
    title: 'Timeout Handling',
    language: 'typescript',
    code: `// Set timeout using AbortSignal
const result = await generateText({
  model,
  prompt: '...',
  abortSignal: AbortSignal.timeout(30000), // 30 second timeout
})

// Or use a controller for manual abort
const controller = new AbortController()
setTimeout(() => controller.abort(), 30000)

const result = await generateText({
  model,
  prompt: '...',
  abortSignal: controller.signal,
})`,
  },
]

type ErrorType = 'none' | 'api' | 'rate-limit' | 'timeout'

function ErrorChat({ errorType }: { errorType: ErrorType }) {
  const [input, setInput] = useState('')
  const { messages, sendMessage, status, setMessages, error, clearError } = useChat({
    transport: new DefaultChatTransport({ api: `/api/errors?type=${errorType}` }),
    onError: (err) => console.error('Chat error:', err),
  })
  const isLoading = status === 'streaming' || status === 'submitted'

  return (
    <div className="space-y-4">
      {error && (
        <Card className="p-4 bg-destructive/10 border-destructive/20">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
              <div>
                <p className="font-medium text-destructive">Error occurred</p>
                <p className="text-sm text-muted-foreground">{error.message}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={clearError}>
                <X className="h-4 w-4" />
              </Button>
              <Button size="sm" onClick={() => { clearError(); if (input) sendMessage({ text: input }) }}>
                <RefreshCw className="h-4 w-4 mr-1" /> Retry
              </Button>
            </div>
          </div>
        </Card>
      )}

      <ScrollArea className="h-[150px] border rounded-lg p-4">
        {messages.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">Send a message to test error handling</p>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={`mb-2 ${m.role === 'user' ? 'text-right' : ''}`}>
              <Badge variant={m.role === 'user' ? 'default' : 'secondary'}>{m.role}</Badge>
              <p className="text-sm mt-1">{m.parts.map((p: any) => p.type === 'text' ? p.text : null)}</p>
            </div>
          ))
        )}
      </ScrollArea>

      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          disabled={isLoading}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage({ text: input })}
        />
        <Button onClick={() => { sendMessage({ text: input }); setInput('') }} disabled={isLoading || !input.trim()}>
          Send
        </Button>
      </div>
    </div>
  )
}

function ErrorsDemo() {
  const [errorType, setErrorType] = useState<ErrorType>('none')

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Simulate:</span>
        {(['none', 'api', 'rate-limit', 'timeout'] as ErrorType[]).map((type) => (
          <Badge
            key={type}
            variant={errorType === type ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setErrorType(type)}
          >
            {type === 'none' ? 'Normal' : type}
          </Badge>
        ))}
      </div>

      <ErrorChat key={errorType} errorType={errorType} />
    </div>
  )
}

export default function ErrorsPage() {
  return <LearningPage content={content} demo={<ErrorsDemo />} codeExamples={codeExamples} />
}
