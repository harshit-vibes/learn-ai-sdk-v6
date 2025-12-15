'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import {
  BookOpen,
  MessageSquare,
  TextCursorInput,
  Braces,
  Waves,
  FileText,
  Zap,
  PenTool,
  Package,
  PackageOpen,
  Wrench,
  Bot,
  Plug,
  Eye,
  Image,
  Mic,
  Volume2,
  Hash,
  ArrowUpDown,
  Settings,
  Layers,
  Server,
  AlertCircle,
  TestTube,
  Activity,
  Terminal,
  Sparkles,
} from 'lucide-react'

const navigation = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Overview', href: '/learn/overview', icon: BookOpen },
    ],
  },
  {
    title: 'AI SDK UI',
    items: [
      { title: 'useChat', href: '/learn/ui/chat', icon: MessageSquare },
      { title: 'useCompletion', href: '/learn/ui/completion', icon: TextCursorInput },
      { title: 'useObject', href: '/learn/ui/object', icon: Braces },
      { title: 'Stream Utilities', href: '/learn/ui/streams', icon: Waves },
    ],
  },
  {
    title: 'Text Generation',
    items: [
      { title: 'generateText', href: '/learn/text/generate', icon: FileText },
      { title: 'streamText', href: '/learn/text/stream', icon: Zap },
      { title: 'Prompt Engineering', href: '/learn/text/prompts', icon: PenTool },
    ],
  },
  {
    title: 'Structured Data',
    items: [
      { title: 'generateObject', href: '/learn/structured/generate', icon: Package },
      { title: 'streamObject', href: '/learn/structured/stream', icon: PackageOpen },
    ],
  },
  {
    title: 'Tool Calling',
    items: [
      { title: 'Basic Tools', href: '/learn/tools/basic', icon: Wrench },
      { title: 'Multi-step Agents', href: '/learn/tools/agents', icon: Bot },
      { title: 'MCP', href: '/learn/tools/mcp', icon: Plug },
    ],
  },
  {
    title: 'Multimodal',
    items: [
      { title: 'Vision', href: '/learn/multimodal/vision', icon: Eye },
      { title: 'Image Generation', href: '/learn/multimodal/image', icon: Image },
      { title: 'Transcription', href: '/learn/multimodal/transcription', icon: Mic },
      { title: 'Speech', href: '/learn/multimodal/speech', icon: Volume2 },
    ],
  },
  {
    title: 'RAG & Search',
    items: [
      { title: 'Embeddings', href: '/learn/rag/embeddings', icon: Hash },
      { title: 'Reranking', href: '/learn/rag/reranking', icon: ArrowUpDown },
    ],
  },
  {
    title: 'Advanced',
    items: [
      { title: 'Model Settings', href: '/learn/advanced/settings', icon: Settings },
      { title: 'Middleware', href: '/learn/advanced/middleware', icon: Layers },
      { title: 'Providers', href: '/learn/advanced/providers', icon: Server },
      { title: 'Error Handling', href: '/learn/advanced/errors', icon: AlertCircle },
    ],
  },
  {
    title: 'Development',
    items: [
      { title: 'Testing', href: '/learn/dev/testing', icon: TestTube },
      { title: 'Telemetry', href: '/learn/dev/telemetry', icon: Activity },
      { title: 'DevTools', href: '/learn/dev/devtools', icon: Terminal },
    ],
  },
]

export function LearningSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/learn/overview">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Sparkles className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">AI SDK v6</span>
                  <span className="text-xs text-muted-foreground">Learning Hub</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {navigation.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      tooltip={item.title}
                    >
                      <Link href={item.href}>
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}
