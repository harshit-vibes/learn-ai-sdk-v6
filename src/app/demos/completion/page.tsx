'use client'

import { useCompletion } from '@ai-sdk/react'
import { DemoShell } from '@/components/demo-shell'
import { StatusBar } from '@/components/status-bar'
import { ChatInput } from '@/components/chat-input'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function CompletionDemo() {
  const { completion, input, setInput, handleSubmit, isLoading, stop, setCompletion } = useCompletion({
    api: '/api/completion',
  })

  return (
    <DemoShell
      title="Text Completion"
      badge="useCompletion"
      description={<>Single-prompt text generation with <code className="text-xs bg-muted px-1 rounded">useCompletion</code> hook.</>}
    >
      <StatusBar
        status={isLoading ? 'generating' : 'ready'}
        isLoading={isLoading}
        onStop={stop}
        onClear={() => setCompletion('')}
        showClear={!!completion}
      />
      <ScrollArea className="flex-1 border rounded-lg p-4 bg-muted/30">
        {completion ? (
          <div className="whitespace-pre-wrap">{completion}</div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            Try: "Write a haiku about coding" or "Explain quantum computing"
          </p>
        )}
      </ScrollArea>
      <ChatInput
        input={input}
        setInput={setInput}
        onSubmit={() => handleSubmit()}
        isLoading={isLoading}
        placeholder="Enter a prompt..."
        submitLabel="Generate"
      />
    </DemoShell>
  )
}
