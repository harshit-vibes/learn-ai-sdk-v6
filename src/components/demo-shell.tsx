'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ReactNode } from 'react'

interface DemoShellProps {
  title: string
  badge: string
  description: ReactNode
  children: ReactNode
}

export function DemoShell({ title, badge, description, children }: DemoShellProps) {
  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] p-4">
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            {title}
            <Badge variant="outline">{badge}</Badge>
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
      <Card className="flex-1 flex flex-col min-h-0">
        <CardContent className="flex-1 flex flex-col p-4 min-h-0">
          {children}
        </CardContent>
      </Card>
    </div>
  )
}
