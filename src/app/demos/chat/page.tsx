'use client'

import { useChat } from '@ai-sdk/react'
import { useState } from 'react'
import { DemoShell } from '@/components/demo-shell'
import { ChatMessages } from '@/components/chat-messages'
import { ChatInput } from '@/components/chat-input'
import { StatusBar } from '@/components/status-bar'

export default function ChatDemo() {
  const [input, setInput] = useState('')
  const { messages, sendMessage, status, stop, setMessages } = useChat()
  const isLoading = status === 'streaming' || status === 'submitted'

  return (
    <DemoShell
      title="Basic Chat"
      badge="useChat"
      description={<>Real-time streaming chat with <code className="text-xs bg-muted px-1 rounded">useChat</code> hook.</>}
    >
      <StatusBar
        status={status}
        isLoading={isLoading}
        onStop={stop}
        onClear={() => setMessages([])}
        showClear={messages.length > 0}
      />
      <ChatMessages messages={messages} emptyText="Send a message to start the conversation" />
      <ChatInput
        input={input}
        setInput={setInput}
        onSubmit={() => { sendMessage({ text: input }); setInput('') }}
        isLoading={isLoading}
      />
    </DemoShell>
  )
}
