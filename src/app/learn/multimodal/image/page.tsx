'use client'

import { useState } from 'react'
import { LearningPage } from '@/components/educational'
import { getPageContent } from '@/lib/education-content'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Image as ImageIcon, Sparkles, Loader2, AlertCircle, ExternalLink, Download, Square, RectangleVertical, RectangleHorizontal } from 'lucide-react'

const content = getPageContent('multimodal/image')!

const codeExamples = [
  {
    title: 'generateImage',
    language: 'typescript',
    code: `import { experimental_generateImage as generateImage } from 'ai'
import { openai } from '@ai-sdk/openai'

const { image } = await generateImage({
  model: openai.image('dall-e-3'),
  prompt: 'A serene mountain landscape at sunset',
  size: '1024x1024',
})

// Access the image
const base64 = image.base64
const uint8Array = image.uint8Array`,
  },
  {
    title: 'Multiple Images',
    language: 'typescript',
    code: `// Generate multiple images
const { images } = await generateImage({
  model: openai.image('dall-e-2'),
  prompt: 'Abstract art',
  n: 4, // Generate 4 images
  size: '512x512',
})

// Each image in the array
images.forEach((img, i) => {
  console.log(\`Image \${i}:\`, img.base64)
})`,
  },
  {
    title: 'With Aspect Ratio',
    language: 'typescript',
    code: `// Some providers support aspect ratios
const { image } = await generateImage({
  model: fal.image('flux-pro'),
  prompt: 'A cinematic landscape',
  aspectRatio: '16:9',
  providerOptions: {
    fal: {
      num_inference_steps: 50,
    },
  },
})`,
  },
]

const presetPrompts = [
  'A serene mountain landscape at golden hour with mist in the valleys',
  'Cyberpunk city with neon lights reflecting on wet streets at night',
  'Abstract art with flowing colors and geometric shapes',
  'Cute robot reading a book in a cozy library',
]

const styles = [
  { id: 'none', name: 'None', description: 'No style modifier' },
  { id: 'photorealistic', name: 'Photo', description: 'Photorealistic' },
  { id: 'digital art', name: 'Digital', description: 'Digital art' },
  { id: 'oil painting', name: 'Painting', description: 'Oil painting' },
  { id: 'anime', name: 'Anime', description: 'Anime style' },
  { id: '3d render', name: '3D', description: '3D render' },
]

interface GenerationResult {
  success: boolean
  simulated?: boolean
  provider?: string
  imageUrl?: string
  revisedPrompt?: string
  prompt?: string
  size?: string
  setupGuide?: {
    step1: string
    step2: string
    step3: string
  }
  error?: string
}

