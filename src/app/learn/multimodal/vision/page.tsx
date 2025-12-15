'use client'

import { useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { LearningPage } from '@/components/educational'
import { getPageContent } from '@/lib/education-content'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Loader2, Image as ImageIcon, Send } from 'lucide-react'

const content = getPageContent('multimodal/vision')!

const codeExamples = [
  {
    title: 'Image URL Input',
    language: 'typescript',
    code: `const result = await generateText({
  model: gateway('anthropic/claude-sonnet-4'),
  messages: [{
    role: 'user',
    content: [
      { type: 'text', text: 'What is in this image?' },
      {
        type: 'image',
        image: 'https://example.com/image.jpg',
      },
    ],
  }],
})`,
  },
  {
    title: 'Base64 Image',
    language: 'typescript',
    code: `// For uploaded files or generated images
const result = await generateText({
  model,
  messages: [{
    role: 'user',
    content: [
      { type: 'text', text: 'Describe this image' },
      {
        type: 'image',
        image: base64Data, // Without data:image prefix
        mimeType: 'image/png',
      },
    ],
  }],
})`,
  },
  {
    title: 'API Route',
    language: 'typescript',
    code: `export async function POST(req: Request) {
  const { messages, imageUrl } = await req.json()

  // Append image to last message
  const messagesWithImage = messages.map((m, i) => {
    if (i === messages.length - 1 && m.role === 'user') {
      return {
        ...m,
        content: [
          { type: 'text', text: m.content },
          { type: 'image', image: imageUrl },
        ],
      }
    }
    return m
  })

  const result = streamText({
    model: gateway('anthropic/claude-sonnet-4'),
    messages: messagesWithImage,
  })

  return result.toUIMessageStreamResponse()
}`,
  },
]

function VisionDemo() {
  const [imageUrl, setImageUrl] = useState('')
  const [prompt, setPrompt] = useState('')
  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: '/api/vision' }),
  })
  const isLoading = status === 'streaming' || status === 'submitted'

  const handleSubmit = () => {
    if (!prompt.trim()) return
    sendMessage({
      text: prompt,
      body: { imageUrl },
    } as any)
    setPrompt('')
  }

  const sampleImages = [
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/300px-PNG_transparency_demonstration_1.png', label: 'Dice' },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Camponotus_flavomarginatus_ant.jpg/320px-Camponotus_flavomarginatus_ant.jpg', label: 'Ant' },
  ]

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="space-y-2">
        <label className="text-sm font-medium">Image URL</label>
        <div className="flex gap-2">
          <Input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1"
          />
          {sampleImages.map((img) => (
            <Button
              key={img.label}
              variant="outline"
              size="sm"
              onClick={() => setImageUrl(img.url)}
            >
              {img.label}
            </Button>
          ))}
        </div>
        {imageUrl && (
          <div className="flex items-center gap-2">
            <img src={imageUrl} alt="Preview" className="h-20 rounded border" onError={() => {}} />
            <Badge variant="secondary">Image loaded</Badge>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Badge variant={isLoading ? 'default' : 'secondary'}>
          {isLoading ? 'Analyzing...' : 'Ready'}
        </Badge>
        {messages.length > 0 && (
          <Button variant="outline" size="sm" onClick={() => setMessages([])}>Clear</Button>
        )}
      </div>

      <ScrollArea className="flex-1 border rounded-lg p-4 min-h-[150px]">
        {messages.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Enter an image URL and ask a question about it
          </p>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <Card key={msg.id} className={`p-3 ${msg.role === 'user' ? 'bg-primary text-primary-foreground ml-8' : 'mr-8'}`}>
                <span className="text-xs opacity-70">{msg.role}</span>
                <div className="mt-1">
                  {msg.parts.map((p: any, i) => p.type === 'text' ? <span key={i}>{p.text}</span> : null)}
                </div>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="flex gap-2">
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="What's in this image?"
          disabled={isLoading}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <Button onClick={handleSubmit} disabled={isLoading || !prompt.trim()}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  )
}

export default function VisionPage() {
  return <LearningPage content={content} demo={<VisionDemo />} codeExamples={codeExamples} />
}
