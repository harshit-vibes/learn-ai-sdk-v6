import { createGateway } from 'ai'

// Create Vercel AI Gateway provider
const gateway = createGateway({
  apiKey: process.env.AI_GATEWAY_API_KEY ?? '',
})

// Export the model function
export const openrouter = (model: string) => gateway(model)

// Models - using Vercel AI Gateway model format
export const MODELS = {
  chat: 'anthropic/claude-sonnet-4',
  tools: 'anthropic/claude-sonnet-4',
} as const
