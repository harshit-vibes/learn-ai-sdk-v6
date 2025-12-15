'use client'

import { useCompletion } from '@ai-sdk/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Loader2 } from 'lucide-react'

interface CompletionDemoProps {
  api?: string
  placeholder?: string
}

export function CompletionDemo({
  api = '/api/completion',
  placeholder = 'Write a haiku about programming...',
}: CompletionDemoProps) {
  const {
    completion,
    input,
    setInput,
    handleSubmit,
    isLoading,
    stop,
    setCompletion,
  } = useCompletion({ api })

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <Badge variant={isLoading ? 'default' : 'secondary'}>
          {isLoading ? 'Streaming' : 'Ready'}
        </Badge>
        {isLoading && (
          <Button variant="outline" size="sm" onClick={stop}>
            Stop
          </Button>
        )}
        {completion && (
          <Button variant="outline" size="sm" onClick={() => setCompletion('')}>
            Clear
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          disabled={isLoading}
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading || !input.trim()}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating
            </>
          ) : (
            'Generate'
          )}
        </Button>
      </form>

      <ScrollArea className="flex-1 border rounded-lg p-4 bg-muted/30">
        {completion ? (
          <div className="whitespace-pre-wrap">{completion}</div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            Enter a prompt to generate text
          </p>
        )}
      </ScrollArea>
    </>
  )
}
