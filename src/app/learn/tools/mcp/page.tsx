'use client'

import { LearningPage } from '@/components/educational'
import { getPageContent } from '@/lib/education-content'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, Server, Plug, Wrench, Database } from 'lucide-react'

const content = getPageContent('tools/mcp')!

const codeExamples = [
  {
    title: 'MCP Client Setup',
    language: 'typescript',
    code: `import { experimental_createMCPClient } from 'ai'

// Create MCP client with stdio transport
const client = await experimental_createMCPClient({
  transport: {
    type: 'stdio',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-filesystem'],
  },
})

// Discover available tools
const tools = await client.tools()
console.log('Available tools:', tools)

// Use tools with AI SDK
const result = await generateText({
  model,
  tools,
  prompt: 'List files in the current directory',
})`,
  },
  {
    title: 'SSE Transport',
    language: 'typescript',
    code: `// Connect to remote MCP server via SSE
const client = await experimental_createMCPClient({
  transport: {
    type: 'sse',
    url: 'http://localhost:3001/mcp',
  },
})

// Tools are automatically discovered
const tools = await client.tools()`,
  },
  {
    title: 'Custom MCP Server',
    language: 'typescript',
    code: `// Creating an MCP server (separate package)
import { Server } from '@modelcontextprotocol/server'

const server = new Server({
  name: 'my-tools',
  version: '1.0.0',
})

// Register tools
server.setRequestHandler('tools/list', async () => ({
  tools: [
    {
      name: 'search',
      description: 'Search the database',
      inputSchema: { /* ... */ },
    },
  ],
}))

server.setRequestHandler('tools/call', async (request) => {
  // Handle tool execution
})`,
  },
]

function MCPDemo() {
  const mcpServers = [
    { name: 'Filesystem', desc: 'Read/write files', icon: Database },
    { name: 'GitHub', desc: 'Repository operations', icon: Server },
    { name: 'Postgres', desc: 'Database queries', icon: Database },
    { name: 'Puppeteer', desc: 'Web automation', icon: Wrench },
  ]

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-blue-500/10 border-blue-500/20">
        <div className="flex items-start gap-3">
          <Plug className="h-5 w-5 text-blue-500 mt-0.5" />
          <div>
            <h3 className="font-medium">Model Context Protocol</h3>
            <p className="text-sm text-muted-foreground mt-1">
              MCP is an open standard for connecting AI models to external tools and data sources.
              Instead of defining tools in your code, MCP servers expose tools that can be discovered
              and used automatically.
            </p>
          </div>
        </div>
      </Card>

      <div>
        <h3 className="font-medium mb-3">Popular MCP Servers</h3>
        <div className="grid grid-cols-2 gap-3">
          {mcpServers.map((server) => (
            <Card key={server.name} className="p-3">
              <div className="flex items-center gap-2">
                <server.icon className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-sm">{server.name}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{server.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">MCP vs Built-in Tools</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-4">
            <Badge className="mb-2">Built-in Tools</Badge>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Defined in your codebase</li>
              <li>• Full control over implementation</li>
              <li>• No external dependencies</li>
              <li>• Best for app-specific tools</li>
            </ul>
          </Card>
          <Card className="p-4">
            <Badge variant="secondary" className="mb-2">MCP Tools</Badge>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Discovered from external servers</li>
              <li>• Reusable across applications</li>
              <li>• Community ecosystem</li>
              <li>• Best for common integrations</li>
            </ul>
          </Card>
        </div>
      </div>

      <a
        href="https://modelcontextprotocol.io"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
      >
        Learn more at modelcontextprotocol.io <ExternalLink className="h-3 w-3" />
      </a>
    </div>
  )
}

export default function MCPPage() {
  return <LearningPage content={content} demo={<MCPDemo />} codeExamples={codeExamples} />
}
