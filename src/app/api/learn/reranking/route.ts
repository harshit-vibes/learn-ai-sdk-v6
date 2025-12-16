import { NextRequest } from 'next/server'

export const maxDuration = 30

interface Document {
  id: number
  text: string
  source: string
  initialScore: number
}

interface RerankRequest {
  query: string
  documents: Document[]
  topN: number
}

export async function POST(req: NextRequest) {
  const { query, documents, topN }: RerankRequest = await req.json()

  const cohereApiKey = process.env.COHERE_API_KEY

  // If no Cohere API key, provide enhanced simulation with setup guide
  if (!cohereApiKey) {
    await new Promise(resolve => setTimeout(resolve, 800))

    // Enhanced simulation that considers query relevance
    const queryLower = query.toLowerCase()
    const keywords = extractKeywords(queryLower)

    const scoredDocs = documents.map(doc => {
      const docLower = doc.text.toLowerCase()
      let relevanceScore = doc.initialScore

      // Boost for keyword matches
      keywords.forEach(keyword => {
        if (docLower.includes(keyword)) {
          relevanceScore += 0.1
        }
      })

      // Semantic similarity simulation
      if (queryLower.includes('machine learning') || queryLower.includes('ai')) {
        if (docLower.includes('machine learning') || docLower.includes('artificial intelligence') || docLower.includes('deep learning')) {
          relevanceScore += 0.2
        }
      }

      // Penalize clearly irrelevant documents
      if ((queryLower.includes('machine learning') || queryLower.includes('ai')) &&
          (docLower.includes('weather') || docLower.includes('stock market'))) {
        relevanceScore -= 0.3
      }

      // Add slight randomness for realism
      relevanceScore += (Math.random() * 0.1 - 0.05)

      return {
        ...doc,
        rerankScore: Math.min(Math.max(relevanceScore, 0), 1),
      }
    })

    // Sort by rerank score and take topN
    const results = scoredDocs
      .sort((a, b) => b.rerankScore - a.rerankScore)
      .slice(0, topN)

    return Response.json({
      success: true,
      simulated: true,
      results,
      setupGuide: {
        step1: "Get a free API key at https://dashboard.cohere.com",
        step2: "Add COHERE_API_KEY to your .env.local file",
        step3: "Restart the development server",
      }
    })
  }

  try {
    // Use Cohere's Rerank API
    const response = await fetch('https://api.cohere.ai/v1/rerank', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cohereApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'rerank-english-v3.0',
        query,
        documents: documents.map(d => d.text),
        top_n: topN,
        return_documents: true,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Cohere API error: ${error}`)
    }

    const data = await response.json()

    // Map Cohere results back to our document format
    const results = data.results.map((result: { index: number; relevance_score: number }) => ({
      ...documents[result.index],
      rerankScore: result.relevance_score,
    }))

    return Response.json({
      success: true,
      simulated: false,
      results,
    })
  } catch (error) {
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Reranking failed',
    }, { status: 500 })
  }
}

function extractKeywords(text: string): string[] {
  const stopWords = new Set(['the', 'a', 'an', 'is', 'are', 'was', 'were', 'what', 'how', 'and', 'or', 'in', 'on', 'at', 'to', 'for'])
  return text
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word))
}
