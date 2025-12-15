'use client'

import { LearningPage } from '@/components/educational'
import { getPageContent } from '@/lib/education-content'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Layers, Shield, Database, FileText, Zap } from 'lucide-react'

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

function MiddlewareDemo() {
  const middlewareTypes = [
    { name: 'Logging', icon: FileText, desc: 'Track requests, responses, and performance metrics' },
    { name: 'Caching', icon: Database, desc: 'Cache responses to reduce API costs and latency' },
    { name: 'RAG', icon: Zap, desc: 'Automatically inject relevant context from vector stores' },
    { name: 'Guardrails', icon: Shield, desc: 'Filter content, enforce policies, validate outputs' },
  ]

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-purple-500/10 border-purple-500/20">
        <div className="flex items-start gap-3">
          <Layers className="h-5 w-5 text-purple-500 mt-0.5" />
          <div>
            <h3 className="font-medium">What is Middleware?</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Middleware wraps language models to intercept and modify requests and responses.
              Add cross-cutting concerns like logging, caching, and filtering without changing your application code.
            </p>
          </div>
        </div>
      </Card>

      <div>
        <h3 className="font-medium mb-3">Middleware Types</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {middlewareTypes.map((mw) => (
            <Card key={mw.name} className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <mw.icon className="h-4 w-4 text-primary" />
                <span className="font-medium">{mw.name}</span>
              </div>
              <p className="text-sm text-muted-foreground">{mw.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Middleware Hooks</h3>
        <div className="space-y-2">
          <Card className="p-3">
            <code className="text-primary">transformParams</code>
            <p className="text-xs text-muted-foreground mt-1">
              Modify request parameters before they reach the model
            </p>
          </Card>
          <Card className="p-3">
            <code className="text-primary">wrapGenerate</code>
            <p className="text-xs text-muted-foreground mt-1">
              Wrap non-streaming generation (generateText, generateObject)
            </p>
          </Card>
          <Card className="p-3">
            <code className="text-primary">wrapStream</code>
            <p className="text-xs text-muted-foreground mt-1">
              Wrap streaming generation (streamText, streamObject)
            </p>
          </Card>
        </div>
      </div>

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
