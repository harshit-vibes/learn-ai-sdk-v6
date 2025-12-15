'use client'

import { LearningPage } from '@/components/educational'
import { getPageContent } from '@/lib/education-content'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowUpDown, AlertCircle, Search, Filter, ListOrdered } from 'lucide-react'

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

function RerankingDemo() {
  return (
    <div className="space-y-6">
      <Card className="p-4 bg-blue-500/10 border-blue-500/20">
        <div className="flex items-start gap-3">
          <ArrowUpDown className="h-5 w-5 text-blue-500 mt-0.5" />
          <div>
            <h3 className="font-medium">What is Reranking?</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Reranking improves search quality by scoring document relevance more precisely.
              After initial retrieval (fast but approximate), reranking uses an AI model
              to score how well each document matches the query.
            </p>
          </div>
        </div>
      </Card>

      <div>
        <h3 className="font-medium mb-3">Two-Stage Retrieval Pipeline</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Badge>Stage 1: Retrieve</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Fast embedding search retrieves many candidates (e.g., 100 documents).
              Quick but approximate matching.
            </p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <ListOrdered className="h-4 w-4 text-muted-foreground" />
              <Badge variant="secondary">Stage 2: Rerank</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              AI model scores relevance of each candidate.
              Slower but much more precise.
            </p>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Supported Providers</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: 'Cohere', model: 'rerank-v3.0, rerank-english-v3.0' },
            { name: 'Voyage', model: 'rerank-2, rerank-lite-2' },
            { name: 'Jina', model: 'jina-reranker-v2-base' },
          ].map((p) => (
            <Card key={p.name} className="p-3">
              <div className="font-medium text-sm">{p.name}</div>
              <div className="text-xs text-muted-foreground">{p.model}</div>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">When to Use Reranking</h3>
        <div className="space-y-2">
          {[
            'High-precision search applications',
            'RAG systems where context quality matters',
            'When embedding similarity alone isn\'t accurate enough',
            'Legal, medical, or technical document search',
          ].map((use, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="h-3 w-3" />
              {use}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Output</h3>
        <Card className="p-4">
          <code className="text-sm">results: Array&lt;&#123; document, relevanceScore, index &#125;&gt;</code>
          <p className="text-xs text-muted-foreground mt-2">
            Each result contains the document text, a relevance score (0-1),
            and the original index for mapping back to your data.
          </p>
        </Card>
      </div>
    </div>
  )
}

export default function RerankingPage() {
  return <LearningPage content={content} demo={<RerankingDemo />} codeExamples={codeExamples} />
}
