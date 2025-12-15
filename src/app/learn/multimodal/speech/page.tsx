'use client'

import { useState } from 'react'
import { LearningPage } from '@/components/educational'
import { getPageContent } from '@/lib/education-content'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Volume2, Play, Loader2, Copy, Check, User } from 'lucide-react'

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

const voices = [
  { id: 'alloy', name: 'Alloy', desc: 'Neutral, balanced', gender: 'neutral' },
  { id: 'echo', name: 'Echo', desc: 'Male, warm', gender: 'male' },
  { id: 'fable', name: 'Fable', desc: 'British, expressive', gender: 'neutral' },
  { id: 'onyx', name: 'Onyx', desc: 'Deep, authoritative', gender: 'male' },
  { id: 'nova', name: 'Nova', desc: 'Female, friendly', gender: 'female' },
  { id: 'shimmer', name: 'Shimmer', desc: 'Female, soft', gender: 'female' },
]

const sampleTexts = [
  'Hello! Welcome to the AI SDK demonstration.',
  'The quick brown fox jumps over the lazy dog.',
  'Artificial intelligence is transforming how we interact with technology.',
]

function SpeechDemo() {
  const [text, setText] = useState(sampleTexts[0])
  const [selectedVoice, setSelectedVoice] = useState('alloy')
  const [model, setModel] = useState<'tts-1' | 'tts-1-hd'>('tts-1')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [copied, setCopied] = useState(false)

  const simulateGeneration = async () => {
    setIsGenerating(true)
    setGenerated(false)

    // Simulate generation time (HD takes longer)
    await new Promise(resolve => setTimeout(resolve, model === 'tts-1-hd' ? 2000 : 1000))

    setGenerated(true)
    setIsGenerating(false)
  }

  const simulatePlayback = async () => {
    setIsPlaying(true)
    // Simulate playback duration based on text length
    const duration = Math.min(text.length * 50, 5000)
    await new Promise(resolve => setTimeout(resolve, duration))
    setIsPlaying(false)
  }

  const generateCode = () => {
    return `const { audio } = await generateSpeech({
  model: openai.speech('${model}'),
  text: '${text}',
  voice: '${selectedVoice}',
})

// Play in browser
const blob = new Blob([audio.audioData], { type: 'audio/mpeg' })
const url = URL.createObjectURL(blob)
new Audio(url).play()`
  }

  const copyCode = () => {
    navigator.clipboard.writeText(generateCode())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const selectedVoiceData = voices.find(v => v.id === selectedVoice)

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-violet-500/10 border-violet-500/20">
        <div className="flex items-start gap-3">
          <Volume2 className="h-5 w-5 text-violet-500 mt-0.5" />
          <div>
            <h3 className="font-medium">Text-to-Speech Simulator</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Configure voice settings and see how the API call would look.
              Actual audio generation requires a TTS provider (OpenAI, ElevenLabs, etc.).
            </p>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Configuration */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Text to Speak</label>
            <textarea
              value={text}
              onChange={(e) => {
                setText(e.target.value)
                setGenerated(false)
              }}
              className="w-full h-24 p-3 rounded-md border bg-background text-sm resize-none"
              placeholder="Enter text to convert to speech..."
            />
            <div className="flex gap-1 mt-2">
              {sampleTexts.map((t, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  className="text-xs h-auto py-1"
                  onClick={() => {
                    setText(t)
                    setGenerated(false)
                  }}
                >
                  Sample {i + 1}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Model Quality</label>
            <div className="flex gap-2">
              <Button
                variant={model === 'tts-1' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setModel('tts-1')}
              >
                tts-1 (Standard)
              </Button>
              <Button
                variant={model === 'tts-1-hd' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setModel('tts-1-hd')}
              >
                tts-1-hd (HD)
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Voice</label>
            <div className="grid grid-cols-2 gap-2">
              {voices.map((voice) => (
                <Card
                  key={voice.id}
                  className={`p-2 cursor-pointer transition-all ${
                    selectedVoice === voice.id
                      ? 'ring-2 ring-primary bg-primary/5'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => {
                    setSelectedVoice(voice.id)
                    setGenerated(false)
                  }}
                >
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">{voice.name}</div>
                      <div className="text-xs text-muted-foreground">{voice.desc}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Output */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Output</label>
            <Button variant="outline" size="sm" onClick={copyCode}>
              {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
              {copied ? 'Copied!' : 'Copy Code'}
            </Button>
          </div>

          <Card className="p-6">
            <div className="text-center space-y-4">
              {/* Voice indicator */}
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center">
                {isPlaying ? (
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="w-1 bg-violet-500 rounded-full animate-pulse"
                        style={{
                          height: `${20 + Math.random() * 20}px`,
                          animationDelay: `${i * 0.1}s`,
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <Volume2 className="h-8 w-8 text-violet-500/50" />
                )}
              </div>

              <div>
                <p className="font-medium">{selectedVoiceData?.name}</p>
                <p className="text-sm text-muted-foreground">{selectedVoiceData?.desc}</p>
              </div>

              <div className="flex gap-2 justify-center">
                <Button
                  onClick={simulateGeneration}
                  disabled={!text.trim() || isGenerating}
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

                {generated && (
                  <Button
                    variant="outline"
                    onClick={simulatePlayback}
                    disabled={isPlaying}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {isPlaying ? 'Playing...' : 'Play'}
                  </Button>
                )}
              </div>

              {generated && (
                <div className="flex justify-center gap-2 pt-2">
                  <Badge variant="outline">MP3 Format</Badge>
                  <Badge variant="outline">{model === 'tts-1-hd' ? 'HD Quality' : 'Standard'}</Badge>
                </div>
              )}
            </div>
          </Card>

          {/* Generated Code Preview */}
          <Card className="p-3 bg-zinc-950">
            <pre className="text-xs font-mono text-zinc-100 overflow-x-auto whitespace-pre-wrap">
              {generateCode()}
            </pre>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function SpeechPage() {
  return <LearningPage content={content} demo={<SpeechDemo />} codeExamples={codeExamples} />
}
