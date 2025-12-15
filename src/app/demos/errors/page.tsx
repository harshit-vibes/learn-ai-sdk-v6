'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useState } from 'react'
import { DemoShell } from '@/components/demo-shell'
import { ChatMessages } from '@/components/chat-messages'
import { ChatInput } from '@/components/chat-input'
import { StatusBar } from '@/components/status-bar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

type ErrorType = 'none' | 'api' | 'rate-limit' | 'timeout'

// Separate component that uses useChat - will remount when key changes
function ErrorChat({ errorType }: { errorType: ErrorType }) {
  const [input, setInput] = useState('')

  const { messages, sendMessage, status, setMessages, error, clearError } = useChat({
    transport: new DefaultChatTransport({ api: `/api/errors?type=${errorType}` }),
    onError: (err) => {
      console.error('Chat error:', err)
    },
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  return (
    <>
      <StatusBar
        status={status}
        isLoading={isLoading}
        onClear={() => { setMessages([]); clearError() }}
        showClear={messages.length > 0 || !!error}
      />

      {error && (
        <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-destructive">Error occurred</p>
              <p className="text-sm text-muted-foreground">{error.message}</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={clearError}>
                Dismiss
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  clearError()
                  if (messages.length > 0) {
                    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user')
                    if (lastUserMsg) {
                      setMessages(messages.slice(0, -1))
                      const textPart = lastUserMsg.parts.find((p: any) => p.type === 'text') as { text: string } | undefined
                      sendMessage({ text: textPart?.text || '' })
                    }
                  }
                }}
              >
                Retry
              </Button>
            </div>
          </div>
        </div>
      )}

      <ChatMessages messages={messages} emptyText="Send a message to test the selected error scenario" />
      <ChatInput
        input={input}
        setInput={setInput}
        onSubmit={() => { sendMessage({ text: input }); setInput('') }}
        isLoading={isLoading}
      />
    </>
  )
}

export default function ErrorsDemo() {
  const [errorType, setErrorType] = useState<ErrorType>('none')

  return (
    <DemoShell
      title="Error Handling"
      badge="onError"
      description={<>Demonstrates graceful error handling with different error scenarios.</>}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs text-muted-foreground">Simulate:</span>
        {(['none', 'api', 'rate-limit', 'timeout'] as ErrorType[]).map((type) => (
          <Badge
            key={type}
            variant={errorType === type ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setErrorType(type)}
          >
            {type === 'none' ? 'Normal' : type}
          </Badge>
        ))}
      </div>

      {/* Key forces remount when errorType changes, reinitializing useChat with new transport */}
      <ErrorChat key={errorType} errorType={errorType} />
    </DemoShell>
  )
}
