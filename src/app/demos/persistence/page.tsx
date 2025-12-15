'use client'

import { useChat } from '@ai-sdk/react'
import { useState, useEffect } from 'react'
import { DemoShell } from '@/components/demo-shell'
import { ChatMessages } from '@/components/chat-messages'
import { ChatInput } from '@/components/chat-input'
import { StatusBar } from '@/components/status-bar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'

const STORAGE_KEY = 'ai-sdk-demo-chats'

export default function PersistenceDemo() {
  const [input, setInput] = useState('')
  const [chatId, setChatId] = useState<string>(() => `chat-${Date.now()}`)
  const [savedChats, setSavedChats] = useState<string[]>([])

  const { messages, sendMessage, status, setMessages } = useChat({
    id: chatId,
    onFinish: () => {
      // Save to localStorage after each message
      const allChats = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
      allChats[chatId] = messages
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allChats))
    },
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  useEffect(() => {
    // Load saved chat IDs
    const allChats = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    setSavedChats(Object.keys(allChats))
  }, [])

  useEffect(() => {
    // Load messages for current chat
    const allChats = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    if (allChats[chatId]) {
      setMessages(allChats[chatId])
    }
  }, [chatId, setMessages])

  const saveCurrentChat = () => {
    const allChats = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    allChats[chatId] = messages
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allChats))
    if (!savedChats.includes(chatId)) {
      setSavedChats([...savedChats, chatId])
    }
  }

  const newChat = () => {
    const newId = `chat-${Date.now()}`
    setChatId(newId)
    setMessages([])
  }

  const loadChat = (id: string) => {
    setChatId(id)
  }

  const clearAll = () => {
    localStorage.removeItem(STORAGE_KEY)
    setSavedChats([])
    newChat()
  }

  return (
    <DemoShell
      title="Persistence"
      badge="localStorage"
      description={<>Messages are saved to localStorage. Reload the page to see persistence in action.</>}
    >
      <div className="flex gap-4 h-full">
        {/* Sidebar with saved chats */}
        <div className="w-48 border-r pr-4 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Chats</span>
            <Button size="sm" variant="outline" onClick={newChat}>New</Button>
          </div>
          <ScrollArea className="flex-1">
            <div className="space-y-1">
              {savedChats.map((id) => (
                <Button
                  key={id}
                  variant={id === chatId ? 'secondary' : 'ghost'}
                  size="sm"
                  className="w-full justify-start text-xs truncate"
                  onClick={() => loadChat(id)}
                >
                  {id.slice(5, 18)}
                </Button>
              ))}
            </div>
          </ScrollArea>
          <Button size="sm" variant="destructive" onClick={clearAll} className="mt-2">
            Clear All
          </Button>
        </div>

        {/* Main chat area */}
        <div className="flex-1 flex flex-col min-h-0">
          <StatusBar
            status={status}
            isLoading={isLoading}
            onClear={() => setMessages([])}
            showClear={messages.length > 0}
          >
            <Badge variant="outline">{chatId.slice(0, 15)}...</Badge>
            <Button size="sm" variant="outline" onClick={saveCurrentChat}>
              Save
            </Button>
          </StatusBar>
          <ChatMessages messages={messages} emptyText="Start a conversation - it will be saved!" />
          <ChatInput
            input={input}
            setInput={setInput}
            onSubmit={() => { sendMessage({ text: input }); setInput('') }}
            isLoading={isLoading}
          />
        </div>
      </div>
    </DemoShell>
  )
}
