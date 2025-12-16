'use client'

import { useState, useRef, useEffect } from 'react'
import { LearningPage } from '@/components/educational'
import { getPageContent } from '@/lib/education-content'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Mic, Square, Play, Pause, Loader2, FileAudio, Clock, AlertCircle, ExternalLink } from 'lucide-react'

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

interface TranscriptionResult {
  success: boolean
  simulated?: boolean
  text?: string
  language?: string
  duration?: number
  segments?: Segment[]
  setupGuide?: {
    step1: string
    step2: string
    step3: string
  }
  error?: string
}

function TranscriptionDemo() {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [transcription, setTranscription] = useState<TranscriptionResult | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const chunksRef = useRef<Blob[]>([])

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl)
    }
  }, [audioUrl])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setTranscription(null)
    } catch (error) {
      console.error('Failed to start recording:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const togglePlayback = () => {
    if (!audioRef.current || !audioUrl) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const transcribeAudio = async () => {
    if (!audioBlob) return

    setIsTranscribing(true)
    setTranscription(null)

    try {
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.webm')

      const response = await fetch('/api/learn/transcription', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()
      setTranscription(result)
    } catch (error) {
      setTranscription({
        success: false,
        error: error instanceof Error ? error.message : 'Transcription failed',
      })
    } finally {
      setIsTranscribing(false)
    }
  }

  const getCurrentSegment = () => {
    if (!transcription?.segments) return null
    return transcription.segments.find(
      s => currentTime >= s.start && currentTime < s.end
    )
  }

  const reset = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl)
    setAudioBlob(null)
    setAudioUrl(null)
    setTranscription(null)
    setCurrentTime(0)
    setIsPlaying(false)
  }

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-green-500/10 border-green-500/20">
        <div className="flex items-start gap-3">
          <Mic className="h-5 w-5 text-green-500 mt-0.5" />
          <div>
            <h3 className="font-medium">Live Audio Transcription</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Record audio using your microphone and transcribe it using Whisper.
              Uses Groq&apos;s free API for fast transcription.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recording Controls */}
        <div className="space-y-4">
          <h3 className="font-medium">Record Audio</h3>

          {/* Recording UI */}
          <Card className="p-6">
            <div className="text-center space-y-4">
              {/* Microphone Visualizer */}
              <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center transition-all ${
                isRecording
                  ? 'bg-red-500/20 animate-pulse'
                  : audioBlob
                    ? 'bg-green-500/20'
                    : 'bg-muted'
              }`}>
                {isRecording ? (
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="w-1 bg-red-500 rounded-full animate-pulse"
                        style={{
                          height: `${15 + Math.random() * 25}px`,
                          animationDelay: `${i * 0.1}s`,
                        }}
                      />
                    ))}
                  </div>
                ) : audioBlob ? (
                  <FileAudio className="h-10 w-10 text-green-500" />
                ) : (
                  <Mic className="h-10 w-10 text-muted-foreground" />
                )}
              </div>

              {/* Status */}
              <div>
                {isRecording ? (
                  <Badge className="bg-red-500">Recording...</Badge>
                ) : audioBlob ? (
                  <Badge variant="secondary">Audio Ready</Badge>
                ) : (
                  <p className="text-sm text-muted-foreground">Click to start recording</p>
                )}
              </div>

              {/* Controls */}
              <div className="flex gap-2 justify-center">
                {!isRecording && !audioBlob && (
                  <Button onClick={startRecording}>
                    <Mic className="h-4 w-4 mr-2" />
                    Start Recording
                  </Button>
                )}
                {isRecording && (
                  <Button variant="destructive" onClick={stopRecording}>
                    <Square className="h-4 w-4 mr-2" />
                    Stop
                  </Button>
                )}
                {audioBlob && !isRecording && (
                  <>
                    <Button variant="outline" onClick={togglePlayback}>
                      {isPlaying ? (
                        <Pause className="h-4 w-4 mr-2" />
                      ) : (
                        <Play className="h-4 w-4 mr-2" />
                      )}
                      {isPlaying ? 'Pause' : 'Play'}
                    </Button>
                    <Button onClick={transcribeAudio} disabled={isTranscribing}>
                      {isTranscribing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Transcribing...
                        </>
                      ) : (
                        <>
                          <FileAudio className="h-4 w-4 mr-2" />
                          Transcribe
                        </>
                      )}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={reset}>
                      <Square className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>

          {/* Hidden Audio Element */}
          {audioUrl && (
            <audio
              ref={audioRef}
              src={audioUrl}
              onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
              onEnded={() => setIsPlaying(false)}
            />
          )}

          {/* Instructions */}
          <Card className="p-4 bg-muted/50">
            <h4 className="text-sm font-medium mb-2">How to use:</h4>
            <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Click &quot;Start Recording&quot; and speak into your microphone</li>
              <li>Click &quot;Stop&quot; when done</li>
              <li>Click &quot;Transcribe&quot; to convert speech to text</li>
            </ol>
          </Card>
        </div>

        {/* Transcription Output */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Transcription</h3>
            {transcription?.duration && (
              <Badge variant="outline" className="text-xs">
                {transcription.duration.toFixed(1)}s
              </Badge>
            )}
          </div>

          <Card className="p-4 min-h-[250px]">
            {isTranscribing ? (
              <div className="flex flex-col items-center justify-center h-full py-8">
                <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
                <p className="text-sm text-muted-foreground">Processing audio...</p>
              </div>
            ) : transcription?.success ? (
              <div className="space-y-4">
                {/* Simulated Warning */}
                {transcription.simulated && (
                  <div className="p-3 rounded bg-amber-500/10 border border-amber-500/20">
                    <div className="flex items-center gap-2 text-amber-500 mb-2">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Simulated Response</span>
                    </div>
                    {transcription.setupGuide && (
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>To enable real transcription:</p>
                        <ol className="list-decimal list-inside pl-2">
                          <li>{transcription.setupGuide.step1}</li>
                          <li>{transcription.setupGuide.step2}</li>
                          <li>{transcription.setupGuide.step3}</li>
                        </ol>
                        <a
                          href="https://console.groq.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary hover:underline mt-2"
                        >
                          Get free Groq API key <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* Full Text */}
                <div className="p-3 bg-muted/50 rounded">
                  <p className="text-sm">{transcription.text}</p>
                </div>

                {/* Segments with timestamps */}
                {transcription.segments && transcription.segments.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-medium text-muted-foreground uppercase">Segments</h4>
                    {transcription.segments.map((segment, i) => {
                      const isActive = currentTime >= segment.start && currentTime < segment.end
                      return (
                        <div
                          key={i}
                          className={`p-2 rounded text-sm transition-all ${
                            isActive
                              ? 'bg-primary/20 border-l-2 border-primary'
                              : 'text-muted-foreground'
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
                )}

                {/* Metadata */}
                <div className="flex gap-2 pt-2 border-t">
                  {transcription.language && (
                    <Badge variant="outline">Language: {transcription.language}</Badge>
                  )}
                  {transcription.duration && (
                    <Badge variant="outline">Duration: {transcription.duration.toFixed(1)}s</Badge>
                  )}
                </div>
              </div>
            ) : transcription?.error ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
                <p className="text-sm text-red-500">{transcription.error}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <Mic className="h-8 w-8 text-muted-foreground mb-2 opacity-30" />
                <p className="text-sm text-muted-foreground">
                  Record audio and click &quot;Transcribe&quot; to see results
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
