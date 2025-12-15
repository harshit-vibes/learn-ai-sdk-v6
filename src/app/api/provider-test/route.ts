import { generateText } from 'ai'
import { openrouter } from '@/lib/openrouter'

export const maxDuration = 30

export async function POST(req: Request) {
  const { prompt, model } = await req.json()

  const startTime = Date.now()

  try {
    const { text, usage, finishReason } = await generateText({
      model: openrouter(model),
      prompt,
      maxOutputTokens: 150,
    })

    return Response.json({
      text,
      usage,
      finishReason,
      model,
      latencyMs: Date.now() - startTime,
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return Response.json({
      error: errorMessage,
      model,
      latencyMs: Date.now() - startTime,
    }, { status: 500 })
  }
}
