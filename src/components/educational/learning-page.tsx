'use client'

import { ReactNode } from 'react'
import { EducationalShell } from './educational-shell'
import { InfoBar } from './info-bar'
import { CodeBlock } from './code-block'
import { ApiReference } from './api-reference'
import { DemoCard } from './demo-card'
import { PageContent } from '@/lib/education-content'

interface LearningPageProps {
  content: PageContent
  demo?: ReactNode
  codeExamples?: { title: string; language: string; code: string }[]
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
      <InfoBar
        whatIs={content.infoBar.whatIs}
        whenToUse={content.infoBar.whenToUse}
        keyConcepts={content.infoBar.keyConcepts}
        codeExample={content.infoBar.codeExample}
      />

      <DemoCard
        code={
          codeContent && codeContent.length > 0 ? (
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
          ) : undefined
        }
      >
        {demo || (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <p>Interactive demo coming soon</p>
          </div>
        )}
      </DemoCard>

      {content.apiReference && content.apiReference.length > 0 && (
        <div className="mt-4">
          <ApiReference items={content.apiReference} />
        </div>
      )}
    </EducationalShell>
  )
}
