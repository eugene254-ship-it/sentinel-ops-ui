import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

function LiveClock() {
  const [time, setTime] = useState(new Date().toLocaleTimeString("en-US", { hour12: false }));
  useEffect(() => {
    const id = setInterval(() => setTime(new Date().toLocaleTimeString("en-US", { hour12: false })), 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="tabular-nums">{time} UTC</span>;
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [show, setShow] = useState(true);

  useEffect(() => {
    setShow(false);
    const id = requestAnimationFrame(() => setShow(true));
    return () => cancelAnimationFrame(id);
  }, [location.pathname]);

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
                <LiveClock />
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <div className={`transition-all duration-200 ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}`}>
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
