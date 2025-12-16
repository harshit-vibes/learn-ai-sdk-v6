'use client'

import { useState } from 'react'
import { LearningPage } from '@/components/educational'
import { getPageContent } from '@/lib/education-content'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ExternalLink, Plug, Wrench, Database, Search, Loader2, CheckCircle, XCircle, FileText, GitBranch, Globe, Play, Terminal, Info } from 'lucide-react'

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

interface MCPServerInfo {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  description: string
}

interface DiscoveredTool {
  name: string
  description: string
  inputSchema: {
    type: string
    properties: Record<string, { type: string; description?: string }>
    required?: string[]
  }
}

interface SetupGuide {
  step1: string
  step2: string
  step3: string
}

interface ExecutionResult {
  success: boolean
  toolName: string
  args: Record<string, unknown>
  result: Record<string, unknown>
  executionTime: number
}

const mcpServers: MCPServerInfo[] = [
  {
    id: 'filesystem',
    name: '@modelcontextprotocol/server-filesystem',
    icon: FileText,
    description: 'File system operations',
  },
  {
    id: 'github',
    name: '@modelcontextprotocol/server-github',
    icon: GitBranch,
    description: 'GitHub repository operations',
  },
  {
    id: 'postgres',
    name: '@modelcontextprotocol/server-postgres',
    icon: Database,
    description: 'PostgreSQL database queries',
  },
  {
    id: 'puppeteer',
    name: '@modelcontextprotocol/server-puppeteer',
    icon: Globe,
    description: 'Browser automation',
  },
]

