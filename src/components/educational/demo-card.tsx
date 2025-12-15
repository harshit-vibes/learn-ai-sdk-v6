'use client'

import { ReactNode } from 'react'
import * as Tabs from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'

interface DemoCardProps {
  children: ReactNode
  code?: ReactNode
  defaultTab?: 'demo' | 'code'
  className?: string
}

export function DemoCard({
  children,
  code,
  defaultTab = 'demo',
  className,
}: DemoCardProps) {
  if (!code) {
    return <div className={cn('flex-1 flex flex-col', className)}>{children}</div>
  }

  return (
    <Tabs.Root defaultValue={defaultTab} className={cn('flex-1 flex flex-col', className)}>
      <Tabs.List className="flex border-b mb-4">
        <Tabs.Trigger
          value="demo"
          className="px-4 py-2 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary text-muted-foreground hover:text-foreground transition-colors"
        >
          Demo
        </Tabs.Trigger>
        <Tabs.Trigger
          value="code"
          className="px-4 py-2 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary text-muted-foreground hover:text-foreground transition-colors"
        >
          Code
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="demo" className="flex-1 flex flex-col outline-none">
        {children}
      </Tabs.Content>

      <Tabs.Content value="code" className="flex-1 overflow-auto outline-none">
        {code}
      </Tabs.Content>
    </Tabs.Root>
  )
}
