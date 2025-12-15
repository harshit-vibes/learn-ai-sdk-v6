'use client'

import { useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { LearningPage } from '@/components/educational'
import { getPageContent } from '@/lib/education-content'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Loader2 } from 'lucide-react'

const content = getPageContent('text/prompts')!

const codeExamples = [
  {
    title: 'System Prompt',
    language: 'typescript',
    code: `const result = await generateText({
  model,
  system: \`You are a helpful assistant that speaks like a pirate.
Always end responses with "Arrr!"\`,
  prompt: 'Tell me about the weather',
})`,
  },
  {
    title: 'Few-Shot Examples',
    language: 'typescript',
    code: `const result = await generateText({
  model,
  messages: [
    // Example 1
    { role: 'user', content: 'Translate to French: Hello' },
    { role: 'assistant', content: 'Bonjour' },
    // Example 2
    { role: 'user', content: 'Translate to French: Goodbye' },
    { role: 'assistant', content: 'Au revoir' },
    // Actual request
    { role: 'user', content: 'Translate to French: Thank you' },
  ],
})`,
  },
  {
    title: 'Message Parts',
    language: 'typescript',
    code: `// v6 messages use parts array
const messages = [
  {
    role: 'user',
    content: [
      { type: 'text', text: 'What is in this image?' },
      { type: 'image', image: imageUrl },
    ],
  },
]`,
  },
]

function PromptDemo() {
  const [systemPrompt, setSystemPrompt] = useState('You are a helpful assistant.')
  const [input, setInput] = useState('')
  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: '/api/prompts' }),
  })
  const isLoading = status === 'streaming' || status === 'submitted'

  const handleSubmit = () => {
    if (!input.trim()) return
    // Send with system prompt in body
    sendMessage({
      text: input,
      body: { system: systemPrompt },
    } as any)
    setInput('')
  }

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="space-y-2">
        <label className="text-sm font-medium">System Prompt</label>
        <Textarea
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          placeholder="Set the AI's behavior and personality..."
          rows={3}
          className="text-sm"
        />
      </div>

      <div className="flex items-center gap-2">
        <Badge variant={isLoading ? 'default' : 'secondary'}>
          {isLoading ? 'Streaming' : 'Ready'}
        </Badge>
        {messages.length > 0 && (
          <Button variant="outline" size="sm" onClick={() => setMessages([])}>
            Clear
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 border rounded-lg p-4 min-h-[200px]">
        {messages.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Customize the system prompt above, then send a message
          </p>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={msg.role === 'user' ? 'text-right' : ''}>
                <span className="text-xs text-muted-foreground">{msg.role}</span>
                <Card className={`p-2 inline-block max-w-[80%] ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : ''}`}>
                  {msg.parts.map((p: any, i) => p.type === 'text' ? <span key={i}>{p.text}</span> : null)}
                </Card>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          disabled={isLoading}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <Button onClick={handleSubmit} disabled={isLoading || !input.trim()}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send'}
        </Button>
      </div>
    </div>
  )
}

export default function PromptsPage() {
  return <LearningPage content={content} demo={<PromptDemo />} codeExamples={codeExamples} />
}
