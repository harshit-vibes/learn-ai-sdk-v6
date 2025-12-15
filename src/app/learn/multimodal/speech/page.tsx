'use client'

import { LearningPage } from '@/components/educational'
import { getPageContent } from '@/lib/education-content'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Volume2, AlertCircle, PlayCircle } from 'lucide-react'

const content = getPageContent('multimodal/speech')!

const codeExamples = [
  {
    title: 'Basic Speech Generation',
    language: 'typescript',
    code: `import { experimental_generateSpeech as generateSpeech } from 'ai'
import { openai } from '@ai-sdk/openai'

const { audio } = await generateSpeech({
  model: openai.speech('tts-1'),
  text: 'Hello, welcome to the AI SDK!',
  voice: 'alloy',
})

// audio.audioData is Uint8Array
// Can be played or saved as audio file`,
  },
  {
    title: 'Different Voices',
    language: 'typescript',
    code: `// OpenAI TTS voices
const voices = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer']

const { audio } = await generateSpeech({
  model: openai.speech('tts-1-hd'), // HD quality
  text: 'This is high-definition speech.',
  voice: 'nova',
})`,
  },
  {
    title: 'Playing Audio in Browser',
    language: 'typescript',
    code: `// Client-side playback
async function playAudio(audioData: Uint8Array) {
  const blob = new Blob([audioData], { type: 'audio/mpeg' })
  const url = URL.createObjectURL(blob)
  const audio = new Audio(url)
  await audio.play()
}

// Or use HTML audio element
<audio src={audioUrl} controls />`,
  },
  {
    title: 'Save to File',
    language: 'typescript',
    code: `import { writeFile } from 'fs/promises'

const { audio } = await generateSpeech({
  model,
  text: 'Text to convert to speech',
  voice: 'alloy',
})

// Save as MP3 file
await writeFile('output.mp3', audio.audioData)`,
  },
]

function SpeechDemo() {
  const openaiVoices = [
    { name: 'alloy', desc: 'Neutral, balanced' },
    { name: 'echo', desc: 'Male, warm' },
    { name: 'fable', desc: 'British, expressive' },
    { name: 'onyx', desc: 'Deep, authoritative' },
    { name: 'nova', desc: 'Female, friendly' },
    { name: 'shimmer', desc: 'Female, soft' },
  ]

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-amber-500/10 border-amber-500/20">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
          <div>
            <h3 className="font-medium">Provider Required</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Speech generation requires a provider with text-to-speech capabilities (OpenAI TTS, ElevenLabs, etc.).
              This demo shows the API patterns.
            </p>
          </div>
        </div>
      </Card>

      <div>
        <h3 className="font-medium mb-3">Supported Providers</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { name: 'OpenAI', models: 'tts-1, tts-1-hd' },
            { name: 'ElevenLabs', models: 'Multilingual v2' },
            { name: 'LMNT', models: 'Various voices' },
            { name: 'Hume', models: 'Empathic voice' },
          ].map((provider) => (
            <Card key={provider.name} className="p-3">
              <div className="font-medium text-sm">{provider.name}</div>
              <div className="text-xs text-muted-foreground">{provider.models}</div>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">OpenAI Voices</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {openaiVoices.map((voice) => (
            <Card key={voice.name} className="p-3">
              <div className="flex items-center gap-2">
                <PlayCircle className="h-4 w-4 text-muted-foreground" />
                <code className="text-sm font-medium">{voice.name}</code>
              </div>
              <div className="text-xs text-muted-foreground mt-1">{voice.desc}</div>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Models & Quality</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-4">
            <Badge className="mb-2">tts-1</Badge>
            <p className="text-sm text-muted-foreground">
              Standard quality. Faster generation, good for real-time applications.
            </p>
          </Card>
          <Card className="p-4">
            <Badge variant="secondary" className="mb-2">tts-1-hd</Badge>
            <p className="text-sm text-muted-foreground">
              High definition. Better quality, slightly slower. Best for pre-generated content.
            </p>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Output Format</h3>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <code>audio.audioData</code>
          </div>
          <p className="text-sm text-muted-foreground">
            Returns audio as <code>Uint8Array</code>. Default format is MP3.
            Can be converted to Blob for browser playback or saved directly to file.
          </p>
        </Card>
      </div>
    </div>
  )
}

export default function SpeechPage() {
  return <LearningPage content={content} demo={<SpeechDemo />} codeExamples={codeExamples} />
}
