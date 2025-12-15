'use client'

import { LearningPage } from '@/components/educational'
import { getPageContent } from '@/lib/education-content'
import { ChatDemo } from '@/components/demos'

const content = getPageContent('text/stream')!

const codeExamples = [
  {
    title: 'API Route',
    language: 'typescript',
    code: `import { streamText, UIMessage, convertToModelMessages } from 'ai'
import { createGateway } from 'ai'

const gateway = createGateway({
  apiKey: process.env.AI_GATEWAY_API_KEY!,
})

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: gateway('anthropic/claude-sonnet-4'),
    messages: convertToModelMessages(messages),
    onChunk: ({ chunk }) => {
      console.log('Chunk:', chunk)
    },
    onFinish: ({ text, usage }) => {
      console.log('Finished:', { text, usage })
    },
  })

  return result.toUIMessageStreamResponse()
}`,
  },
  {
    title: 'With Transform',
    language: 'typescript',
    code: `import { streamText, smoothStream } from 'ai'

const result = streamText({
  model,
  messages,
  // Smooth the output for better UX
  experimental_transform: smoothStream({
    chunking: 'word',
    delayInMs: 20,
  }),
})`,
  },
]

export default function StreamTextPage() {
  return (
    <LearningPage
      content={content}
      demo={<ChatDemo api="/api/chat" emptyText="Try the streaming chat - watch text appear in real-time" />}
      codeExamples={codeExamples}
    />
  )
}
