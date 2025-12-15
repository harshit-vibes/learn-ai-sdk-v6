import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { LearningSidebar } from '@/components/navigation/learning-sidebar'

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <LearningSidebar />
      <SidebarInset>
        <div className="flex h-screen flex-col">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
