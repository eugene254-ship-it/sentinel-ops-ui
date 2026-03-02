import { useState } from "react";

interface AgentClaim {
  agent: string;
  role: string;
  claim: string;
  evidence: string;
  risk?: string;
  color: string;
}

const debate: AgentClaim[] = [
  {
    agent: "Planner",
    role: "Options",
    claim: "Reassign 3 drivers from Zone 8 → Zone 12. Reroute NE-7 via NE-9 secondary.",
    evidence: "Zone 8 has 5 idle drivers. NE-9 adds 12min but avoids congestion.",
    color: "text-primary",
  },
  {
    agent: "Executor",
    role: "Feasibility",
    claim: "Driver reassignment: feasible, 8min ETA. Reroute: feasible but requires dispatcher approval.",
    evidence: "Dispatch API available. D-441, D-522, D-607 confirmed idle via fleet telemetry.",
    risk: "Reroute may trigger customer notification cascade (est. 47 notifications)",
    color: "text-severity-medium",
  },
  {
    agent: "Communicator",
    role: "Messaging",
    claim: "Will call ops manager for confirmation. Draft proactive customer update for affected shipments.",
    evidence: "Mike Chen is on-call. Customer template T-12 (delay notification) ready.",
    color: "text-severity-ok",
  },
  {
    agent: "Verifier",
    role: "Policy Check",
    claim: "Action within guardrails. Rate limit: 47/200 actions this hour. No forbidden actions triggered.",
    evidence: "Policy P-003 (max 5 driver reassignments/hour): 0 used. SOC2 log entry prepared.",
    risk: "Confidence 94% is above 85% auto-act threshold. Proceed.",
    color: "text-severity-low",
  },
];

export function AgentCouncil() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="rounded-lg border border-border bg-card">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Agent Council</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono">4 agents</span>
        </div>
        <span className="text-xs text-muted-foreground">{isOpen ? "▾" : "▸"}</span>
      </button>

      {isOpen && (
        <div className="border-t border-border p-3 space-y-3">
          {debate.map((d, i) => (
            <div key={i} className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold font-mono ${d.color}`}>{d.agent}</span>
                <span className="text-[10px] px-1 py-0.5 rounded bg-secondary text-muted-foreground font-mono">{d.role}</span>
              </div>
              <p className="text-xs text-foreground">{d.claim}</p>
              <p className="text-[11px] text-muted-foreground">
                <span className="text-primary">Evidence:</span> {d.evidence}
              </p>
              {d.risk && (
                <p className="text-[11px] text-severity-high">
                  ⚠ {d.risk}
                </p>
              )}
            </div>
          ))}

          <div className="border-t border-border pt-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase text-severity-ok">Decision</span>
              <span className="text-[10px] font-mono text-muted-foreground">Consensus: PROCEED</span>
            </div>
            <p className="text-xs text-foreground mt-1">
              Execute driver reassignment (3 drivers). Hold reroute pending ops manager confirmation. Initiate voice call.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
