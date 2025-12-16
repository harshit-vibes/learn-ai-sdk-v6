'use client'

import { useState } from 'react'
import { LearningPage } from '@/components/educational'
import { getPageContent } from '@/lib/education-content'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowUpDown, Search, Loader2, ArrowUp, ArrowDown, AlertCircle, ExternalLink } from 'lucide-react'

const content = getPageContent('rag/reranking')!

const codeExamples = [
  {
    title: 'Basic Reranking',
    language: 'typescript',
    code: `import { experimental_rerank as rerank } from 'ai'
import { cohere } from '@ai-sdk/cohere'

const { results } = await rerank({
  model: cohere.reranker('rerank-v3'),
  query: 'What is machine learning?',
  documents: [
    'Machine learning is a type of artificial intelligence...',
    'The weather today is sunny and warm...',
    'Deep learning is a subset of machine learning...',
  ],
  topN: 2, // Return top 2 results
})

results.forEach(result => {
  console.log(\`Score: \${result.relevanceScore}\`)
  console.log(\`Document: \${result.document}\`)
})`,
  },
  {
    title: 'Two-Stage Retrieval',
    language: 'typescript',
    code: `// Stage 1: Fast embedding search (retrieve many)
const candidates = await vectorDB.search(queryEmbedding, {
  topK: 100, // Get 100 candidates
})

// Stage 2: Precise reranking (filter to best)
const { results } = await rerank({
  model: cohere.reranker('rerank-v3'),
  query: userQuery,
  documents: candidates.map(c => c.text),
  topN: 5, // Keep top 5
})

// Use top reranked results for generation`,
  },
  {
    title: 'With Metadata',
    language: 'typescript',
    code: `// Documents with metadata
const documentsWithMeta = [
  { id: '1', text: 'Document content...', source: 'wiki' },
  { id: '2', text: 'Another document...', source: 'docs' },
]

const { results } = await rerank({
  model,
  query,
  documents: documentsWithMeta.map(d => d.text),
  topN: 5,
})

// Map back to original documents with metadata
const rankedDocs = results.map(r => ({
  ...documentsWithMeta[r.index],
  score: r.relevanceScore,
}))`,
  },
]

interface Document {
  id: number
  text: string
  source: string
  initialScore: number
}

interface RankedDocument extends Document {
  rerankScore: number
}

interface RerankResult {
  success: boolean
  simulated?: boolean
  results?: RankedDocument[]
  setupGuide?: {
    step1: string
    step2: string
    step3: string
  }
  error?: string
}

const sampleDocuments: Document[] = [
  { id: 1, text: 'Machine learning is a subset of artificial intelligence that enables systems to learn from data.', source: 'wiki', initialScore: 0.72 },
  { id: 2, text: 'The weather forecast predicts sunny skies with temperatures reaching 75°F.', source: 'news', initialScore: 0.45 },
  { id: 3, text: 'Deep learning uses neural networks with multiple layers to model complex patterns.', source: 'docs', initialScore: 0.68 },
  { id: 4, text: 'Python is a popular programming language often used in AI development.', source: 'wiki', initialScore: 0.55 },
  { id: 5, text: 'Natural language processing allows computers to understand human language.', source: 'docs', initialScore: 0.61 },
  { id: 6, text: 'The stock market showed gains in the technology sector yesterday.', source: 'news', initialScore: 0.38 },
]

