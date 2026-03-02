import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import LiveOps from "./pages/LiveOps";
import Runs from "./pages/Runs";
import RunDetail from "./pages/RunDetail";
import Automations from "./pages/Automations";
import VoiceCenter from "./pages/VoiceCenter";
import SystemsMap from "./pages/SystemsMap";
import Audit from "./pages/Audit";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<LiveOps />} />
            <Route path="/runs" element={<Runs />} />
            <Route path="/runs/:runId" element={<RunDetail />} />
            <Route path="/automations" element={<Automations />} />
            <Route path="/voice" element={<VoiceCenter />} />
            <Route path="/systems" element={<SystemsMap />} />
            <Route path="/audit" element={<Audit />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
