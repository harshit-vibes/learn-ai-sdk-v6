'use client'

import { useState } from 'react'
import { LearningPage } from '@/components/educational'
import { getPageContent } from '@/lib/education-content'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Zap, Clock, Coins } from 'lucide-react'

const content = getPageContent('advanced/providers')!

const codeExamples = [
  {
    title: 'Vercel AI Gateway',
    language: 'typescript',
    code: `import { createGateway } from 'ai'

// Single API key accesses multiple providers
const gateway = createGateway({
  apiKey: process.env.AI_GATEWAY_API_KEY,
})

// Use any model through the gateway
const anthropic = gateway('anthropic/claude-sonnet-4')
const openai = gateway('openai/gpt-4o')
const google = gateway('google/gemini-1.5-pro')`,
  },
  {
    title: 'Direct Provider Setup',
    language: 'typescript',
    code: `import { anthropic } from '@ai-sdk/anthropic'
import { openai } from '@ai-sdk/openai'
import { google } from '@ai-sdk/google'

// Each provider uses its own API key
const claude = anthropic('claude-sonnet-4-20250514')
const gpt = openai('gpt-4o')
const gemini = google('gemini-1.5-pro')

// Use in generation
const result = await generateText({
  model: claude, // or gpt, or gemini
  prompt: 'Hello!',
})`,
  },
  {
    title: 'Provider Registry',
    language: 'typescript',
    code: `import { createProviderRegistry, anthropic, openai } from 'ai'

const registry = createProviderRegistry({
  anthropic,
  openai,
})

// Get model by string ID
const model = registry.languageModel('anthropic:claude-sonnet-4')

// Useful for dynamic model selection
const userModel = registry.languageModel(userSelectedModelId)`,
  },
  {
    title: 'Custom Provider',
    language: 'typescript',
    code: `import { customProvider } from 'ai'

const myProvider = customProvider({
  languageModels: {
    'my-model': createCustomModel({
      // Custom implementation
    }),
  },
  textEmbeddingModels: {
    'my-embeddings': createCustomEmbedding({
      // Custom implementation
    }),
  },
})`,
  },
]

const models = [
  { id: 'anthropic/claude-sonnet-4', name: 'Claude Sonnet 4', provider: 'Anthropic', badge: 'Recommended' },
  { id: 'anthropic/claude-haiku', name: 'Claude Haiku', provider: 'Anthropic', badge: 'Fast' },
  { id: 'openai/gpt-4o', name: 'GPT-4o', provider: 'OpenAI', badge: null },
  { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI', badge: 'Budget' },
  { id: 'google/gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'Google', badge: null },
  { id: 'google/gemini-1.5-flash', name: 'Gemini 1.5 Flash', provider: 'Google', badge: 'Fast' },
]

function ProvidersDemo() {
  const [selectedModel, setSelectedModel] = useState(models[0].id)
  const [prompt, setPrompt] = useState('Explain quantum computing in one sentence.')
  const [result, setResult] = useState<{
    text: string
    model: string
    latencyMs: number
    usage?: { promptTokens: number; completionTokens: number }
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleGenerate() {
    if (!prompt.trim()) return
    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const res = await fetch('/api/provider-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, model: selectedModel }),
      })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setResult(data)
      }
    } catch (err) {
      setError('Failed to connect to API')
    } finally {
      setLoading(false)
    }
  }

  const selectedModelInfo = models.find(m => m.id === selectedModel)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Badge variant="outline">Model Switcher</Badge>
        <span className="text-sm text-muted-foreground">
          Test different models with the same prompt
        </span>
      </div>

      {/* Model Selection */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {models.map((model) => (
          <Card
            key={model.id}
            className={`p-3 cursor-pointer transition-all ${
              selectedModel === model.id
                ? 'ring-2 ring-primary bg-primary/5'
                : 'hover:bg-muted/50'
            }`}
            onClick={() => setSelectedModel(model.id)}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">{model.name}</div>
                <div className="text-xs text-muted-foreground">{model.provider}</div>
              </div>
              {model.badge && (
                <Badge variant="secondary" className="text-xs">
                  {model.badge}
                </Badge>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Prompt Input */}
      <div className="flex gap-2">
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a prompt..."
          className="flex-1"
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
        />
        <Button onClick={handleGenerate} disabled={loading || !prompt.trim()}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
          <span className="ml-2">Generate</span>
        </Button>
      </div>

      {/* Result */}
      {result && (
        <Card className="p-4 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge>{selectedModelInfo?.provider}</Badge>
            <Badge variant="secondary">{selectedModelInfo?.name}</Badge>
          </div>
          <p className="text-sm">{result.text}</p>
          <div className="flex gap-4 text-xs text-muted-foreground border-t pt-3">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {result.latencyMs}ms
            </span>
            {result.usage && (
              <span className="flex items-center gap-1">
                <Coins className="h-3 w-3" />
                {result.usage.promptTokens + result.usage.completionTokens} tokens
              </span>
            )}
          </div>
        </Card>
      )}

      {error && (
        <Card className="p-4 bg-destructive/10 border-destructive/20">
          <p className="text-sm text-destructive">{error}</p>
        </Card>
      )}

      {!result && !error && !loading && (
        <Card className="p-8 text-center text-muted-foreground">
          <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="font-medium">Select a model and generate</p>
          <p className="text-sm">Compare responses across different providers</p>
        </Card>
      )}
    </div>
  )
}

export default function ProvidersPage() {
  return <LearningPage content={content} demo={<ProvidersDemo />} codeExamples={codeExamples} />
}
