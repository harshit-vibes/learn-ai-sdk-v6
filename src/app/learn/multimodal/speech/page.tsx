'use client'

import { useState, useRef, useEffect } from 'react'
import { LearningPage } from '@/components/educational'
import { getPageContent } from '@/lib/education-content'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { Volume2, Play, Square, Loader2, AlertCircle, ExternalLink, Download } from 'lucide-react'

const content = getPageContent('multimodal/speech')!

const codeExamples = [
  {
    title: 'Basic Speech',
    language: 'typescript',
    code: `import { experimental_generateSpeech as generateSpeech } from 'ai'
import { openai } from '@ai-sdk/openai'

const { audio, warnings } = await generateSpeech({
  model: openai.speech('tts-1'),
  text: 'Hello! This is AI-generated speech.',
  voice: 'alloy', // alloy, echo, fable, onyx, nova, shimmer
})

// Save to file
const audioBuffer = Buffer.from(await audio.arrayBuffer())
await writeFile('output.mp3', audioBuffer)`,
  },
  {
    title: 'Voice Options',
    language: 'typescript',
    code: `// OpenAI TTS voices
const voices = [
  'alloy',   // Neutral, balanced
  'echo',    // Male voice
  'fable',   // British accent
  'onyx',    // Deep male voice
  'nova',    // Female voice
  'shimmer', // Soft female voice
]

const { audio } = await generateSpeech({
  model: openai.speech('tts-1'),
  text: 'Try different voices!',
  voice: 'nova',
})`,
  },
  {
    title: 'With Speed Control',
    language: 'typescript',
    code: `const { audio } = await generateSpeech({
  model: openai.speech('tts-1'),
  text: 'Adjustable speaking speed',
  voice: 'alloy',
  providerOptions: {
    openai: {
      speed: 1.2, // 0.25 to 4.0
    },
  },
})`,
  },
  {
    title: 'High Quality',
    language: 'typescript',
    code: `// Use tts-1-hd for higher quality (slower)
const { audio } = await generateSpeech({
  model: openai.speech('tts-1-hd'),
  text: 'Premium quality audio output',
  voice: 'nova',
})`,
  },
]

const voices = [
  { id: 'alloy', name: 'Alloy', description: 'Neutral, balanced' },
  { id: 'echo', name: 'Echo', description: 'Male voice' },
  { id: 'fable', name: 'Fable', description: 'British accent' },
  { id: 'onyx', name: 'Onyx', description: 'Deep male' },
  { id: 'nova', name: 'Nova', description: 'Female voice' },
  { id: 'shimmer', name: 'Shimmer', description: 'Soft female' },
]

