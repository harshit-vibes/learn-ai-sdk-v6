'use client'

import { useCompletion } from '@ai-sdk/react'
import { LearningPage } from '@/components/educational'
import { getPageContent } from '@/lib/education-content'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Loader2 } from 'lucide-react'

const content = getPageContent('ui/completion')!

const codeExamples = [
  {
    title: 'Client Component',
    language: 'tsx',
    code: `'use client'

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
}`,
  },
  {
    title: 'API Route',
    language: 'typescript',
    code: `// app/api/completion/route.ts
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
}`,
  },
  {
    title: 'With Body',
    language: 'tsx',
    code: `// Send additional data with the request
const { completion, handleSubmit } = useCompletion({
  api: '/api/completion',
  body: {
    temperature: 0.7,
    maxTokens: 500,
  },
})`,
  },
  {
    title: 'With Headers',
    language: 'tsx',
    code: `const { completion, handleSubmit } = useCompletion({
  api: '/api/completion',
  headers: {
    'X-Custom-Header': 'custom-value',
  },
})`,
  },
]

function CompletionDemo() {
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
    <div className="flex flex-col h-full space-y-4">
      {/* Status */}
      <div className="flex items-center gap-2">
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
      <form onSubmit={handleSubmit} className="flex gap-2">
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
    </div>
  )
}

export default function UseCompletionPage() {
  return <LearningPage content={content} demo={<CompletionDemo />} codeExamples={codeExamples} />
}
