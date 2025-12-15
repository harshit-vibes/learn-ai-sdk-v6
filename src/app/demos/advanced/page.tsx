'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useState } from 'react'
import { DemoShell } from '@/components/demo-shell'
import { ChatMessages } from '@/components/chat-messages'
import { ChatInput } from '@/components/chat-input'
import { StatusBar } from '@/components/status-bar'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

interface MessageMeta {
  finishedAt: string
  finishReason?: string
  isAbort: boolean
  isDisconnect: boolean
  isError: boolean
  partsCount: number
  totalMessages: number
}

export default function AdvancedDemo() {
  const [input, setInput] = useState('')
  const [metadata, setMetadata] = useState<Record<string, MessageMeta>>({})

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: '/api/advanced' }),
    onFinish: ({ message, messages, isAbort, isDisconnect, isError, finishReason }) => {
      if (message?.id) {
        setMetadata(prev => ({
          ...prev,
          [message.id]: {
            finishedAt: new Date().toISOString(),
            finishReason: finishReason ?? 'unknown',
            isAbort,
            isDisconnect,
            isError,
            partsCount: message.parts?.length ?? 0,
            totalMessages: messages.length,
          }
        }))
      }
    },
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  return (
    <DemoShell
      title="Advanced Features"
      badge="onFinish"
      description={<>Demonstrates onFinish callback with full message metadata.</>}
    >
      <div className="flex gap-4 h-full">
        <div className="flex-1 flex flex-col min-h-0">
          <StatusBar
            status={status}
            isLoading={isLoading}
            onClear={() => { setMessages([]); setMetadata({}) }}
            showClear={messages.length > 0}
          >
            <Badge variant="outline">onFinish callback</Badge>
          </StatusBar>
          <ChatMessages messages={messages} emptyText="Send a message to see metadata tracking" />
          <ChatInput
            input={input}
            setInput={setInput}
            onSubmit={() => { sendMessage({ text: input }); setInput('') }}
            isLoading={isLoading}
          />
        </div>

        {/* Metadata panel */}
        <div className="w-72 border-l pl-4 flex flex-col min-h-0">
          <h3 className="font-medium mb-2 text-sm">onFinish Metadata</h3>
          <ScrollArea className="flex-1">
            <div className="space-y-2 pr-2">
              {messages.length === 0 ? (
                <p className="text-xs text-muted-foreground">No messages yet</p>
              ) : (
                messages.map((msg) => (
                  <Card key={msg.id} className="p-3 text-xs space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={msg.role === 'user' ? 'default' : 'secondary'} className="text-[10px]">
                        {msg.role}
                      </Badge>
                      <span className="font-mono text-muted-foreground truncate">
                        {msg.id.slice(0, 8)}...
                      </span>
                    </div>
                    {metadata[msg.id] ? (
                      <div className="space-y-0.5 pt-1 border-t mt-1">
                        <Row label="finishReason" value={metadata[msg.id].finishReason} />
                        <Row label="parts" value={metadata[msg.id].partsCount} />
                        <Row label="totalMsgs" value={metadata[msg.id].totalMessages} />
                        <Row label="isAbort" value={metadata[msg.id].isAbort} />
                        <Row label="isError" value={metadata[msg.id].isError} />
                        <Row label="time" value={new Date(metadata[msg.id].finishedAt).toLocaleTimeString()} />
                      </div>
                    ) : (
                      <p className="text-muted-foreground italic">No metadata (user msg)</p>
                    )}
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </DemoShell>
  )
}

function Row({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-mono">{String(value)}</span>
    </div>
  )
}
