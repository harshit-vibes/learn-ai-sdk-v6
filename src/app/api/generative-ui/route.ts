import { streamText, UIMessage, convertToModelMessages, stepCountIs } from 'ai'
import { z } from 'zod'
import { openrouter, MODELS } from '@/lib/openrouter'

export const maxDuration = 30

// Define tool parameters schemas
const weatherParams = z.object({
  location: z.string().describe('City name'),
})

const stockParams = z.object({
  symbol: z.string().describe('Stock ticker symbol like AAPL, GOOGL'),
})

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: openrouter(MODELS.tools),
    system: `You have access to tools. When the user asks about weather, use the getWeather tool. When they ask about stocks, use the getStock tool. Always respond with a summary after using tools.`,
    messages: convertToModelMessages(messages),
    tools: {
      getWeather: {
        description: 'Get current weather for any city',
        inputSchema: weatherParams,
        execute: async ({ location }: z.infer<typeof weatherParams>) => {
          const conditions = ['sunny', 'cloudy', 'rainy', 'partly cloudy']
          return {
            location,
            temperature: Math.floor(Math.random() * 30) + 5,
            condition: conditions[Math.floor(Math.random() * conditions.length)],
          }
        },
      },
      getStock: {
        description: 'Get stock price for a ticker symbol',
        inputSchema: stockParams,
        execute: async ({ symbol }: z.infer<typeof stockParams>) => ({
          symbol: symbol.toUpperCase(),
          price: Math.random() * 500 + 50,
          change: (Math.random() - 0.5) * 10,
        }),
      },
    },
    stopWhen: stepCountIs(5),
  })

  return result.toUIMessageStreamResponse()
}
