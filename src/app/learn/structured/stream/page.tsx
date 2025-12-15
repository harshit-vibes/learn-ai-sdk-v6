'use client'

import { experimental_useObject as useObject } from '@ai-sdk/react'
import { z } from 'zod'
import { LearningPage } from '@/components/educational'
import { getPageContent } from '@/lib/education-content'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Loader2, Sparkles, User, Briefcase, Heart } from 'lucide-react'
import { useState } from 'react'

const content = getPageContent('structured/stream')!

const profileSchema = z.object({
  name: z.string().describe('Full name'),
  age: z.number().describe('Age in years'),
  occupation: z.string().describe('Job or profession'),
  interests: z.array(z.string()).describe('Hobbies and interests'),
  bio: z.string().describe('Short biography'),
})

const codeExamples = [
  {
    title: 'streamObject',
    language: 'typescript',
    code: `import { streamObject } from 'ai'
import { z } from 'zod'

const schema = z.object({
  name: z.string(),
  age: z.number(),
  bio: z.string(),
})

const { partialObjectStream } = streamObject({
  model,
  schema,
  prompt: 'Generate a user profile',
})

// Object streams progressively
for await (const partial of partialObjectStream) {
  console.log(partial)
  // { name: undefined, age: undefined, bio: undefined }
  // { name: 'John', age: undefined, bio: undefined }
  // { name: 'John', age: 30, bio: undefined }
  // { name: 'John', age: 30, bio: 'A software...' }
}`,
  },
  {
    title: 'useObject Hook',
    language: 'tsx',
    code: `import { experimental_useObject as useObject } from '@ai-sdk/react'

const { object, submit, isLoading } = useObject({
  api: '/api/object',
  schema: profileSchema,
})

// object is partial during streaming
// Fields populate progressively
<div>
  <h2>{object?.name || 'Loading...'}</h2>
  <p>{object?.bio}</p>
</div>`,
  },
]

function StreamObjectDemo() {
  const [prompt, setPrompt] = useState('')
  const { object, submit, isLoading, stop } = useObject({
    api: '/api/object',
    schema: profileSchema,
  })

  const handleSubmit = () => {
    if (prompt.trim()) submit({ prompt })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Badge variant={isLoading ? 'default' : 'secondary'}>
          {isLoading ? 'Streaming...' : 'Ready'}
        </Badge>
        {isLoading && (
          <Button variant="outline" size="sm" onClick={stop}>Stop</Button>
        )}
      </div>

      <div className="flex gap-2">
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe a person (e.g., 'A jazz musician from New Orleans')"
          disabled={isLoading}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <Button onClick={handleSubmit} disabled={isLoading || !prompt.trim()}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          <span className="ml-2">Stream</span>
        </Button>
      </div>

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
                {object.age && <span className="text-sm text-muted-foreground">{object.age} years old</span>}
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
          Watch the object populate field-by-field as it streams
        </div>
      )}
    </div>
  )
}

export default function StreamObjectPage() {
  return <LearningPage content={content} demo={<StreamObjectDemo />} codeExamples={codeExamples} />
}
