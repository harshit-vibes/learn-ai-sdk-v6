import { streamText, UIMessage, convertToModelMessages } from 'ai'
import { openrouter, MODELS } from '@/lib/openrouter'

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: openrouter(MODELS.chat),
    messages: convertToModelMessages(messages),
  })

  return result.toUIMessageStreamResponse()
}
