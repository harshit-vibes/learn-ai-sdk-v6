'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormEvent } from 'react'

interface ChatInputProps {
  input: string
  setInput: (value: string) => void
  onSubmit: () => void
  isLoading?: boolean
  placeholder?: string
  submitLabel?: string
}

export function ChatInput({
  input,
  setInput,
  onSubmit,
  isLoading = false,
  placeholder = 'Type a message...',
  submitLabel = 'Send',
}: ChatInputProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
        disabled={isLoading}
      />
      <Button type="submit" disabled={isLoading || !input.trim()}>
        {submitLabel}
      </Button>
    </form>
  )
}
