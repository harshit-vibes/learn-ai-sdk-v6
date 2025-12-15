'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Info, Lightbulb, Code2, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface KeyConcept {
  term: string
  definition: string
}

interface InfoBarProps {
  whatIs: string
  whenToUse: string[]
  keyConcepts?: KeyConcept[]
  codeExample?: string
  defaultExpanded?: boolean
}

export function InfoBar({
  whatIs,
  whenToUse,
  keyConcepts = [],
  codeExample,
  defaultExpanded = false,
}: InfoBarProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <div className="border rounded-lg bg-muted/30 mb-4">
      {/* Toggle Header */}
      <Button
        variant="ghost"
        className="w-full justify-between p-4 h-auto hover:bg-muted/50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-blue-500" />
          <span className="font-medium">Learn about this feature</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </Button>

      {/* Expandable Content */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-200',
          isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="p-4 pt-0 space-y-4">
          {/* What is it? */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <BookOpen className="h-4 w-4 text-green-500" />
              What is it?
            </div>
            <p className="text-sm text-muted-foreground pl-6">{whatIs}</p>
          </div>

          {/* When to use */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              When to use
            </div>
            <ul className="text-sm text-muted-foreground pl-6 space-y-1">
              {whenToUse.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-muted-foreground">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Key Concepts */}
          {keyConcepts.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Info className="h-4 w-4 text-purple-500" />
                Key concepts
              </div>
              <div className="pl-6 space-y-2">
                {keyConcepts.map((concept, i) => (
                  <div key={i} className="text-sm">
                    <span className="font-mono text-primary">{concept.term}</span>
                    <span className="text-muted-foreground"> - {concept.definition}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Code Example */}
          {codeExample && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Code2 className="h-4 w-4 text-orange-500" />
                Quick example
              </div>
              <pre className="pl-6 text-xs bg-background/50 p-3 rounded-md overflow-x-auto">
                <code>{codeExample}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
