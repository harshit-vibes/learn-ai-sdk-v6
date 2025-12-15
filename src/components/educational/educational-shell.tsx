'use client'

import { ReactNode } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
    <div className="flex flex-col h-[calc(100vh-3.5rem)] p-4 gap-4">
      {/* Header Card */}
      <Card className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{title}</h1>
              <Badge variant="secondary">{category}</Badge>
            </div>
            <p className="text-muted-foreground">{subtitle}</p>
          </div>
          {docsUrl && (
            <Button variant="outline" size="sm" asChild>
              <a href={docsUrl} target="_blank" rel="noopener noreferrer">
                <BookOpen className="h-4 w-4 mr-2" />
                Docs
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </Button>
          )}
        </div>
      </Card>

      {/* Main Content */}
      <Card className="flex-1 flex flex-col overflow-hidden p-4">
        {children}
      </Card>
    </div>
  )
}
