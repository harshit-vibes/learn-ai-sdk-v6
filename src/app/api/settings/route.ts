import { generateText } from 'ai'
import { openrouter, MODELS } from '@/lib/openrouter'

export const maxDuration = 30

export async function POST(req: Request) {
  const { prompt, temperature = 0.7, maxTokens = 200 } = await req.json()

  const { text, usage, finishReason } = await generateText({
    model: openrouter(MODELS.chat),
    prompt,
    temperature,
    maxOutputTokens: maxTokens,
  })

  return Response.json({ text, usage, finishReason })
}
