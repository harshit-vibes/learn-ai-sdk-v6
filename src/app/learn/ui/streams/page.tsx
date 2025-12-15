'use client'

import { useState, useEffect, useRef } from 'react'
import { LearningPage } from '@/components/educational'
import { getPageContent } from '@/lib/education-content'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Play, Pause, RotateCcw, Zap } from 'lucide-react'

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

const scenarioEvents: Record<string, Omit<StreamEvent, 'id' | 'timestamp'>[]> = {
  simple: [
    { type: 'text', content: 'Hello' },
    { type: 'text', content: ', ' },
    { type: 'text', content: 'world' },
    { type: 'text', content: '!' },
    { type: 'finish', content: 'Stream complete' },
  ],
  tools: [
    { type: 'text', content: 'Let me check the weather...' },
    { type: 'tool-call', content: 'weather({ location: "Paris" })' },
    { type: 'tool-result', content: '{ temperature: 22, condition: "sunny" }' },
    { type: 'text', content: 'The weather in Paris is 22°C and sunny!' },
    { type: 'finish', content: 'Stream complete' },
  ],
  complex: [
    { type: 'text', content: 'Processing your request...' },
    { type: 'tool-call', content: 'searchDocs({ query: "AI SDK" })' },
    { type: 'tool-result', content: '[doc1, doc2, doc3]' },
    { type: 'text', content: 'Found 3 documents. ' },
    { type: 'tool-call', content: 'summarize({ docs: [...] })' },
    { type: 'tool-result', content: '{ summary: "AI SDK is..." }' },
    { type: 'text', content: 'Here is the summary: AI SDK provides...' },
    { type: 'finish', content: 'Stream complete' },
  ],
  error: [
    { type: 'text', content: 'Starting task...' },
    { type: 'tool-call', content: 'riskyOperation()' },
    { type: 'error', content: 'Operation timed out after 30s' },
  ],
}

function StreamUtilitiesDemo() {
  const [events, setEvents] = useState<StreamEvent[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [scenario, setScenario] = useState<keyof typeof scenarioEvents>('simple')
  const [accumulatedText, setAccumulatedText] = useState('')
  const eventIndexRef = useRef(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

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
    if (intervalRef.current) clearInterval(intervalRef.current)
    setEvents([])
    setAccumulatedText('')
    setIsPlaying(false)
    eventIndexRef.current = 0
  }

  const play = () => {
    if (eventIndexRef.current >= scenarioEvents[scenario].length) {
      reset()
    }
    setIsPlaying(true)
  }

  const pause = () => {
    setIsPlaying(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  useEffect(() => {
    if (!isPlaying) return

    intervalRef.current = setInterval(() => {
      const scenarioList = scenarioEvents[scenario]
      if (eventIndexRef.current >= scenarioList.length) {
        setIsPlaying(false)
        if (intervalRef.current) clearInterval(intervalRef.current)
        return
      }

      const eventData = scenarioList[eventIndexRef.current]
      const newEvent: StreamEvent = {
        id: eventIndexRef.current,
        ...eventData,
        timestamp: Date.now(),
      }

      setEvents(prev => [...prev, newEvent])

      if (eventData.type === 'text') {
        setAccumulatedText(prev => prev + eventData.content)
      }

      eventIndexRef.current++
    }, 600)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPlaying, scenario])

  const changeScenario = (newScenario: keyof typeof scenarioEvents) => {
    reset()
    setScenario(newScenario)
  }

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-blue-500/10 border-blue-500/20">
        <div className="flex items-start gap-3">
          <Zap className="h-5 w-5 text-blue-500 mt-0.5" />
          <div>
            <h3 className="font-medium">Stream Event Visualizer</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Watch how stream events flow in real-time. Select a scenario and press play to see different event types.
            </p>
          </div>
        </div>
      </Card>

      {/* Controls */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex gap-2">
          <Button
            variant={isPlaying ? "secondary" : "default"}
            size="sm"
            onClick={isPlaying ? pause : play}
          >
            {isPlaying ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
          <Button variant="outline" size="sm" onClick={reset}>
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
        </div>
        <div className="h-6 w-px bg-border mx-2" />
        <div className="flex gap-1">
          {(Object.keys(scenarioEvents) as (keyof typeof scenarioEvents)[]).map(s => (
            <Button
              key={s}
              variant={scenario === s ? "default" : "outline"}
              size="sm"
              onClick={() => changeScenario(s)}
              className="capitalize"
            >
              {s}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Event Stream */}
        <div className="space-y-3">
          <h3 className="font-medium">Event Stream</h3>
          <Card className="p-4 bg-zinc-950 h-[300px] overflow-y-auto">
            {events.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Press Play to start streaming events
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
                        +{((event.timestamp - (events[0]?.timestamp || event.timestamp)) / 1000).toFixed(1)}s
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
                Text events will appear here as they stream
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
