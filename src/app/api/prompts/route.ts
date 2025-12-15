import { streamText, UIMessage, convertToModelMessages } from 'ai'
import { openrouter, MODELS } from '@/lib/openrouter'

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages, system }: { messages: UIMessage[]; system?: string } = await req.json()

  const result = streamText({
    model: openrouter(MODELS.chat),
    system: system || 'You are a helpful assistant.',
    messages: convertToModelMessages(messages),
  })

  return result.toUIMessageStreamResponse()
}
