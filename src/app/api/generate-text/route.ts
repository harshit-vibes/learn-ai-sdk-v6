import { generateText } from 'ai'
import { openrouter, MODELS } from '@/lib/openrouter'

export const maxDuration = 30

export async function POST(req: Request) {
  const { prompt } = await req.json()

  const { text, usage, finishReason } = await generateText({
    model: openrouter(MODELS.chat),
    prompt,
  })

  return Response.json({ text, usage, finishReason })
}
