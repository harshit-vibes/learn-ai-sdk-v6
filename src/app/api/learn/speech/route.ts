import { NextRequest } from 'next/server'

export const maxDuration = 60

interface SpeechRequest {
  text: string
  voice: string
  speed: number
}

export async function POST(req: NextRequest) {
  const { text, voice, speed }: SpeechRequest = await req.json()

  const openaiApiKey = process.env.OPENAI_API_KEY

  // If no OpenAI API key, return guidance for browser TTS
  if (!openaiApiKey) {
    return Response.json({
      success: true,
      useBrowserTTS: true,
      text,
      voice,
      speed,
      setupGuide: {
        step1: "Get an API key at https://platform.openai.com",
        step2: "Add OPENAI_API_KEY to your .env.local file",
        step3: "Restart the development server",
      }
    })
  }

  try {
    // Use OpenAI's TTS API
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: text,
        voice: voice || 'alloy',
        speed: speed || 1.0,
        response_format: 'mp3',
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`OpenAI API error: ${error}`)
    }

    // Return audio as blob
    const audioBuffer = await response.arrayBuffer()

    return new Response(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
      },
    })
  } catch (error) {
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Speech generation failed',
    }, { status: 500 })
  }
}
