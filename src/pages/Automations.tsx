import { useState } from "react";
import {
  Zap, Shield, Users, Clock, ChevronRight, AlertTriangle,
  Play, Pause, Plus, Settings, Lock, X, Check,
} from "lucide-react";

const playbooks = [
  {
    id: "PB-001", name: "Delay Spike Response",
    description: "Detect delay anomalies, reassign drivers, reroute shipments, notify stakeholders",
    system: "Dispatch", autonomy: "act" as const,
    triggers: ["Delay z-score > 3.0σ", "SLA breach T-30min"],
    actions: ["Reassign drivers from adjacent zones", "Reroute affected shipments", "Notify ops manager via voice call"],
    lastRun: "14 min ago", runs24h: 3, status: "active" as const,
  },
  {
    id: "PB-002", name: "CRM Sync Recovery",
    description: "Detect sync failures, attempt retry, escalate if persistent, notify affected users",
    system: "CRM", autonomy: "suggest" as const,
    triggers: ["Sync gap > 15min", "Error rate > 5%"],
    actions: ["Retry sync with exponential backoff", "Queue failed records", "Escalate to engineering after 3 failures"],
    lastRun: "47 min ago", runs24h: 1, status: "active" as const,
  },
  {
    id: "PB-003", name: "Fleet Compliance Check",
    description: "Monitor vehicle inspection schedules, auto-schedule overdue, notify fleet manager",
    system: "Fleet", autonomy: "act" as const,
    triggers: ["Inspection overdue", "Monthly audit schedule"],
    actions: ["Schedule inspection appointment", "Update compliance records", "Notify fleet manager"],
    lastRun: "3 hours ago", runs24h: 2, status: "active" as const,
  },
  {
    id: "PB-004", name: "Customer Escalation Handler",
    description: "Detect complaint velocity spikes, prioritize responses, escalate to senior ops",
    system: "CRM", autonomy: "observe" as const,
    triggers: ["Complaint rate > 200% baseline"],
    actions: ["Classify complaints by urgency", "Assign to available agents", "Notify senior ops if P1"],
    lastRun: "Never", runs24h: 0, status: "draft" as const,
  },
];

const policies = [
  { id: "POL-001", name: "Driver Reassignment Limit", rule: "Max 5 driver reassignments per hour per zone", current: "0/5 used", status: "enforced" },
  { id: "POL-002", name: "Customer Notification Gate", rule: "Bulk notifications (>20 recipients) require human approval", current: "Approval pending: 47 notifications", status: "blocking" },
  { id: "POL-003", name: "UI Automation Rate Limit", rule: "Max 200 UI actions per hour across all agents", current: "47/200 used", status: "enforced" },
  { id: "POL-004", name: "Forbidden: Delete Operations", rule: "Agents cannot perform DELETE actions on production databases", current: "0 violations", status: "enforced" },
  { id: "POL-005", name: "Forbidden: Payment Modifications", rule: "No automated changes to billing, invoicing, or payment systems", current: "0 violations", status: "enforced" },
];

const approvalRules = [
  { severity: "Critical", rule: "Auto-execute within guardrails, notify ops manager post-action", icon: Zap, color: "text-severity-critical" },
  { severity: "High", rule: "Auto-execute, require approval for customer-facing actions", icon: AlertTriangle, color: "text-severity-high" },
  { severity: "Medium", rule: "Suggest actions, human clicks execute", icon: Users, color: "text-severity-medium" },
  { severity: "Low", rule: "Observe and log only, suggest on request", icon: Clock, color: "text-muted-foreground" },
];

const autonomyColors = {
  act: "bg-severity-ok/10 text-severity-ok border-severity-ok/20",
  suggest: "bg-severity-medium/10 text-severity-medium border-severity-medium/20",
  observe: "bg-primary/10 text-primary border-primary/20",
};

const rateLimits = [
  { label: "UI Actions", used: 47, max: 200 },
  { label: "Driver Reassignments", used: 0, max: 5 },
  { label: "API Calls", used: 234, max: 1000 },
  { label: "Notifications Sent", used: 12, max: 50 },
];

