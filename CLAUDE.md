# Claude Code Memory - AI SDK Demo Project

## Critical: AI SDK Version

**This project uses AI SDK v6 (beta) with Vercel AI Gateway.**

Versions:
- ai@6.0.0-beta.151
- @ai-sdk/react@3.0.0-beta.154

Documentation: https://v6.ai-sdk.dev/docs

## Provider Configuration

Using Vercel AI Gateway for model access:

```typescript
// src/lib/openrouter.ts
import { createGateway } from 'ai'

const gateway = createGateway({
  apiKey: process.env.AI_GATEWAY_API_KEY ?? '',
})

export const openrouter = (model: string) => gateway(model)

// Models use provider/model-name format
export const MODELS = {
  chat: 'anthropic/claude-sonnet-4',
  tools: 'anthropic/claude-sonnet-4',
} as const
```

Environment variable: `AI_GATEWAY_API_KEY`

## Project Structure

```
src/
├── app/
│   ├── page.tsx            # Redirects to /learn/overview
│   ├── api/                # API routes for all demos
│   │   ├── chat/           # useChat API
│   │   ├── completion/     # useCompletion API
│   │   ├── object/         # useObject API
│   │   ├── tools/          # Tool calling API
│   │   ├── generate-text/  # generateText API
│   │   ├── generate-object/ # generateObject API
│   │   ├── prompts/        # Custom prompts API
│   │   ├── vision/         # Vision/image input API
│   │   ├── settings/       # Model settings API
│   │   ├── generative-ui/  # Generative UI API
│   │   ├── errors/         # Error simulation API
│   │   └── advanced/       # Advanced features API
│   ├── learn/              # Learning Hub (26 pages)
│   │   ├── layout.tsx      # Sidebar layout
│   │   ├── overview/       # Getting started
│   │   ├── ui/             # AI SDK UI section (4 pages)
│   │   ├── text/           # Text generation section (3 pages)
│   │   ├── structured/     # Structured data section (2 pages)
│   │   ├── tools/          # Tool calling section (3 pages)
│   │   ├── multimodal/     # Multimodal section (4 pages)
│   │   ├── rag/            # RAG & search section (2 pages)
│   │   ├── advanced/       # Advanced section (4 pages)
│   │   └── dev/            # Development section (3 pages)
│   └── demos/              # Legacy demo pages (8 pages)
├── components/
│   ├── educational/        # Educational UI components
│   │   ├── educational-shell.tsx  # Page wrapper
│   │   ├── info-bar.tsx           # Expandable info section
│   │   ├── code-block.tsx         # Syntax highlighted code
│   │   ├── api-reference.tsx      # API props table
│   │   ├── demo-card.tsx          # Demo/Code tabs
│   │   ├── learning-page.tsx      # Reusable page template
│   │   └── index.ts               # Barrel export
│   ├── navigation/
│   │   └── learning-sidebar.tsx   # Sectioned sidebar
│   ├── demos/              # Reusable demo components
│   │   ├── chat-demo.tsx
│   │   └── completion-demo.tsx
│   ├── chat/               # Chat UI components
│   └── ui/                 # shadcn/ui components
└── lib/
    ├── openrouter.ts       # Gateway provider config
    ├── schemas.ts          # Zod schemas
    └── education-content.ts # Centralized content config
```

## Learning Hub Navigation (26 Pages)

