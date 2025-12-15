'use client'

import { ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { ExternalLink, BookOpen } from 'lucide-react'

interface EducationalShellProps {
  title: string
  subtitle: string
  category: string
  docsUrl?: string
  children: ReactNode
}

export function EducationalShell({
  title,
  subtitle,
  category,
  docsUrl,
  children,
}: EducationalShellProps) {
  return (
    <>
      {/* Header */}
      <header className="flex h-14 shrink-0 items-center gap-3 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-6" />
        <div className="flex flex-1 items-center justify-between gap-4 min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="text-lg font-semibold truncate">{title}</h1>
            <Badge variant="secondary" className="shrink-0">{category}</Badge>
            <span className="text-sm text-muted-foreground truncate hidden md:inline">{subtitle}</span>
          </div>
          {docsUrl && (
            <Button variant="ghost" size="sm" asChild className="shrink-0">
              <a href={docsUrl} target="_blank" rel="noopener noreferrer">
                <BookOpen className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Docs</span>
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 p-4">
        {children}
      </main>
    </>
  )
}
