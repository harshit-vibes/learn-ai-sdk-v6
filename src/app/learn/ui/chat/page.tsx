'use client'

import { useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { EducationalShell, InfoBar, CodeBlock, ApiReference, DemoCard } from '@/components/educational'
import { ChatMessages } from '@/components/chat-messages'
import { ChatInput } from '@/components/chat-input'
import { StatusBar } from '@/components/status-bar'

const clientCode = `'use client'

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
}`

const serverCode = `// app/api/chat/route.ts
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
}`

const apiItems = [
  { name: 'messages', type: 'UIMessage[]', description: 'Array of chat messages with role and parts' },
  { name: 'sendMessage', type: '(options) => void', description: 'Send a new message: sendMessage({ text: "..." })' },
  { name: 'status', type: '"idle" | "submitted" | "streaming"', description: 'Current status of the chat' },
  { name: 'stop', type: '() => void', description: 'Stop the current streaming response' },
  { name: 'setMessages', type: '(messages) => void', description: 'Manually set the messages array' },
  { name: 'error', type: 'Error | undefined', description: 'Error object if an error occurred' },
  { name: 'clearError', type: '() => void', description: 'Clear the current error' },
  { name: 'transport', type: 'ChatTransport', required: true, description: 'Transport for API communication' },
  { name: 'onFinish', type: '(params) => void', description: 'Callback when streaming completes' },
  { name: 'onError', type: '(error) => void', description: 'Callback when an error occurs' },
]

export default function UseChatPage() {
  const [input, setInput] = useState('')
  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  return (
    <EducationalShell
      title="useChat"
      subtitle="Real-time streaming chat interface with automatic state management"
      category="AI SDK UI"
      docsUrl="https://v6.ai-sdk.dev/docs/ai-sdk-ui/chatbot"
    >
      <InfoBar
        whatIs="useChat is a React hook that manages the complete state of a chat interface. It handles message history, streaming responses, loading states, and error handling automatically."
        whenToUse={[
          'Building conversational AI interfaces',
          'Chat applications with streaming responses',
          'Multi-turn conversations with context',
          'When you need automatic state management for chat',
        ]}
        keyConcepts={[
          { term: 'UIMessage', definition: 'Message format with id, role (user/assistant), and parts array' },
          { term: 'parts', definition: 'Array of message content - text, tool calls, etc.' },
          { term: 'transport', definition: 'Configures the API endpoint for chat communication' },
          { term: 'status', definition: 'Tracks streaming state: idle, submitted, or streaming' },
        ]}
        codeExample={`const { messages, sendMessage, status } = useChat({
  transport: new DefaultChatTransport({ api: '/api/chat' })
})

sendMessage({ text: 'Hello!' })`}
      />

      <DemoCard
        code={
          <div className="space-y-4">
            <CodeBlock code={clientCode} title="Client Component" language="tsx" />
            <CodeBlock code={serverCode} title="API Route" language="typescript" />
          </div>
        }
      >
        <StatusBar
          status={status}
          isLoading={isLoading}
          onClear={() => setMessages([])}
          showClear={messages.length > 0}
        />
        <ChatMessages messages={messages} emptyText="Send a message to start chatting" />
        <ChatInput
          input={input}
          setInput={setInput}
          onSubmit={() => { sendMessage({ text: input }); setInput('') }}
          isLoading={isLoading}
          placeholder="Type a message..."
        />
      </DemoCard>

      <div className="mt-4">
        <ApiReference items={apiItems} />
      </div>
    </EducationalShell>
  )
}
