import { streamText, UIMessage, convertToModelMessages } from 'ai'
import { openrouter, MODELS } from '@/lib/openrouter'

export const maxDuration = 30

export async function POST(req: Request) {
  const url = new URL(req.url)
  const errorType = url.searchParams.get('type')

  // AI SDK expects plain text error messages with appropriate status codes
  if (errorType === 'api') {
    return new Response('API Error: Invalid API key. Please check your credentials.', {
      status: 401,
      headers: { 'Content-Type': 'text/plain' },
    })
  }

  if (errorType === 'rate-limit') {
    return new Response('Rate limit exceeded. Please try again later.', {
      status: 429,
      headers: { 'Content-Type': 'text/plain' },
    })
  }

  if (errorType === 'timeout') {
    // Simulate a timeout by waiting longer than the client expects
    await new Promise(resolve => setTimeout(resolve, 5000))
    return new Response('Request timeout. The server took too long to respond.', {
      status: 504,
      headers: { 'Content-Type': 'text/plain' },
    })
  }

  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: openrouter(MODELS.chat),
    messages: convertToModelMessages(messages),
  })

  return result.toUIMessageStreamResponse()
}
