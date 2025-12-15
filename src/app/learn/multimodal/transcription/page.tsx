'use client'

import { LearningPage } from '@/components/educational'
import { getPageContent } from '@/lib/education-content'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Mic, AlertCircle, FileAudio } from 'lucide-react'

const content = getPageContent('multimodal/transcription')!

const codeExamples = [
  {
    title: 'Basic Transcription',
    language: 'typescript',
    code: `import { experimental_transcribe as transcribe } from 'ai'
import { openai } from '@ai-sdk/openai'
import { readFile } from 'fs/promises'

const audioBuffer = await readFile('audio.mp3')

const { text, segments, language, durationInSeconds } = await transcribe({
  model: openai.transcription('whisper-1'),
  audio: audioBuffer,
})

console.log('Transcription:', text)
console.log('Language:', language)
console.log('Duration:', durationInSeconds, 'seconds')`,
  },
  {
    title: 'With Timestamps',
    language: 'typescript',
    code: `const result = await transcribe({
  model: openai.transcription('whisper-1'),
  audio: audioBuffer,
  providerOptions: {
    openai: {
      timestampGranularities: ['word', 'segment'],
    },
  },
})

// Access segments with timing
result.segments?.forEach(segment => {
  console.log(\`[\${segment.start}s - \${segment.end}s]: \${segment.text}\`)
})`,
  },
  {
    title: 'Different Input Formats',
    language: 'typescript',
    code: `// From URL
const result1 = await transcribe({
  model,
  audio: 'https://example.com/audio.mp3',
})

// From base64
const result2 = await transcribe({
  model,
  audio: base64AudioString,
})

// From ArrayBuffer
const result3 = await transcribe({
  model,
  audio: arrayBuffer,
})

// From Uint8Array
const result4 = await transcribe({
  model,
  audio: uint8Array,
})`,
  },
]

function TranscriptionDemo() {
  const supportedFormats = ['MP3', 'MP4', 'MPEG', 'MPGA', 'M4A', 'WAV', 'WEBM']

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-amber-500/10 border-amber-500/20">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
          <div>
            <h3 className="font-medium">Provider Required</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Transcription requires a provider with speech-to-text capabilities (OpenAI Whisper, Groq, etc.).
              This demo shows the API patterns.
            </p>
          </div>
        </div>
      </Card>

      <div>
        <h3 className="font-medium mb-3">Supported Providers</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { name: 'OpenAI', model: 'whisper-1' },
            { name: 'Groq', model: 'whisper-large-v3' },
            { name: 'Deepgram', model: 'nova-2' },
            { name: 'AssemblyAI', model: 'best' },
            { name: 'ElevenLabs', model: 'scribe' },
            { name: 'Azure', model: 'whisper' },
          ].map((provider) => (
            <Card key={provider.name} className="p-3">
              <div className="font-medium text-sm">{provider.name}</div>
              <div className="text-xs text-muted-foreground">{provider.model}</div>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Supported Audio Formats</h3>
        <div className="flex flex-wrap gap-2">
          {supportedFormats.map((format) => (
            <Badge key={format} variant="secondary">
              <FileAudio className="h-3 w-3 mr-1" />
              {format}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Output Properties</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between p-2 bg-muted rounded">
            <code>text</code>
            <span className="text-muted-foreground">The transcribed text</span>
          </div>
          <div className="flex justify-between p-2 bg-muted rounded">
            <code>segments</code>
            <span className="text-muted-foreground">Array with timing information</span>
          </div>
          <div className="flex justify-between p-2 bg-muted rounded">
            <code>language</code>
            <span className="text-muted-foreground">Detected language code</span>
          </div>
          <div className="flex justify-between p-2 bg-muted rounded">
            <code>durationInSeconds</code>
            <span className="text-muted-foreground">Audio file duration</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Input Formats</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-3">
            <Badge className="mb-2">Uint8Array / Buffer</Badge>
            <p className="text-xs text-muted-foreground">From file reads or uploads</p>
          </Card>
          <Card className="p-3">
            <Badge variant="secondary" className="mb-2">Base64 String</Badge>
            <p className="text-xs text-muted-foreground">Encoded audio data</p>
          </Card>
          <Card className="p-3">
            <Badge variant="secondary" className="mb-2">URL</Badge>
            <p className="text-xs text-muted-foreground">Remote audio file</p>
          </Card>
          <Card className="p-3">
            <Badge variant="secondary" className="mb-2">ArrayBuffer</Badge>
            <p className="text-xs text-muted-foreground">Raw binary data</p>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function TranscriptionPage() {
  return <LearningPage content={content} demo={<TranscriptionDemo />} codeExamples={codeExamples} />
}
