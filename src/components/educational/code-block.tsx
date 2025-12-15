'use client'

import { useEffect, useState } from 'react'
import { codeToHtml } from 'shiki'
import { Button } from '@/components/ui/button'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CodeBlockProps {
  code: string
  language?: string
  title?: string
  showLineNumbers?: boolean
  className?: string
}

export function CodeBlock({
  code,
  language = 'typescript',
  title,
  showLineNumbers = true,
  className,
}: CodeBlockProps) {
  const [html, setHtml] = useState<string>('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    codeToHtml(code.trim(), {
      lang: language,
      theme: 'github-dark',
    }).then(setHtml)
  }, [code, language])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code.trim())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn('rounded-lg overflow-hidden border bg-[#0d1117]', className)}>
      {/* Header */}
      {title && (
        <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-[#30363d]">
          <span className="text-xs font-medium text-[#8b949e]">{title}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-[#8b949e] hover:text-white hover:bg-[#30363d]"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      )}

      {/* Code */}
      <div className="relative">
        {!title && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 h-7 px-2 text-[#8b949e] hover:text-white hover:bg-[#30363d] z-10"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </Button>
        )}
        <div
          className={cn(
            'overflow-x-auto text-sm p-4',
            showLineNumbers && '[&_pre]:!pl-12 [&_code]:relative [&_.line]:before:absolute [&_.line]:before:-left-8 [&_.line]:before:text-[#484f58] [&_.line]:before:content-[counter(line)] [&_.line]:before:counter-increment-[line] [&_code]:counter-reset-[line]'
          )}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  )
}
