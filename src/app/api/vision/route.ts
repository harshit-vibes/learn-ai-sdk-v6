import { streamText, UIMessage, convertToModelMessages } from 'ai'
import { openrouter, MODELS } from '@/lib/openrouter'

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages, imageUrl }: { messages: UIMessage[]; imageUrl?: string } = await req.json()

  // Convert messages to model format
  const modelMessages = convertToModelMessages(messages)

  // If there's an image URL, append it to the last user message
  if (imageUrl && modelMessages.length > 0) {
    const lastMessage = modelMessages[modelMessages.length - 1]
    if (lastMessage.role === 'user') {
      // Convert string content to array with image
      const textContent = typeof lastMessage.content === 'string'
        ? lastMessage.content
        : (lastMessage.content as any[]).find(p => p.type === 'text')?.text || ''

      lastMessage.content = [
        { type: 'text', text: textContent },
        { type: 'image', image: imageUrl },
      ]
    }
  }

  const result = streamText({
    model: openrouter(MODELS.chat),
    messages: modelMessages,
  })

  return result.toUIMessageStreamResponse()
}
