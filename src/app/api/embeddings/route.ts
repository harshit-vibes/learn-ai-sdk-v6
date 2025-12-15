import { embed } from 'ai'
import { openrouter } from '@/lib/openrouter'

export const maxDuration = 30

export async function POST(req: Request) {
  const { text1, text2 } = await req.json()

  // Note: Embeddings require an embedding model, which may not be available via all gateways
  // This is a demonstration of the API pattern
  try {
    // For demo purposes, we'll simulate embeddings if no embedding model is available
    // In production, you'd use: openai.embedding('text-embedding-3-small')

    // Simulate embedding generation with deterministic pseudo-embeddings
    const generatePseudoEmbedding = (text: string): number[] => {
      const embedding = new Array(128).fill(0)
      const words = text.toLowerCase().split(/\s+/)
      words.forEach((word, i) => {
        const hash = word.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
        embedding[hash % 128] += 1 / words.length
        embedding[(hash * 31) % 128] += 0.5 / words.length
      })
      // Normalize
      const magnitude = Math.sqrt(embedding.reduce((acc, val) => acc + val * val, 0))
      return embedding.map(val => val / (magnitude || 1))
    }

    const embedding1 = generatePseudoEmbedding(text1)
    const embedding2 = generatePseudoEmbedding(text2)

    // Calculate cosine similarity
    const dotProduct = embedding1.reduce((acc, val, i) => acc + val * embedding2[i], 0)
    const similarity = Math.max(0, Math.min(1, dotProduct))

    return Response.json({
      similarity: Math.round(similarity * 100) / 100,
      dimensions: embedding1.length,
      interpretation: similarity > 0.8 ? 'Very similar' :
                     similarity > 0.6 ? 'Somewhat similar' :
                     similarity > 0.4 ? 'Slightly related' :
                     'Different topics',
    })
  } catch (error) {
    console.error('Embedding error:', error)
    return Response.json({ error: 'Failed to generate embeddings' }, { status: 500 })
  }
}
