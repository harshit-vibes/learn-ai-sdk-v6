'use client'

import { LearningPage } from '@/components/educational'
import { getPageContent } from '@/lib/education-content'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Server, Zap, Shield, Globe } from 'lucide-react'

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

function ProvidersDemo() {
  const providers = [
    { name: 'OpenAI', models: 'GPT-4o, GPT-4, GPT-3.5', features: ['Text', 'Vision', 'TTS', 'Embeddings'] },
    { name: 'Anthropic', models: 'Claude 4, Claude Sonnet', features: ['Text', 'Vision', 'Tools'] },
    { name: 'Google', models: 'Gemini 1.5 Pro/Flash', features: ['Text', 'Vision', 'Embeddings'] },
    { name: 'Mistral', models: 'Mistral Large, Codestral', features: ['Text', 'Embeddings'] },
    { name: 'Cohere', models: 'Command R+', features: ['Text', 'Embeddings', 'Reranking'] },
    { name: 'Amazon Bedrock', models: 'Multiple providers', features: ['Text', 'Embeddings'] },
  ]

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-green-500/10 border-green-500/20">
        <div className="flex items-start gap-3">
          <Globe className="h-5 w-5 text-green-500 mt-0.5" />
          <div>
            <h3 className="font-medium">Provider Architecture</h3>
            <p className="text-sm text-muted-foreground mt-1">
              AI SDK provides a unified interface across providers. Write code once,
              switch providers by changing a single line. Use Vercel AI Gateway for
              simplified multi-provider access with a single API key.
            </p>
          </div>
        </div>
      </Card>

      <div>
        <h3 className="font-medium mb-3">Supported Providers</h3>
        <div className="space-y-2">
          {providers.map((p) => (
            <Card key={p.name} className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium">{p.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">{p.models}</span>
                </div>
                <div className="flex gap-1">
                  {p.features.map((f) => (
                    <Badge key={f} variant="secondary" className="text-xs">{f}</Badge>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Approaches</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-primary" />
              <Badge>AI Gateway</Badge>
            </div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Single API key for all providers</li>
              <li>• Managed by Vercel</li>
              <li>• Automatic rate limiting</li>
              <li>• Usage analytics</li>
            </ul>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Server className="h-4 w-4 text-muted-foreground" />
              <Badge variant="secondary">Direct Providers</Badge>
            </div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Separate API key per provider</li>
              <li>• Full control over configuration</li>
              <li>• Direct provider features</li>
              <li>• Lower latency (no proxy)</li>
            </ul>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Model ID Format</h3>
        <Card className="p-4">
          <div className="font-mono text-sm space-y-1">
            <div><Badge variant="secondary">gateway</Badge> anthropic/claude-sonnet-4</div>
            <div><Badge variant="secondary">direct</Badge> claude-sonnet-4-20250514</div>
            <div><Badge variant="secondary">registry</Badge> anthropic:claude-sonnet-4</div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default function ProvidersPage() {
  return <LearningPage content={content} demo={<ProvidersDemo />} codeExamples={codeExamples} />
}