function RerankingDemo() {
  const [query, setQuery] = useState('What is machine learning and AI?')
  const [topN, setTopN] = useState(3)
  const [isReranking, setIsReranking] = useState(false)
  const [result, setResult] = useState<RerankResult | null>(null)

  const rerank = async () => {
    setIsReranking(true)
    setResult(null)

    try {
      const response = await fetch('/api/learn/reranking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          documents: sampleDocuments,
          topN,
        }),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Reranking failed',
      })
    } finally {
      setIsReranking(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-orange-500/10 border-orange-500/20">
        <div className="flex items-start gap-3">
          <ArrowUpDown className="h-5 w-5 text-orange-500 mt-0.5" />
          <div>
            <h3 className="font-medium">Live Document Reranking</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Enter a query to rerank documents using AI. Uses Cohere&apos;s Rerank API for precise semantic scoring.
            </p>
          </div>
        </div>
      </Card>

      {/* Query Input */}
      <div className="space-y-3">
        <label className="text-sm font-medium">Search Query</label>
        <div className="flex gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your search query..."
            className="flex-1"
          />
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Top</span>
            <select
              value={topN}
              onChange={(e) => setTopN(Number(e.target.value))}
              className="h-9 rounded-md border bg-background px-2 text-sm"
            >
              {[2, 3, 4, 5].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <Button onClick={rerank} disabled={!query.trim() || isReranking}>
            {isReranking ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Reranking...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Rerank
              </>
            )}
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setQuery('What is machine learning and AI?')}>
            ML/AI query
          </Button>
          <Button variant="outline" size="sm" onClick={() => setQuery('programming languages for data science')}>
            Programming
          </Button>
          <Button variant="outline" size="sm" onClick={() => setQuery('weather forecast today')}>
            Weather
          </Button>
        </div>
      </div>

      {/* Simulated Warning */}
      {result?.simulated && (
        <Card className="p-3 bg-amber-500/10 border-amber-500/20">
          <div className="flex items-center gap-2 text-amber-500 mb-2">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Simulated Reranking</span>
          </div>
          {result.setupGuide && (
            <div className="text-xs text-muted-foreground space-y-1">
              <p>To enable real Cohere reranking:</p>
              <ol className="list-decimal list-inside pl-2">
                <li>{result.setupGuide.step1}</li>
                <li>{result.setupGuide.step2}</li>
                <li>{result.setupGuide.step3}</li>
              </ol>
              <a
                href="https://dashboard.cohere.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline mt-2"
              >
                Get free Cohere API key <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Initial Results */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Stage 1: Initial Retrieval</h3>
            <Badge variant="secondary">Embedding Search</Badge>
          </div>
          <div className="space-y-2">
            {sampleDocuments.map((doc) => (
              <Card key={doc.id} className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-sm">{doc.text}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">{doc.source}</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-mono">{doc.initialScore.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">score</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Reranked Results */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Stage 2: Reranked</h3>
            <Badge>AI Reranker</Badge>
          </div>
          {isReranking ? (
            <Card className="p-8 flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
              <p className="text-sm text-muted-foreground">Scoring relevance with AI...</p>
            </Card>
          ) : result?.success && result.results ? (
            <div className="space-y-2">
              {result.results.map((doc, i) => {
                const originalDoc = sampleDocuments.find(d => d.id === doc.id)
                const scoreDiff = doc.rerankScore - (originalDoc?.initialScore || 0)
                const improved = scoreDiff > 0
                return (
                  <Card key={doc.id} className="p-3 border-primary/30 bg-primary/5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className="text-xs">#{i + 1}</Badge>
                        </div>
                        <p className="text-sm">{doc.text}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">{doc.source}</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-mono font-bold text-primary">
                          {doc.rerankScore.toFixed(2)}
                        </div>
                        <div className={`text-xs flex items-center gap-0.5 ${improved ? 'text-green-500' : 'text-red-500'}`}>
                          {improved ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                          {Math.abs(scoreDiff).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })}
              <Card className="p-3 bg-muted/50">
                <p className="text-xs text-muted-foreground text-center">
                  Reranking filtered {sampleDocuments.length} documents down to {result.results.length} most relevant
                </p>
              </Card>
            </div>
          ) : result?.error ? (
            <Card className="p-8 flex flex-col items-center justify-center text-center">
              <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
              <p className="text-sm text-red-500">{result.error}</p>
            </Card>
          ) : (
            <Card className="p-8 flex flex-col items-center justify-center text-center">
              <ArrowUpDown className="h-8 w-8 text-muted-foreground mb-2 opacity-30" />
              <p className="text-sm text-muted-foreground">
                Enter a query and click &quot;Rerank&quot; to see improved results
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* Supported Providers */}
      <div>
        <h3 className="font-medium mb-3">Reranking Providers</h3>
        <div className="grid grid-cols-3 gap-2">
          {[
            { name: 'Cohere', model: 'rerank-v3', active: true },
            { name: 'Voyage', model: 'rerank-2', active: false },
            { name: 'Jina', model: 'jina-reranker-v2', active: false },
          ].map((p) => (
            <Card key={p.name} className={`p-2 ${p.active ? 'border-primary/30' : ''}`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-xs">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.model}</div>
                </div>
                {p.active && <Badge variant="secondary" className="text-xs">Active</Badge>}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function RerankingPage() {
  return <LearningPage content={content} demo={<RerankingDemo />} codeExamples={codeExamples} />
}
