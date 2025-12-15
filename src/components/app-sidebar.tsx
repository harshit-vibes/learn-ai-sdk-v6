"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  MessageSquare,
  TextCursorInput,
  Braces,
  Wrench,
  LayoutDashboard,
  Database,
  AlertCircle,
  Sparkles,
} from "lucide-react"

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
  SidebarRail,
} from "@/components/ui/sidebar"

const demos = [
  {
    title: "Basic Chat",
    url: "/demos/chat",
    icon: MessageSquare,
    description: "useChat hook",
  },
  {
    title: "Completion",
    url: "/demos/completion",
    icon: TextCursorInput,
    description: "useCompletion hook",
  },
  {
    title: "Object Generation",
    url: "/demos/object",
    icon: Braces,
    description: "useObject hook",
  },
  {
    title: "Tool Usage",
    url: "/demos/tools",
    icon: Wrench,
    description: "Server & client tools",
  },
  {
    title: "Generative UI",
    url: "/demos/generative-ui",
    icon: LayoutDashboard,
    description: "Dynamic components",
  },
  {
    title: "Persistence",
    url: "/demos/persistence",
    icon: Database,
    description: "Save/load messages",
  },
  {
    title: "Error Handling",
    url: "/demos/errors",
    icon: AlertCircle,
    description: "Graceful errors",
  },
  {
    title: "Advanced",
    url: "/demos/advanced",
    icon: Sparkles,
    description: "Resume, metadata",
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="font-semibold text-lg group-data-[collapsible=icon]:hidden">
            AI SDK UI
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Demos</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {demos.map((demo) => (
                <SidebarMenuItem key={demo.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === demo.url}
                    tooltip={demo.title}
                  >
                    <Link href={demo.url}>
                      <demo.icon />
                      <span>{demo.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
