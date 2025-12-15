'use client'

import { useState } from 'react'
import { LearningPage } from '@/components/educational'
import { getPageContent } from '@/lib/education-content'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Loader2 } from 'lucide-react'

const content = getPageContent('advanced/settings')!

const codeExamples = [
  {
    title: 'Common Settings',
    language: 'typescript',
    code: `const result = await generateText({
  model: gateway('anthropic/claude-sonnet-4'),
  prompt: 'Write a creative story',

  // Creativity control
  temperature: 0.8,  // 0 = deterministic, 2 = very random

  // Length control
  maxTokens: 500,    // Maximum tokens to generate

  // Sampling options
  topP: 0.9,         // Nucleus sampling
  topK: 50,          // Top-K sampling

  // Repetition control
  presencePenalty: 0.5,   // Reduce repeating prompt info
  frequencyPenalty: 0.5,  // Reduce repeating same words

  // Determinism
  seed: 12345,       // For reproducible outputs
})`,
  },
  {
    title: 'Stop Sequences',
    language: 'typescript',
    code: `const result = await generateText({
  model,
  prompt: 'List three items:',
  stopSequences: ['4.', '\\n\\n'],  // Stop at these
})

// Output might be:
// "1. Apple
// 2. Banana
// 3. Cherry"
// (stops before "4.")`,
  },
  {
    title: 'Retry & Timeout',
    language: 'typescript',
    code: `const result = await generateText({
  model,
  prompt: '...',

  // Retry configuration
  maxRetries: 3,  // Default is 2, 0 to disable

  // Timeout via AbortSignal
  abortSignal: AbortSignal.timeout(30000), // 30 seconds

  // Custom headers
  headers: {
    'X-Custom-Header': 'value',
  },
})`,
  },
]

function SettingsDemo() {
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(200)
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleGenerate() {
    if (!prompt.trim()) return
    setLoading(true)
    setResult('')

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, temperature, maxTokens }),
      })
      const data = await res.json()
      setResult(data.text)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Temperature: {temperature}</label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Deterministic</span>
            <span>Creative</span>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Max Tokens: {maxTokens}</label>
          <input
            type="range"
            min="50"
            max="1000"
            step="50"
            value={maxTokens}
            onChange={(e) => setMaxTokens(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Short</span>
            <span>Long</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Write a short story about..."
          disabled={loading}
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
        />
        <Button onClick={handleGenerate} disabled={loading || !prompt.trim()}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Generate'}
        </Button>
      </div>

      <div className="flex gap-2">
        <Badge variant="secondary">temp: {temperature}</Badge>
        <Badge variant="secondary">max: {maxTokens}</Badge>
      </div>

      <ScrollArea className="h-[200px] border rounded-lg p-4">
        {result ? (
          <div className="whitespace-pre-wrap">{result}</div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            Adjust settings above and generate to see how they affect output
          </p>
        )}
      </ScrollArea>
    </div>
  )
}

export default function SettingsPage() {
  return <LearningPage content={content} demo={<SettingsDemo />} codeExamples={codeExamples} />
}
