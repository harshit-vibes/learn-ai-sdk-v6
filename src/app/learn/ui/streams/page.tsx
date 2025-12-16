'use client'

import { useState, useRef } from 'react'
import { LearningPage } from '@/components/educational'
import { getPageContent } from '@/lib/education-content'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Play, RotateCcw, Zap, Loader2 } from 'lucide-react'

const content = getPageContent('ui/streams')!

const codeExamples = [
  {
    title: 'Create Stream',
    language: 'typescript',
    code: `import { createUIMessageStream, createUIMessageStreamResponse } from 'ai'

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

return createUIMessageStreamResponse({ stream })`,
  },
  {
    title: 'Read Stream',
    language: 'typescript',
    code: `import { readUIMessageStream } from 'ai'

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
}`,
  },
  {
    title: 'Prune Messages',
    language: 'typescript',
    code: `import { pruneMessages } from 'ai'

const prunedMessages = pruneMessages(messages, {
  maxTokens: 4000,
  tokenizer: 'cl100k_base',
  strategy: 'summarize',
})

const result = streamText({
  model: gateway('anthropic/claude-sonnet-4'),
  messages: convertToModelMessages(prunedMessages),
})`,
  },
  {
    title: 'Node.js Pipe',
    language: 'typescript',
    code: `import { pipeUIMessageStreamToResponse } from 'ai'

export async function POST(req: Request, res: Response) {
  const stream = createUIMessageStream({
    execute: async (writer) => {
      // ... write to stream
    },
  })

  // Pipe directly to Node.js response
  pipeUIMessageStreamToResponse(stream, res)
}`,
  },
]

interface StreamEvent {
  id: number
  type: 'text' | 'tool-call' | 'tool-result' | 'finish' | 'error'
  content: string
  timestamp: number
}

type Scenario = 'simple' | 'tools' | 'complex' | 'error'

const scenarioDescriptions: Record<Scenario, string> = {
  simple: 'Simple text streaming from LLM',
  tools: 'Tool calling with weather lookup',
  complex: 'Multi-step with search & summarize',
  error: 'Error handling demonstration',
}

