'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
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
  ChevronRight,
  Sparkles,
  Zap,
  BookOpen,
} from 'lucide-react'

const curriculum = [
  {
    section: 'AI SDK UI',
    description: 'React hooks for chat interfaces',
    icon: MessageSquare,
    gradient: 'from-blue-500 to-blue-600',
    pages: [
      { num: 1, title: 'useChat', href: '/learn/ui/chat' },
      { num: 2, title: 'useCompletion', href: '/learn/ui/completion' },
      { num: 3, title: 'useObject', href: '/learn/ui/object' },
      { num: 4, title: 'Stream Utilities', href: '/learn/ui/streams' },
    ],
  },
  {
    section: 'Text Generation',
    description: 'Generate and stream text',
    icon: FileText,
    gradient: 'from-emerald-500 to-emerald-600',
    pages: [
      { num: 5, title: 'generateText', href: '/learn/text/generate' },
      { num: 6, title: 'streamText', href: '/learn/text/stream' },
      { num: 7, title: 'Prompt Engineering', href: '/learn/text/prompts' },
    ],
  },
  {
    section: 'Structured Data',
    description: 'Type-safe object generation',
    icon: Package,
    gradient: 'from-violet-500 to-violet-600',
    pages: [
      { num: 8, title: 'generateObject', href: '/learn/structured/generate' },
      { num: 9, title: 'streamObject', href: '/learn/structured/stream' },
    ],
  },
  {
    section: 'Tool Calling',
    description: 'AI-powered tool execution',
    icon: Wrench,
    gradient: 'from-orange-500 to-orange-600',
    pages: [
      { num: 10, title: 'Basic Tools', href: '/learn/tools/basic' },
      { num: 11, title: 'Multi-step Agents', href: '/learn/tools/agents' },
      { num: 12, title: 'MCP Integration', href: '/learn/tools/mcp' },
    ],
  },
  {
    section: 'Multimodal',
    description: 'Vision, audio & images',
    icon: Image,
    gradient: 'from-pink-500 to-pink-600',
    pages: [
      { num: 13, title: 'Vision', href: '/learn/multimodal/vision' },
      { num: 14, title: 'Image Generation', href: '/learn/multimodal/image' },
      { num: 15, title: 'Transcription', href: '/learn/multimodal/transcription' },
      { num: 16, title: 'Speech', href: '/learn/multimodal/speech' },
    ],
  },
  {
    section: 'RAG & Search',
    description: 'Embeddings & semantic search',
    icon: Hash,
    gradient: 'from-cyan-500 to-cyan-600',
    pages: [
      { num: 17, title: 'Embeddings', href: '/learn/rag/embeddings' },
      { num: 18, title: 'Reranking', href: '/learn/rag/reranking' },
    ],
  },
  {
    section: 'Advanced',
    description: 'Settings & middleware',
    icon: Settings,
    gradient: 'from-slate-500 to-slate-600',
    pages: [
      { num: 19, title: 'Model Settings', href: '/learn/advanced/settings' },
      { num: 20, title: 'Middleware', href: '/learn/advanced/middleware' },
      { num: 21, title: 'Providers', href: '/learn/advanced/providers' },
      { num: 22, title: 'Error Handling', href: '/learn/advanced/errors' },
    ],
  },
  {
    section: 'Development',
    description: 'Testing & debugging',
    icon: TestTube,
    gradient: 'from-amber-500 to-amber-600',
    pages: [
      { num: 23, title: 'Testing', href: '/learn/dev/testing' },
      { num: 24, title: 'Telemetry', href: '/learn/dev/telemetry' },
      { num: 25, title: 'DevTools', href: '/learn/dev/devtools' },
    ],
  },
]

export default function OverviewPage() {
  return (
    <>
      {/* Header */}
      <header className="flex h-14 shrink-0 items-center gap-3 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-6" />
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-semibold">AI SDK v6</span>
            <Badge variant="secondary">Learning Hub</Badge>
          </div>
          <a
            href="https://v6.ai-sdk.dev/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
          >
            Docs <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Hero */}
        <div className="bg-gradient-to-b from-primary/5 to-transparent px-6 py-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Zap className="h-4 w-4" />
              25 Interactive Lessons
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Master the Vercel AI SDK
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              Learn streaming, tool calling, structured generation, and more through
              hands-on demos and real code examples.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button asChild size="lg">
                <Link href="/learn/ui/chat">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Start Learning
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="https://github.com/vercel/ai" target="_blank" rel="noopener noreferrer">
                  GitHub
                  <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Curriculum */}
        <div className="px-6 py-8 max-w-6xl mx-auto">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {curriculum.map((section) => (
              <Card key={section.section} className="overflow-hidden">
                {/* Section Header */}
                <div className={`bg-gradient-to-r ${section.gradient} px-3 py-2`}>
                  <div className="flex items-center gap-2">
                    <section.icon className="h-4 w-4 text-white" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white text-sm">{section.section}</h3>
                    </div>
                  </div>
                </div>

                {/* Pages */}
                <div className="p-1">
                  {section.pages.map((page) => (
                    <Link
                      key={page.href}
                      href={page.href}
                      className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted transition-colors group"
                    >
                      <span className="w-5 h-5 rounded bg-muted flex items-center justify-center text-xs font-mono text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        {page.num}
                      </span>
                      <span className="text-sm group-hover:text-primary transition-colors">
                        {page.title}
                      </span>
                      <ChevronRight className="h-3 w-3 ml-auto text-muted-foreground/30 group-hover:text-primary transition-colors" />
                    </Link>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>Powered by <strong className="text-foreground">Vercel AI Gateway</strong></span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">claude-sonnet-4</span>
            </div>
            <span>Next.js 16 + React 19</span>
          </div>
        </div>
      </main>
    </>
  )
}
