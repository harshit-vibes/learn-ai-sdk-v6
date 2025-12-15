'use client'

import { UIMessage } from 'ai'
import { ScrollArea } from '@/components/ui/scroll-area'

interface ChatMessagesProps {
  messages: UIMessage[]
  emptyText?: string
  renderToolInvocation?: boolean
}

export function ChatMessages({
  messages,
  emptyText = 'Send a message to start',
  renderToolInvocation = false
}: ChatMessagesProps) {
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground text-center">{emptyText}</p>
      </div>
    )
  }

  return (
    <ScrollArea className="flex-1 pr-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              <p className="text-xs font-medium mb-1 opacity-70">
                {message.role === 'user' ? 'You' : 'Assistant'}
              </p>
              <div className="whitespace-pre-wrap">
                {message.parts.map((part: any, i) => {
                  if (part.type === 'text') {
                    return <span key={i}>{part.text}</span>
                  }
                  // v6 format: tool parts have type 'tool-{toolName}'
                  // States: input-streaming, input-available, output-available, output-error
                  if (renderToolInvocation && part.type?.startsWith('tool-')) {
                    const toolName = part.type.replace('tool-', '')
                    return (
                      <div key={i} className="my-2 p-2 bg-background/50 rounded text-xs">
                        <div className="font-mono text-primary">
                          🔧 {toolName}
                        </div>
                        {part.input && (
                          <div className="text-muted-foreground mt-1">
                            {JSON.stringify(part.input)}
                          </div>
                        )}
                        {part.state === 'output-available' && part.output && (
                          <div className="mt-1 text-green-600 dark:text-green-400">
                            ✓ {JSON.stringify(part.output)}
                          </div>
                        )}
                        {part.state === 'output-error' && (
                          <div className="mt-1 text-red-600 dark:text-red-400">
                            ✗ {part.errorText || 'Error'}
                          </div>
                        )}
                      </div>
                    )
                  }
                  return null
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
