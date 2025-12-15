import { streamText } from 'ai'
import { openrouter, MODELS } from '@/lib/openrouter'

export const maxDuration = 30

export async function POST(req: Request) {
  const { prompt } = await req.json()

  const result = streamText({
    model: openrouter(MODELS.chat),
    prompt,
  })

  return result.toTextStreamResponse()
}
