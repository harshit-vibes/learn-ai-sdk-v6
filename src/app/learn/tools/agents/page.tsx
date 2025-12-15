'use client'

import { LearningPage } from '@/components/educational'
import { getPageContent } from '@/lib/education-content'
import { ChatDemo } from '@/components/demos'

const content = getPageContent('tools/agents')!

const codeExamples = [
  {
    title: 'Multi-step Agent',
    language: 'typescript',
    code: `import { streamText, stepCountIs } from 'ai'

const result = streamText({
  model: gateway('anthropic/claude-sonnet-4'),
  system: \`You are a research assistant.
Use the available tools to gather information
and complete the user's request.\`,
  messages,
  tools: {
    search: { /* ... */ },
    fetch: { /* ... */ },
    calculate: { /* ... */ },
  },
  // Stop after 5 tool call rounds
  stopWhen: stepCountIs(5),
  onStepFinish: ({ text, toolCalls, toolResults }) => {
    console.log('Step completed:', { text, toolCalls })
  },
})

// Access all steps after completion
const { steps } = await result
console.log('Total steps:', steps.length)`,
  },
  {
    title: 'Custom Stop Condition',
    language: 'typescript',
    code: `import { streamText } from 'ai'

const result = streamText({
  model,
  messages,
  tools,
  // Custom stop condition
  stopWhen: ({ steps }) => {
    // Stop if we've found the answer
    const lastStep = steps[steps.length - 1]
    return lastStep?.text?.includes('FINAL ANSWER')
  },
})`,
  },
  {
    title: 'Accessing Steps',
    language: 'typescript',
    code: `// Each step contains:
interface Step {
  text: string           // Model's response text
  toolCalls: ToolCall[]  // Tools the model called
  toolResults: Result[]  // Results from tool execution
  finishReason: string   // Why this step ended
  usage: TokenUsage      // Tokens used
}

// Iterate through steps
for (const step of result.steps) {
  console.log('Model said:', step.text)
  console.log('Tools called:', step.toolCalls.map(t => t.name))
}`,
  },
]

export default function AgentsPage() {
  return (
    <LearningPage
      content={content}
      demo={
        <ChatDemo
          api="/api/tools"
          renderToolInvocation
          emptyText="Ask a complex question that requires multiple steps, like: 'What's 15% tip on a $45 meal in Paris weather?'"
        />
      }
      codeExamples={codeExamples}
    />
  )
}
