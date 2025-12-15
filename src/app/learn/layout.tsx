import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { LearningSidebar } from '@/components/navigation/learning-sidebar'
import { Separator } from '@/components/ui/separator'

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <LearningSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <span className="text-sm text-muted-foreground">AI SDK v6 Learning Hub</span>
        </header>
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
