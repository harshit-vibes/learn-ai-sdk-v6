'use client'

import { LearningPage } from '@/components/educational'
import { getPageContent } from '@/lib/education-content'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Terminal, ExternalLink, Eye, Zap, Bug, BarChart3 } from 'lucide-react'

const content = getPageContent('dev/devtools')!

const codeExamples = [
  {
    title: 'Installation',
    language: 'bash',
    code: `# Install the devtools package
npm install @ai-sdk/devtools

# Run the devtools server
npx ai-sdk-devtools`,
  },
  {
    title: 'Configuration',
    language: 'typescript',
    code: `// next.config.js or app config
import { withDevtools } from '@ai-sdk/devtools'

export default withDevtools({
  // Your existing config
})

// DevTools will be available at http://localhost:4000`,
  },
  {
    title: 'With Custom Port',
    language: 'bash',
    code: `# Run on a custom port
npx ai-sdk-devtools --port 5000

# Or via environment variable
AI_SDK_DEVTOOLS_PORT=5000 npx ai-sdk-devtools`,
  },
]

function DevToolsDemo() {
  const features = [
    { icon: Eye, name: 'Request Inspector', desc: 'View prompts, messages, and parameters' },
    { icon: Zap, name: 'Response Viewer', desc: 'See generated content and tool calls' },
    { icon: BarChart3, name: 'Token Usage', desc: 'Track prompt and completion tokens' },
    { icon: Bug, name: 'Error Debugging', desc: 'Inspect errors and stack traces' },
  ]

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-blue-500/10 border-blue-500/20">
        <div className="flex items-start gap-3">
          <Terminal className="h-5 w-5 text-blue-500 mt-0.5" />
          <div>
            <h3 className="font-medium">AI SDK DevTools</h3>
            <p className="text-sm text-muted-foreground mt-1">
              A visual debugging interface for AI SDK operations. Inspect requests,
              responses, tool calls, and streaming in real-time during development.
            </p>
          </div>
        </div>
      </Card>

      <div>
        <h3 className="font-medium mb-3">Features</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {features.map((feature) => (
            <Card key={feature.name} className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <feature.icon className="h-4 w-4 text-primary" />
                <span className="font-medium">{feature.name}</span>
              </div>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Quick Start</h3>
        <div className="space-y-3">
          <Card className="p-4">
            <Badge className="mb-2">Step 1</Badge>
            <p className="text-sm">Install the devtools package</p>
            <code className="text-xs text-muted-foreground mt-1 block">
              npm install @ai-sdk/devtools
            </code>
          </Card>
          <Card className="p-4">
            <Badge className="mb-2">Step 2</Badge>
            <p className="text-sm">Run the devtools server</p>
            <code className="text-xs text-muted-foreground mt-1 block">
              npx ai-sdk-devtools
            </code>
          </Card>
          <Card className="p-4">
            <Badge className="mb-2">Step 3</Badge>
            <p className="text-sm">Open the DevTools UI</p>
            <code className="text-xs text-muted-foreground mt-1 block">
              http://localhost:4000
            </code>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">When to Use</h3>
        <div className="space-y-2">
          {[
            'Debugging prompt engineering',
            'Inspecting tool call flows',
            'Optimizing token usage',
            'Understanding streaming behavior',
            'Troubleshooting errors',
          ].map((use, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              {use}
            </div>
          ))}
        </div>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Learn More</h4>
            <p className="text-sm text-muted-foreground">
              Visit the official documentation for detailed setup instructions.
            </p>
          </div>
          <Button variant="outline" asChild>
            <a
              href="https://v6.ai-sdk.dev/docs/ai-sdk-core/devtools"
              target="_blank"
              rel="noopener noreferrer"
            >
              Docs <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default function DevToolsPage() {
  return <LearningPage content={content} demo={<DevToolsDemo />} codeExamples={codeExamples} />
}
