'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ReactNode } from 'react'

interface StatusBarProps {
  status: string
  isLoading: boolean
  onStop?: () => void
  onClear?: () => void
  showClear?: boolean
  children?: ReactNode
}

export function StatusBar({
  status,
  isLoading,
  onStop,
  onClear,
  showClear = false,
  children,
}: StatusBarProps) {
  return (
    <div className="flex items-center gap-2 mb-4 flex-wrap">
      <Badge variant={status === 'ready' ? 'default' : 'secondary'}>
        {status}
      </Badge>
      {children}
      {showClear && onClear && (
        <Button variant="outline" size="sm" onClick={onClear}>
          Clear
        </Button>
      )}
      {isLoading && onStop && (
        <Button variant="destructive" size="sm" onClick={onStop}>
          Stop
        </Button>
      )}
    </div>
  )
}
