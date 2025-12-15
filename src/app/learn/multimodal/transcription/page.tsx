'use client'

import { useState, useEffect } from 'react'
import { LearningPage } from '@/components/educational'
import { getPageContent } from '@/lib/education-content'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Mic, Play, Pause, Loader2, FileAudio, Clock } from 'lucide-react'

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
})`,
  },
]

interface Segment {
  start: number
  end: number
  text: string
}

const sampleAudios = [
  {
    name: 'Meeting Recording',
    duration: 12.5,
    segments: [
      { start: 0, end: 3.2, text: "Good morning everyone, let's get started with today's meeting." },
      { start: 3.2, end: 6.8, text: "First, I'd like to discuss the quarterly results." },
      { start: 6.8, end: 10.1, text: "We've seen a 15% increase in user engagement." },
      { start: 10.1, end: 12.5, text: "Let me share the details." },
    ],
    language: 'en',
  },
  {
    name: 'Podcast Intro',
    duration: 8.3,
    segments: [
      { start: 0, end: 2.5, text: "Welcome to Tech Talk, the podcast about innovation." },
      { start: 2.5, end: 5.2, text: "I'm your host, and today we're exploring AI." },
      { start: 5.2, end: 8.3, text: "Let's dive into the fascinating world of machine learning." },
    ],
    language: 'en',
  },
]

function TranscriptionDemo() {
  const [selectedAudio, setSelectedAudio] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [transcription, setTranscription] = useState<{
    text: string
    segments: Segment[]
    language: string
    duration: number
  } | null>(null)

  const audio = sampleAudios[selectedAudio]

  useEffect(() => {
    if (!isPlaying || !transcription) return

    const interval = setInterval(() => {
      setCurrentTime(prev => {
        if (prev >= transcription.duration) {
          setIsPlaying(false)
          return transcription.duration
        }
        return prev + 0.1
      })
    }, 100)

    return () => clearInterval(interval)
  }, [isPlaying, transcription])

  const startTranscription = async () => {
    setIsTranscribing(true)
    setTranscription(null)
    setCurrentTime(0)

    // Simulate transcription process
    await new Promise(resolve => setTimeout(resolve, 1500))

    setTranscription({
      text: audio.segments.map(s => s.text).join(' '),
      segments: audio.segments,
      language: audio.language,
      duration: audio.duration,
    })
    setIsTranscribing(false)
  }

  const togglePlayback = () => {
    if (currentTime >= (transcription?.duration || 0)) {
      setCurrentTime(0)
    }
    setIsPlaying(!isPlaying)
  }

  const getCurrentSegment = () => {
    if (!transcription) return null
    return transcription.segments.find(
      s => currentTime >= s.start && currentTime < s.end
    )
  }

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-green-500/10 border-green-500/20">
        <div className="flex items-start gap-3">
          <Mic className="h-5 w-5 text-green-500 mt-0.5" />
          <div>
            <h3 className="font-medium">Transcription Simulator</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Simulate audio transcription with timestamps. Select a sample audio and see how the transcription API works.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Audio Selection */}
        <div className="space-y-4">
          <h3 className="font-medium">Sample Audio</h3>
          <div className="space-y-2">
            {sampleAudios.map((a, i) => (
              <Card
                key={i}
                className={`p-3 cursor-pointer transition-all ${
                  selectedAudio === i ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'
                }`}
                onClick={() => {
                  setSelectedAudio(i)
                  setTranscription(null)
                  setCurrentTime(0)
                  setIsPlaying(false)
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileAudio className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">{a.name}</div>
                      <div className="text-xs text-muted-foreground">{a.duration}s</div>
                    </div>
                  </div>
                  <Badge variant="secondary">{a.language.toUpperCase()}</Badge>
                </div>
              </Card>
            ))}
          </div>

          <Button onClick={startTranscription} disabled={isTranscribing} className="w-full">
            {isTranscribing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Transcribing...
              </>
            ) : (
              <>
                <Mic className="h-4 w-4 mr-2" />
                Transcribe Audio
              </>
            )}
          </Button>
        </div>

        {/* Transcription Output */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Transcription</h3>
            {transcription && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={togglePlayback}>
                  {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                </Button>
                <span className="text-xs text-muted-foreground">
                  {currentTime.toFixed(1)}s / {transcription.duration}s
                </span>
              </div>
            )}
          </div>

          <Card className="p-4 min-h-[200px]">
            {isTranscribing ? (
              <div className="flex flex-col items-center justify-center h-full py-8">
                <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
                <p className="text-sm text-muted-foreground">Processing audio...</p>
              </div>
            ) : transcription ? (
              <div className="space-y-4">
                {/* Progress bar */}
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-100"
                    style={{ width: `${(currentTime / transcription.duration) * 100}%` }}
                  />
                </div>

                {/* Segments */}
                <div className="space-y-2">
                  {transcription.segments.map((segment, i) => {
                    const isActive = currentTime >= segment.start && currentTime < segment.end
                    const isPast = currentTime >= segment.end
                    return (
                      <div
                        key={i}
                        className={`p-2 rounded text-sm transition-all ${
                          isActive
                            ? 'bg-primary/20 border-l-2 border-primary'
                            : isPast
                              ? 'text-muted-foreground'
                              : 'text-foreground/60'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="h-3 w-3" />
                          <span className="text-xs font-mono">
                            {segment.start.toFixed(1)}s - {segment.end.toFixed(1)}s
                          </span>
                        </div>
                        <p>{segment.text}</p>
                      </div>
                    )
                  })}
                </div>

                {/* Metadata */}
                <div className="flex gap-2 pt-2 border-t">
                  <Badge variant="outline">Language: {transcription.language}</Badge>
                  <Badge variant="outline">Duration: {transcription.duration}s</Badge>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <Mic className="h-8 w-8 text-muted-foreground mb-2 opacity-30" />
                <p className="text-sm text-muted-foreground">
                  Click &quot;Transcribe Audio&quot; to start
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Supported Formats */}
      <div>
        <h3 className="font-medium mb-3">Supported Audio Formats</h3>
        <div className="flex flex-wrap gap-2">
          {['MP3', 'MP4', 'MPEG', 'MPGA', 'M4A', 'WAV', 'WEBM'].map((format) => (
            <Badge key={format} variant="secondary">
              <FileAudio className="h-3 w-3 mr-1" />
              {format}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function TranscriptionPage() {
  return <LearningPage content={content} demo={<TranscriptionDemo />} codeExamples={codeExamples} />
}
