import { NextRequest } from 'next/server'

export const maxDuration = 60

// This demo uses Groq's Whisper API for free transcription
// API Key needed: GROQ_API_KEY
export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const audioFile = formData.get('audio') as File | null

  if (!audioFile) {
    return Response.json({ error: 'No audio file provided' }, { status: 400 })
  }

  const groqApiKey = process.env.GROQ_API_KEY

  // If no Groq API key, provide a simulated response with guidance
  if (!groqApiKey) {
    // Simulate transcription for demo purposes
    const duration = 5.0 + Math.random() * 5
    await new Promise(resolve => setTimeout(resolve, 1500))

    return Response.json({
      success: true,
      simulated: true,
      text: "This is a simulated transcription. To enable real transcription, add your GROQ_API_KEY to the environment. Groq provides free Whisper API access with fast inference speeds.",
      language: 'en',
      duration: duration,
      segments: [
        { start: 0, end: 2.5, text: "This is a simulated transcription." },
        { start: 2.5, end: 5, text: "To enable real transcription, add your GROQ_API_KEY to the environment." },
        { start: 5, end: duration, text: "Groq provides free Whisper API access with fast inference speeds." },
      ],
      setupGuide: {
        step1: "Get a free API key at https://console.groq.com",
        step2: "Add GROQ_API_KEY to your .env.local file",
        step3: "Restart the development server",
      }
    })
  }

  try {
    // Use Groq's Whisper API
    const groqFormData = new FormData()
    groqFormData.append('file', audioFile)
    groqFormData.append('model', 'whisper-large-v3')
    groqFormData.append('response_format', 'verbose_json')
    groqFormData.append('timestamp_granularities[]', 'segment')

    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
      },
      body: groqFormData,
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Groq API error: ${error}`)
    }

    const result = await response.json()

    return Response.json({
      success: true,
      simulated: false,
      text: result.text,
      language: result.language,
      duration: result.duration,
      segments: result.segments?.map((seg: { start: number; end: number; text: string }) => ({
        start: seg.start,
        end: seg.end,
        text: seg.text,
      })) || [],
    })
  } catch (error) {
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Transcription failed',
    }, { status: 500 })
  }
}