function SpeechDemo() {
  const [text, setText] = useState('Hello! This is a demonstration of AI-generated speech using the AI SDK.')
  const [voice, setVoice] = useState('alloy')
  const [speed, setSpeed] = useState(1.0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [useBrowserTTS, setUseBrowserTTS] = useState(false)
  const [setupGuide, setSetupGuide] = useState<{ step1: string; step2: string; step3: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)

  useEffect(() => {
    synthRef.current = window.speechSynthesis
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl)
      synthRef.current?.cancel()
    }
  }, [audioUrl])

  const generateSpeech = async () => {
    setIsGenerating(true)
    setError(null)
    setAudioUrl(null)
    setUseBrowserTTS(false)
    setSetupGuide(null)

    try {
      const response = await fetch('/api/learn/speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice, speed }),
      })

      const contentType = response.headers.get('Content-Type')

      if (contentType?.includes('audio')) {
        // Real audio response
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
      } else {
        // JSON response (browser TTS fallback)
        const data = await response.json()
        if (data.useBrowserTTS) {
          setUseBrowserTTS(true)
          setSetupGuide(data.setupGuide)
        } else if (data.error) {
          throw new Error(data.error)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Speech generation failed')
    } finally {
      setIsGenerating(false)
    }
  }

  const playAudio = () => {
    if (useBrowserTTS && synthRef.current) {
      // Use browser's Web Speech API
      synthRef.current.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = speed
      utterance.onend = () => setIsPlaying(false)
      synthRef.current.speak(utterance)
      setIsPlaying(true)
    } else if (audioRef.current) {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const stopAudio = () => {
    if (useBrowserTTS && synthRef.current) {
      synthRef.current.cancel()
    } else if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setIsPlaying(false)
  }

  const downloadAudio = () => {
    if (audioUrl) {
      const a = document.createElement('a')
      a.href = audioUrl
      a.download = 'speech.mp3'
      a.click()
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-violet-500/10 border-violet-500/20">
        <div className="flex items-start gap-3">
          <Volume2 className="h-5 w-5 text-violet-500 mt-0.5" />
          <div>
            <h3 className="font-medium">Text-to-Speech Generator</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Convert text to natural-sounding speech. Uses OpenAI TTS API with browser fallback.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Configuration */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Text to Speak</label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to convert to speech..."
              rows={4}
              maxLength={500}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Max 500 characters</span>
              <span>{text.length}/500</span>
            </div>
          </div>

          {/* Voice Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Voice</label>
            <div className="grid grid-cols-3 gap-2">
              {voices.map((v) => (
                <Card
                  key={v.id}
                  className={`p-2 cursor-pointer transition-all text-center ${
                    voice === v.id ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setVoice(v.id)}
                >
                  <div className="font-medium text-sm">{v.name}</div>
                  <div className="text-xs text-muted-foreground">{v.description}</div>
                </Card>
              ))}
            </div>
          </div>

          {/* Speed Control */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium">Speed</label>
              <span className="text-sm text-muted-foreground">{speed.toFixed(1)}x</span>
            </div>
            <Slider
              value={[speed]}
              onValueChange={([v]) => setSpeed(v)}
              min={0.5}
              max={2}
              step={0.1}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0.5x (Slow)</span>
              <span>2x (Fast)</span>
            </div>
          </div>

          {/* Generate Button */}
          <Button
            className="w-full"
            onClick={generateSpeech}
            disabled={isGenerating || !text.trim()}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Volume2 className="h-4 w-4 mr-2" />
                Generate Speech
              </>
            )}
          </Button>
        </div>

        {/* Output / Player */}
        <div className="space-y-4">
          <h3 className="font-medium">Audio Output</h3>

          {/* Player Card */}
          <Card className="p-6">
            {error ? (
              <div className="flex flex-col items-center text-center">
                <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
                <p className="text-sm text-red-500">{error}</p>
              </div>
            ) : (audioUrl || useBrowserTTS) ? (
              <div className="space-y-4">
                {/* Browser TTS Warning */}
                {useBrowserTTS && setupGuide && (
                  <div className="p-3 rounded bg-amber-500/10 border border-amber-500/20 mb-4">
                    <div className="flex items-center gap-2 text-amber-500 mb-2">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Using Browser TTS</span>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>To enable OpenAI TTS (higher quality):</p>
                      <ol className="list-decimal list-inside pl-2">
                        <li>{setupGuide.step1}</li>
                        <li>{setupGuide.step2}</li>
                        <li>{setupGuide.step3}</li>
                      </ol>
                      <a
                        href="https://platform.openai.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline mt-2"
                      >
                        Get OpenAI API key <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Visualization */}
                <div className="flex justify-center gap-1 h-16">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-1 rounded-full transition-all ${
                        isPlaying
                          ? 'bg-primary animate-pulse'
                          : 'bg-muted'
                      }`}
                      style={{
                        height: isPlaying
                          ? `${20 + Math.sin(i * 0.5) * 30 + Math.random() * 20}px`
                          : '20px',
                        animationDelay: `${i * 0.05}s`,
                      }}
                    />
                  ))}
                </div>

                {/* Controls */}
                <div className="flex justify-center gap-2">
                  {isPlaying ? (
                    <Button onClick={stopAudio} variant="outline" size="lg">
                      <Square className="h-5 w-5 mr-2" />
                      Stop
                    </Button>
                  ) : (
                    <Button onClick={playAudio} size="lg">
                      <Play className="h-5 w-5 mr-2" />
                      Play
                    </Button>
                  )}
                  {audioUrl && (
                    <Button onClick={downloadAudio} variant="outline" size="lg">
                      <Download className="h-5 w-5 mr-2" />
                      Download
                    </Button>
                  )}
                </div>

                {/* Audio element (hidden) */}
                {audioUrl && (
                  <audio
                    ref={audioRef}
                    src={audioUrl}
                    onEnded={() => setIsPlaying(false)}
                  />
                )}

                {/* Info */}
                <div className="flex justify-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline">Voice: {voice}</Badge>
                  <Badge variant="outline">Speed: {speed.toFixed(1)}x</Badge>
                  {useBrowserTTS && <Badge variant="secondary">Browser TTS</Badge>}
                  {audioUrl && <Badge className="bg-green-500/20 text-green-500">OpenAI TTS</Badge>}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center py-8">
                <Volume2 className="h-12 w-12 text-muted-foreground mb-4 opacity-30" />
                <p className="text-sm text-muted-foreground">
                  Enter text and click &quot;Generate Speech&quot;
                </p>
              </div>
            )}
          </Card>

          {/* Quick Phrases */}
          <div>
            <h4 className="text-sm font-medium mb-2">Quick Phrases</h4>
            <div className="flex flex-wrap gap-2">
              {[
                'Hello, how can I help you today?',
                'Welcome to the AI SDK demo!',
                'This is a test of text-to-speech.',
              ].map((phrase, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  onClick={() => setText(phrase)}
                  className="text-xs"
                >
                  {phrase.slice(0, 25)}...
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Supported Providers */}
      <div>
        <h3 className="font-medium mb-3">TTS Providers</h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">OpenAI TTS</Badge>
          <Badge variant="secondary">ElevenLabs</Badge>
          <Badge variant="outline">Browser Web Speech API</Badge>
        </div>
      </div>
    </div>
  )
}

export default function SpeechPage() {
  return <LearningPage content={content} demo={<SpeechDemo />} codeExamples={codeExamples} />
}