function MCPDemo() {
  const [selectedServer, setSelectedServer] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle')
  const [discoveredTools, setDiscoveredTools] = useState<DiscoveredTool[]>([])
  const [setupGuide, setSetupGuide] = useState<SetupGuide | null>(null)
  const [selectedTool, setSelectedTool] = useState<DiscoveredTool | null>(null)
  const [toolArgs, setToolArgs] = useState<Record<string, string>>({})
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null)

  const connectToServer = async (serverId: string) => {
    setSelectedServer(serverId)
    setConnectionStatus('connecting')
    setDiscoveredTools([])
    setSetupGuide(null)
    setSelectedTool(null)
    setExecutionResult(null)

    try {
      // Connect to server
      const connectResponse = await fetch('/api/learn/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'connect', serverId }),
      })
      const connectData = await connectResponse.json()

      if (!connectData.success) {
        setConnectionStatus('error')
        return
      }

      setSetupGuide(connectData.setupGuide)

      // Discover tools
      const discoverResponse = await fetch('/api/learn/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'discover', serverId }),
      })
      const discoverData = await discoverResponse.json()

      if (discoverData.success) {
        setDiscoveredTools(discoverData.tools)
        setConnectionStatus('connected')
      } else {
        setConnectionStatus('error')
      }
    } catch {
      setConnectionStatus('error')
    }
  }

  const disconnect = () => {
    setSelectedServer(null)
    setConnectionStatus('idle')
    setDiscoveredTools([])
    setSetupGuide(null)
    setSelectedTool(null)
    setToolArgs({})
    setExecutionResult(null)
  }

  const selectTool = (tool: DiscoveredTool) => {
    setSelectedTool(tool)
    setToolArgs({})
    setExecutionResult(null)
  }

  const executeTool = async () => {
    if (!selectedTool || !selectedServer) return

    setIsExecuting(true)
    setExecutionResult(null)

    try {
      const response = await fetch('/api/learn/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'execute',
          serverId: selectedServer,
          toolName: selectedTool.name,
          toolArgs,
        }),
      })
      const data = await response.json()

      if (data.success) {
        setExecutionResult(data)
      }
    } catch (error) {
      console.error('Execution error:', error)
    } finally {
      setIsExecuting(false)
    }
  }

  const selectedServerData = mcpServers.find(s => s.id === selectedServer)

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-blue-500/10 border-blue-500/20">
        <div className="flex items-start gap-3">
          <Plug className="h-5 w-5 text-blue-500 mt-0.5" />
          <div>
            <h3 className="font-medium">MCP Interactive Demo</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Connect to MCP servers, discover tools, and execute them. This simulates
              the MCP protocol to demonstrate how dynamic tool discovery works.
            </p>
          </div>
        </div>
      </Card>

      {/* Step 1: Connect to Server */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline">Step 1</Badge>
          <h3 className="font-medium">Connect to an MCP Server</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {mcpServers.map((server) => {
            const Icon = server.icon
            const isSelected = selectedServer === server.id
            const isConnected = isSelected && connectionStatus === 'connected'
            return (
              <Card
                key={server.id}
                className={`p-3 cursor-pointer transition-all ${
                  isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'
                }`}
                onClick={() => !isSelected && connectToServer(server.id)}
              >
                <div className="flex flex-col items-center text-center gap-2">
                  <div className={`p-2 rounded-full ${isSelected ? 'bg-primary/20' : 'bg-muted'}`}>
                    {connectionStatus === 'connecting' && isSelected ? (
                      <Loader2 className="h-5 w-5 text-primary animate-spin" />
                    ) : isConnected ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Icon className={`h-5 w-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-medium truncate max-w-full">{server.name.split('/')[1]}</p>
                    <p className="text-xs text-muted-foreground">{server.description}</p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
        {selectedServer && (
          <Button variant="outline" size="sm" onClick={disconnect}>
            <XCircle className="h-3 w-3 mr-1" />
            Disconnect
          </Button>
        )}
      </div>

      {/* Setup Guide */}
      {setupGuide && (
        <Card className="p-4 bg-amber-500/10 border-amber-500/20">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-amber-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-sm mb-2">Real Setup Instructions</h4>
              <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                <li>{setupGuide.step1}</li>
                <li>{setupGuide.step2}</li>
                <li>{setupGuide.step3}</li>
              </ol>
            </div>
          </div>
        </Card>
      )}

      {/* Step 2: Discovered Tools */}
      {connectionStatus === 'connected' && discoveredTools.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline">Step 2</Badge>
            <h3 className="font-medium">Discovered Tools</h3>
            <Badge variant="secondary" className="text-xs">{discoveredTools.length} tools</Badge>
          </div>
          <div className="grid md:grid-cols-2 gap-2">
            {discoveredTools.map((tool) => (
              <Card
                key={tool.name}
                className={`p-3 cursor-pointer transition-all ${
                  selectedTool?.name === tool.name ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'
                }`}
                onClick={() => selectTool(tool)}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Wrench className="h-3 w-3 text-primary" />
                  <code className="text-sm font-medium text-primary">{tool.name}</code>
                </div>
                <p className="text-xs text-muted-foreground">{tool.description}</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Execute Tool */}
      {selectedTool && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline">Step 3</Badge>
            <h3 className="font-medium">Execute: {selectedTool.name}</h3>
          </div>
          <Card className="p-4">
            <div className="space-y-4">
              {/* Tool parameters */}
              <div className="space-y-3">
                {Object.entries(selectedTool.inputSchema.properties || {}).map(([key, prop]) => (
                  <div key={key}>
                    <label className="text-sm font-medium flex items-center gap-2">
                      {key}
                      {selectedTool.inputSchema.required?.includes(key) && (
                        <Badge variant="destructive" className="text-xs">required</Badge>
                      )}
                    </label>
                    <Input
                      placeholder={prop.description || key}
                      value={toolArgs[key] || ''}
                      onChange={(e) => setToolArgs({ ...toolArgs, [key]: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                ))}
              </div>

              <Button onClick={executeTool} disabled={isExecuting} className="w-full">
                {isExecuting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Executing...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Execute Tool
                  </>
                )}
              </Button>

              {/* Execution Result */}
              {executionResult && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Result</span>
                    <Badge variant="secondary" className="text-xs">
                      {executionResult.executionTime}ms
                    </Badge>
                  </div>
                  <Card className="p-3 bg-zinc-950">
                    <pre className="text-xs text-green-400 overflow-auto max-h-40">
                      {JSON.stringify(executionResult.result, null, 2)}
                    </pre>
                  </Card>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Code Example */}
      {selectedServer && connectionStatus === 'connected' && (
        <Card className="p-4 bg-zinc-950">
          <div className="flex items-center gap-2 mb-3">
            <Terminal className="h-4 w-4 text-zinc-400" />
            <span className="text-sm font-medium text-zinc-300">Generated Code</span>
          </div>
          <pre className="text-xs text-zinc-300 overflow-auto">
{`import { experimental_createMCPClient } from 'ai'

const client = await experimental_createMCPClient({
  transport: {
    type: 'stdio',
    command: 'npx',
    args: ['-y', '${selectedServerData?.name}'],
  },
})

const tools = await client.tools()
// Discovered ${discoveredTools.length} tools: ${discoveredTools.map(t => t.name).join(', ')}
${selectedTool ? `
// Execute ${selectedTool.name}
const result = await generateText({
  model,
  tools,
  prompt: 'Use ${selectedTool.name} to...',
})` : ''}`}
          </pre>
        </Card>
      )}

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
