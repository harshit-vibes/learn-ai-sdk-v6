import { generateText } from 'ai'
import { openrouter, MODELS } from '@/lib/openrouter'

export const maxDuration = 30

interface TelemetryConfig {
  isEnabled: boolean
  functionId: string
  recordInputs: boolean
  recordOutputs: boolean
  metadata: { key: string; value: string }[]
}

interface Span {
  id: string
  name: string
  startTime: number
  endTime?: number
  duration?: number
  attributes: Record<string, unknown>
  status: 'running' | 'success' | 'error'
  children?: Span[]
}

export async function POST(req: Request) {
  const { config, prompt }: { config: TelemetryConfig; prompt: string } = await req.json()

  const startTime = Date.now()
  const spans: Span[] = []

  // Root span
  const rootSpan: Span = {
    id: 'span_' + Math.random().toString(36).substr(2, 9),
    name: 'ai.generateText',
    startTime,
    attributes: {
      'ai.operationType': 'generateText',
      'ai.telemetry.functionId': config.functionId || undefined,
      ...Object.fromEntries(
        config.metadata.map(m => [`ai.telemetry.metadata.${m.key}`, m.value])
      ),
    },
    status: 'running',
    children: [],
  }

  if (config.recordInputs) {
    rootSpan.attributes['ai.prompt'] = prompt
  }

  spans.push(rootSpan)

  // Model call span
  const modelSpan: Span = {
    id: 'span_' + Math.random().toString(36).substr(2, 9),
    name: 'ai.model.doGenerate',
    startTime: startTime + 10,
    attributes: {
      'ai.model.id': MODELS.chat,
      'ai.model.provider': 'anthropic',
    },
    status: 'running',
  }
  rootSpan.children?.push(modelSpan)

  try {
    const result = await generateText({
      model: openrouter(MODELS.chat),
      prompt,
      maxOutputTokens: 100,
    })

    const endTime = Date.now()

    // Update model span
    modelSpan.endTime = endTime - 5
    modelSpan.duration = modelSpan.endTime - modelSpan.startTime
    modelSpan.status = 'success'
    modelSpan.attributes['ai.usage.inputTokens'] = result.usage?.inputTokens
    modelSpan.attributes['ai.usage.outputTokens'] = result.usage?.outputTokens
    modelSpan.attributes['ai.finishReason'] = result.finishReason

    if (config.recordOutputs) {
      modelSpan.attributes['ai.response.text'] = result.text
    }

    // Update root span
    rootSpan.endTime = endTime
    rootSpan.duration = endTime - startTime
    rootSpan.status = 'success'
    rootSpan.attributes['ai.usage.totalTokens'] =
      (result.usage?.inputTokens || 0) + (result.usage?.outputTokens || 0)

    return Response.json({
      success: true,
      text: result.text,
      spans,
      usage: result.usage,
      duration: endTime - startTime,
    })
  } catch (error) {
    const endTime = Date.now()

    modelSpan.endTime = endTime - 5
    modelSpan.duration = modelSpan.endTime - modelSpan.startTime
    modelSpan.status = 'error'
    modelSpan.attributes['error.message'] = error instanceof Error ? error.message : 'Unknown error'

    rootSpan.endTime = endTime
    rootSpan.duration = endTime - startTime
    rootSpan.status = 'error'

    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Generation failed',
      spans,
      duration: endTime - startTime,
    })
  }
}
