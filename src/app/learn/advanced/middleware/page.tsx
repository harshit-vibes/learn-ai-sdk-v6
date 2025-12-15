'use client'

import { useState, useEffect } from 'react'
import { LearningPage } from '@/components/educational'
import { getPageContent } from '@/lib/education-content'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Layers, Shield, Database, FileText, Zap, Play, RotateCcw, ArrowRight, Check } from 'lucide-react'

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
  status: 'pending' | 'processing' | 'done'
}

function MiddlewareDemo() {
  const [middlewares, setMiddlewares] = useState<MiddlewareStep[]>([
    { id: 'logging', name: 'Logging', icon: FileText, color: 'blue', enabled: true, action: 'Log request to console', status: 'pending' },
    { id: 'caching', name: 'Caching', icon: Database, color: 'green', enabled: true, action: 'Check cache for response', status: 'pending' },
    { id: 'rag', name: 'RAG', icon: Zap, color: 'yellow', enabled: false, action: 'Inject context documents', status: 'pending' },
    { id: 'guardrails', name: 'Guardrails', icon: Shield, color: 'red', enabled: true, action: 'Validate input content', status: 'pending' },
  ])
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(-1)
  const [logs, setLogs] = useState<string[]>([])

  const enabledMiddlewares = middlewares.filter(m => m.enabled)

  const toggleMiddleware = (id: string) => {
    setMiddlewares(prev => prev.map(m =>
      m.id === id ? { ...m, enabled: !m.enabled } : m
    ))
  }

  const reset = () => {
    setIsRunning(false)
    setCurrentStep(-1)
    setLogs([])
    setMiddlewares(prev => prev.map(m => ({ ...m, status: 'pending' })))
  }

  const runSimulation = async () => {
    reset()
    setIsRunning(true)
    setLogs(['Starting middleware chain...'])

    const enabled = middlewares.filter(m => m.enabled)

    for (let i = 0; i < enabled.length; i++) {
      setCurrentStep(i)
      const mw = enabled[i]

      // Mark as processing
      setMiddlewares(prev => prev.map(m =>
        m.id === mw.id ? { ...m, status: 'processing' } : m
      ))

      setLogs(prev => [...prev, `[${mw.name}] ${mw.action}...`])
      await new Promise(resolve => setTimeout(resolve, 800))

      // Mark as done
      setMiddlewares(prev => prev.map(m =>
        m.id === mw.id ? { ...m, status: 'done' } : m
      ))

      setLogs(prev => [...prev, `[${mw.name}] Complete`])
    }

    // Model call
    setLogs(prev => [...prev, '[Model] Calling language model...'])
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLogs(prev => [...prev, '[Model] Response received'])

    // Reverse through middleware for response
    for (let i = enabled.length - 1; i >= 0; i--) {
      const mw = enabled[i]
      if (mw.id === 'logging') {
        setLogs(prev => [...prev, `[${mw.name}] Logging response...`])
        await new Promise(resolve => setTimeout(resolve, 300))
      }
      if (mw.id === 'caching') {
        setLogs(prev => [...prev, `[${mw.name}] Caching response...`])
        await new Promise(resolve => setTimeout(resolve, 300))
      }
    }

    setLogs(prev => [...prev, 'Middleware chain complete!'])
    setCurrentStep(-1)
    setIsRunning(false)
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

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-purple-500/10 border-purple-500/20">
        <div className="flex items-start gap-3">
          <Layers className="h-5 w-5 text-purple-500 mt-0.5" />
          <div>
            <h3 className="font-medium">Middleware Chain Visualizer</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Toggle middleware layers and watch how requests flow through the chain.
              Middleware intercepts requests before the model and responses after.
            </p>
          </div>
        </div>
      </Card>

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
              <Button size="sm" onClick={runSimulation} disabled={isRunning || enabledMiddlewares.length === 0}>
                <Play className="h-3 w-3 mr-1" />
                Run
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            {middlewares.map((mw, i) => {
              const Icon = mw.icon
              const isActive = enabledMiddlewares.findIndex(m => m.id === mw.id) === currentStep
              return (
                <Card
                  key={mw.id}
                  className={`p-3 cursor-pointer transition-all ${
                    !mw.enabled ? 'opacity-50' : ''
                  } ${isActive ? 'ring-2 ring-primary' : ''}`}
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
                      {mw.status === 'done' && <Check className="h-4 w-4 text-green-500" />}
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
              {enabledMiddlewares.map((mw, i) => (
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
            {logs.length === 0 ? (
              <p className="text-sm text-zinc-500">Click &quot;Run&quot; to execute the middleware chain</p>
            ) : (
              <div className="space-y-1">
                {logs.map((log, i) => (
                  <div key={i} className="text-xs text-zinc-300">
                    <span className="text-zinc-500">{String(i + 1).padStart(2, '0')}.</span> {log}
                  </div>
                ))}
              </div>
            )}
          </Card>
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
