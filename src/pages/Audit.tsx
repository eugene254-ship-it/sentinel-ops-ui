import { useState, useMemo } from "react";
import {
  Shield, Download, Search, FileText, Image, Camera, CheckCircle,
  AlertTriangle, Filter, Hash, ChevronDown, ExternalLink, Lock,
} from "lucide-react";
import { useAuditLogs } from "@/hooks/useSupabaseData";

const attachments = [
  { name: "dispatch_screenshot_zone12.png", type: "screenshot", size: "342 KB", run: "RUN-1192", ts: "14:23:16" },
  { name: "driver_reassignment_diff.html", type: "html_diff", size: "18 KB", run: "RUN-1192", ts: "14:23:16" },
  { name: "delay_anomaly_chart.png", type: "screenshot", size: "128 KB", run: "RUN-1192", ts: "14:23:07" },
  { name: "voice_transcript_vc301.json", type: "transcript", size: "4 KB", run: "RUN-1192", ts: "14:16:10" },
  { name: "action_plan_analysis.json", type: "data", size: "12 KB", run: "RUN-1192", ts: "14:23:10" },
  { name: "sla_impact_projection.csv", type: "data", size: "8 KB", run: "RUN-1192", ts: "14:23:09" },
];

const soc2Checklist = [
  { control: "CC6.1", name: "Logical Access Controls", status: "pass" as const, detail: "All agent actions authenticated via service credentials" },
  { control: "CC6.2", name: "System Operations Monitoring", status: "pass" as const, detail: "Real-time anomaly detection active, 100% event coverage" },
  { control: "CC6.3", name: "Change Management", status: "pass" as const, detail: "All changes logged with immutable audit trail" },
  { control: "CC7.1", name: "Incident Response", status: "pass" as const, detail: "Automated detection → response pipeline, avg 2min MTTR" },
  { control: "CC7.2", name: "Communication Protocols", status: "pass" as const, detail: "Voice + notification protocols defined, on-call routing active" },
  { control: "CC8.1", name: "Data Integrity", status: "warning" as const, detail: "CRM sync gap detected — 47min staleness (normally <5min)" },
  { control: "CC9.1", name: "Risk Assessment", status: "pass" as const, detail: "Confidence scoring active on all detections, threshold: 85%" },
  { control: "CC9.2", name: "Policy Enforcement", status: "pass" as const, detail: "5 policies active, 0 violations, rate limits enforced" },
];

const actionColors: Record<string, string> = {
  UI_ACTION: "text-primary",
  PLAN_GENERATED: "text-severity-ok",
  ALERT_TRIGGERED: "text-severity-critical",
  ANOMALY_DETECTED: "text-severity-high",
  VOICE_CALL: "text-severity-medium",
  CONSTRAINT_SET: "text-severity-high",
  INBOUND_CALL: "text-severity-medium",
  COMPLIANCE_CHECK: "text-severity-ok",
};

