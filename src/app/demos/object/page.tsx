'use client'

import { experimental_useObject as useObject } from '@ai-sdk/react'
import { useState } from 'react'
import { DemoShell } from '@/components/demo-shell'
import { StatusBar } from '@/components/status-bar'
import { ChatInput } from '@/components/chat-input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { profileSchema, type Profile } from '@/lib/schemas'

export default function ObjectDemo() {
  const [input, setInput] = useState('')
  const { object, submit, isLoading, stop, error } = useObject({
    api: '/api/object',
    schema: profileSchema,
  })

  return (
    <DemoShell
      title="Object Generation"
      badge="useObject"
      description={<>Stream structured JSON with Zod validation (min/max constraints).</>}
    >
      <StatusBar status={isLoading ? 'generating' : 'ready'} isLoading={isLoading} onStop={stop} />

      {error && (
        <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
          {error.message}
        </div>
      )}

      <ScrollArea className="flex-1 border rounded-lg p-4 bg-muted/30">
        {object ? (
          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{object.name || '...'}</h2>
              {object.available !== undefined && (
                <Badge variant={object.available ? 'default' : 'secondary'}>
                  {object.available ? 'Available' : 'Unavailable'}
                </Badge>
              )}
            </div>

            {object.experience !== undefined && (
              <p className="text-sm text-muted-foreground">
                {object.experience} years experience
              </p>
            )}

            {object.bio && (
              <p className="text-sm border-l-2 pl-3 italic">{object.bio}</p>
            )}

            {object.skills && object.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {object.skills.map((skill, i) => (
                  <Badge key={i} variant="outline">{skill}</Badge>
                ))}
              </div>
            )}
          </Card>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            Try: "senior react developer", "data scientist", "product manager"
          </p>
        )}
      </ScrollArea>

      <div className="mt-2 text-xs text-muted-foreground">
        <strong>Schema:</strong> name (2-50), bio (20-200 chars), skills (3-6 items), experience (0-50 yrs), available (bool)
      </div>

      <ChatInput
        input={input}
        setInput={setInput}
        onSubmit={() => { submit(input); setInput('') }}
        isLoading={isLoading}
        placeholder="Enter a job title or role..."
        submitLabel="Generate Profile"
      />
    </DemoShell>
  )
}
