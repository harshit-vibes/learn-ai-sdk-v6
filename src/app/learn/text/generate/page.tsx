'use client'

import { useState } from 'react'
import { LearningPage } from '@/components/educational'
import { getPageContent } from '@/lib/education-content'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Loader2, Sparkles } from 'lucide-react'

const content = getPageContent('text/generate')!

const codeExamples = [
  {
    title: 'Server Action',
    language: 'typescript',
    code: `'use server'

import { generateText } from 'ai'
import { createGateway } from 'ai'

const gateway = createGateway({
  apiKey: process.env.AI_GATEWAY_API_KEY!,
})

export async function generate(prompt: string) {
  const { text, usage, finishReason } = await generateText({
    model: gateway('anthropic/claude-sonnet-4'),
    prompt,
  })

  return { text, usage, finishReason }
}`,
  },
  {
    title: 'Client Usage',
    language: 'tsx',
    code: `'use client'

import { generate } from './actions'

export function GenerateDemo() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleGenerate(prompt: string) {
    setLoading(true)
    const result = await generate(prompt)
    setResult(result)
    setLoading(false)
  }

  return (
    <div>
      <button onClick={() => handleGenerate('Write a haiku')}>
        Generate
      </button>
      {result && <p>{result.text}</p>}
    </div>
  )
}`,
  },
]

function GenerateDemo() {
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState<{ text: string; usage?: any } | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleGenerate() {
    if (!prompt.trim()) return
    setLoading(true)
    setResult(null)

    try {
      const res = await fetch('/api/generate-text', {
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
          placeholder="Write a haiku about coding..."
          disabled={loading}
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
        />
        <Button onClick={handleGenerate} disabled={loading || !prompt.trim()}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          <span className="ml-2">Generate</span>
        </Button>
      </div>

      {result && (
        <Card className="p-4 space-y-3">
          <div className="whitespace-pre-wrap">{result.text}</div>
          {result.usage && (
            <div className="flex gap-4 text-xs text-muted-foreground border-t pt-2">
              <span>Prompt tokens: {result.usage.promptTokens}</span>
              <span>Completion tokens: {result.usage.completionTokens}</span>
            </div>
          )}
        </Card>
      )}

      {!result && !loading && (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          Enter a prompt and click Generate
        </div>
      )}
    </div>
  )
}

export default function GenerateTextPage() {
  return <LearningPage content={content} demo={<GenerateDemo />} codeExamples={codeExamples} />
}