const Automations = () => {
  const [activeTab, setActiveTab] = useState<"playbooks" | "policies" | "approvals">("playbooks");
  const [expandedPlaybook, setExpandedPlaybook] = useState<string | null>(null);
  const [showNewPlaybook, setShowNewPlaybook] = useState(false);

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">Automations</h1>
          <p className="text-xs font-mono text-muted-foreground">Playbooks, policies, and guardrails</p>
        </div>
        <button
          onClick={() => setShowNewPlaybook(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
        >
          <Plus className="w-3 h-3" />
          New Playbook
        </button>
      </div>

      <div className="flex gap-1 border-b border-border">
        {(["playbooks", "policies", "approvals"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-mono capitalize border-b-2 transition-colors ${
              activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "playbooks" && (
        <div className="space-y-3">
          {playbooks.map((pb) => {
            const isExpanded = expandedPlaybook === pb.id;
            return (
              <div
                key={pb.id}
                className={`rounded-lg border bg-card transition-all cursor-pointer ${
                  isExpanded ? "border-primary/30 ring-1 ring-primary/10" : "border-border hover:border-primary/20"
                }`}
              >
                <div className="p-4" onClick={() => setExpandedPlaybook(isExpanded ? null : pb.id)}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-primary" />
                      <span className="text-sm font-semibold text-foreground">{pb.name}</span>
                      <span className="text-[10px] font-mono text-muted-foreground">{pb.id}</span>
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
                    <ChevronRight className={`w-3 h-3 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-border p-4 space-y-3 animate-fade-in">
                    <div>
                      <h4 className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2">Action Sequence</h4>
                      <div className="space-y-1.5">
                        {pb.actions.map((action, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs">
                            <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-mono flex items-center justify-center flex-shrink-0">{i + 1}</span>
                            <span className="text-foreground">{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex items-center gap-1 px-3 py-1.5 rounded text-xs font-mono bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors">
                        <Play className="w-3 h-3" /> Run Now
                      </button>
                      <button className="flex items-center gap-1 px-3 py-1.5 rounded text-xs font-mono bg-secondary text-foreground border border-border hover:bg-secondary/80 transition-colors">
                        <Settings className="w-3 h-3" /> Configure
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "policies" && (
        <div className="space-y-3">
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
                  <span className={`text-[10px] font-mono ${pol.status === "blocking" ? "text-severity-medium" : "text-severity-ok"}`}>
                    {pol.current}
                  </span>
                  <div className={`text-[10px] font-mono uppercase mt-0.5 ${pol.status === "blocking" ? "text-severity-medium" : "text-severity-ok"}`}>
                    {pol.status}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">Rate Limits — Current Hour</h3>
            <div className="space-y-3">
              {rateLimits.map((rl) => (
                <div key={rl.label}>
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className="text-muted-foreground">{rl.label}</span>
                    <span className={rl.used / rl.max > 0.8 ? "text-severity-high" : "text-foreground"}>
                      {rl.used}/{rl.max}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${rl.used / rl.max > 0.8 ? "bg-severity-high" : "bg-primary"}`}
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
                  <tr key={ar.severity} className="border-t border-border hover:bg-secondary/20 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <ar.icon className={`w-3 h-3 ${ar.color}`} />
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

          {/* Pending Approvals */}
          <div className="rounded-lg border border-severity-medium/30 bg-severity-medium/5 p-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-severity-medium mb-3">Pending Approvals (1)</h3>
            <div className="rounded-lg border border-border bg-card p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-3 h-3 text-severity-medium" />
                  <span className="text-xs font-semibold text-foreground">Bulk Customer Notification</span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">POL-002</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">47 customers affected by NE corridor delay. Notification template: "Customer Delay Update"</p>
              <div className="flex gap-2">
                <button className="flex items-center gap-1 px-3 py-1.5 rounded text-xs font-mono bg-severity-ok/10 text-severity-ok border border-severity-ok/20 hover:bg-severity-ok/20 transition-colors">
                  <Check className="w-3 h-3" /> Approve
                </button>
                <button className="flex items-center gap-1 px-3 py-1.5 rounded text-xs font-mono bg-severity-critical/10 text-severity-critical border border-severity-critical/20 hover:bg-severity-critical/20 transition-colors">
                  <X className="w-3 h-3" /> Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Playbook Modal */}
      {showNewPlaybook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="rounded-lg border border-border bg-card p-6 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-foreground">Create Playbook</h2>
              <button onClick={() => setShowNewPlaybook(false)} className="p-1 rounded hover:bg-secondary text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Name</label>
                <input className="w-full mt-1 px-3 py-2 rounded bg-secondary border border-border text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" placeholder="e.g. Late Delivery Handler" />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Target System</label>
                <select className="w-full mt-1 px-3 py-2 rounded bg-secondary border border-border text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                  <option>Dispatch</option>
                  <option>CRM</option>
                  <option>Fleet</option>
                  <option>Billing</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Autonomy Level</label>
                <div className="flex gap-2 mt-1">
                  {(["observe", "suggest", "act"] as const).map(mode => (
                    <button key={mode} className={`px-3 py-1.5 rounded text-xs font-mono uppercase border ${autonomyColors[mode]} hover:opacity-80 transition-opacity`}>
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Trigger Condition</label>
                <input className="w-full mt-1 px-3 py-2 rounded bg-secondary border border-border text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" placeholder="e.g. Delay z-score > 3.0σ" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setShowNewPlaybook(false)} className="px-4 py-1.5 rounded text-xs font-mono bg-secondary text-foreground border border-border hover:bg-secondary/80 transition-colors">
                  Cancel
                </button>
                <button onClick={() => setShowNewPlaybook(false)} className="px-4 py-1.5 rounded text-xs font-mono bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Automations;
