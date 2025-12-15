'use client'

import { useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { LearningPage } from '@/components/educational'
import { getPageContent } from '@/lib/education-content'
import { ChatMessages } from '@/components/chat-messages'
import { ChatInput } from '@/components/chat-input'
import { StatusBar } from '@/components/status-bar'

const content = getPageContent('ui/chat')!

const codeExamples = [
  {
    title: 'Client Component',
    language: 'tsx',
    code: `'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'

export function ChatDemo() {
  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  return (
    <div>
      {messages.map((message) => (
        <div key={message.id}>
          {message.role}: {message.parts.map(p =>
            p.type === 'text' ? p.text : null
          )}
        </div>
      ))}
      <button onClick={() => sendMessage({ text: 'Hello!' })}>
        Send
      </button>
    </div>
  )
}`,
  },
  {
    title: 'API Route',
    language: 'typescript',
    code: `// app/api/chat/route.ts
import { streamText, UIMessage, convertToModelMessages } from 'ai'
import { createGateway } from 'ai'

const gateway = createGateway({
  apiKey: process.env.AI_GATEWAY_API_KEY ?? '',
})

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: gateway('anthropic/claude-sonnet-4'),
    messages: convertToModelMessages(messages),
  })

  return result.toUIMessageStreamResponse()
}`,
  },
  {
    title: 'With System Prompt',
    language: 'typescript',
    code: `const result = streamText({
  model: gateway('anthropic/claude-sonnet-4'),
  system: 'You are a helpful assistant that speaks like a pirate.',
  messages: convertToModelMessages(messages),
})`,
  },
  {
    title: 'With Callbacks',
    language: 'tsx',
    code: `const { messages, sendMessage } = useChat({
  transport: new DefaultChatTransport({ api: '/api/chat' }),
  onFinish: (message) => {
    console.log('Finished:', message)
  },
  onError: (error) => {
    console.error('Error:', error)
  },
})`,
  },
]

function ChatDemo() {
  const [input, setInput] = useState('')
  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  return (
    <div className="flex flex-col h-full">
      <StatusBar
        status={status}
        isLoading={isLoading}
        onClear={() => setMessages([])}
        showClear={messages.length > 0}
      />
      <div className="flex-1 min-h-0">
        <ChatMessages messages={messages} emptyText="Send a message to start chatting" />
      </div>
      <ChatInput
        input={input}
        setInput={setInput}
        onSubmit={() => { sendMessage({ text: input }); setInput('') }}
        isLoading={isLoading}
        placeholder="Type a message..."
      />
    </div>
  )
}

export default function UseChatPage() {
  return <LearningPage content={content} demo={<ChatDemo />} codeExamples={codeExamples} />
}
