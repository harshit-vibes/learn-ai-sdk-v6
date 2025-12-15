'use client'

import { LearningPage } from '@/components/educational'
import { getPageContent } from '@/lib/education-content'
import { ChatDemo } from '@/components/demos'

const content = getPageContent('tools/basic')!

const codeExamples = [
  {
    title: 'Tool Definition',
    language: 'typescript',
    code: `import { streamText } from 'ai'
import { z } from 'zod'

const weatherParams = z.object({
  location: z.string().describe('City name'),
})

const result = streamText({
  model: gateway('anthropic/claude-sonnet-4'),
  messages,
  tools: {
    weather: {
      description: 'Get current weather for any city',
      inputSchema: weatherParams,
      execute: async ({ location }) => {
        // Call weather API or return mock data
        return {
          location,
          temperature: 22,
          condition: 'sunny',
        }
      },
    },
    calculator: {
      description: 'Calculate math expressions',
      inputSchema: z.object({
        expression: z.string(),
      }),
      execute: async ({ expression }) => {
        const result = eval(expression)
        return { expression, result }
      },
    },
  },
})`,
  },
  {
    title: 'Client Rendering',
    language: 'tsx',
    code: `// v6 tool parts have type 'tool-{toolName}'
{message.parts.map((part, i) => {
  if (part.type === 'text') {
    return <span key={i}>{part.text}</span>
  }

  if (part.type === 'tool-weather') {
    if (part.state === 'output-available') {
      return <WeatherCard data={part.output} />
    }
    return <div>Loading weather...</div>
  }
})}`,
  },
]

export default function BasicToolsPage() {
  return (
    <LearningPage
      content={content}
      demo={
        <ChatDemo
          api="/api/tools"
          renderToolInvocation
          emptyText="Try: 'What's the weather in Paris?' or 'Calculate 15% of 120'"
        />
      }
      codeExamples={codeExamples}
    />
  )
}
