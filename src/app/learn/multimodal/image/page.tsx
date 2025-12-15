'use client'

import { LearningPage } from '@/components/educational'
import { getPageContent } from '@/lib/education-content'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Image, Sparkles, AlertCircle } from 'lucide-react'

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

function ImageGenDemo() {
  return (
    <div className="space-y-6">
      <Card className="p-4 bg-amber-500/10 border-amber-500/20">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
          <div>
            <h3 className="font-medium">Provider Required</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Image generation requires a provider that supports image models (OpenAI DALL-E, Fal, etc.).
              This demo shows the API patterns - actual generation depends on your provider setup.
            </p>
          </div>
        </div>
      </Card>

      <div>
        <h3 className="font-medium mb-3">Supported Providers</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { name: 'OpenAI', models: 'DALL-E 2, DALL-E 3' },
            { name: 'Google', models: 'Imagen' },
            { name: 'Fal', models: 'Flux, Stable Diffusion' },
            { name: 'Replicate', models: 'Various models' },
            { name: 'Together AI', models: 'Flux, SDXL' },
            { name: 'Black Forest', models: 'Flux Pro' },
          ].map((provider) => (
            <Card key={provider.name} className="p-3">
              <div className="font-medium text-sm">{provider.name}</div>
              <div className="text-xs text-muted-foreground">{provider.models}</div>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Output Formats</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge>base64</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Image data as a base64-encoded string. Use for embedding in HTML or storing.
            </p>
            <code className="text-xs mt-2 block">image.base64</code>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">uint8Array</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Raw binary data as Uint8Array. Use for file operations or processing.
            </p>
            <code className="text-xs mt-2 block">image.uint8Array</code>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Common Options</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between p-2 bg-muted rounded">
            <code>size</code>
            <span className="text-muted-foreground">e.g., "1024x1024", "512x512"</span>
          </div>
          <div className="flex justify-between p-2 bg-muted rounded">
            <code>aspectRatio</code>
            <span className="text-muted-foreground">e.g., "16:9", "1:1", "4:3"</span>
          </div>
          <div className="flex justify-between p-2 bg-muted rounded">
            <code>n</code>
            <span className="text-muted-foreground">Number of images to generate</span>
          </div>
          <div className="flex justify-between p-2 bg-muted rounded">
            <code>providerOptions</code>
            <span className="text-muted-foreground">Provider-specific settings</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ImageGenPage() {
  return <LearningPage content={content} demo={<ImageGenDemo />} codeExamples={codeExamples} />
}
