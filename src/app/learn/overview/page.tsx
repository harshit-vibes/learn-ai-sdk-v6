import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import {
  MessageSquare,
  FileText,
  Package,
  Wrench,
  Image,
  Hash,
  Settings,
  TestTube,
  ExternalLink,
  Sparkles,
} from 'lucide-react'

const sections = [
  {
    title: 'AI SDK UI',
    description: 'React hooks for building chat interfaces',
    icon: MessageSquare,
    href: '/learn/ui/chat',
    color: 'bg-blue-500',
  },
  {
    title: 'Text Generation',
    description: 'Generate and stream text with LLMs',
    icon: FileText,
    href: '/learn/text/generate',
    color: 'bg-green-500',
  },
  {
    title: 'Structured Data',
    description: 'Generate typed objects with schemas',
    icon: Package,
    href: '/learn/structured/generate',
    color: 'bg-purple-500',
  },
  {
    title: 'Tool Calling',
    description: 'Enable AI to use external tools',
    icon: Wrench,
    href: '/learn/tools/basic',
    color: 'bg-orange-500',
  },
  {
    title: 'Multimodal',
    description: 'Vision, image gen, speech & transcription',
    icon: Image,
    href: '/learn/multimodal/vision',
    color: 'bg-pink-500',
  },
  {
    title: 'RAG & Search',
    description: 'Embeddings and semantic search',
    icon: Hash,
    href: '/learn/rag/embeddings',
    color: 'bg-cyan-500',
  },
  {
    title: 'Advanced',
    description: 'Settings, middleware & providers',
    icon: Settings,
    href: '/learn/advanced/settings',
    color: 'bg-slate-500',
  },
  {
    title: 'Development',
    description: 'Testing, telemetry & devtools',
    icon: TestTube,
    href: '/learn/dev/testing',
    color: 'bg-amber-500',
  },
]

export default function OverviewPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-8">
        <div className="flex justify-center">
          <div className="p-4 rounded-2xl bg-primary/10">
            <Sparkles className="h-12 w-12 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold">AI SDK v6 Learning Hub</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          An interactive guide to building AI-powered applications with Vercel AI SDK.
          Explore features, run demos, and learn by doing.
        </p>
        <div className="flex justify-center gap-2">
          <Badge variant="secondary">ai@6.0.0-beta</Badge>
          <Badge variant="secondary">@ai-sdk/react@3.0.0-beta</Badge>
        </div>
      </div>

      {/* Quick Links */}
      <div className="flex justify-center gap-4 text-sm">
        <a
          href="https://v6.ai-sdk.dev/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
        >
          Official Docs <ExternalLink className="h-3 w-3" />
        </a>
        <a
          href="https://github.com/vercel/ai"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
        >
          GitHub <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* Section Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {sections.map((section) => (
          <Link key={section.title} href={section.href}>
            <Card className="p-4 h-full hover:border-primary/50 transition-colors cursor-pointer">
              <div className="space-y-3">
                <div className={`w-10 h-10 rounded-lg ${section.color} flex items-center justify-center`}>
                  <section.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">{section.title}</h3>
                  <p className="text-sm text-muted-foreground">{section.description}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Architecture Overview */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">SDK Architecture</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="font-medium flex items-center gap-2">
              <Badge>AI SDK Core</Badge>
              Server-side
            </h3>
            <p className="text-sm text-muted-foreground">
              Core functions for interacting with LLMs. Use <code className="text-primary">generateText</code>,{' '}
              <code className="text-primary">streamText</code>, <code className="text-primary">generateObject</code>,
              and more in your API routes and server actions.
            </p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Text & object generation</li>
              <li>• Tool calling & agents</li>
              <li>• Embeddings & RAG</li>
              <li>• Multimodal (vision, speech)</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="font-medium flex items-center gap-2">
              <Badge>AI SDK UI</Badge>
              Client-side
            </h3>
            <p className="text-sm text-muted-foreground">
              React hooks for building interactive AI interfaces. Handle streaming,
              state management, and UI updates automatically with{' '}
              <code className="text-primary">useChat</code>, <code className="text-primary">useCompletion</code>,
              and <code className="text-primary">useObject</code>.
            </p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Real-time streaming</li>
              <li>• Message state management</li>
              <li>• Error handling</li>
              <li>• Framework agnostic</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Provider Info */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">This Learning Hub Uses</h2>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
            <span className="font-medium">Provider:</span>
            <span className="text-muted-foreground">Vercel AI Gateway</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
            <span className="font-medium">Model:</span>
            <span className="text-muted-foreground">anthropic/claude-sonnet-4</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
            <span className="font-medium">Framework:</span>
            <span className="text-muted-foreground">Next.js 16 + React 19</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
