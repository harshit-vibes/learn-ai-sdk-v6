'use client'

import { experimental_useObject as useObject } from '@ai-sdk/react'
import { z } from 'zod'
import { EducationalShell, InfoBar, CodeBlock, ApiReference, DemoCard } from '@/components/educational'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Loader2, User, Briefcase, Heart, Sparkles } from 'lucide-react'
import { useState } from 'react'

const profileSchema = z.object({
  name: z.string().describe('Full name of the person'),
  age: z.number().describe('Age in years'),
  occupation: z.string().describe('Job or profession'),
  interests: z.array(z.string()).describe('List of hobbies and interests'),
  bio: z.string().describe('A short biography (2-3 sentences)'),
})

const clientCode = `'use client'

import { experimental_useObject as useObject } from '@ai-sdk/react'
import { z } from 'zod'

const profileSchema = z.object({
  name: z.string().describe('Full name'),
  age: z.number().describe('Age in years'),
  occupation: z.string().describe('Job or profession'),
  interests: z.array(z.string()).describe('Hobbies'),
  bio: z.string().describe('Short biography'),
})

export function ObjectDemo() {
  const { object, submit, isLoading, error } = useObject({
    api: '/api/object',
    schema: profileSchema,
  })

  return (
    <div>
      <button onClick={() => submit({ prompt: 'A software engineer' })}>
        Generate Profile
      </button>
      {isLoading && <div>Generating...</div>}
      {object && (
        <div>
          <h2>{object.name}</h2>
          <p>{object.occupation}</p>
        </div>
      )}
    </div>
  )
}`

const serverCode = `// app/api/object/route.ts
import { streamObject } from 'ai'
import { createGateway } from 'ai'
import { z } from 'zod'

const gateway = createGateway({
  apiKey: process.env.AI_GATEWAY_API_KEY ?? '',
})

const profileSchema = z.object({
  name: z.string(),
  age: z.number(),
  occupation: z.string(),
  interests: z.array(z.string()),
  bio: z.string(),
})

export async function POST(req: Request) {
  const { prompt } = await req.json()

  const result = streamObject({
    model: gateway('anthropic/claude-sonnet-4'),
    schema: profileSchema,
    prompt: \`Generate a fictional profile for: \${prompt}\`,
  })

  return result.toTextStreamResponse()
}`

const apiItems = [
  { name: 'object', type: 'T | undefined', description: 'The generated object (partial during streaming)' },
  { name: 'submit', type: '(input) => void', description: 'Trigger generation: submit({ prompt: "..." })' },
  { name: 'isLoading', type: 'boolean', description: 'Whether generation is in progress' },
  { name: 'error', type: 'Error | undefined', description: 'Error object if generation failed' },
  { name: 'stop', type: '() => void', description: 'Stop the current generation' },
  { name: 'api', type: 'string', required: true, description: 'The API endpoint for object generation' },
  { name: 'schema', type: 'ZodSchema', required: true, description: 'Zod schema defining the object structure' },
]

export default function UseObjectPage() {
  const [prompt, setPrompt] = useState('')
  const { object, submit, isLoading, error, stop } = useObject({
    api: '/api/object',
    schema: profileSchema,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim()) {
      submit({ prompt })
    }
  }

  return (
    <EducationalShell
      title="useObject"
      subtitle="Stream structured JSON objects with Zod schema validation"
      category="AI SDK UI"
      docsUrl="https://v6.ai-sdk.dev/docs/ai-sdk-ui/object-generation"
    >
      <InfoBar
        whatIs="useObject is a React hook that generates structured data matching a Zod schema. The object streams progressively, allowing you to display partial data as it generates."
        whenToUse={[
          'Generating structured data (profiles, recipes, products)',
          'Form auto-fill from natural language',
          'Data extraction from unstructured text',
          'When you need type-safe generated objects',
        ]}
        keyConcepts={[
          { term: 'schema', definition: 'Zod schema that defines and validates the output structure' },
          { term: 'object', definition: 'The generated object, partially populated during streaming' },
          { term: 'submit', definition: 'Function to trigger generation with a prompt' },
          { term: 'streaming', definition: 'Object fields populate progressively as they generate' },
        ]}
        codeExample={`const schema = z.object({
  name: z.string(),
  age: z.number(),
})

const { object, submit } = useObject({
  api: '/api/object',
  schema,
})

submit({ prompt: 'A software engineer' })`}
      />

      <DemoCard
        code={
          <div className="space-y-4">
            <CodeBlock code={clientCode} title="Client Component" language="tsx" />
            <CodeBlock code={serverCode} title="API Route" language="typescript" />
          </div>
        }
      >
        {/* Status */}
        <div className="flex items-center gap-2 mb-4">
          <Badge variant={isLoading ? 'default' : 'secondary'}>
            {isLoading ? 'Streaming' : 'Ready'}
          </Badge>
          {isLoading && (
            <Button variant="outline" size="sm" onClick={stop}>
              Stop
            </Button>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe a person (e.g., 'A jazz musician from New Orleans')"
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !prompt.trim()}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate
              </>
            )}
          </Button>
        </form>

        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
            {error.message}
          </div>
        )}

        {/* Output */}
        <ScrollArea className="flex-1">
          {object ? (
            <Card className="p-4">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {object.name || <span className="text-muted-foreground animate-pulse">Loading name...</span>}
                    </h3>
                    {object.age && (
                      <span className="text-sm text-muted-foreground">{object.age} years old</span>
                    )}
                  </div>
                </div>

                {object.occupation && (
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span>{object.occupation}</span>
                  </div>
                )}

                {object.interests && object.interests.length > 0 && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Heart className="h-4 w-4 text-muted-foreground" />
                      Interests
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {object.interests.map((interest, i) => (
                        <Badge key={i} variant="secondary">{interest}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {object.bio && (
                  <p className="text-sm text-muted-foreground border-t pt-3">{object.bio}</p>
                )}
              </div>
            </Card>
          ) : (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              Enter a description to generate a profile
            </div>
          )}
        </ScrollArea>
      </DemoCard>

      <div className="mt-4">
        <ApiReference items={apiItems} />
      </div>
    </EducationalShell>
  )
}
