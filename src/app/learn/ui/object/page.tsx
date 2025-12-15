'use client'

import { useState } from 'react'
import { experimental_useObject as useObject } from '@ai-sdk/react'
import { z } from 'zod'
import { LearningPage } from '@/components/educational'
import { getPageContent } from '@/lib/education-content'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Loader2, User, Briefcase, Heart, Sparkles } from 'lucide-react'

const content = getPageContent('ui/object')!

const profileSchema = z.object({
  name: z.string().describe('Full name of the person'),
  age: z.number().describe('Age in years'),
  occupation: z.string().describe('Job or profession'),
  interests: z.array(z.string()).describe('List of hobbies and interests'),
  bio: z.string().describe('A short biography (2-3 sentences)'),
})

const codeExamples = [
  {
    title: 'Client Component',
    language: 'tsx',
    code: `'use client'

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
}`,
  },
  {
    title: 'API Route',
    language: 'typescript',
    code: `// app/api/object/route.ts
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
}`,
  },
  {
    title: 'Nested Schema',
    language: 'typescript',
    code: `const recipeSchema = z.object({
  name: z.string(),
  ingredients: z.array(z.object({
    name: z.string(),
    amount: z.string(),
    unit: z.string(),
  })),
  steps: z.array(z.string()),
  cookTime: z.number().describe('Time in minutes'),
})

const { object, submit } = useObject({
  api: '/api/recipe',
  schema: recipeSchema,
})`,
  },
  {
    title: 'With onFinish',
    language: 'tsx',
    code: `const { object, submit } = useObject({
  api: '/api/object',
  schema: profileSchema,
  onFinish: ({ object, error }) => {
    if (error) {
      console.error('Generation failed:', error)
    } else {
      console.log('Generated:', object)
      // Save to database, etc.
    }
  },
})`,
  },
]

function ObjectDemo() {
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
    <div className="flex flex-col h-full space-y-4">
      {/* Status */}
      <div className="flex items-center gap-2">
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
      <form onSubmit={handleSubmit} className="flex gap-2">
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
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
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
    </div>
  )
}

export default function UseObjectPage() {
  return <LearningPage content={content} demo={<ObjectDemo />} codeExamples={codeExamples} />
}
