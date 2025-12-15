'use client'

import { LearningPage } from '@/components/educational'
import { getPageContent } from '@/lib/education-content'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Hash, AlertCircle, ArrowRight } from 'lucide-react'

const content = getPageContent('rag/embeddings')!

const codeExamples = [
  {
    title: 'Single Embedding',
    language: 'typescript',
    code: `import { embed } from 'ai'
import { openai } from '@ai-sdk/openai'

const { embedding, usage } = await embed({
  model: openai.embedding('text-embedding-3-small'),
  value: 'The quick brown fox jumps over the lazy dog',
})

console.log('Embedding dimensions:', embedding.length)
console.log('Tokens used:', usage.tokens)`,
  },
  {
    title: 'Batch Embeddings',
    language: 'typescript',
    code: `import { embedMany } from 'ai'

const { embeddings, usage } = await embedMany({
  model: openai.embedding('text-embedding-3-small'),
  values: [
    'First document to embed',
    'Second document to embed',
    'Third document to embed',
  ],
})

console.log('Generated', embeddings.length, 'embeddings')
// Each embedding is a number[]`,
  },
  {
    title: 'Similarity Search',
    language: 'typescript',
    code: `import { embed, cosineSimilarity } from 'ai'

// Embed the query
const { embedding: queryEmbedding } = await embed({
  model,
  value: 'What is machine learning?',
})

// Compare with stored embeddings
const similarities = documents.map(doc => ({
  document: doc,
  score: cosineSimilarity(queryEmbedding, doc.embedding),
}))

// Sort by similarity
const topResults = similarities
  .sort((a, b) => b.score - a.score)
  .slice(0, 5)`,
  },
  {
    title: 'RAG Pipeline',
    language: 'typescript',
    code: `// 1. Embed user query
const { embedding } = await embed({
  model: embeddingModel,
  value: userQuery,
})

// 2. Find similar documents (from vector DB)
const relevantDocs = await vectorDB.search(embedding, { topK: 5 })

// 3. Generate response with context
const { text } = await generateText({
  model: chatModel,
  system: \`Use this context to answer: \${relevantDocs.join('\\n')}\`,
  prompt: userQuery,
})`,
  },
]

function EmbeddingsDemo() {
  const providers = [
    { name: 'OpenAI', models: 'text-embedding-3-small/large, ada-002', dims: '1536-3072' },
    { name: 'Google', models: 'text-embedding-004, gemini-embedding', dims: '768-3072' },
    { name: 'Cohere', models: 'embed-v3.0, embed-multilingual', dims: '1024' },
    { name: 'Mistral', models: 'mistral-embed', dims: '1024' },
    { name: 'Voyage', models: 'voyage-2, voyage-code-2', dims: '1024-1536' },
  ]

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-blue-500/10 border-blue-500/20">
        <div className="flex items-start gap-3">
          <Hash className="h-5 w-5 text-blue-500 mt-0.5" />
          <div>
            <h3 className="font-medium">What are Embeddings?</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Embeddings convert text into numerical vectors that capture semantic meaning.
              Similar texts have vectors that are close together in the embedding space,
              enabling semantic search and similarity comparisons.
            </p>
          </div>
        </div>
      </Card>

      <div>
        <h3 className="font-medium mb-3">Embedding Providers</h3>
        <div className="space-y-2">
          {providers.map((p) => (
            <Card key={p.name} className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-sm">{p.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">{p.models}</span>
                </div>
                <Badge variant="secondary">{p.dims} dims</Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">RAG Flow</h3>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge>Query</Badge>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <Badge variant="secondary">Embed</Badge>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <Badge variant="secondary">Vector Search</Badge>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <Badge variant="secondary">Retrieve Docs</Badge>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <Badge>Generate</Badge>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Key Functions</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-4">
            <code className="text-primary">embed()</code>
            <p className="text-xs text-muted-foreground mt-1">Embed a single text value</p>
          </Card>
          <Card className="p-4">
            <code className="text-primary">embedMany()</code>
            <p className="text-xs text-muted-foreground mt-1">Batch embed multiple values</p>
          </Card>
          <Card className="p-4">
            <code className="text-primary">cosineSimilarity()</code>
            <p className="text-xs text-muted-foreground mt-1">Compare two embeddings</p>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function EmbeddingsPage() {
  return <LearningPage content={content} demo={<EmbeddingsDemo />} codeExamples={codeExamples} />
}
