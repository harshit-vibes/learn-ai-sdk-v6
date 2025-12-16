'use client'

import { useState } from 'react'
import { LearningPage } from '@/components/educational'
import { getPageContent } from '@/lib/education-content'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Layers, Shield, Database, FileText, Zap, Play, RotateCcw, ArrowRight, Check, Loader2 } from 'lucide-react'

const content = getPageContent('advanced/middleware')!

const codeExamples = [
  {
    title: 'Basic Middleware',
    language: 'typescript',
    code: `import { wrapLanguageModel, LanguageModelMiddleware } from 'ai'

const loggingMiddleware: LanguageModelMiddleware = {
  // Called before generation
  transformParams: async ({ params }) => {
    console.log('Request:', params.prompt)
    return params
  },

  // Wrap non-streaming calls
  wrapGenerate: async ({ doGenerate }) => {
    const start = Date.now()
    const result = await doGenerate()
    console.log('Duration:', Date.now() - start, 'ms')
    return result
  },
}

const wrappedModel = wrapLanguageModel({
  model: originalModel,
  middleware: loggingMiddleware,
})`,
  },
  {
    title: 'Caching Middleware',
    language: 'typescript',
    code: `const cachingMiddleware: LanguageModelMiddleware = {
  wrapGenerate: async ({ doGenerate, params }) => {
    const cacheKey = hash(params)

    // Check cache
    const cached = await cache.get(cacheKey)
    if (cached) return cached

    // Generate and cache
    const result = await doGenerate()
    await cache.set(cacheKey, result)
    return result
  },
}`,
  },
  {
    title: 'RAG Middleware',
    language: 'typescript',
    code: `const ragMiddleware: LanguageModelMiddleware = {
  transformParams: async ({ params }) => {
    // Get relevant documents
    const docs = await vectorSearch(params.prompt)

    // Inject context into system prompt
    return {
      ...params,
      system: \`Context:\\n\${docs.join('\\n')}\\n\\n\${params.system || ''}\`,
    }
  },
}`,
  },
  {
    title: 'Guardrails Middleware',
    language: 'typescript',
    code: `const guardrailsMiddleware: LanguageModelMiddleware = {
  // Check input before sending
  transformParams: async ({ params }) => {
    if (containsToxicContent(params.prompt)) {
      throw new Error('Content policy violation')
    }
    return params
  },

  // Check output after receiving
  wrapGenerate: async ({ doGenerate }) => {
    const result = await doGenerate()
    if (containsToxicContent(result.text)) {
      return { ...result, text: '[Content filtered]' }
    }
    return result
  },
}`,
  },
  {
    title: 'Chaining Middleware',
    language: 'typescript',
    code: `// Multiple middleware are applied in order
const wrappedModel = wrapLanguageModel({
  model,
  middleware: [
    loggingMiddleware,
    cachingMiddleware,
    guardrailsMiddleware,
  ],
})

// Execution order: logging -> caching -> guardrails -> model`,
  },
]

interface MiddlewareStep {
  id: string
  name: string
  icon: typeof FileText
  color: string
  enabled: boolean
  action: string
}

interface LogEntry {
  timestamp: number
  middleware: string
  phase: 'request' | 'response'
  message: string
  data?: unknown
}

