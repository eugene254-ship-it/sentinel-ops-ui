import { useParams, useNavigate } from "react-router-dom";
import { mockRun, mockRunSteps } from "@/data/mockData";
import { RunTimeline } from "@/components/RunTimeline";
import { EvidencePanel } from "@/components/EvidencePanel";
import { AgentCouncil } from "@/components/AgentCouncil";
import { ArrowLeft, Clock, Shield, StopCircle, RotateCcw, CheckCircle } from "lucide-react";

const RunDetail = () => {
  const { runId } = useParams();
  const navigate = useNavigate();
  const run = mockRun; // In real app, fetch by runId

  return (
    <div className="p-4 space-y-4 min-h-full">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-foreground">{run.title}</h1>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-severity-critical/15 text-severity-critical font-mono font-bold uppercase">
              {run.severity}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono">
              {run.id}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Started {run.startedAt.toLocaleTimeString("en-US", { hour12: false })}
            </span>
            <span className="text-xs font-mono text-muted-foreground">
              Agent: {run.agent}
            </span>
            <span className="text-xs font-mono text-muted-foreground">
              System: {run.system}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono bg-severity-critical/10 text-severity-critical border border-severity-critical/20 hover:bg-severity-critical/20 transition-colors">
            <StopCircle className="w-3 h-3" />
            Stop
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono bg-severity-medium/10 text-severity-medium border border-severity-medium/20 hover:bg-severity-medium/20 transition-colors">
            <RotateCcw className="w-3 h-3" />
            Rollback
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono bg-severity-ok/10 text-severity-ok border border-severity-ok/20 hover:bg-severity-ok/20 transition-colors">
            <CheckCircle className="w-3 h-3" />
            Approve
          </button>
        </div>
      </div>

      {/* Three-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Timeline */}
        <div className="lg:col-span-3">
          <h2 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">Run Timeline</h2>
          <RunTimeline steps={mockRunSteps} />
        </div>

        {/* Center: Evidence */}
        <div className="lg:col-span-5">
          <h2 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">Reasoning & Evidence</h2>
          <EvidencePanel />
        </div>

        {/* Right: Actions & Council */}
        <div className="lg:col-span-4 space-y-4">
          <div>
            <h2 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">Actions & Approvals</h2>
            <div className="space-y-2">
              <div className="rounded-lg border border-severity-ok/20 bg-severity-ok/5 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="w-3 h-3 text-severity-ok" />
                  <span className="text-xs font-mono font-bold text-severity-ok">GUARDRAILS OK</span>
                </div>
                <div className="space-y-1 text-[11px] font-mono text-muted-foreground">
                  <div>Rate limit: 47/200 actions this hour</div>
                  <div>Policy P-003: 0/5 driver reassignments used</div>
                  <div>Confidence 94% ≥ 85% auto-act threshold</div>
                  <div>No forbidden actions triggered</div>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-3">
                <span className="text-[10px] font-mono uppercase text-muted-foreground">Pending Approval</span>
                <div className="mt-2 p-2 rounded bg-secondary/50 text-xs font-mono text-foreground">
                  Reroute 12 NE-7 shipments via NE-9 secondary corridor
                </div>
                <div className="mt-2 flex gap-2">
                  <button className="flex-1 py-1.5 rounded text-xs font-mono bg-severity-ok/10 text-severity-ok border border-severity-ok/20 hover:bg-severity-ok/20 transition-colors">
                    Approve
                  </button>
                  <button className="flex-1 py-1.5 rounded text-xs font-mono bg-severity-critical/10 text-severity-critical border border-severity-critical/20 hover:bg-severity-critical/20 transition-colors">
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>

          <AgentCouncil />
        </div>
      </div>
    </div>
  );
};

export default RunDetail;
