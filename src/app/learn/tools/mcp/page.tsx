'use client'

import { useState } from 'react'
import { LearningPage } from '@/components/educational'
import { getPageContent } from '@/lib/education-content'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, Server, Plug, Wrench, Database, Search, Loader2, CheckCircle, XCircle, FileText, GitBranch, Globe } from 'lucide-react'

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

interface MCPServer {
  id: string
  name: string
  icon: typeof Server
  description: string
  tools: { name: string; description: string; params: string[] }[]
}

const mcpServers: MCPServer[] = [
  {
    id: 'filesystem',
    name: '@modelcontextprotocol/server-filesystem',
    icon: FileText,
    description: 'File system operations',
    tools: [
      { name: 'read_file', description: 'Read contents of a file', params: ['path'] },
      { name: 'write_file', description: 'Write content to a file', params: ['path', 'content'] },
      { name: 'list_directory', description: 'List files in a directory', params: ['path'] },
      { name: 'search_files', description: 'Search for files by pattern', params: ['pattern', 'path'] },
    ],
  },
  {
    id: 'github',
    name: '@modelcontextprotocol/server-github',
    icon: GitBranch,
    description: 'GitHub repository operations',
    tools: [
      { name: 'create_issue', description: 'Create a new GitHub issue', params: ['repo', 'title', 'body'] },
      { name: 'list_prs', description: 'List pull requests', params: ['repo', 'state'] },
      { name: 'get_file_contents', description: 'Get file from repository', params: ['repo', 'path'] },
    ],
  },
  {
    id: 'postgres',
    name: '@modelcontextprotocol/server-postgres',
    icon: Database,
    description: 'PostgreSQL database queries',
    tools: [
      { name: 'query', description: 'Execute SQL query', params: ['sql'] },
      { name: 'list_tables', description: 'List database tables', params: [] },
      { name: 'describe_table', description: 'Get table schema', params: ['table'] },
    ],
  },
  {
    id: 'puppeteer',
    name: '@modelcontextprotocol/server-puppeteer',
    icon: Globe,
    description: 'Browser automation',
    tools: [
      { name: 'navigate', description: 'Navigate to URL', params: ['url'] },
      { name: 'screenshot', description: 'Take page screenshot', params: ['selector?'] },
      { name: 'click', description: 'Click an element', params: ['selector'] },
      { name: 'type', description: 'Type into input', params: ['selector', 'text'] },
    ],
  },
]

function MCPDemo() {
  const [selectedServer, setSelectedServer] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle')
  const [discoveredTools, setDiscoveredTools] = useState<MCPServer['tools']>([])

  const connectToServer = async (serverId: string) => {
    setSelectedServer(serverId)
    setConnectionStatus('connecting')
    setDiscoveredTools([])

    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 800))

    const server = mcpServers.find(s => s.id === serverId)
    if (server) {
      // Simulate discovering tools
      await new Promise(resolve => setTimeout(resolve, 600))
      setDiscoveredTools(server.tools)
      setConnectionStatus('connected')
    } else {
      setConnectionStatus('error')
    }
  }

  const disconnect = () => {
    setSelectedServer(null)
    setConnectionStatus('idle')
    setDiscoveredTools([])
  }

  const selectedServerData = mcpServers.find(s => s.id === selectedServer)

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-blue-500/10 border-blue-500/20">
        <div className="flex items-start gap-3">
          <Plug className="h-5 w-5 text-blue-500 mt-0.5" />
          <div>
            <h3 className="font-medium">MCP Tool Discovery Simulator</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Select an MCP server to simulate connecting and discovering available tools.
              This demonstrates how MCP enables dynamic tool discovery.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Server Selection */}
        <div className="space-y-3">
          <h3 className="font-medium">MCP Servers</h3>
          <div className="space-y-2">
            {mcpServers.map((server) => {
              const Icon = server.icon
              const isSelected = selectedServer === server.id
              return (
                <Card
                  key={server.id}
                  className={`p-3 cursor-pointer transition-all ${
                    isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => !isSelected && connectToServer(server.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded ${isSelected ? 'bg-primary/20' : 'bg-muted'}`}>
                        <Icon className={`h-4 w-4 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                      <div>
                        <code className="text-xs font-medium">{server.name}</code>
                        <p className="text-xs text-muted-foreground">{server.description}</p>
                      </div>
                    </div>
                    {isSelected && connectionStatus === 'connected' && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                    {isSelected && connectionStatus === 'connecting' && (
                      <Loader2 className="h-4 w-4 text-primary animate-spin" />
                    )}
                  </div>
                </Card>
              )
            })}
          </div>
          {selectedServer && (
            <Button variant="outline" size="sm" onClick={disconnect} className="w-full">
              <XCircle className="h-3 w-3 mr-1" />
              Disconnect
            </Button>
          )}
        </div>

        {/* Discovered Tools */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Discovered Tools</h3>
            {connectionStatus === 'connected' && (
              <Badge variant="secondary" className="text-xs">
                {discoveredTools.length} tools
              </Badge>
            )}
          </div>
          <Card className="p-4 min-h-[300px]">
            {connectionStatus === 'idle' && (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <Search className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Select an MCP server to discover tools
                </p>
              </div>
            )}
            {connectionStatus === 'connecting' && (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
                <p className="text-sm text-muted-foreground">
                  Connecting to {selectedServerData?.name}...
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Discovering available tools
                </p>
              </div>
            )}
            {connectionStatus === 'connected' && (
              <div className="space-y-3">
                {discoveredTools.map((tool) => (
                  <div key={tool.name} className="p-3 rounded bg-muted/50">
                    <div className="flex items-center gap-2 mb-1">
                      <Wrench className="h-3 w-3 text-primary" />
                      <code className="text-sm font-medium text-primary">{tool.name}</code>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{tool.description}</p>
                    {tool.params.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {tool.params.map(param => (
                          <Badge key={param} variant="outline" className="text-xs">
                            {param}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {connectionStatus === 'error' && (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <XCircle className="h-8 w-8 text-red-500 mb-2" />
                <p className="text-sm text-red-500">Connection failed</p>
              </div>
            )}
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
