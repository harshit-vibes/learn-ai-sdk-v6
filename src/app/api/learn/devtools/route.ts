import { NextRequest } from 'next/server'

export const maxDuration = 30

// In-memory request log (in production, use Redis or similar)
// This is a simple demo - requests are lost on server restart
interface LoggedRequest {
  id: string
  method: string
  timestamp: string
  model: string
  status: 'success' | 'error' | 'streaming'
  tokens: { prompt: number; completion: number }
  latency: number
  prompt: string
  response?: string
  metadata?: Record<string, unknown>
}

// Global request store (persists across requests in same server instance)
const requestStore: LoggedRequest[] = []
const MAX_REQUESTS = 50

// Generate sample requests if store is empty (for demo purposes)
function ensureSampleRequests() {
  if (requestStore.length > 0) return

  const sampleRequests: LoggedRequest[] = [
    {
      id: `req_${Date.now()}_1`,
      method: 'generateText',
      timestamp: new Date(Date.now() - 60000).toLocaleTimeString(),
      model: 'anthropic/claude-sonnet-4',
      status: 'success',
      tokens: { prompt: 45, completion: 128 },
      latency: 1240,
      prompt: 'Explain quantum computing in simple terms',
      response: 'Quantum computing uses quantum bits or qubits that can exist in multiple states simultaneously...',
      metadata: { temperature: 0.7, maxOutputTokens: 500 },
    },
    {
      id: `req_${Date.now()}_2`,
      method: 'streamText',
      timestamp: new Date(Date.now() - 120000).toLocaleTimeString(),
      model: 'anthropic/claude-sonnet-4',
      status: 'success',
      tokens: { prompt: 32, completion: 67 },
      latency: 890,
      prompt: 'Write a haiku about programming',
      response: 'Code flows like water\nBugs emerge from the shadows\nDebug brings the light',
      metadata: { streaming: true },
    },
    {
      id: `req_${Date.now()}_3`,
      method: 'generateObject',
      timestamp: new Date(Date.now() - 180000).toLocaleTimeString(),
      model: 'anthropic/claude-sonnet-4',
      status: 'success',
      tokens: { prompt: 89, completion: 234 },
      latency: 2100,
      prompt: 'Extract user data from: John Doe, john@example.com, age 30',
      response: '{ "name": "John Doe", "email": "john@example.com", "age": 30 }',
      metadata: { schema: 'UserProfile' },
    },
  ]

  requestStore.push(...sampleRequests)
}

export async function GET() {
  ensureSampleRequests()

  return Response.json({
    success: true,
    requests: requestStore.slice(-MAX_REQUESTS).reverse(),
    count: requestStore.length,
    maxRequests: MAX_REQUESTS,
  })
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  if (body.action === 'log') {
    // Log a new request
    const newRequest: LoggedRequest = {
      id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      method: body.method || 'unknown',
      timestamp: new Date().toLocaleTimeString(),
      model: body.model || 'unknown',
      status: body.status || 'success',
      tokens: body.tokens || { prompt: 0, completion: 0 },
      latency: body.latency || 0,
      prompt: body.prompt || '',
      response: body.response,
      metadata: body.metadata,
    }

    requestStore.push(newRequest)

    // Keep only last MAX_REQUESTS
    while (requestStore.length > MAX_REQUESTS) {
      requestStore.shift()
    }

    return Response.json({
      success: true,
      request: newRequest,
    })
  }

  if (body.action === 'clear') {
    requestStore.length = 0
    return Response.json({
      success: true,
      message: 'Request log cleared',
    })
  }

  if (body.action === 'simulate') {
    // Simulate a real AI call for demo purposes
    const methods = ['generateText', 'streamText', 'generateObject', 'useChat']
    const models = ['anthropic/claude-sonnet-4', 'openai/gpt-4o', 'google/gemini-1.5-pro']
    const prompts = [
      'Explain machine learning',
      'Write a function to sort an array',
      'What is the capital of France?',
      'Generate a product description',
      'Summarize this article...',
    ]

    const simulated: LoggedRequest = {
      id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      method: methods[Math.floor(Math.random() * methods.length)],
      timestamp: new Date().toLocaleTimeString(),
      model: models[Math.floor(Math.random() * models.length)],
      status: Math.random() > 0.9 ? 'error' : 'success',
      tokens: {
        prompt: Math.floor(20 + Math.random() * 100),
        completion: Math.floor(50 + Math.random() * 200),
      },
      latency: Math.floor(500 + Math.random() * 2000),
      prompt: prompts[Math.floor(Math.random() * prompts.length)],
      response: 'Simulated response content...',
      metadata: { simulated: true },
    }

    requestStore.push(simulated)

    return Response.json({
      success: true,
      request: simulated,
    })
  }

  return Response.json({
    success: false,
    error: 'Invalid action. Use: log, clear, or simulate',
  })
}
