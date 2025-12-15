'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useState } from 'react'
import { DemoShell } from '@/components/demo-shell'
import { ChatMessages } from '@/components/chat-messages'
import { ChatInput } from '@/components/chat-input'
import { StatusBar } from '@/components/status-bar'
import { Badge } from '@/components/ui/badge'

export default function ToolsDemo() {
  const [input, setInput] = useState('')
  const { messages, sendMessage, status, stop, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: '/api/tools' }),
  })
  const isLoading = status === 'streaming' || status === 'submitted'

  return (
    <DemoShell
      title="Tool Usage"
      badge="Server Tools"
      description={<>AI can call server-side tools like weather lookup and calculations.</>}
    >
      <StatusBar
        status={status}
        isLoading={isLoading}
        onStop={stop}
        onClear={() => setMessages([])}
        showClear={messages.length > 0}
      >
        <Badge variant="outline">weather</Badge>
        <Badge variant="outline">calculator</Badge>
      </StatusBar>
      <ChatMessages
        messages={messages}
        emptyText={`Try: "What's the weather in Tokyo?" or "Calculate 15% tip on $85"`}
        renderToolInvocation
      />
      <ChatInput
        input={input}
        setInput={setInput}
        onSubmit={() => { sendMessage({ text: input }); setInput('') }}
        isLoading={isLoading}
        placeholder="Ask about weather or do calculations..."
      />
    </DemoShell>
  )
}
