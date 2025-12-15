'use client'

import { useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { ChatMessages } from '@/components/chat-messages'
import { ChatInput } from '@/components/chat-input'
import { StatusBar } from '@/components/status-bar'

interface ChatDemoProps {
  api?: string
  renderToolInvocation?: boolean
  emptyText?: string
}

export function ChatDemo({
  api = '/api/chat',
  renderToolInvocation = false,
  emptyText = 'Send a message to start chatting',
}: ChatDemoProps) {
  const [input, setInput] = useState('')
  const { messages, sendMessage, status, setMessages, stop } = useChat({
    transport: new DefaultChatTransport({ api }),
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  return (
    <>
      <StatusBar
        status={status}
        isLoading={isLoading}
        onClear={() => setMessages([])}
        showClear={messages.length > 0}
        onStop={stop}
      />
      <ChatMessages
        messages={messages}
        emptyText={emptyText}
        renderToolInvocation={renderToolInvocation}
      />
      <ChatInput
        input={input}
        setInput={setInput}
        onSubmit={() => { sendMessage({ text: input }); setInput('') }}
        isLoading={isLoading}
        placeholder="Type a message..."
      />
    </>
  )
}
