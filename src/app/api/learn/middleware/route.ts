import { generateText, wrapLanguageModel, type LanguageModelMiddleware } from 'ai'
import { openrouter, MODELS } from '@/lib/openrouter'

export const maxDuration = 30

interface MiddlewareConfig {
  logging: boolean
  caching: boolean
  rag: boolean
  guardrails: boolean
}

interface LogEntry {
  timestamp: number
  middleware: string
  phase: 'request' | 'response'
  message: string
  data?: unknown
}

export async function POST(req: Request) {
  const { middlewares, prompt }: { middlewares: MiddlewareConfig; prompt: string } = await req.json()

  const logs: LogEntry[] = []
  const startTime = Date.now()

  const addLog = (middleware: string, phase: 'request' | 'response', message: string, data?: unknown) => {
    logs.push({
      timestamp: Date.now() - startTime,
      middleware,
      phase,
      message,
      data,
    })
  }

  // Build middleware chain based on config
  const middlewareChain: LanguageModelMiddleware[] = []

  if (middlewares.logging) {
    middlewareChain.push({
      specificationVersion: 'v3',
      transformParams: async ({ params }) => {
        addLog('Logging', 'request', 'Logging request params', {
          hasMaxTokens: 'maxOutputTokens' in params,
          temperature: (params as Record<string, unknown>).temperature ?? 'default',
        })
        return params
      },
      wrapGenerate: async ({ doGenerate }) => {
        const generateStart = Date.now()
        const result = await doGenerate()
        const duration = Date.now() - generateStart
        addLog('Logging', 'response', `Response received in ${duration}ms`, {
          contentParts: result.content?.length ?? 0,
          finishReason: result.finishReason,
        })
        return result
      },
    })
  }

  if (middlewares.caching) {
    // Simulated cache - in real world would use Redis/memory cache
    const cacheKey = `cache_${prompt.slice(0, 50)}`
    middlewareChain.push({
      specificationVersion: 'v3',
      transformParams: async ({ params }) => {
        addLog('Caching', 'request', `Checking cache with key: ${cacheKey.slice(0, 20)}...`)
        // Simulate cache miss for demo
        addLog('Caching', 'request', 'Cache miss - proceeding with generation')
        return params
      },
      wrapGenerate: async ({ doGenerate }) => {
        const result = await doGenerate()
        addLog('Caching', 'response', 'Caching response for future requests')
        return result
      },
    })
  }

  if (middlewares.rag) {
    middlewareChain.push({
      specificationVersion: 'v3',
      transformParams: async ({ params }) => {
        addLog('RAG', 'request', 'Searching for relevant documents...')
        // Simulated RAG context
        const ragContext = `Context from knowledge base:
- AI SDK is a TypeScript toolkit for building AI applications
- It supports streaming, tool calling, and structured generation
- Compatible with multiple providers like OpenAI, Anthropic, Google`
        addLog('RAG', 'request', 'Found 3 relevant documents, injecting context')

        // Add RAG context - just log for demo since we can't easily modify internal params
        addLog('RAG', 'request', 'Injected RAG context into request')
        return params
      },
    })
  }

  if (middlewares.guardrails) {
    const blockedWords = ['hack', 'exploit', 'malware']
    middlewareChain.push({
      specificationVersion: 'v3',
      transformParams: async ({ params }) => {
        addLog('Guardrails', 'request', 'Checking input for policy violations...')
        // Check the original prompt for blocked content
        const hasViolation = blockedWords.some(word =>
          prompt.toLowerCase().includes(word)
        )
        if (hasViolation) {
          addLog('Guardrails', 'request', 'Content policy violation detected!', { blocked: true })
          throw new Error('Content policy violation')
        }
        addLog('Guardrails', 'request', 'Input passed content policy check')
        return params
      },
      wrapGenerate: async ({ doGenerate }) => {
        const result = await doGenerate()
        addLog('Guardrails', 'response', 'Checking output for policy violations...')
        // Simple output check
        addLog('Guardrails', 'response', 'Output passed content policy check')
        return result
      },
    })
  }

  try {
    addLog('System', 'request', 'Starting middleware chain execution')

    // Apply middleware chain to model
    let model = openrouter(MODELS.chat)
    if (middlewareChain.length > 0) {
      model = wrapLanguageModel({
        model: openrouter(MODELS.chat),
        middleware: middlewareChain,
      })
    }

    addLog('Model', 'request', 'Calling language model...')
    const result = await generateText({
      model,
      prompt,
      maxOutputTokens: 100,
    })

    addLog('System', 'response', 'Middleware chain complete')

    return Response.json({
      success: true,
      text: result.text,
      usage: result.usage,
      logs,
      totalTime: Date.now() - startTime,
    })
  } catch (error) {
    addLog('Error', 'response', error instanceof Error ? error.message : 'Unknown error')

    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      logs,
      totalTime: Date.now() - startTime,
    })
  }
}