const Audit = () => {
  const [activeTab, setActiveTab] = useState<"log" | "evidence" | "export" | "controls">("log");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [verifiedHash, setVerifiedHash] = useState<string | null>(null);

  const { data: auditLogs, isLoading } = useAuditLogs();

  const filteredLogs = useMemo(() => {
    if (!auditLogs) return [];
    return auditLogs.filter((l) => {
      const matchesSearch =
        (l.detail ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.actor.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesAction = actionFilter === "all" || l.action === actionFilter;
      return matchesSearch && matchesAction;
    });
  }, [auditLogs, searchQuery, actionFilter]);

  const actionTypes = useMemo(() => {
    if (!auditLogs) return [];
    return [...new Set(auditLogs.map(l => l.action))];
  }, [auditLogs]);

  const passCount = soc2Checklist.filter(c => c.status === "pass").length;

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">Audit & Compliance</h1>
          <p className="text-xs font-mono text-muted-foreground">Immutable event log, evidence, and controls</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Lock className="w-3 h-3 text-severity-ok" />
            <span className="text-[10px] font-mono text-severity-ok">TAMPER-PROOF</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-severity-ok" />
            <span className="text-xs font-mono text-severity-ok">{passCount}/{soc2Checklist.length} controls passing</span>
          </div>
        </div>
      </div>

      <div className="flex gap-1 border-b border-border">
        {(["log", "evidence", "export", "controls"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-mono capitalize border-b-2 transition-colors ${
              activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "controls" ? "SOC2 Controls" : tab}
          </button>
        ))}
      </div>

      {activeTab === "log" && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search events, actors, actions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded bg-secondary border border-border text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="relative">
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="appearance-none pl-7 pr-6 py-1.5 rounded bg-secondary border border-border text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="all">All Actions</option>
                {actionTypes.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
              <Filter className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
              <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">{filteredLogs.length} events</span>
          </div>

          {isLoading ? (
            <div className="text-xs font-mono text-muted-foreground animate-pulse">Loading audit logs...</div>
          ) : (
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full text-[11px] font-mono">
                <thead>
                  <tr className="bg-secondary/50 text-muted-foreground">
                    <th className="text-left p-2 font-medium">Timestamp</th>
                    <th className="text-left p-2 font-medium">Actor</th>
                    <th className="text-left p-2 font-medium">Action</th>
                    <th className="text-left p-2 font-medium">Detail</th>
                    <th className="text-left p-2 font-medium">Run</th>
                    <th className="text-left p-2 font-medium">Hash</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="border-t border-border hover:bg-secondary/20 transition-colors">
                      <td className="p-2 text-muted-foreground whitespace-nowrap">
                        {new Date(log.created_at).toLocaleTimeString("en-US", { hour12: false })}
                      </td>
                      <td className="p-2 text-foreground">{log.actor}</td>
                      <td className="p-2">
                        <span className={actionColors[log.action] ?? "text-foreground"}>{log.action}</span>
                      </td>
                      <td className="p-2 text-foreground max-w-xs truncate">{log.detail}</td>
                      <td className="p-2 text-primary">{log.run_id}</td>
                      <td className="p-2">
                        <button
                          onClick={() => setVerifiedHash(verifiedHash === log.hash ? null : (log.hash ?? null))}
                          className={`flex items-center gap-1 transition-colors ${
                            verifiedHash === log.hash ? "text-severity-ok" : "text-muted-foreground/60 hover:text-muted-foreground"
                          }`}
                          title="Click to verify hash"
                        >
                          <Hash className="w-2.5 h-2.5" />
                          {log.hash?.slice(0, 6)}
                          {verifiedHash === log.hash && <CheckCircle className="w-2.5 h-2.5 text-severity-ok" />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
            <Shield className="w-3 h-3" />
            <span>All entries cryptographically hashed. Tamper-evident chain active. No UPDATE or DELETE permitted.</span>
          </div>
        </div>
      )}

      {activeTab === "evidence" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {attachments.map((att, i) => (
            <div key={i} className="rounded-lg border border-border bg-card p-3 hover:border-primary/30 transition-colors cursor-pointer group">
              <div className="flex items-center gap-2 mb-2">
                {att.type === "screenshot" ? (
                  <Camera className="w-4 h-4 text-primary" />
                ) : (
                  <FileText className="w-4 h-4 text-muted-foreground" />
                )}
                <span className="text-xs font-semibold text-foreground truncate">{att.name}</span>
                <ExternalLink className="w-3 h-3 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground">
                <span>{att.size}</span>
                <span>{att.run}</span>
                <span>{att.ts}</span>
              </div>
              {att.type === "screenshot" && (
                <div className="mt-2 h-20 rounded bg-secondary/50 border border-border flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full ops-grid flex items-center justify-center">
                    <Image className="w-5 h-5 text-muted-foreground/30" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === "export" && (
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Export Audit Data</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { format: "CSV", desc: "Spreadsheet-compatible audit log export" },
                { format: "JSON", desc: "Structured data with full metadata" },
                { format: "PDF", desc: "Formatted report for auditor review" },
              ].map((exp) => (
                <button key={exp.format} className="rounded-lg border border-border bg-secondary/30 p-4 hover:border-primary/30 hover:bg-primary/5 transition-colors text-left group">
                  <div className="flex items-center gap-2 mb-2">
                    <Download className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-sm font-bold font-mono text-foreground">{exp.format}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{exp.desc}</p>
                </button>
              ))}
            </div>
            <div className="mt-4 p-3 rounded bg-secondary/50 border border-border">
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-muted-foreground">Events:</span>
                <span className="text-foreground">{auditLogs?.length ?? 0}</span>
                <span className="text-muted-foreground">|</span>
                <span className="text-muted-foreground">Attachments:</span>
                <span className="text-foreground">{attachments.length}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "controls" && (
        <div className="space-y-2">
          {soc2Checklist.map((ctrl) => (
            <div
              key={ctrl.control}
              className={`rounded-lg border bg-card p-3 flex items-start gap-3 ${
                ctrl.status === "warning" ? "border-severity-medium/30" : "border-border"
              }`}
            >
              <div className="mt-0.5">
                {ctrl.status === "pass" ? (
                  <CheckCircle className="w-4 h-4 text-severity-ok" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-severity-medium" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-muted-foreground">{ctrl.control}</span>
                  <span className="text-sm font-semibold text-foreground">{ctrl.name}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{ctrl.detail}</p>
              </div>
              <span className={`text-[10px] font-mono uppercase font-bold ${
                ctrl.status === "pass" ? "text-severity-ok" : "text-severity-medium"
              }`}>
                {ctrl.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Audit;
