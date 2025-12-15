// Centralized educational content configuration for all pages
// This allows easy updates and consistency across the learning hub

export interface PageContent {
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
  apiReference?: {
    name: string
    type: string
    required?: boolean
    default?: string
    description: string
  }[]
  codeExamples?: {
    title: string
    language: string
    code: string
  }[]
}

export const pageContent: Record<string, PageContent> = {
  // AI SDK UI
  'ui/chat': {
    title: 'useChat',
    subtitle: 'Real-time streaming chat interface with automatic state management',
    category: 'AI SDK UI',
    docsUrl: 'https://v6.ai-sdk.dev/docs/ai-sdk-ui/chatbot',
    infoBar: {
      whatIs: 'useChat is a React hook that manages the complete state of a chat interface. It handles message history, streaming responses, loading states, and error handling automatically.',
      whenToUse: [
        'Building conversational AI interfaces',
        'Chat applications with streaming responses',
        'Multi-turn conversations with context',
        'When you need automatic state management for chat',
      ],
      keyConcepts: [
        { term: 'UIMessage', definition: 'Message format with id, role (user/assistant), and parts array' },
        { term: 'parts', definition: 'Array of message content - text, tool calls, etc.' },
        { term: 'transport', definition: 'Configures the API endpoint for chat communication' },
        { term: 'status', definition: 'Tracks streaming state: idle, submitted, or streaming' },
      ],
      codeExample: `const { messages, sendMessage, status } = useChat({
  transport: new DefaultChatTransport({ api: '/api/chat' })
})

sendMessage({ text: 'Hello!' })`,
    },
    apiReference: [
      { name: 'messages', type: 'UIMessage[]', description: 'Array of chat messages with role and parts' },
      { name: 'sendMessage', type: '(options) => void', description: 'Send a new message' },
      { name: 'status', type: '"idle" | "submitted" | "streaming"', description: 'Current chat status' },
      { name: 'stop', type: '() => void', description: 'Stop current streaming' },
      { name: 'setMessages', type: '(messages) => void', description: 'Set messages manually' },
      { name: 'error', type: 'Error | undefined', description: 'Error if occurred' },
      { name: 'clearError', type: '() => void', description: 'Clear error' },
    ],
  },

  'ui/completion': {
    title: 'useCompletion',
    subtitle: 'Single-prompt text completion with streaming support',
    category: 'AI SDK UI',
    docsUrl: 'https://v6.ai-sdk.dev/docs/ai-sdk-ui/completion',
    infoBar: {
      whatIs: 'useCompletion is a React hook for single-prompt text generation. Unlike useChat which maintains conversation history, useCompletion is stateless - each request is independent.',
      whenToUse: [
        'Text completion tasks (story continuation, code completion)',
        'Single-shot generation without conversation context',
        'Form-based generation interfaces',
        'When you need simple prompt → response flow',
      ],
      keyConcepts: [
        { term: 'completion', definition: 'The generated text, updated in real-time as it streams' },
        { term: 'handleSubmit', definition: 'Form handler that sends the input to the API' },
        { term: 'prompt', definition: 'Server receives { prompt } instead of messages array' },
        { term: 'toTextStreamResponse', definition: 'Server returns plain text stream, not UI messages' },
      ],
      codeExample: `const { completion, input, handleSubmit } = useCompletion({
  api: '/api/completion'
})

// In form: onSubmit={handleSubmit}`,
    },
    apiReference: [
      { name: 'completion', type: 'string', description: 'The current completion text, updated as it streams' },
      { name: 'input', type: 'string', description: 'The current input value' },
      { name: 'setInput', type: '(input) => void', description: 'Update the input value' },
      { name: 'handleSubmit', type: '(e) => void', description: 'Form submit handler that triggers completion' },
      { name: 'isLoading', type: 'boolean', description: 'Whether a completion is currently streaming' },
      { name: 'stop', type: '() => void', description: 'Stop the current streaming response' },
      { name: 'api', type: 'string', required: true, description: 'The API endpoint for completions' },
    ],
  },

  'ui/object': {
    title: 'useObject',
    subtitle: 'Stream structured JSON objects with Zod schema validation',
    category: 'AI SDK UI',
    docsUrl: 'https://v6.ai-sdk.dev/docs/ai-sdk-ui/object-generation',
    infoBar: {
      whatIs: 'useObject is a React hook that generates structured data matching a Zod schema. The object streams progressively, allowing you to display partial data as it generates.',
      whenToUse: [
        'Generating structured data (profiles, recipes, products)',
        'Form auto-fill from natural language',
        'Data extraction from unstructured text',
        'When you need type-safe generated objects',
      ],
      keyConcepts: [
        { term: 'schema', definition: 'Zod schema that defines and validates the output structure' },
        { term: 'object', definition: 'The generated object, partially populated during streaming' },
        { term: 'submit', definition: 'Function to trigger generation with a prompt' },
        { term: 'streaming', definition: 'Object fields populate progressively as they generate' },
      ],
      codeExample: `const schema = z.object({
  name: z.string(),
  age: z.number(),
})

const { object, submit } = useObject({
  api: '/api/object',
  schema,
})

submit({ prompt: 'A software engineer' })`,
    },
    apiReference: [
      { name: 'object', type: 'T | undefined', description: 'The generated object (partial during streaming)' },
      { name: 'submit', type: '(input) => void', description: 'Trigger generation: submit({ prompt: "..." })' },
      { name: 'isLoading', type: 'boolean', description: 'Whether generation is in progress' },
      { name: 'error', type: 'Error | undefined', description: 'Error object if generation failed' },
      { name: 'stop', type: '() => void', description: 'Stop the current generation' },
      { name: 'schema', type: 'ZodSchema', required: true, description: 'Zod schema defining the object structure' },
    ],
  },

  'ui/streams': {
    title: 'Stream Utilities',
    subtitle: 'Low-level utilities for custom stream management and message handling',
    category: 'AI SDK UI',
    docsUrl: 'https://v6.ai-sdk.dev/docs/ai-sdk-ui/streaming',
    infoBar: {
      whatIs: 'Stream utilities provide low-level control over UI message streams. While useChat and useCompletion handle streaming automatically, these utilities let you build custom streaming experiences.',
      whenToUse: [
        'Building custom streaming UI without useChat',
        'Processing streams outside React (vanilla JS, other frameworks)',
        'Managing token limits in long conversations',
        'Creating custom stream formats or transformations',
      ],
      keyConcepts: [
        { term: 'UIMessageStream', definition: 'A ReadableStream containing structured UI events (text, tool calls, etc.)' },
        { term: 'writer', definition: 'Interface for writing events to the stream (writeText, writeToolCall, etc.)' },
        { term: 'pruning', definition: 'Removing old messages to fit within model token limits' },
        { term: 'streaming events', definition: 'text, tool-call, tool-result, finish, error' },
      ],
      codeExample: `const stream = createUIMessageStream({
  execute: async (writer) => {
    writer.writeText('Hello!')
  }
})`,
    },
    apiReference: [
      { name: 'createUIMessageStream', type: '(options) => ReadableStream', description: 'Creates a stream with execute callback for writing events' },
      { name: 'createUIMessageStreamResponse', type: '(options) => Response', description: 'Wraps a stream in a Response with correct headers' },
      { name: 'readUIMessageStream', type: '(response) => AsyncIterable', description: 'Reads and parses stream events from a Response' },
      { name: 'pruneMessages', type: '(messages, options) => UIMessage[]', description: 'Prunes messages to fit maxTokens limit' },
    ],
  },

  // Text Generation
  'text/generate': {
    title: 'generateText',
    subtitle: 'Non-streaming text generation with awaitable promises',
    category: 'Text Generation',
    docsUrl: 'https://v6.ai-sdk.dev/docs/ai-sdk-core/generating-text',
    infoBar: {
      whatIs: 'generateText produces text in a single request, returning when complete. Use it for non-interactive scenarios like automation, email drafting, or when you need the full response before proceeding.',
      whenToUse: [
        'Background processing and automation',
        'When you need the complete response before continuing',
        'Server-side generation without streaming',
        'Agent implementations with tool use',
      ],
      keyConcepts: [
        { term: 'text', definition: 'The generated text content' },
        { term: 'usage', definition: 'Token consumption metrics' },
        { term: 'finishReason', definition: 'Why generation stopped (stop, length, tool-calls)' },
        { term: 'toolCalls', definition: 'Any tool invocations made during generation' },
      ],
      codeExample: `const { text, usage } = await generateText({
  model: gateway('anthropic/claude-sonnet-4'),
  prompt: 'Write a haiku about coding',
})`,
    },
    apiReference: [
      { name: 'model', type: 'LanguageModel', required: true, description: 'The model to use' },
      { name: 'prompt', type: 'string', description: 'Simple text prompt' },
      { name: 'messages', type: 'Message[]', description: 'Conversation messages' },
      { name: 'system', type: 'string', description: 'System instructions' },
      { name: 'tools', type: 'Record<string, Tool>', description: 'Available tools' },
      { name: 'maxTokens', type: 'number', description: 'Maximum tokens to generate' },
      { name: 'temperature', type: 'number', description: 'Randomness (0-2)' },
    ],
  },

  'text/stream': {
    title: 'streamText',
    subtitle: 'Real-time streaming text generation for interactive applications',
    category: 'Text Generation',
    docsUrl: 'https://v6.ai-sdk.dev/docs/ai-sdk-core/generating-text',
    infoBar: {
      whatIs: 'streamText enables real-time text streaming, perfect for chatbots and interactive applications. Text appears progressively as it generates, providing immediate feedback to users.',
      whenToUse: [
        'Chat interfaces and conversational AI',
        'Real-time content generation',
        'When immediate feedback improves UX',
        'Long-form content that benefits from progressive display',
      ],
      keyConcepts: [
        { term: 'textStream', definition: 'AsyncIterable/ReadableStream of text chunks' },
        { term: 'fullStream', definition: 'Stream with all event types (text, tool-call, etc.)' },
        { term: 'onChunk', definition: 'Callback for each chunk received' },
        { term: 'toUIMessageStreamResponse', definition: 'Convert to Response for useChat' },
      ],
      codeExample: `const result = streamText({
  model: gateway('anthropic/claude-sonnet-4'),
  messages: convertToModelMessages(messages),
})

return result.toUIMessageStreamResponse()`,
    },
    apiReference: [
      { name: 'model', type: 'LanguageModel', required: true, description: 'The model to use' },
      { name: 'messages', type: 'Message[]', description: 'Conversation messages' },
      { name: 'onChunk', type: '(chunk) => void', description: 'Per-chunk callback' },
      { name: 'onFinish', type: '(result) => void', description: 'Completion callback' },
      { name: 'onError', type: '(error) => void', description: 'Error callback' },
      { name: 'stopWhen', type: 'StopCondition', description: 'When to stop (e.g., stepCountIs(5))' },
    ],
  },

  'text/prompts': {
    title: 'Prompt Engineering',
    subtitle: 'Craft effective prompts with system instructions and few-shot examples',
    category: 'Text Generation',
    docsUrl: 'https://v6.ai-sdk.dev/docs/ai-sdk-core/prompts',
    infoBar: {
      whatIs: 'Prompt engineering is the art of crafting inputs that guide AI models to produce desired outputs. AI SDK v6 provides structured ways to define system prompts, few-shot examples, and message templates.',
      whenToUse: [
        'Setting up model behavior with system prompts',
        'Providing examples for consistent output format',
        'Building reusable prompt templates',
        'Optimizing model responses for specific tasks',
      ],
      keyConcepts: [
        { term: 'system', definition: 'Instructions that set model behavior and context' },
        { term: 'few-shot', definition: 'Example inputs/outputs that demonstrate desired behavior' },
        { term: 'messages', definition: 'Structured conversation with user/assistant roles' },
        { term: 'prompt', definition: 'Simple string input for single-turn generation' },
      ],
      codeExample: `const result = await generateText({
  model,
  system: 'You are a helpful assistant.',
  messages: [
    { role: 'user', content: 'Example input' },
    { role: 'assistant', content: 'Example output' },
    { role: 'user', content: 'Actual query' },
  ],
})`,
    },
  },

  // Structured Data
  'structured/generate': {
    title: 'generateObject',
    subtitle: 'Generate type-safe structured data with Zod schema validation',
    category: 'Structured Data',
    docsUrl: 'https://v6.ai-sdk.dev/docs/ai-sdk-core/generating-structured-data',
    infoBar: {
      whatIs: 'generateObject produces structured JSON objects that conform to a Zod schema. The AI generates data that matches your exact type definitions, enabling type-safe AI outputs.',
      whenToUse: [
        'Extracting structured data from text',
        'Generating typed objects (profiles, products, etc.)',
        'Form auto-fill from natural language',
        'When you need guaranteed output structure',
      ],
      keyConcepts: [
        { term: 'schema', definition: 'Zod schema defining the output structure' },
        { term: 'object', definition: 'The generated, validated object' },
        { term: 'mode', definition: 'Generation mode: auto, json, or tool' },
        { term: 'output', definition: 'Can be "object" (default), "array", or "enum"' },
      ],
      codeExample: `const { object } = await generateObject({
  model,
  schema: z.object({
    name: z.string(),
    age: z.number(),
  }),
  prompt: 'Generate a user profile',
})`,
    },
  },

  'structured/stream': {
    title: 'streamObject',
    subtitle: 'Stream structured objects with progressive field population',
    category: 'Structured Data',
    docsUrl: 'https://v6.ai-sdk.dev/docs/ai-sdk-core/generating-structured-data',
    infoBar: {
      whatIs: 'streamObject generates structured data progressively, allowing you to display partial objects as they generate. Fields populate one by one, providing immediate visual feedback.',
      whenToUse: [
        'Long-form structured content (articles, reports)',
        'UI that benefits from progressive updates',
        'When object generation takes noticeable time',
        'Forms that populate field-by-field',
      ],
      keyConcepts: [
        { term: 'partialObjectStream', definition: 'Stream of progressively complete objects' },
        { term: 'partial', definition: 'Object may have undefined fields during streaming' },
        { term: 'onFinish', definition: 'Callback with final complete object' },
        { term: 'deepPartial', definition: 'Nested objects also stream progressively' },
      ],
      codeExample: `const { partialObjectStream } = streamObject({
  model,
  schema: recipeSchema,
  prompt: 'Generate a recipe',
})

for await (const partial of partialObjectStream) {
  console.log(partial) // { title: '...', ingredients: [...] }
}`,
    },
  },

  // Tools
  'tools/basic': {
    title: 'Basic Tools',
    subtitle: 'Enable AI to call functions and interact with external systems',
    category: 'Tool Calling',
    docsUrl: 'https://v6.ai-sdk.dev/docs/ai-sdk-core/tools-and-tool-calling',
    infoBar: {
      whatIs: 'Tools allow AI models to call functions you define. When the model needs external data or actions, it generates tool calls with arguments matching your schema, and you execute the function and return results.',
      whenToUse: [
        'Accessing external APIs (weather, stocks, etc.)',
        'Database queries and data retrieval',
        'Performing calculations or transformations',
        'Any action the AI cannot do directly',
      ],
      keyConcepts: [
        { term: 'inputSchema', definition: 'Zod schema defining tool parameters' },
        { term: 'execute', definition: 'Async function that runs when tool is called' },
        { term: 'description', definition: 'Helps the model understand when to use the tool' },
        { term: 'toolCalls', definition: 'Array of tool invocations in the response' },
      ],
      codeExample: `tools: {
  weather: {
    description: 'Get weather for a city',
    inputSchema: z.object({
      location: z.string(),
    }),
    execute: async ({ location }) => {
      return { temperature: 22, condition: 'sunny' }
    },
  },
}`,
    },
  },

  'tools/agents': {
    title: 'Multi-step Agents',
    subtitle: 'Build autonomous agents with iterative tool execution',
    category: 'Tool Calling',
    docsUrl: 'https://v6.ai-sdk.dev/docs/ai-sdk-core/agents',
    infoBar: {
      whatIs: 'Multi-step agents can execute multiple tool calls in sequence, reasoning about results and deciding next actions. They operate in a loop until reaching a goal or stop condition.',
      whenToUse: [
        'Complex tasks requiring multiple steps',
        'Research and information gathering',
        'Workflows with conditional logic',
        'Autonomous task completion',
      ],
      keyConcepts: [
        { term: 'stopWhen', definition: 'Condition to end the agent loop' },
        { term: 'stepCountIs', definition: 'Stop after N iterations' },
        { term: 'steps', definition: 'Array of all steps taken' },
        { term: 'reasoning', definition: 'Model\'s thought process between tool calls' },
      ],
      codeExample: `const result = await generateText({
  model,
  tools: { search, calculate, fetch },
  stopWhen: stepCountIs(5),
  prompt: 'Research and summarize...',
})

console.log(result.steps) // All iterations`,
    },
  },

  'tools/mcp': {
    title: 'Model Context Protocol',
    subtitle: 'Connect to MCP servers for standardized tool discovery',
    category: 'Tool Calling',
    docsUrl: 'https://v6.ai-sdk.dev/docs/ai-sdk-core/mcp',
    infoBar: {
      whatIs: 'MCP (Model Context Protocol) is a standard for AI tools and context. MCP servers expose tools that AI can discover and use, enabling plug-and-play tool integration.',
      whenToUse: [
        'Connecting to external tool servers',
        'Using pre-built MCP tool packages',
        'Standardized tool discovery',
        'Sharing tools across applications',
      ],
      keyConcepts: [
        { term: 'MCP Server', definition: 'Service that exposes tools via the MCP protocol' },
        { term: 'Tool Discovery', definition: 'AI automatically learns available tools' },
        { term: 'Context', definition: 'Additional information MCP servers can provide' },
        { term: 'Transport', definition: 'How client communicates with MCP server' },
      ],
      codeExample: `import { experimental_createMCPClient } from 'ai'

const client = await experimental_createMCPClient({
  transport: { type: 'stdio', command: 'mcp-server' },
})

const tools = await client.tools()`,
    },
  },

  // Advanced
  'advanced/settings': {
    title: 'Model Settings',
    subtitle: 'Fine-tune model behavior with temperature, tokens, and more',
    category: 'Advanced',
    docsUrl: 'https://v6.ai-sdk.dev/docs/ai-sdk-core/settings',
    infoBar: {
      whatIs: 'Model settings control how the AI generates responses. Adjust temperature for creativity, maxTokens for length, and penalties to reduce repetition.',
      whenToUse: [
        'Tuning response creativity (temperature)',
        'Controlling output length (maxTokens)',
        'Reducing repetitive content (penalties)',
        'Making outputs deterministic (seed)',
      ],
      keyConcepts: [
        { term: 'temperature', definition: 'Randomness: 0 = deterministic, 2 = very random' },
        { term: 'maxTokens', definition: 'Maximum number of tokens to generate' },
        { term: 'topP', definition: 'Nucleus sampling - probability mass threshold' },
        { term: 'seed', definition: 'Fixed seed for reproducible outputs' },
      ],
      codeExample: `const result = await generateText({
  model,
  prompt: '...',
  temperature: 0.7,
  maxTokens: 500,
  topP: 0.9,
  seed: 12345,
})`,
    },
  },

  'advanced/middleware': {
    title: 'Middleware',
    subtitle: 'Enhance models with logging, caching, RAG, and guardrails',
    category: 'Advanced',
    docsUrl: 'https://v6.ai-sdk.dev/docs/ai-sdk-core/middleware',
    infoBar: {
      whatIs: 'Middleware wraps language models to add functionality like logging, caching, or content filtering. Multiple middleware can be chained together.',
      whenToUse: [
        'Adding logging for debugging',
        'Implementing response caching',
        'Adding guardrails and content filtering',
        'Injecting RAG context automatically',
      ],
      keyConcepts: [
        { term: 'wrapLanguageModel', definition: 'Function to wrap a model with middleware' },
        { term: 'transformParams', definition: 'Modify params before model call' },
        { term: 'wrapGenerate', definition: 'Wrap non-streaming generation' },
        { term: 'wrapStream', definition: 'Wrap streaming generation' },
      ],
      codeExample: `const wrappedModel = wrapLanguageModel({
  model,
  middleware: loggingMiddleware,
})`,
    },
  },

  'advanced/providers': {
    title: 'Provider Management',
    subtitle: 'Configure and switch between AI providers seamlessly',
    category: 'Advanced',
    docsUrl: 'https://v6.ai-sdk.dev/docs/ai-sdk-core/providers-and-models',
    infoBar: {
      whatIs: 'AI SDK supports multiple providers (OpenAI, Anthropic, Google, etc.) through a unified interface. Switch providers without changing your application code.',
      whenToUse: [
        'Using multiple AI providers',
        'A/B testing different models',
        'Failover between providers',
        'Cost optimization across providers',
      ],
      keyConcepts: [
        { term: 'provider', definition: 'Service that hosts AI models (OpenAI, Anthropic, etc.)' },
        { term: 'gateway', definition: 'Unified access point (like Vercel AI Gateway)' },
        { term: 'model ID', definition: 'Provider-specific model identifier' },
        { term: 'registry', definition: 'Central place to configure all providers' },
      ],
      codeExample: `import { createGateway } from 'ai'

const gateway = createGateway({
  apiKey: process.env.AI_GATEWAY_API_KEY,
})

// Use any model through the gateway
const model = gateway('anthropic/claude-sonnet-4')`,
    },
  },

  'advanced/errors': {
    title: 'Error Handling',
    subtitle: 'Handle API errors, rate limits, and failures gracefully',
    category: 'Advanced',
    docsUrl: 'https://v6.ai-sdk.dev/docs/ai-sdk-core/error-handling',
    infoBar: {
      whatIs: 'Proper error handling ensures your AI application remains robust. Handle rate limits, API errors, and timeouts gracefully with retries and user feedback.',
      whenToUse: [
        'Production applications',
        'Handling rate limiting gracefully',
        'Implementing retry logic',
        'Providing user feedback on errors',
      ],
      keyConcepts: [
        { term: 'onError', definition: 'Callback for handling errors in hooks' },
        { term: 'error', definition: 'Error object from useChat/useCompletion' },
        { term: 'clearError', definition: 'Reset error state' },
        { term: 'maxRetries', definition: 'Automatic retry count (default: 2)' },
      ],
      codeExample: `const { error, clearError } = useChat({
  transport,
  onError: (err) => {
    console.error('Chat error:', err)
    // Show user notification
  },
})`,
    },
  },

  // Development
  'dev/testing': {
    title: 'Testing',
    subtitle: 'Mock AI responses for reliable, deterministic tests',
    category: 'Development',
    docsUrl: 'https://v6.ai-sdk.dev/docs/ai-sdk-core/testing',
    infoBar: {
      whatIs: 'AI SDK provides mock providers for testing. Create deterministic, fast tests without making actual API calls or spending money.',
      whenToUse: [
        'Unit testing AI-powered features',
        'CI/CD pipelines',
        'Deterministic test scenarios',
        'Testing edge cases and error handling',
      ],
      keyConcepts: [
        { term: 'MockLanguageModelV3', definition: 'Mock model that returns configured responses' },
        { term: 'simulateReadableStream', definition: 'Simulate streaming with delays' },
        { term: 'mockValues', definition: 'Helper for cycling through test values' },
        { term: 'mockId', definition: 'Generate incrementing IDs' },
      ],
      codeExample: `import { MockLanguageModelV3 } from 'ai/test'

const mockModel = new MockLanguageModelV3({
  doGenerate: async () => ({
    text: 'Mocked response',
    finishReason: 'stop',
    usage: { promptTokens: 10, completionTokens: 5 },
  }),
})`,
    },
  },

  'dev/telemetry': {
    title: 'Telemetry',
    subtitle: 'Monitor AI usage with OpenTelemetry integration',
    category: 'Development',
    docsUrl: 'https://v6.ai-sdk.dev/docs/ai-sdk-core/telemetry',
    infoBar: {
      whatIs: 'AI SDK integrates with OpenTelemetry to collect observability data. Track token usage, latency, errors, and custom metadata for monitoring and debugging.',
      whenToUse: [
        'Production monitoring',
        'Cost tracking and optimization',
        'Debugging issues in production',
        'Analytics and usage metrics',
      ],
      keyConcepts: [
        { term: 'experimental_telemetry', definition: 'Option to enable telemetry collection' },
        { term: 'functionId', definition: 'Identifier for specific function calls' },
        { term: 'metadata', definition: 'Custom data attached to spans' },
        { term: 'spans', definition: 'Trace data for each AI operation' },
      ],
      codeExample: `const result = await generateText({
  model,
  prompt: '...',
  experimental_telemetry: {
    isEnabled: true,
    functionId: 'chat-completion',
    metadata: { userId: '123' },
  },
})`,
    },
  },

  'dev/devtools': {
    title: 'DevTools',
    subtitle: 'Debug and inspect AI SDK operations in real-time',
    category: 'Development',
    docsUrl: 'https://v6.ai-sdk.dev/docs/ai-sdk-core/devtools',
    infoBar: {
      whatIs: 'AI SDK DevTools provides a visual interface for debugging AI operations. Inspect requests, responses, tool calls, and streaming in real-time.',
      whenToUse: [
        'Debugging during development',
        'Inspecting tool call flows',
        'Understanding token usage',
        'Visualizing streaming responses',
      ],
      keyConcepts: [
        { term: 'DevTools UI', definition: 'Visual interface for AI debugging' },
        { term: 'Request inspection', definition: 'View prompts and parameters' },
        { term: 'Response inspection', definition: 'View generated content' },
        { term: 'Tool call tracking', definition: 'Trace tool execution' },
      ],
      codeExample: `// Install and run
npm install @ai-sdk/devtools
npx ai-sdk-devtools`,
    },
  },

  // Multimodal
  'multimodal/vision': {
    title: 'Vision',
    subtitle: 'Analyze images with multimodal language models',
    category: 'Multimodal',
    docsUrl: 'https://v6.ai-sdk.dev/docs/ai-sdk-core/multimodal',
    infoBar: {
      whatIs: 'Vision capabilities allow AI models to understand and analyze images. Pass images as URLs or base64-encoded data alongside text prompts.',
      whenToUse: [
        'Image analysis and description',
        'Visual question answering',
        'Document and chart understanding',
        'Accessibility (alt text generation)',
      ],
      keyConcepts: [
        { term: 'image part', definition: 'Message part containing image data' },
        { term: 'URL', definition: 'Image accessible via URL' },
        { term: 'base64', definition: 'Image encoded as base64 string' },
        { term: 'multimodal', definition: 'Models that understand text + images' },
      ],
      codeExample: `const result = await generateText({
  model: gateway('anthropic/claude-sonnet-4'),
  messages: [{
    role: 'user',
    content: [
      { type: 'text', text: 'Describe this image' },
      { type: 'image', image: imageUrl },
    ],
  }],
})`,
    },
  },

  'multimodal/image': {
    title: 'Image Generation',
    subtitle: 'Generate images from text descriptions',
    category: 'Multimodal',
    docsUrl: 'https://v6.ai-sdk.dev/docs/ai-sdk-core/image-generation',
    infoBar: {
      whatIs: 'Image generation creates images from text prompts using models like DALL-E, Stable Diffusion, or Imagen. Returns images as base64 or URLs.',
      whenToUse: [
        'Creating illustrations from descriptions',
        'Generating product images',
        'Creative content generation',
        'Prototyping visual designs',
      ],
      keyConcepts: [
        { term: 'generateImage', definition: 'Function to create images from prompts' },
        { term: 'base64', definition: 'Image data encoded as string' },
        { term: 'size', definition: 'Output dimensions (e.g., 1024x1024)' },
        { term: 'n', definition: 'Number of images to generate' },
      ],
      codeExample: `import { experimental_generateImage } from 'ai'

const { image } = await experimental_generateImage({
  model: openai.image('dall-e-3'),
  prompt: 'A sunset over mountains',
  size: '1024x1024',
})

// image.base64 or image.uint8Array`,
    },
  },

  'multimodal/transcription': {
    title: 'Transcription',
    subtitle: 'Convert speech to text with AI transcription',
    category: 'Multimodal',
    docsUrl: 'https://v6.ai-sdk.dev/docs/ai-sdk-core/transcription',
    infoBar: {
      whatIs: 'Transcription converts audio to text using models like Whisper. Get accurate transcripts with optional timestamps and language detection.',
      whenToUse: [
        'Voice input interfaces',
        'Meeting transcription',
        'Podcast/video captioning',
        'Voice-to-text features',
      ],
      keyConcepts: [
        { term: 'transcribe', definition: 'Function to convert audio to text' },
        { term: 'segments', definition: 'Text with timing information' },
        { term: 'language', definition: 'Detected or specified language' },
        { term: 'audio formats', definition: 'MP3, WAV, M4A, etc.' },
      ],
      codeExample: `import { experimental_transcribe } from 'ai'

const { text, segments } = await experimental_transcribe({
  model: openai.transcription('whisper-1'),
  audio: audioBuffer,
})`,
    },
  },

  'multimodal/speech': {
    title: 'Speech',
    subtitle: 'Convert text to natural-sounding speech',
    category: 'Multimodal',
    docsUrl: 'https://v6.ai-sdk.dev/docs/ai-sdk-core/speech',
    infoBar: {
      whatIs: 'Speech synthesis converts text to audio using AI voices. Generate natural-sounding speech with various voice options and languages.',
      whenToUse: [
        'Voice assistants',
        'Audio content creation',
        'Accessibility features',
        'Text-to-speech interfaces',
      ],
      keyConcepts: [
        { term: 'generateSpeech', definition: 'Function to create audio from text' },
        { term: 'voice', definition: 'Voice identifier for the model' },
        { term: 'audioData', definition: 'Generated audio as Uint8Array' },
        { term: 'language', definition: 'Language for speech synthesis' },
      ],
      codeExample: `import { experimental_generateSpeech } from 'ai'

const { audio } = await experimental_generateSpeech({
  model: openai.speech('tts-1'),
  text: 'Hello, world!',
  voice: 'alloy',
})

// audio.audioData is Uint8Array`,
    },
  },

  // RAG
  'rag/embeddings': {
    title: 'Embeddings',
    subtitle: 'Convert text to vectors for semantic search and similarity',
    category: 'RAG & Search',
    docsUrl: 'https://v6.ai-sdk.dev/docs/ai-sdk-core/embeddings',
    infoBar: {
      whatIs: 'Embeddings convert text into numerical vectors that capture semantic meaning. Similar texts have similar vectors, enabling semantic search and clustering.',
      whenToUse: [
        'Semantic search',
        'Finding similar documents',
        'RAG (Retrieval Augmented Generation)',
        'Text clustering and classification',
      ],
      keyConcepts: [
        { term: 'embed', definition: 'Convert single text to vector' },
        { term: 'embedMany', definition: 'Batch embed multiple texts' },
        { term: 'cosineSimilarity', definition: 'Measure vector similarity' },
        { term: 'vector', definition: 'Array of numbers representing text' },
      ],
      codeExample: `import { embed, cosineSimilarity } from 'ai'

const { embedding } = await embed({
  model: openai.embedding('text-embedding-3-small'),
  value: 'Hello world',
})

const similarity = cosineSimilarity(embedding1, embedding2)`,
    },
  },

  'rag/reranking': {
    title: 'Reranking',
    subtitle: 'Improve search results with AI-powered relevance scoring',
    category: 'RAG & Search',
    docsUrl: 'https://v6.ai-sdk.dev/docs/ai-sdk-core/reranking',
    infoBar: {
      whatIs: 'Reranking improves search results by scoring document relevance with AI. After initial retrieval, rerank to surface the most relevant documents.',
      whenToUse: [
        'Improving RAG retrieval quality',
        'Two-stage search pipelines',
        'When embedding similarity isn\'t enough',
        'High-precision search applications',
      ],
      keyConcepts: [
        { term: 'rerank', definition: 'Score documents by relevance to query' },
        { term: 'score', definition: 'Relevance score for each document' },
        { term: 'topN', definition: 'Number of top results to return' },
        { term: 'two-stage', definition: 'Retrieve broadly, then rerank precisely' },
      ],
      codeExample: `import { experimental_rerank } from 'ai'

const { results } = await experimental_rerank({
  model: cohere.reranker('rerank-v3'),
  query: 'What is AI?',
  documents: ['Doc 1...', 'Doc 2...'],
  topN: 5,
})`,
    },
  },
}

export function getPageContent(path: string): PageContent | undefined {
  return pageContent[path]
}
