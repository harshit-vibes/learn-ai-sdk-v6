'use client'

import { ReactNode } from 'react'
import * as Tabs from '@radix-ui/react-tabs'
import { EducationalShell } from './educational-shell'
import { CodeBlock } from './code-block'
import { ApiReference } from './api-reference'
import { PageContent } from '@/lib/education-content'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Lightbulb, Code2, Play, FileText } from 'lucide-react'

interface LearningPageProps {
  content: PageContent
  demo?: ReactNode
  codeExamples?: { title: string; language: string; code: string }[]
}

function InfoContent({ content }: { content: PageContent }) {
  return (
    <div className="space-y-6">
      {/* What is it */}
      <Card className="p-4">
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-primary" />
          What is it?
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {content.infoBar.whatIs}
        </p>
      </Card>

      {/* When to use */}
      <Card className="p-4">
        <h3 className="font-semibold mb-2">When to use</h3>
        <ul className="space-y-2">
          {content.infoBar.whenToUse.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </Card>

      {/* Key concepts */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Key concepts</h3>
        <div className="space-y-3">
          {content.infoBar.keyConcepts.map((concept, i) => (
            <div key={i} className="flex gap-3">
              <Badge variant="secondary" className="shrink-0 h-fit">
                {concept.term}
              </Badge>
              <span className="text-sm text-muted-foreground">{concept.definition}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick example */}
      {content.infoBar.codeExample && (
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Quick example</h3>
          <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto">
            <code>{content.infoBar.codeExample}</code>
          </pre>
        </Card>
      )}
    </div>
  )
}

export function LearningPage({ content, demo, codeExamples }: LearningPageProps) {
  const codeContent = codeExamples || content.codeExamples

  return (
    <EducationalShell
      title={content.title}
      subtitle={content.subtitle}
      category={content.category}
      docsUrl={content.docsUrl}
    >
      <Tabs.Root defaultValue="demo" className="flex-1 flex flex-col min-h-0">
        <Tabs.List className="flex border-b mb-4 gap-1 shrink-0">
          <Tabs.Trigger
            value="demo"
            className="px-4 py-2 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
          >
            <Play className="h-4 w-4" />
            Demo
          </Tabs.Trigger>
          <Tabs.Trigger
            value="info"
            className="px-4 py-2 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
          >
            <Lightbulb className="h-4 w-4" />
            Learn
          </Tabs.Trigger>
          <Tabs.Trigger
            value="code"
            className="px-4 py-2 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
          >
            <Code2 className="h-4 w-4" />
            Code
          </Tabs.Trigger>
          {content.apiReference && content.apiReference.length > 0 && (
            <Tabs.Trigger
              value="api"
              className="px-4 py-2 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              API
            </Tabs.Trigger>
          )}
        </Tabs.List>

        <Tabs.Content value="demo" className="flex-1 flex flex-col min-h-0 overflow-auto outline-none">
          {demo || (
            <div className="flex-1 flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg p-8">
              <div className="text-center">
                <Play className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="font-medium">Interactive demo</p>
                <p className="text-sm">Try out {content.title} hands-on</p>
              </div>
            </div>
          )}
        </Tabs.Content>

        <Tabs.Content value="info" className="flex-1 min-h-0 overflow-auto outline-none">
          <InfoContent content={content} />
        </Tabs.Content>

        <Tabs.Content value="code" className="flex-1 min-h-0 overflow-auto outline-none">
          {codeContent && codeContent.length > 0 ? (
            <div className="space-y-4">
              {codeContent.map((example, i) => (
                <CodeBlock
                  key={i}
                  code={example.code}
                  title={example.title}
                  language={example.language}
                />
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg p-8">
              <div className="text-center">
                <Code2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Code examples coming soon</p>
              </div>
            </div>
          )}
        </Tabs.Content>

        {content.apiReference && content.apiReference.length > 0 && (
          <Tabs.Content value="api" className="flex-1 min-h-0 overflow-auto outline-none">
            <ApiReference items={content.apiReference} />
          </Tabs.Content>
        )}
      </Tabs.Root>
    </EducationalShell>
  )
}
