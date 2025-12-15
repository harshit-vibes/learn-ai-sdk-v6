'use client'

import { useState } from 'react'
import { LearningPage } from '@/components/educational'
import { getPageContent } from '@/lib/education-content'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, ArrowLeftRight, Sparkles } from 'lucide-react'

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
  const [text1, setText1] = useState('Machine learning is a type of artificial intelligence that allows computers to learn from data.')
  const [text2, setText2] = useState('AI systems can improve their performance by analyzing patterns in large datasets.')
  const [result, setResult] = useState<{ similarity: number; interpretation: string; dimensions: number } | null>(null)
  const [loading, setLoading] = useState(false)

  const compareSamples = [
    { label: 'Similar', t1: 'The cat sat on the mat', t2: 'A feline was resting on the rug' },
    { label: 'Different', t1: 'The weather is sunny today', t2: 'Python is a programming language' },
    { label: 'Related', t1: 'I love pizza', t2: 'Italian food is delicious' },
  ]

  async function handleCompare() {
    if (!text1.trim() || !text2.trim()) return
    setLoading(true)
    setResult(null)

    try {
      const res = await fetch('/api/embeddings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text1, text2 }),
      })
      const data = await res.json()
      setResult(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const getSimilarityColor = (score: number) => {
    if (score > 0.7) return 'text-green-500'
    if (score > 0.4) return 'text-yellow-500'
    return 'text-red-500'
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="outline">Semantic Similarity Calculator</Badge>
        {compareSamples.map((sample) => (
          <Button
            key={sample.label}
            variant="ghost"
            size="sm"
            onClick={() => {
              setText1(sample.t1)
              setText2(sample.t2)
              setResult(null)
            }}
          >
            Try: {sample.label}
          </Button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Text 1</label>
          <Textarea
            value={text1}
            onChange={(e) => { setText1(e.target.value); setResult(null) }}
            placeholder="Enter first text..."
            rows={4}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Text 2</label>
          <Textarea
            value={text2}
            onChange={(e) => { setText2(e.target.value); setResult(null) }}
            placeholder="Enter second text..."
            rows={4}
          />
        </div>
      </div>

      <Button
        onClick={handleCompare}
        disabled={loading || !text1.trim() || !text2.trim()}
        className="w-full"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <ArrowLeftRight className="h-4 w-4 mr-2" />
        )}
        Compare Semantic Similarity
      </Button>

      {result && (
        <Card className="p-6">
          <div className="text-center space-y-4">
            <div>
              <div className={`text-5xl font-bold ${getSimilarityColor(result.similarity)}`}>
                {Math.round(result.similarity * 100)}%
              </div>
              <div className="text-sm text-muted-foreground mt-1">Similarity Score</div>
            </div>

            <div className="flex justify-center">
              <Badge variant="secondary" className="text-lg px-4 py-1">
                {result.interpretation}
              </Badge>
            </div>

            {/* Visual similarity bar */}
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  result.similarity > 0.7 ? 'bg-green-500' :
                  result.similarity > 0.4 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${result.similarity * 100}%` }}
              />
            </div>

            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Different</span>
              <span>Related</span>
              <span>Similar</span>
              <span>Identical</span>
            </div>

            <p className="text-xs text-muted-foreground border-t pt-4">
              Embeddings converted to {result.dimensions}-dimensional vectors and compared using cosine similarity.
              In production, use OpenAI&apos;s text-embedding-3-small (1536 dims) or similar models.
            </p>
          </div>
        </Card>
      )}

      {!result && !loading && (
        <Card className="p-8 text-center text-muted-foreground">
          <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="font-medium">Enter two texts and click Compare</p>
          <p className="text-sm">See how semantically similar they are</p>
        </Card>
      )}
    </div>
  )
}

export default function EmbeddingsPage() {
  return <LearningPage content={content} demo={<EmbeddingsDemo />} codeExamples={codeExamples} />
}
