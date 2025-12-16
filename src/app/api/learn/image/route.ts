import { NextRequest } from 'next/server'

export const maxDuration = 60

interface ImageRequest {
  prompt: string
  size: 'square' | 'portrait' | 'landscape'
  style: string
}

export async function POST(req: NextRequest) {
  const { prompt, size, style }: ImageRequest = await req.json()

  const replicateApiKey = process.env.REPLICATE_API_KEY
  const openaiApiKey = process.env.OPENAI_API_KEY

  // Enhanced prompt with style
  const enhancedPrompt = style !== 'none'
    ? `${prompt}, ${style} style`
    : prompt

  // Map size to dimensions
  const dimensions = {
    square: { width: 1024, height: 1024 },
    portrait: { width: 768, height: 1024 },
    landscape: { width: 1024, height: 768 },
  }
  const { width, height } = dimensions[size]

  // Try Replicate first (cheapest), then OpenAI, then simulate
  if (replicateApiKey) {
    try {
      // Use Replicate's Flux Schnell model (fast and cheap)
      const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${replicateApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: '5599ed30703defd1d160a25a63321b4dec97101d98b4674bcc56e41f62f35637',
          input: {
            prompt: enhancedPrompt,
            width,
            height,
            num_outputs: 1,
            output_format: 'webp',
          },
        }),
      })

      if (!response.ok) {
        throw new Error('Replicate API error')
      }

      const prediction = await response.json()

      // Poll for result
      let result = prediction
      while (result.status !== 'succeeded' && result.status !== 'failed') {
        await new Promise(resolve => setTimeout(resolve, 1000))
        const pollResponse = await fetch(
          `https://api.replicate.com/v1/predictions/${result.id}`,
          {
            headers: {
              'Authorization': `Token ${replicateApiKey}`,
            },
          }
        )
        result = await pollResponse.json()
      }

      if (result.status === 'failed') {
        throw new Error('Image generation failed')
      }

      return Response.json({
        success: true,
        simulated: false,
        provider: 'replicate',
        imageUrl: result.output[0],
        prompt: enhancedPrompt,
        size: `${width}x${height}`,
      })
    } catch (error) {
      console.error('Replicate error:', error)
    }
  }

  if (openaiApiKey) {
    try {
      // Use OpenAI DALL-E
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: enhancedPrompt,
          n: 1,
          size: size === 'square' ? '1024x1024' : size === 'portrait' ? '1024x1792' : '1792x1024',
        }),
      })

      if (!response.ok) {
        throw new Error('OpenAI API error')
      }

      const data = await response.json()

      return Response.json({
        success: true,
        simulated: false,
        provider: 'openai',
        imageUrl: data.data[0].url,
        revisedPrompt: data.data[0].revised_prompt,
        prompt: enhancedPrompt,
        size: size === 'square' ? '1024x1024' : size === 'portrait' ? '1024x1792' : '1792x1024',
      })
    } catch (error) {
      console.error('OpenAI error:', error)
    }
  }

  // Simulated response with placeholder
  await new Promise(resolve => setTimeout(resolve, 1500))

  return Response.json({
    success: true,
    simulated: true,
    provider: 'simulated',
    imageUrl: `https://placehold.co/${width}x${height}/1a1a1a/666?text=AI+Generated+Image`,
    prompt: enhancedPrompt,
    size: `${width}x${height}`,
    setupGuide: {
      step1: "Get a Replicate API key at https://replicate.com (recommended, ~$0.003/image)",
      step2: "Add REPLICATE_API_KEY to your .env.local file",
      step3: "Or use OPENAI_API_KEY for DALL-E ($0.04-0.08/image)",
    }
  })
}
