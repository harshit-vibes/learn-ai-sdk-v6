import { streamObject } from 'ai'
import { openrouter, MODELS } from '@/lib/openrouter'
import { profileSchema } from '@/lib/schemas'

export const maxDuration = 30

export async function POST(req: Request) {
  const input = await req.json()

  const result = streamObject({
    model: openrouter(MODELS.chat),
    schema: profileSchema,
    prompt: `Generate a professional profile for: ${input}. Bio must be 20-200 characters. Include 3-6 relevant skills.`,
  })

  return result.toTextStreamResponse()
}
