import { streamText, UIMessage, convertToModelMessages, stepCountIs } from 'ai'
import { z } from 'zod'
import { openrouter, MODELS } from '@/lib/openrouter'

export const maxDuration = 30

// Define tool parameters schemas
const weatherParams = z.object({
  location: z.string().describe('City name'),
})

const calculatorParams = z.object({
  expression: z.string().describe('Math expression like "15 * 0.15"'),
})

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: openrouter(MODELS.tools),
    system: `You have access to tools. Use the weather tool for weather questions and calculator for math. Always respond with the result after using a tool.`,
    messages: convertToModelMessages(messages),
    tools: {
      weather: {
        description: 'Get current weather for any city',
        inputSchema: weatherParams,
        execute: async ({ location }: z.infer<typeof weatherParams>) => {
          const conditions = ['sunny', 'cloudy', 'rainy', 'partly cloudy']
          return {
            location,
            temperature: Math.floor(Math.random() * 30) + 5,
            unit: 'celsius',
            condition: conditions[Math.floor(Math.random() * conditions.length)],
          }
        },
      },
      calculator: {
        description: 'Calculate math expressions',
        inputSchema: calculatorParams,
        execute: async ({ expression }: z.infer<typeof calculatorParams>) => {
          try {
            const sanitized = expression.replace(/[^0-9+\-*/.()% ]/g, '')
            const result = Function(`"use strict"; return (${sanitized})`)()
            return { expression, result: Number(result.toFixed(4)) }
          } catch {
            return { expression, error: 'Invalid expression' }
          }
        },
      },
    },
    stopWhen: stepCountIs(5),
  })

  return result.toUIMessageStreamResponse()
}
