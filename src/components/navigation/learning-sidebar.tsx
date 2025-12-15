'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
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
  ChevronRight,
  type LucideIcon,
} from 'lucide-react'

interface NavItem {
  title: string
  href: string
  icon: LucideIcon
}

interface NavSection {
  title: string
  icon: LucideIcon
  items: NavItem[]
}

const navigation: NavSection[] = [
  {
    title: 'Getting Started',
    icon: BookOpen,
    items: [
      { title: 'Overview', href: '/learn/overview', icon: BookOpen },
    ],
  },
  {
    title: 'AI SDK UI',
    icon: MessageSquare,
    items: [
      { title: 'useChat', href: '/learn/ui/chat', icon: MessageSquare },
      { title: 'useCompletion', href: '/learn/ui/completion', icon: TextCursorInput },
      { title: 'useObject', href: '/learn/ui/object', icon: Braces },
      { title: 'Stream Utilities', href: '/learn/ui/streams', icon: Waves },
    ],
  },
  {
    title: 'Text Generation',
    icon: FileText,
    items: [
      { title: 'generateText', href: '/learn/text/generate', icon: FileText },
      { title: 'streamText', href: '/learn/text/stream', icon: Zap },
      { title: 'Prompt Engineering', href: '/learn/text/prompts', icon: PenTool },
    ],
  },
  {
    title: 'Structured Data',
    icon: Package,
    items: [
      { title: 'generateObject', href: '/learn/structured/generate', icon: Package },
      { title: 'streamObject', href: '/learn/structured/stream', icon: PackageOpen },
    ],
  },
  {
    title: 'Tool Calling',
    icon: Wrench,
    items: [
      { title: 'Basic Tools', href: '/learn/tools/basic', icon: Wrench },
      { title: 'Multi-step Agents', href: '/learn/tools/agents', icon: Bot },
      { title: 'MCP', href: '/learn/tools/mcp', icon: Plug },
    ],
  },
  {
    title: 'Multimodal',
    icon: Image,
    items: [
      { title: 'Vision', href: '/learn/multimodal/vision', icon: Eye },
      { title: 'Image Generation', href: '/learn/multimodal/image', icon: Image },
      { title: 'Transcription', href: '/learn/multimodal/transcription', icon: Mic },
      { title: 'Speech', href: '/learn/multimodal/speech', icon: Volume2 },
    ],
  },
  {
    title: 'RAG & Search',
    icon: Hash,
    items: [
      { title: 'Embeddings', href: '/learn/rag/embeddings', icon: Hash },
      { title: 'Reranking', href: '/learn/rag/reranking', icon: ArrowUpDown },
    ],
  },
  {
    title: 'Advanced',
    icon: Settings,
    items: [
      { title: 'Model Settings', href: '/learn/advanced/settings', icon: Settings },
      { title: 'Middleware', href: '/learn/advanced/middleware', icon: Layers },
      { title: 'Providers', href: '/learn/advanced/providers', icon: Server },
      { title: 'Error Handling', href: '/learn/advanced/errors', icon: AlertCircle },
    ],
  },
  {
    title: 'Development',
    icon: TestTube,
    items: [
      { title: 'Testing', href: '/learn/dev/testing', icon: TestTube },
      { title: 'Telemetry', href: '/learn/dev/telemetry', icon: Activity },
      { title: 'DevTools', href: '/learn/dev/devtools', icon: Terminal },
    ],
  },
]

function SidebarNav() {
  const pathname = usePathname()
  const { state, setOpen } = useSidebar()

  const isSectionActive = (items: NavItem[]) => {
    return items.some(item => pathname === item.href)
  }

  const handleSectionClick = () => {
    if (state === 'collapsed') {
      setOpen(true)
    }
  }

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {navigation.map((section) => (
              <Collapsible
                key={section.title}
                asChild
                defaultOpen={section.title === 'Getting Started' || isSectionActive(section.items)}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={section.title} onClick={handleSectionClick}>
                      <section.icon className="size-4" />
                      <span>{section.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {section.items.map((item) => (
                        <SidebarMenuSubItem key={item.href}>
                          <SidebarMenuSubButton asChild isActive={pathname === item.href}>
                            <Link href={item.href}>
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  )
}

export function LearningSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-14 border-b flex items-center px-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="h-10">
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

      <SidebarNav />
    </Sidebar>
  )
}