```
📚 AI SDK v6 Learning Hub

🎯 GETTING STARTED
   └── Overview & Setup          /learn/overview

🖥️ AI SDK UI (React Hooks)
   ├── useChat                   /learn/ui/chat
   ├── useCompletion             /learn/ui/completion
   ├── useObject                 /learn/ui/object
   └── Stream Utilities          /learn/ui/streams

📝 TEXT GENERATION
   ├── generateText              /learn/text/generate
   ├── streamText                /learn/text/stream
   └── Prompt Engineering        /learn/text/prompts

📦 STRUCTURED DATA
   ├── generateObject            /learn/structured/generate
   └── streamObject              /learn/structured/stream

🔧 TOOL CALLING
   ├── Basic Tools               /learn/tools/basic
   ├── Multi-step Agents         /learn/tools/agents
   └── MCP (Conceptual)          /learn/tools/mcp

🎨 MULTIMODAL
   ├── Vision (Image Input)      /learn/multimodal/vision
   ├── Image Generation          /learn/multimodal/image
   ├── Transcription             /learn/multimodal/transcription
   └── Speech (TTS)              /learn/multimodal/speech

🔍 RAG & SEARCH
   ├── Embeddings                /learn/rag/embeddings
   └── Reranking                 /learn/rag/reranking

⚙️ ADVANCED
   ├── Model Settings            /learn/advanced/settings
   ├── Middleware                /learn/advanced/middleware
   ├── Provider Management       /learn/advanced/providers
   └── Error Handling            /learn/advanced/errors

🛠️ DEVELOPMENT
   ├── Testing                   /learn/dev/testing
   ├── Telemetry                 /learn/dev/telemetry
   └── DevTools                  /learn/dev/devtools
```

## Educational Components

### LearningPage - Reusable page template
```tsx
import { LearningPage } from '@/components/educational'
import { getPageContent } from '@/lib/education-content'

const content = getPageContent('ui/chat')!

export default function ChatPage() {
  return (
    <LearningPage
      content={content}      // From centralized config
      demo={<ChatDemo />}    // Interactive demo component
      codeExamples={[...]}   // Code snippets for tabs
    />
  )
}
```

### Content Configuration (src/lib/education-content.ts)
```typescript
interface PageContent {
  title: string
  subtitle: string
  category: string
  docsUrl: string
  infoBar: {
    whatIs: string
    whenToUse: string[]
    keyConcepts: { term: string; definition: string }[]
    codeExample?: string
  }
  apiReference?: { name: string; type: string; description: string }[]
}

// Get content by path
const content = getPageContent('ui/chat')
```

## Key v6 Patterns

### React Hooks
```typescript
import { useChat, useCompletion, experimental_useObject as useObject } from '@ai-sdk/react'
```

### useChat Hook (v6)
```typescript
const { messages, sendMessage, status, setMessages } = useChat()

// Custom API endpoint via transport
import { DefaultChatTransport } from 'ai'
const { messages, sendMessage, status } = useChat({
  transport: new DefaultChatTransport({ api: '/api/tools' }),
})

// Send message (v6 uses text property)
sendMessage({ text: input })

// Status check
const isLoading = status === 'streaming' || status === 'submitted'
```

### Message Structure (v6)
```typescript
// v6 messages use 'parts' array
message.parts.map(part => {
  if (part.type === 'text') return part.text
})
```

### Tool Definition (Server-side v6)
```typescript
import { streamText, stepCountIs } from 'ai'
import { z } from 'zod'

// Define schema separately for type inference
const weatherParams = z.object({
  location: z.string().describe('City name'),
})

// v6 uses inputSchema (not parameters)
tools: {
  weather: {
    description: 'Get current weather',
    inputSchema: weatherParams,
    execute: async ({ location }: z.infer<typeof weatherParams>) => {
      return { location, temperature: 22 }
    },
  },
}

// Multi-step with stopWhen
stopWhen: stepCountIs(5),
```

### Tool Parts in Messages (Client-side v6)
```typescript
// v6 tool parts have type 'tool-{toolName}'
if (part.type === 'tool-getWeather') {
  // part.toolCallId, part.input, part.state, part.output, part.errorText
  if (part.state === 'output-available' && part.output) {
    return <WeatherCard data={part.output} />
  }
}
```

### API Route Response (v6)
```typescript
return result.toUIMessageStreamResponse()
```

### useObject Hook (v6)
```typescript
const { object, submit, isLoading, error } = useObject({
  api: '/api/object',
  schema: profileSchema,
})
```

### Model Settings (v6)
```typescript
// Use maxOutputTokens (not maxTokens) in v6
const result = await generateText({
  model: openrouter(MODELS.chat),
  prompt,
  temperature: 0.7,
  maxOutputTokens: 200,  // v6 property name
})
```

## Key References

- AI SDK v6 Docs: https://v6.ai-sdk.dev/docs
- AI Gateway: https://vercel.com/docs/ai-gateway
- useChat v6: https://v6.ai-sdk.dev/docs/ai-sdk-ui/chatbot
