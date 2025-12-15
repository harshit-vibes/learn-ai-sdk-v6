'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useState } from 'react'
import { DemoShell } from '@/components/demo-shell'
import { ChatInput } from '@/components/chat-input'
import { StatusBar } from '@/components/status-bar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'

// Generative UI Components
function WeatherCard({ data }: { data: { location: string; temperature: number; condition: string } }) {
  const icons: Record<string, string> = {
    sunny: '☀️', cloudy: '☁️', rainy: '🌧️', 'partly cloudy': '⛅'
  }
  return (
    <Card className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white my-2">
      <div className="text-2xl mb-2">{icons[data.condition] || '🌡️'}</div>
      <div className="font-bold text-lg">{data.location}</div>
      <div className="text-3xl font-bold">{data.temperature}°C</div>
      <div className="capitalize">{data.condition}</div>
    </Card>
  )
}

function StockCard({ data }: { data: { symbol: string; price: number; change: number } }) {
  const isPositive = data.change >= 0
  return (
    <Card className="p-4 my-2">
      <div className="font-bold text-lg">{data.symbol}</div>
      <div className="text-2xl font-bold">${data.price.toFixed(2)}</div>
      <div className={isPositive ? 'text-green-500' : 'text-red-500'}>
        {isPositive ? '↑' : '↓'} {Math.abs(data.change).toFixed(2)}%
      </div>
    </Card>
  )
}

export default function GenerativeUIDemo() {
  const [input, setInput] = useState('')
  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: '/api/generative-ui' }),
  })
  const isLoading = status === 'streaming' || status === 'submitted'

  const renderPart = (part: any, i: number) => {
    if (part.type === 'text') {
      return <span key={i}>{part.text}</span>
    }

    // v6 format: tool parts have type 'tool-{toolName}'
    // States: input-streaming, input-available, output-available, output-error
    if (part.type === 'tool-getWeather') {
      if (part.state === 'output-available' && part.output) {
        return <WeatherCard key={i} data={part.output} />
      }
      return (
        <div key={i} className="my-2 p-2 bg-muted rounded text-sm animate-pulse">
          Loading weather...
        </div>
      )
    }

    if (part.type === 'tool-getStock') {
      if (part.state === 'output-available' && part.output) {
        return <StockCard key={i} data={part.output} />
      }
      return (
        <div key={i} className="my-2 p-2 bg-muted rounded text-sm animate-pulse">
          Loading stock...
        </div>
      )
    }

    return null
  }

  return (
    <DemoShell
      title="Generative UI"
      badge="Dynamic Components"
      description={<>AI renders React components dynamically based on tool calls.</>}
    >
      <StatusBar
        status={status}
        isLoading={isLoading}
        onClear={() => setMessages([])}
        showClear={messages.length > 0}
      >
        <Badge variant="outline">weather cards</Badge>
        <Badge variant="outline">stock cards</Badge>
      </StatusBar>

      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-4">
          {messages.length === 0 && (
            <p className="text-muted-foreground text-center py-8">
              Try: "Show weather in Paris" or "Get stock price for AAPL"
            </p>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}>
                <p className="text-xs font-medium mb-1 opacity-70">
                  {message.role === 'user' ? 'You' : 'Assistant'}
                </p>
                <div>{message.parts.map(renderPart)}</div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <ChatInput
        input={input}
        setInput={setInput}
        onSubmit={() => { sendMessage({ text: input }); setInput('') }}
        isLoading={isLoading}
        placeholder="Ask for weather or stock info..."
      />
    </DemoShell>
  )
}
