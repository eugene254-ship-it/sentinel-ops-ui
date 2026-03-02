import { useState } from "react";
import {
  Zap, Shield, Users, Clock, ChevronRight, AlertTriangle,
  Play, Pause, Plus, Settings, Lock, Unlock,
} from "lucide-react";

const playbooks = [
  {
    id: "PB-001",
    name: "Delay Spike Response",
    description: "Detect delay anomalies, reassign drivers, reroute shipments, notify stakeholders",
    system: "Dispatch",
    autonomy: "act" as const,
    triggers: ["Delay z-score > 3.0σ", "SLA breach T-30min"],
    lastRun: "14 min ago",
    runs24h: 3,
    status: "active" as const,
  },
  {
    id: "PB-002",
    name: "CRM Sync Recovery",
    description: "Detect sync failures, attempt retry, escalate if persistent, notify affected users",
    system: "CRM",
    autonomy: "suggest" as const,
    triggers: ["Sync gap > 15min", "Error rate > 5%"],
    lastRun: "47 min ago",
    runs24h: 1,
    status: "active" as const,
  },
  {
    id: "PB-003",
    name: "Fleet Compliance Check",
    description: "Monitor vehicle inspection schedules, auto-schedule overdue, notify fleet manager",
    system: "Fleet",
    autonomy: "act" as const,
    triggers: ["Inspection overdue", "Monthly audit schedule"],
    lastRun: "3 hours ago",
    runs24h: 2,
    status: "active" as const,
  },
  {
    id: "PB-004",
    name: "Customer Escalation Handler",
    description: "Detect complaint velocity spikes, prioritize responses, escalate to senior ops",
    system: "CRM",
    autonomy: "observe" as const,
    triggers: ["Complaint rate > 200% baseline"],
    lastRun: "Never",
    runs24h: 0,
    status: "draft" as const,
  },
];

const policies = [
  {
    id: "POL-001",
    name: "Driver Reassignment Limit",
    rule: "Max 5 driver reassignments per hour per zone",
    current: "0/5 used",
    status: "enforced",
  },
  {
    id: "POL-002",
    name: "Customer Notification Gate",
    rule: "Bulk notifications (>20 recipients) require human approval",
    current: "Approval pending: 47 notifications",
    status: "blocking",
  },
  {
    id: "POL-003",
    name: "UI Automation Rate Limit",
    rule: "Max 200 UI actions per hour across all agents",
    current: "47/200 used",
    status: "enforced",
  },
  {
    id: "POL-004",
    name: "Forbidden: Delete Operations",
    rule: "Agents cannot perform DELETE actions on production databases",
    current: "0 violations",
    status: "enforced",
  },
  {
    id: "POL-005",
    name: "Forbidden: Payment Modifications",
    rule: "No automated changes to billing, invoicing, or payment systems",
    current: "0 violations",
    status: "enforced",
  },
];

const approvalRules = [
  { severity: "Critical", rule: "Auto-execute within guardrails, notify ops manager post-action", icon: Zap },
  { severity: "High", rule: "Auto-execute, require approval for customer-facing actions", icon: AlertTriangle },
  { severity: "Medium", rule: "Suggest actions, human clicks execute", icon: Users },
  { severity: "Low", rule: "Observe and log only, suggest on request", icon: Clock },
];

const autonomyColors = {
  act: "bg-severity-ok/10 text-severity-ok border-severity-ok/20",
  suggest: "bg-severity-medium/10 text-severity-medium border-severity-medium/20",
  observe: "bg-primary/10 text-primary border-primary/20",
};

const Automations = () => {
  const [activeTab, setActiveTab] = useState<"playbooks" | "policies" | "approvals">("playbooks");

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">Automations</h1>
          <p className="text-xs font-mono text-muted-foreground">Playbooks, policies, and guardrails</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors">
          <Plus className="w-3 h-3" />
          New Playbook
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {(["playbooks", "policies", "approvals"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-mono capitalize border-b-2 transition-colors ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "playbooks" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {playbooks.map((pb) => (
            <div
              key={pb.id}
              className="rounded-lg border border-border bg-card p-4 hover:border-primary/30 transition-colors cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">{pb.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded border font-mono uppercase ${autonomyColors[pb.autonomy]}`}>
                    {pb.autonomy}
                  </span>
                  {pb.status === "draft" ? (
                    <Pause className="w-3 h-3 text-muted-foreground" />
                  ) : (
                    <Play className="w-3 h-3 text-severity-ok" />
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-3">{pb.description}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {pb.triggers.map((t, i) => (
                  <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground font-mono">
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                <span>System: {pb.system}</span>
                <span>Last: {pb.lastRun}</span>
                <span>{pb.runs24h} runs/24h</span>
                <ChevronRight className="w-3 h-3 group-hover:text-primary transition-colors" />
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "policies" && (
        <div className="space-y-2">
          {policies.map((pol) => (
            <div
              key={pol.id}
              className={`rounded-lg border bg-card p-3 flex items-center gap-4 ${
                pol.status === "blocking" ? "border-severity-medium/30" : "border-border"
              }`}
            >
              <div className="flex-shrink-0">
                {pol.status === "blocking" ? (
                  <Lock className="w-4 h-4 text-severity-medium" />
                ) : (
                  <Shield className="w-4 h-4 text-severity-ok" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-muted-foreground">{pol.id}</span>
                  <span className="text-sm font-semibold text-foreground">{pol.name}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{pol.rule}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <span className={`text-[10px] font-mono ${
                  pol.status === "blocking" ? "text-severity-medium" : "text-severity-ok"
                }`}>
                  {pol.current}
                </span>
                <div className={`text-[10px] font-mono uppercase mt-0.5 ${
                  pol.status === "blocking" ? "text-severity-medium" : "text-severity-ok"
                }`}>
                  {pol.status}
                </div>
              </div>
            </div>
          ))}

          {/* Rate limits summary */}
          <div className="rounded-lg border border-border bg-card p-4 mt-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">Rate Limits — Current Hour</h3>
            <div className="space-y-3">
              {[
                { label: "UI Actions", used: 47, max: 200 },
                { label: "Driver Reassignments", used: 0, max: 5 },
                { label: "API Calls", used: 234, max: 1000 },
                { label: "Notifications Sent", used: 12, max: 50 },
              ].map((rl) => (
                <div key={rl.label}>
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className="text-muted-foreground">{rl.label}</span>
                    <span className={rl.used / rl.max > 0.8 ? "text-severity-high" : "text-foreground"}>
                      {rl.used}/{rl.max}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        rl.used / rl.max > 0.8 ? "bg-severity-high" : "bg-primary"
                      }`}
                      style={{ width: `${(rl.used / rl.max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "approvals" && (
        <div className="space-y-3">
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="bg-secondary/50 text-muted-foreground">
                  <th className="text-left p-3 font-medium">Severity</th>
                  <th className="text-left p-3 font-medium">Approval Rule</th>
                  <th className="text-left p-3 font-medium w-20">Edit</th>
                </tr>
              </thead>
              <tbody>
                {approvalRules.map((ar) => (
                  <tr key={ar.severity} className="border-t border-border">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <ar.icon className={`w-3 h-3 ${
                          ar.severity === "Critical" ? "text-severity-critical" :
                          ar.severity === "High" ? "text-severity-high" :
                          ar.severity === "Medium" ? "text-severity-medium" :
                          "text-severity-low"
                        }`} />
                        <span className="font-bold">{ar.severity}</span>
                      </div>
                    </td>
                    <td className="p-3 text-foreground">{ar.rule}</td>
                    <td className="p-3">
                      <button className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                        <Settings className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Automations;
