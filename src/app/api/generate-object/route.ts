import { generateObject } from 'ai'
import { z } from 'zod'
import { openrouter, MODELS } from '@/lib/openrouter'

export const maxDuration = 30

const recipeSchema = z.object({
  name: z.string().describe('Recipe name'),
  ingredients: z.array(z.object({
    name: z.string(),
    amount: z.string(),
  })).describe('List of ingredients'),
  steps: z.array(z.string()).describe('Cooking steps'),
})

export async function POST(req: Request) {
  const { prompt } = await req.json()

  const { object } = await generateObject({
    model: openrouter(MODELS.chat),
    schema: recipeSchema,
    prompt: `Generate a recipe for: ${prompt}`,
  })

  return Response.json(object)
}