function MiddlewareDemo() {
  const [middlewares, setMiddlewares] = useState<MiddlewareStep[]>([
    { id: 'logging', name: 'Logging', icon: FileText, color: 'blue', enabled: true, action: 'Log request to console' },
    { id: 'caching', name: 'Caching', icon: Database, color: 'green', enabled: true, action: 'Check cache for response' },
    { id: 'rag', name: 'RAG', icon: Zap, color: 'yellow', enabled: false, action: 'Inject context documents' },
    { id: 'guardrails', name: 'Guardrails', icon: Shield, color: 'red', enabled: true, action: 'Validate input content' },
  ])
  const [isRunning, setIsRunning] = useState(false)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [result, setResult] = useState<{ text?: string; error?: string; totalTime?: number } | null>(null)
  const [prompt, setPrompt] = useState('What is the AI SDK in one sentence?')

  const enabledMiddlewares = middlewares.filter(m => m.enabled)

  const toggleMiddleware = (id: string) => {
    setMiddlewares(prev => prev.map(m =>
      m.id === id ? { ...m, enabled: !m.enabled } : m
    ))
  }

  const reset = () => {
    setIsRunning(false)
    setLogs([])
    setResult(null)
  }

  const runMiddlewareChain = async () => {
    reset()
    setIsRunning(true)

    try {
      const response = await fetch('/api/learn/middleware', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          middlewares: {
            logging: middlewares.find(m => m.id === 'logging')?.enabled ?? false,
            caching: middlewares.find(m => m.id === 'caching')?.enabled ?? false,
            rag: middlewares.find(m => m.id === 'rag')?.enabled ?? false,
            guardrails: middlewares.find(m => m.id === 'guardrails')?.enabled ?? false,
          },
          prompt,
        }),
      })

      const data = await response.json()
      setLogs(data.logs || [])
      setResult({
        text: data.text,
        error: data.error,
        totalTime: data.totalTime,
      })
    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : 'Request failed' })
    } finally {
      setIsRunning(false)
    }
  }

  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-500/20 border-blue-500/40 text-blue-500',
      green: 'bg-green-500/20 border-green-500/40 text-green-500',
      yellow: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-500',
      red: 'bg-red-500/20 border-red-500/40 text-red-500',
    }
    return colors[color] || colors.blue
  }

  const getLogColor = (middleware: string) => {
    const mw = middlewares.find(m => m.name === middleware)
    if (!mw) return 'text-zinc-400'
    const colors: Record<string, string> = {
      blue: 'text-blue-400',
      green: 'text-green-400',
      yellow: 'text-yellow-400',
      red: 'text-red-400',
    }
    return colors[mw.color] || 'text-zinc-400'
  }

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-purple-500/10 border-purple-500/20">
        <div className="flex items-start gap-3">
          <Layers className="h-5 w-5 text-purple-500 mt-0.5" />
          <div>
            <h3 className="font-medium">Live Middleware Execution</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Toggle middleware layers and run a real API call to see the middleware chain execute.
              Watch the logs update in real-time as each middleware processes the request.
            </p>
          </div>
        </div>
      </Card>

      {/* Prompt Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Test Prompt</label>
        <div className="flex gap-2">
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a prompt to test..."
            className="flex-1"
            disabled={isRunning}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Try: &quot;What is AI?&quot; or test guardrails with words like &quot;hack&quot;
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Middleware Configuration */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Middleware Layers</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={reset} disabled={isRunning}>
                <RotateCcw className="h-3 w-3 mr-1" />
                Reset
              </Button>
              <Button size="sm" onClick={runMiddlewareChain} disabled={isRunning || !prompt.trim()}>
                {isRunning ? (
                  <>
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="h-3 w-3 mr-1" />
                    Run
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            {middlewares.map((mw) => {
              const Icon = mw.icon
              return (
                <Card
                  key={mw.id}
                  className={`p-3 cursor-pointer transition-all ${
                    !mw.enabled ? 'opacity-50' : ''
                  }`}
                  onClick={() => !isRunning && toggleMiddleware(mw.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded border ${getColorClass(mw.color)}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{mw.name}</div>
                        <div className="text-xs text-muted-foreground">{mw.action}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${mw.enabled ? 'bg-green-500' : 'bg-gray-400'}`} />
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

          {/* Visual Chain */}
          <Card className="p-4">
            <div className="flex items-center justify-center gap-1 flex-wrap">
              <Badge variant="outline">Request</Badge>
              {enabledMiddlewares.map((mw) => (
                <div key={mw.id} className="flex items-center gap-1">
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  <Badge className={`${getColorClass(mw.color)} border`}>{mw.name}</Badge>
                </div>
              ))}
              <ArrowRight className="h-3 w-3 text-muted-foreground" />
              <Badge>Model</Badge>
            </div>
          </Card>
        </div>

        {/* Execution Log */}
        <div className="space-y-4">
          <h3 className="font-medium">Execution Log</h3>
          <Card className="p-4 bg-zinc-950 h-[350px] overflow-y-auto font-mono">
            {logs.length === 0 && !isRunning ? (
              <p className="text-sm text-zinc-500">Click &quot;Run&quot; to execute the middleware chain</p>
            ) : isRunning && logs.length === 0 ? (
              <div className="flex items-center gap-2 text-zinc-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Executing...</span>
              </div>
            ) : (
              <div className="space-y-1">
                {logs.map((log, i) => (
                  <div key={i} className="text-xs">
                    <span className="text-zinc-500">{String(log.timestamp).padStart(4, ' ')}ms</span>
                    {' '}
                    <span className={getLogColor(log.middleware)}>[{log.middleware}]</span>
                    {' '}
                    <span className="text-zinc-400">{log.phase === 'request' ? '→' : '←'}</span>
                    {' '}
                    <span className="text-zinc-300">{log.message}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Result */}
          {result && (
            <Card className={`p-4 ${result.error ? 'bg-red-500/10 border-red-500/20' : 'bg-green-500/10 border-green-500/20'}`}>
              {result.error ? (
                <div>
                  <div className="flex items-center gap-2 text-red-500 font-medium mb-2">
                    <Shield className="h-4 w-4" />
                    Error
                  </div>
                  <p className="text-sm text-red-400">{result.error}</p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-green-500 font-medium">
                      <Check className="h-4 w-4" />
                      Success
                    </div>
                    {result.totalTime && (
                      <Badge variant="outline" className="text-xs">
                        {result.totalTime}ms total
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm">{result.text}</p>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>

      {/* Built-in Middleware */}
      <div>
        <h3 className="font-medium mb-3">Built-in Middleware</h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">extractReasoningMiddleware</Badge>
          <Badge variant="secondary">simulateStreamingMiddleware</Badge>
          <Badge variant="secondary">defaultSettingsMiddleware</Badge>
          <Badge variant="secondary">addToolInputExamplesMiddleware</Badge>
        </div>
      </div>
    </div>
  )
}

export default function MiddlewarePage() {
  return <LearningPage content={content} demo={<MiddlewareDemo />} codeExamples={codeExamples} />
}
