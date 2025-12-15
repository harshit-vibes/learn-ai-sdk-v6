'use client'

import { useState } from 'react'
import { LearningPage } from '@/components/educational'
import { getPageContent } from '@/lib/education-content'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Image, Sparkles, Loader2, Wand2, Copy, Check } from 'lucide-react'

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
  'A serene mountain landscape at golden hour',
  'Cyberpunk city with neon lights reflecting on wet streets',
  'Abstract art with flowing colors and geometric shapes',
  'Cute robot reading a book in a cozy library',
]

function ImageGenDemo() {
  const [prompt, setPrompt] = useState('')
  const [size, setSize] = useState<'1024x1024' | '512x512' | '1792x1024'>('1024x1024')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const simulateGeneration = async () => {
    if (!prompt.trim()) return
    setIsGenerating(true)
    setGeneratedPrompt(null)

    // Simulate generation time
    await new Promise(resolve => setTimeout(resolve, 2000))

    setGeneratedPrompt(prompt)
    setIsGenerating(false)
  }

  const generateCode = () => {
    return `const { image } = await generateImage({
  model: openai.image('dall-e-3'),
  prompt: '${prompt}',
  size: '${size}',
})

// Use the generated image
const imageUrl = \`data:image/png;base64,\${image.base64}\``
  }

  const copyCode = () => {
    navigator.clipboard.writeText(generateCode())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 border-pink-500/20">
        <div className="flex items-start gap-3">
          <Wand2 className="h-5 w-5 text-pink-500 mt-0.5" />
          <div>
            <h3 className="font-medium">Image Generation Simulator</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Build your image prompt and see how the API call would look.
              Actual generation requires an image model provider (DALL-E, Flux, etc.).
            </p>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Prompt</label>
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to generate..."
              className="mb-2"
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
                  {p.slice(0, 30)}...
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Size</label>
            <div className="flex gap-2">
              {(['512x512', '1024x1024', '1792x1024'] as const).map((s) => (
                <Button
                  key={s}
                  variant={size === s ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSize(s)}
                >
                  {s}
                </Button>
              ))}
            </div>
          </div>

          <Button
            onClick={simulateGeneration}
            disabled={!prompt.trim() || isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Simulating Generation...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Simulate Generation
              </>
            )}
          </Button>
        </div>

        {/* Preview Panel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Preview</label>
            {prompt && (
              <Button variant="outline" size="sm" onClick={copyCode}>
                {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                {copied ? 'Copied!' : 'Copy Code'}
              </Button>
            )}
          </div>
          <Card className="aspect-square flex items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-800 overflow-hidden">
            {isGenerating ? (
              <div className="text-center">
                <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Processing prompt...</p>
              </div>
            ) : generatedPrompt ? (
              <div className="w-full h-full bg-gradient-to-br from-purple-600/30 via-pink-500/30 to-orange-400/30 flex items-center justify-center p-4">
                <div className="text-center">
                  <Image className="h-16 w-16 text-white/50 mx-auto mb-3" />
                  <p className="text-sm text-white/70 max-w-[200px]">
                    &quot;{generatedPrompt}&quot;
                  </p>
                  <Badge className="mt-3">{size}</Badge>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <Image className="h-12 w-12 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Enter a prompt to preview</p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Generated Code */}
      {prompt && (
        <Card className="p-4 bg-zinc-950">
          <pre className="text-xs font-mono text-zinc-100 overflow-x-auto">
            {generateCode()}
          </pre>
        </Card>
      )}

      {/* Providers */}
      <div>
        <h3 className="font-medium mb-3">Supported Providers</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {[
            { name: 'OpenAI', models: 'DALL-E 2, DALL-E 3' },
            { name: 'Fal', models: 'Flux, Stable Diffusion' },
            { name: 'Replicate', models: 'Various models' },
            { name: 'Together AI', models: 'Flux, SDXL' },
            { name: 'Google', models: 'Imagen' },
            { name: 'Black Forest', models: 'Flux Pro' },
          ].map((provider) => (
            <Card key={provider.name} className="p-2">
              <div className="font-medium text-xs">{provider.name}</div>
              <div className="text-xs text-muted-foreground">{provider.models}</div>
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
