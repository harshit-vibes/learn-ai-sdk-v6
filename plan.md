# AI SDK UI v6 - Mini Apps Demo Plan

A collection of mini apps demonstrating end-to-end capabilities of [AI SDK UI](https://v6.ai-sdk.dev/docs/ai-sdk-ui/overview).

---

## Project Structure

```
ai-sdk-demo/
├── src/app/
│   ├── page.tsx                    # Home - links to all demos
│   ├── demos/
│   │   ├── 1-basic-chat/           # Basic chatbot
│   │   ├── 2-completion/           # Text completion
│   │   ├── 3-object-generation/    # Structured JSON streaming
│   │   ├── 4-tool-usage/           # Server & client-side tools
│   │   ├── 5-generative-ui/        # Dynamic component rendering
│   │   ├── 6-persistence/          # Message save/load
│   │   ├── 7-error-handling/       # Error patterns
│   │   └── 8-advanced/             # Resume streams, custom data
│   └── api/
│       ├── chat/route.ts
│       ├── completion/route.ts
│       ├── object/route.ts
│       └── ...
```

---

## Demo 1: Basic Chatbot

**Capability:** `useChat` hook fundamentals

**Features to demo:**
- Real-time message streaming
- Message state management (`messages`, `sendMessage`)
- Status handling (`status`: ready, submitted, streaming, error)
- Stop generation (`stop()`)
- Clear messages (`setMessages`)

**Files:**
- `src/app/demos/1-basic-chat/page.tsx`
- `src/app/api/chat/route.ts`

---

## Demo 2: Text Completion

**Capability:** `useCompletion` hook

**Features to demo:**
- Single prompt → streamed text response
- `handleInputChange`, `handleSubmit` pattern
- `completion` state updates in real-time
- `stop()` to cancel generation
- `isLoading` state for UI feedback
- `onFinish` callback

**Example use case:** Blog post generator, code explainer

**Files:**
- `src/app/demos/2-completion/page.tsx`
- `src/app/api/completion/route.ts`

---

## Demo 3: Object Generation

**Capability:** `useObject` hook with Zod schemas

**Features to demo:**
- Stream structured JSON objects
- Partial object rendering as it streams
- Zod schema validation
- `isLoading`, `error`, `stop()` states
- Enum/classification mode

**Example use cases:**
- Recipe generator (title, ingredients[], steps[])
- Quiz generator (question, options[], answer)
- Profile card generator

**Files:**
- `src/app/demos/3-object-generation/page.tsx`
- `src/app/api/object/route.ts`
- `src/lib/schemas.ts` (shared Zod schemas)

---

## Demo 4: Tool Usage

**Capability:** Server-side & client-side tools

**Features to demo:**

### 4a. Server-Side Tools
- Tool with `execute` function
- Auto-execution on server
- Weather lookup example

### 4b. Client-Side Tools
- `onToolCall` callback
- `addToolOutput` to return results
- Browser API access (geolocation, clipboard)

### 4c. User Confirmation Tools
- Tool requiring user approval
- Confirmation dialog pattern
- Sensitive operation handling

### 4d. Multi-Step Tools
- Sequential tool calls
- Step boundaries
- Tool call streaming

**Files:**
- `src/app/demos/4-tool-usage/page.tsx`
- `src/app/api/tools/route.ts`

---

## Demo 5: Generative UI

**Capability:** Dynamic component rendering based on LLM decisions

**Features to demo:**
- Tools that render React components
- Weather card component
- Stock ticker component
- Loading/success/error states per tool
- Multiple tools in single conversation

**Example flow:**
1. User: "What's the weather in Tokyo?"
2. LLM calls `getWeather` tool
3. UI renders `<WeatherCard city="Tokyo" temp={22} />`

**Files:**
- `src/app/demos/5-generative-ui/page.tsx`
- `src/app/demos/5-generative-ui/components/`
  - `WeatherCard.tsx`
  - `StockTicker.tsx`
  - `ImageGallery.tsx`
- `src/app/api/generative-ui/route.ts`

---

## Demo 6: Message Persistence

**Capability:** Save and load chat history

**Features to demo:**
- Generate unique chat IDs
- Save messages on `onFinish`
- Load previous messages on mount
- `validateUIMessages` for tool calls
- Multiple chat sessions
- Chat history sidebar

**Storage options demo:**
- LocalStorage (simple)
- File system (demo)
- Database-ready pattern

**Files:**
- `src/app/demos/6-persistence/page.tsx`
- `src/app/demos/6-persistence/[chatId]/page.tsx`
- `src/app/api/chats/route.ts`
- `src/app/api/chats/[chatId]/route.ts`
- `src/lib/chat-storage.ts`

---

## Demo 7: Error Handling

**Capability:** Graceful error management

**Features to demo:**
- `error` object from hooks
- Display user-friendly error messages
- Retry button pattern
- `onError` callback
- Message replacement on error
- Rate limit handling
- Network error handling

**Scenarios to simulate:**
- API key invalid
- Rate limited
- Network timeout
- Invalid response

**Files:**
- `src/app/demos/7-error-handling/page.tsx`
- `src/app/api/error-demo/route.ts`

---

## Demo 8: Advanced Features

**Capability:** Resume streams, custom data, metadata

### 8a. Stream Resumption
- `resume: true` in useChat
- Reconnect after page reload
- Redis-backed stream storage (concept demo)

### 8b. Custom Data Streaming
- Send additional data alongside messages
- Progress indicators
- Source citations
- Metadata in responses

### 8c. Message Metadata
- Attach custom data to messages
- Token usage tracking
- Timestamps
- Model info

**Files:**
- `src/app/demos/8-advanced/page.tsx`
- `src/app/demos/8-advanced/resume/page.tsx`
- `src/app/demos/8-advanced/metadata/page.tsx`

---

## Implementation Order

| Phase | Demos | Complexity |
|-------|-------|------------|
| 1 | Demo 1 (Basic Chat) | Low |
| 2 | Demo 2 (Completion) | Low |
| 3 | Demo 3 (Object Gen) | Medium |
| 4 | Demo 7 (Error Handling) | Low |
| 5 | Demo 4 (Tool Usage) | Medium |
| 6 | Demo 5 (Generative UI) | High |
| 7 | Demo 6 (Persistence) | Medium |
| 8 | Demo 8 (Advanced) | High |

---

## Shared Components

```
src/components/
├── ui/
│   ├── ChatMessage.tsx       # Reusable message bubble
│   ├── ChatInput.tsx         # Input with send button
│   ├── LoadingSpinner.tsx
│   ├── ErrorAlert.tsx
│   └── CodeBlock.tsx
├── layout/
│   ├── DemoLayout.tsx        # Consistent demo wrapper
│   └── Sidebar.tsx           # Navigation
└── demos/
    ├── WeatherCard.tsx
    ├── StockTicker.tsx
    └── RecipeCard.tsx
```

---

## Home Page Design

Landing page with cards linking to each demo:

```
┌─────────────────────────────────────────────────────┐
│           AI SDK UI v6 - Feature Demos              │
├─────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │ Basic Chat  │  │ Completion  │  │ Object Gen  │  │
│  │  useChat    │  │useCompletion│  │  useObject  │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │ Tool Usage  │  │Generative UI│  │ Persistence │  │
│  │  tools      │  │  dynamic    │  │  save/load  │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  │
│  ┌─────────────┐  ┌─────────────┐                   │
│  │Error Handle │  │  Advanced   │                   │
│  │  graceful   │  │resume/meta  │                   │
│  └─────────────┘  └─────────────┘                   │
└─────────────────────────────────────────────────────┘
```

---

## Dependencies to Add

```bash
npm install zod uuid
npm install -D @types/uuid
```

---

## Environment Variables

```env
# .env.local
OPENROUTER_API_KEY=sk-or-v1-xxx

# Optional for persistence demo
REDIS_URL=redis://localhost:6379
```

---

## Next Steps

1. Start with Demo 1 (Basic Chat) - already partially done
2. Create shared components
3. Build home page with navigation
4. Implement demos in order of complexity
5. Add documentation/comments in each demo explaining the concepts
