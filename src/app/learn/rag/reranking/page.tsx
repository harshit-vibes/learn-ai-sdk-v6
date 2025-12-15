'use client'

import { useState } from 'react'
import { LearningPage } from '@/components/educational'
import { getPageContent } from '@/lib/education-content'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowUpDown, Search, Loader2, ArrowUp, ArrowDown } from 'lucide-react'

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
  const [results, setResults] = useState<(Document & { rerankScore: number })[] | null>(null)

  const simulateReranking = async () => {
    setIsReranking(true)
    setResults(null)

    // Simulate reranking delay
    await new Promise(resolve => setTimeout(resolve, 1200))

    // Simulate reranking scores based on query relevance
    const queryLower = query.toLowerCase()
    const scored = sampleDocuments.map(doc => {
      let score = doc.initialScore

      // Boost score based on keyword matches
      const keywords = ['machine learning', 'ai', 'artificial intelligence', 'deep learning', 'neural', 'nlp', 'language']
      keywords.forEach(kw => {
        if (queryLower.includes(kw) && doc.text.toLowerCase().includes(kw)) {
          score += 0.15
        }
      })

      // Penalize irrelevant documents
      if (doc.text.toLowerCase().includes('weather') || doc.text.toLowerCase().includes('stock')) {
        score -= 0.3
      }

      return {
        ...doc,
        rerankScore: Math.min(Math.max(score + (Math.random() * 0.1 - 0.05), 0), 1),
      }
    })

    // Sort by rerank score and take topN
    const sorted = scored.sort((a, b) => b.rerankScore - a.rerankScore).slice(0, topN)
    setResults(sorted)
    setIsReranking(false)
  }

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-orange-500/10 border-orange-500/20">
        <div className="flex items-start gap-3">
          <ArrowUpDown className="h-5 w-5 text-orange-500 mt-0.5" />
          <div>
            <h3 className="font-medium">Document Reranking Simulator</h3>
            <p className="text-sm text-muted-foreground mt-1">
              See how reranking improves search results. Initial retrieval scores are approximate;
              reranking uses AI to score documents more precisely against your query.
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
          <Button onClick={simulateReranking} disabled={!query.trim() || isReranking}>
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
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Initial Results */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Stage 1: Initial Retrieval</h3>
            <Badge variant="secondary">Embedding Search</Badge>
          </div>
          <div className="space-y-2">
            {sampleDocuments.map((doc, i) => (
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
          ) : results ? (
            <div className="space-y-2">
              {results.map((doc, i) => {
                const scoreDiff = doc.rerankScore - doc.initialScore
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
                  Reranking filtered {sampleDocuments.length} documents down to {results.length} most relevant
                </p>
              </Card>
            </div>
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
            { name: 'Cohere', model: 'rerank-v3' },
            { name: 'Voyage', model: 'rerank-2' },
            { name: 'Jina', model: 'jina-reranker-v2' },
          ].map((p) => (
            <Card key={p.name} className="p-2">
              <div className="font-medium text-xs">{p.name}</div>
              <div className="text-xs text-muted-foreground">{p.model}</div>
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
