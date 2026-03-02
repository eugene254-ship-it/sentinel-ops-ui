import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-11 flex items-center border-b border-border bg-surface-0 px-2 gap-3 flex-shrink-0">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <div className="flex items-center gap-2 ml-auto">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-severity-critical/10 border border-severity-critical/20">
                <div className="w-1.5 h-1.5 rounded-full bg-severity-critical animate-pulse-dot" />
                <span className="text-[11px] font-mono text-severity-critical">3 ACTIVE</span>
              </div>
              <div className="text-[11px] font-mono text-muted-foreground">
                {new Date().toLocaleTimeString("en-US", { hour12: false })} UTC
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