function StreamUtilitiesDemo() {
  const [events, setEvents] = useState<StreamEvent[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [scenario, setScenario] = useState<Scenario>('simple')
  const [accumulatedText, setAccumulatedText] = useState('')
  const eventIdRef = useRef(0)

  const getEventColor = (type: StreamEvent['type']) => {
    switch (type) {
      case 'text': return 'bg-blue-500/20 border-blue-500/40 text-blue-400'
      case 'tool-call': return 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400'
      case 'tool-result': return 'bg-green-500/20 border-green-500/40 text-green-400'
      case 'finish': return 'bg-purple-500/20 border-purple-500/40 text-purple-400'
      case 'error': return 'bg-red-500/20 border-red-500/40 text-red-400'
    }
  }

  const reset = () => {
    setEvents([])
    setAccumulatedText('')
    setIsStreaming(false)
    eventIdRef.current = 0
  }

  const addEvent = (type: StreamEvent['type'], content: string) => {
    setEvents(prev => [...prev, {
      id: eventIdRef.current++,
      type,
      content,
      timestamp: Date.now(),
    }])
  }

  const runStream = async () => {
    reset()
    setIsStreaming(true)

    try {
      const response = await fetch('/api/learn/streams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario }),
      })

      if (!response.ok) {
        throw new Error('Stream request failed')
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No reader available')

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.trim() || !line.startsWith('0:')) continue

          try {
            // Parse the data stream format
            const jsonStr = line.slice(2) // Remove '0:' prefix
            const data = JSON.parse(jsonStr)

            if (typeof data === 'string') {
              // Text delta
              setAccumulatedText(prev => prev + data)
              addEvent('text', data)
            } else if (data && typeof data === 'object') {
              if (data.toolCallId && data.toolName) {
                // Tool call
                addEvent('tool-call', `${data.toolName}(${JSON.stringify(data.args)})`)
              } else if (data.toolCallId && data.result) {
                // Tool result
                addEvent('tool-result', JSON.stringify(data.result))
              }
            }
          } catch {
            // Handle other stream formats
            if (line.includes('e:')) {
              // Finish event
              addEvent('finish', 'Stream complete')
            }
          }
        }
      }

      // Add finish event if not already added
      if (events.length === 0 || events[events.length - 1]?.type !== 'finish') {
        addEvent('finish', 'Stream complete')
      }
    } catch (error) {
      addEvent('error', error instanceof Error ? error.message : 'Stream failed')
    } finally {
      setIsStreaming(false)
    }
  }

  const changeScenario = (newScenario: Scenario) => {
    reset()
    setScenario(newScenario)
  }

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-blue-500/10 border-blue-500/20">
        <div className="flex items-start gap-3">
          <Zap className="h-5 w-5 text-blue-500 mt-0.5" />
          <div>
            <h3 className="font-medium">Live Stream Event Visualizer</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Watch real stream events from the AI SDK. Select a scenario and click Play to see actual streaming data.
            </p>
          </div>
        </div>
      </Card>

      {/* Controls */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={runStream}
              disabled={isStreaming}
            >
              {isStreaming ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  Streaming...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-1" />
                  Run Stream
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={reset} disabled={isStreaming}>
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
          </div>
          <div className="h-6 w-px bg-border mx-2" />
          <div className="flex gap-1 flex-wrap">
            {(Object.keys(scenarioDescriptions) as Scenario[]).map(s => (
              <Button
                key={s}
                variant={scenario === s ? "default" : "outline"}
                size="sm"
                onClick={() => changeScenario(s)}
                className="capitalize"
                disabled={isStreaming}
              >
                {s}
              </Button>
            ))}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">{scenarioDescriptions[scenario]}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Event Stream */}
        <div className="space-y-3">
          <h3 className="font-medium">Event Stream</h3>
          <Card className="p-4 bg-zinc-950 h-[300px] overflow-y-auto">
            {events.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                {isStreaming ? 'Waiting for events...' : 'Click "Run Stream" to start'}
              </p>
            ) : (
              <div className="space-y-2">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className={`p-2 rounded border text-sm font-mono ${getEventColor(event.type)}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs uppercase">
                        {event.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        +{((event.timestamp - (events[0]?.timestamp || event.timestamp)) / 1000).toFixed(2)}s
                      </span>
                    </div>
                    <code className="text-xs break-all">{event.content}</code>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Accumulated Output */}
        <div className="space-y-3">
          <h3 className="font-medium">Accumulated Text</h3>
          <Card className="p-4 h-[300px] overflow-y-auto">
            {accumulatedText ? (
              <p className="text-sm whitespace-pre-wrap">{accumulatedText}</p>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                {isStreaming ? 'Receiving text...' : 'Text will appear here as it streams'}
              </p>
            )}
          </Card>

          {/* Event Type Legend */}
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/40">text</Badge>
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/40">tool-call</Badge>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/40">tool-result</Badge>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/40">finish</Badge>
            <Badge className="bg-red-500/20 text-red-400 border-red-500/40">error</Badge>
          </div>
        </div>
      </div>

      {/* Utilities Reference */}
      <Card className="p-4">
        <h3 className="font-medium mb-3">Stream Utilities</h3>
        <div className="grid md:grid-cols-2 gap-3">
          <div className="p-3 rounded bg-muted/50">
            <code className="text-sm text-primary">createUIMessageStream</code>
            <p className="text-xs text-muted-foreground mt-1">Create custom UI streams with writer API</p>
          </div>
          <div className="p-3 rounded bg-muted/50">
            <code className="text-sm text-primary">readUIMessageStream</code>
            <p className="text-xs text-muted-foreground mt-1">Parse stream events on the client</p>
          </div>
          <div className="p-3 rounded bg-muted/50">
            <code className="text-sm text-primary">pruneMessages</code>
            <p className="text-xs text-muted-foreground mt-1">Trim messages to fit token limits</p>
          </div>
          <div className="p-3 rounded bg-muted/50">
            <code className="text-sm text-primary">createUIMessageStreamResponse</code>
            <p className="text-xs text-muted-foreground mt-1">Convert stream to HTTP Response</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default function StreamUtilitiesPage() {
  return <LearningPage content={content} demo={<StreamUtilitiesDemo />} codeExamples={codeExamples} />
}
