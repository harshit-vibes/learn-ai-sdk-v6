import { streamText, stepCountIs } from 'ai'
import { openrouter, MODELS } from '@/lib/openrouter'
import { z } from 'zod'

export const maxDuration = 30

export async function POST(req: Request) {
  const { scenario } = await req.json()

  // Different scenarios for demonstrating streaming
  if (scenario === 'simple') {
    // Simple text streaming
    const result = streamText({
      model: openrouter(MODELS.chat),
      prompt: 'Write a single short sentence about AI. Be concise.',
      maxOutputTokens: 50,
    })

    return result.toTextStreamResponse()
  } else if (scenario === 'tools') {
    // Tool calling demonstration
    const result = streamText({
      model: openrouter(MODELS.tools),
      prompt: 'What is the weather in Paris? Use the weather tool to check.',
      tools: {
        getWeather: {
          description: 'Get the current weather for a city',
          inputSchema: z.object({
            city: z.string().describe('The city name'),
          }),
          execute: async ({ city }) => {
            // Simulated weather data
            return {
              city,
              temperature: Math.round(15 + Math.random() * 15),
              condition: ['sunny', 'cloudy', 'rainy'][Math.floor(Math.random() * 3)],
            }
          },
        },
      },
      stopWhen: stepCountIs(3),
    })

    return result.toUIMessageStreamResponse()
  } else if (scenario === 'complex') {
    // Multi-step tool calling
    const result = streamText({
      model: openrouter(MODELS.tools),
      prompt: 'First search for AI SDK documentation, then summarize what you find.',
      tools: {
        searchDocs: {
          description: 'Search documentation',
          inputSchema: z.object({
            query: z.string().describe('Search query'),
          }),
          execute: async () => {
            return {
              results: [
                { title: 'AI SDK Overview', content: 'The AI SDK is a TypeScript toolkit for building AI applications.' },
                { title: 'Streaming Guide', content: 'Learn how to stream responses from AI models.' },
                { title: 'Tool Calling', content: 'Enable AI models to call functions and tools.' },
              ],
            }
          },
        },
        summarize: {
          description: 'Summarize content',
          inputSchema: z.object({
            content: z.string().describe('Content to summarize'),
          }),
          execute: async () => {
            return { summary: 'AI SDK provides streaming, tool calling, and TypeScript support.' }
          },
        },
      },
      stopWhen: stepCountIs(5),
    })

    return result.toUIMessageStreamResponse()
  } else if (scenario === 'error') {
    // Error handling demonstration
    const result = streamText({
      model: openrouter(MODELS.tools),
      prompt: 'Call the risky operation tool.',
      tools: {
        riskyOperation: {
          description: 'A risky operation that might fail',
          inputSchema: z.object({}),
          execute: async () => {
            throw new Error('Operation timed out after 30s')
          },
        },
      },
      stopWhen: stepCountIs(2),
    })

    return result.toUIMessageStreamResponse()
  }

  return Response.json({ error: 'Invalid scenario' }, { status: 400 })
}