function ImageGenDemo() {
  const [prompt, setPrompt] = useState('')
  const [size, setSize] = useState<'square' | 'portrait' | 'landscape'>('square')
  const [style, setStyle] = useState('none')
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<GenerationResult | null>(null)

  const generateImage = async () => {
    if (!prompt.trim()) return
    setIsGenerating(true)
    setResult(null)

    try {
      const response = await fetch('/api/learn/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, size, style }),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Generation failed',
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadImage = async () => {
    if (!result?.imageUrl) return

    try {
      const response = await fetch(result.imageUrl)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'generated-image.png'
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      // Fallback for cross-origin images
      window.open(result.imageUrl, '_blank')
    }
  }

  const sizeIcons = {
    square: Square,
    portrait: RectangleVertical,
    landscape: RectangleHorizontal,
  }

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 border-pink-500/20">
        <div className="flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-pink-500 mt-0.5" />
          <div>
            <h3 className="font-medium">AI Image Generator</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Generate images using AI. Uses Replicate (Flux) or OpenAI (DALL-E) when configured.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Prompt</label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to generate..."
              rows={3}
              maxLength={500}
            />
            <div className="flex flex-wrap gap-1">
              {presetPrompts.map((p, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  className="text-xs h-auto py-1"
                  onClick={() => setPrompt(p)}
                >
                  {p.slice(0, 25)}...
                </Button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Aspect Ratio</label>
            <div className="flex gap-2">
              {(['square', 'portrait', 'landscape'] as const).map((s) => {
                const Icon = sizeIcons[s]
                return (
                  <Card
                    key={s}
                    className={`p-2 cursor-pointer transition-all flex-1 text-center ${
                      size === s ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSize(s)}
                  >
                    <Icon className="h-4 w-4 mx-auto mb-1" />
                    <div className="text-xs capitalize">{s}</div>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Style Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Style</label>
            <div className="flex flex-wrap gap-2">
              {styles.map((s) => (
                <Badge
                  key={s.id}
                  variant={style === s.id ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setStyle(s.id)}
                >
                  {s.name}
                </Badge>
              ))}
            </div>
          </div>

          <Button
            onClick={generateImage}
            disabled={!prompt.trim() || isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Image
              </>
            )}
          </Button>
        </div>

        {/* Preview Panel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Generated Image</label>
            {result?.provider && !result.simulated && (
              <Badge className="bg-green-500/20 text-green-500">{result.provider}</Badge>
            )}
          </div>

          <Card className={`flex items-center justify-center bg-zinc-900 overflow-hidden ${
            size === 'square' ? 'aspect-square' : size === 'portrait' ? 'aspect-[3/4]' : 'aspect-[4/3]'
          }`}>
            {isGenerating ? (
              <div className="text-center">
                <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Creating image...</p>
                <p className="text-xs text-muted-foreground mt-1">This may take 10-30 seconds</p>
              </div>
            ) : result?.success && result.imageUrl ? (
              <img
                src={result.imageUrl}
                alt={result.prompt || 'Generated image'}
                className="w-full h-full object-cover"
              />
            ) : result?.error ? (
              <div className="text-center p-4">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
                <p className="text-sm text-red-500">{result.error}</p>
              </div>
            ) : (
              <div className="text-center text-muted-foreground p-4">
                <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Enter a prompt and click Generate</p>
              </div>
            )}
          </Card>

          {/* Actions */}
          {result?.success && result.imageUrl && (
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={downloadImage}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => window.open(result.imageUrl, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Full Size
              </Button>
            </div>
          )}

          {/* Simulated Warning */}
          {result?.simulated && result.setupGuide && (
            <Card className="p-3 bg-amber-500/10 border-amber-500/20">
              <div className="flex items-center gap-2 text-amber-500 mb-2">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Simulated Image</span>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>To enable real image generation:</p>
                <ol className="list-decimal list-inside pl-2">
                  <li>{result.setupGuide.step1}</li>
                  <li>{result.setupGuide.step2}</li>
                  <li>{result.setupGuide.step3}</li>
                </ol>
              </div>
            </Card>
          )}

          {/* Revised Prompt */}
          {result?.revisedPrompt && (
            <Card className="p-3 bg-muted/50">
              <h4 className="text-xs font-medium text-muted-foreground mb-1">AI-Revised Prompt</h4>
              <p className="text-sm">{result.revisedPrompt}</p>
            </Card>
          )}
        </div>
      </div>

      {/* Providers */}
      <div>
        <h3 className="font-medium mb-3">Supported Providers</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {[
            { name: 'Replicate', models: 'Flux Schnell (~$0.003)', active: true },
            { name: 'OpenAI', models: 'DALL-E 3 (~$0.04)', active: true },
            { name: 'Fal', models: 'Flux Pro, SDXL', active: false },
            { name: 'Together AI', models: 'Flux, SDXL', active: false },
            { name: 'Google', models: 'Imagen', active: false },
            { name: 'Black Forest', models: 'Flux Pro', active: false },
          ].map((provider) => (
            <Card key={provider.name} className={`p-2 ${provider.active ? 'border-primary/30' : ''}`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-xs">{provider.name}</div>
                  <div className="text-xs text-muted-foreground">{provider.models}</div>
                </div>
                {provider.active && <Badge variant="secondary" className="text-xs">Active</Badge>}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ImageGenPage() {
  return <LearningPage content={content} demo={<ImageGenDemo />} codeExamples={codeExamples} />
}
