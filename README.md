# AI SDK v6 Learning Hub

An interactive learning platform for Vercel AI SDK v6 (beta) featuring 26+ educational demos with live code examples. Built with Next.js 16, React 19, and TypeScript.

![AI SDK v6](https://img.shields.io/badge/AI%20SDK-v6%20beta-blue)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## Features

- **26 Interactive Learning Pages** covering all AI SDK v6 features
- **Live Demos** with real AI model integration
- **Code Examples** with syntax highlighting
- **Guided Setup** for API keys and providers
- **Educational UI** with concepts, when-to-use guides, and API references

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm, npm, or yarn

### Installation

```bash
git clone https://github.com/harshit-vibes/learn-ai-sdk-v6.git
cd learn-ai-sdk-v6
npm install
```

### Environment Setup

Create a `.env.local` file:

```env
# Required: Vercel AI Gateway (for all core demos)
AI_GATEWAY_API_KEY=your_vercel_ai_gateway_key

# Optional: For specific features
OPENAI_API_KEY=your_openai_key           # Speech/TTS, Image Generation
REPLICATE_API_KEY=your_replicate_key     # Image Generation (Flux)
GROQ_API_KEY=your_groq_key               # Transcription (Whisper)
COHERE_API_KEY=your_cohere_key           # Reranking
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access the Learning Hub.

---

## Demo Guide

### AI SDK UI (React Hooks)

#### useChat (`/learn/ui/chat`)
Build conversational AI interfaces with message history management.

**How to use:**
1. Type a message in the input field
2. Press Enter or click Send
3. Watch the streaming response appear
4. Observe message history in the sidebar

**Key concepts:** Message state, streaming responses, transport configuration

#### useCompletion (`/learn/ui/completion`)
Single-turn text completions for autocomplete and inline suggestions.

**How to use:**
1. Enter a partial sentence or prompt
2. Click "Complete" to generate continuation
3. The completion streams in real-time

**Key concepts:** Completion vs chat, single-turn generation

#### useObject (`/learn/ui/object`)
Stream structured JSON objects that conform to a Zod schema.

**How to use:**
1. Select a schema type (Profile, Recipe, etc.)
2. Enter a description prompt
3. Watch the object populate field-by-field

**Key concepts:** Schema validation, partial object streaming

#### Stream Utilities (`/learn/ui/streams`)
Low-level stream manipulation with event visualization.

**How to use:**
1. Select a scenario (Simple, Tools, Complex, Error)
2. Click "Run Stream" to start
3. Watch events appear in the Event Stream panel
4. See accumulated text in the right panel

**Key concepts:** `createUIMessageStream`, `readUIMessageStream`, stream events

---

### Text Generation

#### generateText (`/learn/text/generate`)
One-shot text generation with full response.

**How to use:**
1. Enter a prompt
2. Click "Generate"
3. Receive complete response with usage stats

**Key concepts:** Non-streaming generation, token usage

#### streamText (`/learn/text/stream`)
Token-by-token streaming for real-time responses.

**How to use:**
1. Enter a prompt
2. Click "Stream"
3. Watch text appear character-by-character

**Key concepts:** Streaming responses, `textStream`, `fullStream`

#### Prompt Engineering (`/learn/text/prompts`)
System prompts, templates, and prompt composition.

**How to use:**
1. Configure system prompt
2. Add user prompt with variables
3. See the composed prompt and response

**Key concepts:** System messages, prompt templates, few-shot learning

---

### Structured Data

#### generateObject (`/learn/structured/generate`)
Generate structured data matching a Zod schema.

**How to use:**
1. Select a schema (Person, Recipe, Event)
2. Provide source data or prompt
3. Receive validated JSON object

**Key concepts:** Schema validation, type-safe outputs

#### streamObject (`/learn/structured/stream`)
Stream partial objects as they generate.

**How to use:**
1. Select schema
2. Watch object build incrementally
3. Use partial data for progressive UI

**Key concepts:** Partial streaming, progressive rendering

---

### Tool Calling

#### Basic Tools (`/learn/tools/basic`)
Define and execute AI-callable functions.

**How to use:**
1. Ask a question that requires a tool (e.g., "What's the weather in Paris?")
2. Watch the AI call the weather tool
3. See the result integrated into the response

**Key concepts:** Tool definitions, `inputSchema`, execute functions

#### Multi-step Agents (`/learn/tools/agents`)
Autonomous agents that chain multiple tool calls.

**How to use:**
1. Give a complex task requiring multiple steps
2. Watch the agent plan and execute steps
3. See intermediate results and final answer

**Key concepts:** `stopWhen`, `stepCountIs`, multi-step execution

#### MCP - Model Context Protocol (`/learn/tools/mcp`)
Dynamic tool discovery with MCP servers.

**How to use:**
1. Click an MCP server to connect (Filesystem, GitHub, etc.)
2. View discovered tools and their schemas
3. Select a tool and fill in parameters
4. Execute and see the result

**Key concepts:** MCP protocol, tool discovery, server configuration

---

### Multimodal

#### Vision - Image Input (`/learn/multimodal/vision`)
Analyze images with AI vision models.

**How to use:**
1. Upload an image or paste a URL
2. Ask a question about the image
3. Receive AI analysis

**Key concepts:** Image encoding, vision models, multi-part messages

#### Image Generation (`/learn/multimodal/image`)
Generate images from text prompts.

**How to use:**
1. Enter a descriptive prompt
2. Select size (Square, Portrait, Landscape)
3. Choose a style modifier
4. Click "Generate Image"

**API Keys:** Requires `REPLICATE_API_KEY` or `OPENAI_API_KEY`

**Key concepts:** Image models, aspect ratios, style modifiers

#### Transcription (`/learn/multimodal/transcription`)
Convert audio to text with Whisper.

**How to use:**
1. Click "Start Recording" to record audio
2. Or upload an audio file
3. Click "Transcribe"
4. View the transcribed text with timestamps

**API Keys:** Requires `GROQ_API_KEY` (free tier available)

**Key concepts:** Audio processing, Whisper model, timestamps

#### Speech / TTS (`/learn/multimodal/speech`)
Convert text to natural speech.

**How to use:**
1. Enter text to speak
2. Select a voice (Alloy, Nova, Shimmer, etc.)
3. Adjust speed
4. Click "Generate Speech"
5. Play or download the audio

**API Keys:** Requires `OPENAI_API_KEY` (falls back to browser TTS)

**Key concepts:** TTS voices, speech synthesis, audio output

---

### RAG & Search

#### Embeddings (`/learn/rag/embeddings`)
Generate vector embeddings for semantic search.

**How to use:**
1. Enter text to embed
2. Generate embedding vector
3. Compare similarity between texts

**Key concepts:** Vector embeddings, cosine similarity, semantic search

#### Reranking (`/learn/rag/reranking`)
Re-order search results by relevance.

**How to use:**
1. Enter a query
2. View initial document rankings
3. Click "Rerank" to re-order by relevance
4. Compare before/after scores

**API Keys:** Requires `COHERE_API_KEY` (free tier available)

**Key concepts:** Two-stage retrieval, relevance scoring

---

### Advanced

#### Model Settings (`/learn/advanced/settings`)
Configure temperature, tokens, and other parameters.

**How to use:**
1. Adjust temperature slider (0-2)
2. Set max output tokens
3. Configure top-p, frequency penalty
4. Generate with settings

**Key concepts:** `maxOutputTokens`, temperature, sampling parameters

#### Middleware (`/learn/advanced/middleware`)
Intercept and transform AI requests/responses.

**How to use:**
1. Toggle middleware layers (Logging, Caching, RAG, Guardrails)
2. Enter a prompt
3. Click "Run with Middleware"
4. View execution log showing each layer

**Key concepts:** `wrapLanguageModel`, middleware chain, request/response hooks

#### Provider Management (`/learn/advanced/providers`)
Work with multiple AI providers.

**How to use:**
1. View available providers
2. See model configurations
3. Understand provider-specific options

**Key concepts:** Provider registry, model aliases, fallbacks

#### Error Handling (`/learn/advanced/errors`)
Handle AI errors gracefully.

**How to use:**
1. Select an error type to simulate
2. Click "Trigger Error"
3. See error handling patterns

**Key concepts:** Error types, retry logic, fallback strategies

---

### Development

#### Testing (`/learn/dev/testing`)
Test AI applications with mock models.

**How to use:**
1. Configure mock response settings
2. Set expected tokens and finish reason
3. Run test
4. See assertions pass/fail

**Key concepts:** `MockLanguageModelV3`, test assertions, deterministic testing

#### Telemetry (`/learn/dev/telemetry`)
Monitor AI operations with OpenTelemetry.

**How to use:**
1. Configure telemetry options (record inputs/outputs)
2. Set custom metadata
3. Run a generation
4. View trace spans with timing

**Key concepts:** OpenTelemetry spans, trace visualization, performance monitoring

#### DevTools (`/learn/dev/devtools`)
Debug AI SDK operations in real-time.

**How to use:**
1. Click "Simulate Request" to add sample requests
2. View request list with status
3. Click a request to see details
4. Switch between Request/Response/Metadata tabs

**Key concepts:** Request inspection, token tracking, latency monitoring

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                 # Redirects to /learn/overview
│   ├── api/
│   │   ├── chat/                # useChat API
│   │   ├── completion/          # useCompletion API
│   │   ├── object/              # useObject API
│   │   ├── tools/               # Tool calling API
│   │   └── learn/               # Learning demo APIs
│   │       ├── streams/         # Stream utilities demo
│   │       ├── middleware/      # Middleware demo
│   │       ├── testing/         # Testing demo
│   │       ├── telemetry/       # Telemetry demo
│   │       ├── devtools/        # DevTools demo
│   │       ├── transcription/   # Whisper transcription
│   │       ├── speech/          # TTS demo
│   │       ├── image/           # Image generation
│   │       ├── reranking/       # Cohere reranking
│   │       └── mcp/             # MCP demo
│   ├── learn/                   # Learning Hub (26 pages)
│   │   ├── overview/            # Getting started
│   │   ├── ui/                  # React hooks (4 pages)
│   │   ├── text/                # Text generation (3 pages)
│   │   ├── structured/          # Structured data (2 pages)
│   │   ├── tools/               # Tool calling (3 pages)
│   │   ├── multimodal/          # Multimodal (4 pages)
│   │   ├── rag/                 # RAG & search (2 pages)
│   │   ├── advanced/            # Advanced (4 pages)
│   │   └── dev/                 # Development (3 pages)
│   └── demos/                   # Legacy demos (8 pages)
├── components/
│   ├── educational/             # Learning UI components
│   ├── navigation/              # Sidebar navigation
│   ├── demos/                   # Reusable demo components
│   └── ui/                      # shadcn/ui components
└── lib/
    ├── openrouter.ts            # AI Gateway config
    ├── schemas.ts               # Zod schemas
    └── education-content.ts     # Page content config
```

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19, Tailwind CSS 4, shadcn/ui
- **AI:** Vercel AI SDK v6 (beta)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS with tw-animate-css
- **Code Highlighting:** Shiki

## API Keys Reference

| Feature | Environment Variable | Provider | Free Tier |
|---------|---------------------|----------|-----------|
| Core demos | `AI_GATEWAY_API_KEY` | Vercel AI Gateway | Limited |
| Image Gen | `REPLICATE_API_KEY` | Replicate (Flux) | Yes |
| Image Gen | `OPENAI_API_KEY` | OpenAI (DALL-E) | No |
| Speech/TTS | `OPENAI_API_KEY` | OpenAI TTS | No |
| Transcription | `GROQ_API_KEY` | Groq (Whisper) | Yes |
| Reranking | `COHERE_API_KEY` | Cohere | Yes |

## Deployment

### Vercel (Recommended)

```bash
vercel
```

Or connect your GitHub repo to Vercel for automatic deployments.

### Other Platforms

```bash
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Resources

- [AI SDK v6 Documentation](https://v6.ai-sdk.dev/docs)
- [Vercel AI Gateway](https://vercel.com/docs/ai-gateway)
- [Next.js Documentation](https://nextjs.org/docs)

## License

MIT License - feel free to use this for learning and education.
