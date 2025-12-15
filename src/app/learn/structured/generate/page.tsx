'use client'

import { useState } from 'react'
import { LearningPage } from '@/components/educational'
import { getPageContent } from '@/lib/education-content'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Loader2, Sparkles } from 'lucide-react'

const content = getPageContent('structured/generate')!

const codeExamples = [
  {
    title: 'generateObject',
    language: 'typescript',
    code: `import { generateObject } from 'ai'
import { z } from 'zod'

const schema = z.object({
  recipe: z.object({
    name: z.string(),
    ingredients: z.array(z.object({
      name: z.string(),
      amount: z.string(),
    })),
    steps: z.array(z.string()),
  }),
})

const { object } = await generateObject({
  model: gateway('anthropic/claude-sonnet-4'),
  schema,
  prompt: 'Generate a recipe for chocolate chip cookies',
})

console.log(object.recipe.name) // Fully typed!`,
  },
  {
    title: 'API Route',
    language: 'typescript',
    code: `export async function POST(req: Request) {
  const { prompt } = await req.json()

  const { object } = await generateObject({
    model: gateway('anthropic/claude-sonnet-4'),
    schema: recipeSchema,
    prompt,
  })

  return Response.json(object)
}`,
  },
]

function GenerateObjectDemo() {
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  async function handleGenerate() {
    if (!prompt.trim()) return
    setLoading(true)
    setResult(null)

    try {
      const res = await fetch('/api/generate-object', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      const data = await res.json()
      setResult(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Badge variant={loading ? 'default' : 'secondary'}>
          {loading ? 'Generating...' : 'Ready'}
        </Badge>
      </div>

      <div className="flex gap-2">
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Generate a recipe for..."
          disabled={loading}
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
        />
        <Button onClick={handleGenerate} disabled={loading || !prompt.trim()}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          <span className="ml-2">Generate</span>
        </Button>
      </div>

      {result && (
        <Card className="p-4">
          <h3 className="font-semibold text-lg mb-2">{result.name}</h3>
          {result.ingredients && (
            <div className="mb-3">
              <h4 className="text-sm font-medium mb-1">Ingredients:</h4>
              <ul className="text-sm text-muted-foreground">
                {result.ingredients.map((ing: any, i: number) => (
                  <li key={i}>• {ing.amount} {ing.name}</li>
                ))}
              </ul>
            </div>
          )}
          {result.steps && (
            <div>
              <h4 className="text-sm font-medium mb-1">Steps:</h4>
              <ol className="text-sm text-muted-foreground list-decimal list-inside">
                {result.steps.map((step: string, i: number) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          )}
        </Card>
      )}

      {!result && !loading && (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          Enter a prompt to generate structured data
        </div>
      )}
    </div>
  )
}

export default function GenerateObjectPage() {
  return <LearningPage content={content} demo={<GenerateObjectDemo />} codeExamples={codeExamples} />
}
