import { useState } from "react";
import {
  Shield, Download, Search, FileText, Image, Camera, CheckCircle,
  Circle, AlertTriangle, Clock, Filter,
} from "lucide-react";

const auditLog = [
  { ts: "14:23:16.778", actor: "SentinelOS-Primary", action: "UI_ACTION", detail: "Reassigned driver D-441 → Zone 12", run: "RUN-1192", severity: "high" as const, hash: "a3f2c9" },
  { ts: "14:23:14.334", actor: "SentinelOS-Primary", action: "UI_ACTION", detail: "Opened zone management panel", run: "RUN-1192", severity: "low" as const, hash: "b7d1e4" },
  { ts: "14:23:11.890", actor: "SentinelOS-Primary", action: "UI_ACTION", detail: "Logged into Dispatch Dashboard", run: "RUN-1192", severity: "low" as const, hash: "c2f8a1" },
  { ts: "14:23:10.112", actor: "SentinelOS-Primary", action: "PLAN_GENERATED", detail: "Action plan: reassign 3 drivers from Zone 8", run: "RUN-1192", severity: "medium" as const, hash: "d5e3b7" },
  { ts: "14:23:08.201", actor: "SentinelOS-Primary", action: "ALERT_TRIGGERED", detail: "SLA breach imminent: 3 shipments at T-12min", run: "RUN-1192", severity: "critical" as const, hash: "e1f4c9" },
  { ts: "14:23:07.112", actor: "SentinelOS-Primary", action: "ANOMALY_DETECTED", detail: "Delay spike NE corridor — z-score 4.2σ", run: "RUN-1192", severity: "critical" as const, hash: "f8a2d6" },
  { ts: "14:15:22.000", actor: "SentinelOS-Primary", action: "VOICE_CALL", detail: "Outbound call to Mike Chen — Ops Manager", run: "RUN-1192", severity: "medium" as const, hash: "g3b5e1" },
  { ts: "14:16:10.000", actor: "Mike Chen", action: "CONSTRAINT_SET", detail: "Do not reassign driver 12", run: "RUN-1192", severity: "high" as const, hash: "h7c9f2" },
  { ts: "13:48:07.000", actor: "Sarah Lin", action: "INBOUND_CALL", detail: "Reported manual override on zone 4", run: "RUN-1190", severity: "medium" as const, hash: "i4d1a8" },
  { ts: "12:30:15.000", actor: "SentinelOS-Primary", action: "COMPLIANCE_CHECK", detail: "Monthly safety audit — 2 vehicles scheduled", run: "RUN-1189", severity: "low" as const, hash: "j9e6b3" },
];

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

const sevColors: Record<string, string> = {
  critical: "text-severity-critical",
  high: "text-severity-high",
  medium: "text-severity-medium",
  low: "text-muted-foreground",
};

const attachIcons: Record<string, typeof FileText> = {
  screenshot: Image,
  html_diff: FileText,
  transcript: FileText,
  data: FileText,
};

const Audit = () => {
  const [activeTab, setActiveTab] = useState<"log" | "evidence" | "export" | "controls">("log");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLogs = auditLog.filter(
    (l) =>
      l.detail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.actor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">Audit & Compliance</h1>
          <p className="text-xs font-mono text-muted-foreground">Immutable event log, evidence, and controls</p>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-severity-ok" />
          <span className="text-xs font-mono text-severity-ok">7/8 controls passing</span>
        </div>
      </div>

      <div className="flex gap-1 border-b border-border">
        {(["log", "evidence", "export", "controls"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-mono capitalize border-b-2 transition-colors ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "controls" ? "SOC2 Controls" : tab}
          </button>
        ))}
      </div>

      {activeTab === "log" && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded bg-secondary border border-border text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <button className="flex items-center gap-1 px-2 py-1.5 rounded text-xs font-mono text-muted-foreground hover:text-foreground bg-secondary border border-border">
              <Filter className="w-3 h-3" />
              Filter
            </button>
          </div>

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
                {filteredLogs.map((log, i) => (
                  <tr key={i} className="border-t border-border hover:bg-secondary/20 transition-colors">
                    <td className="p-2 text-muted-foreground whitespace-nowrap">{log.ts}</td>
                    <td className="p-2 text-foreground">{log.actor}</td>
                    <td className="p-2">
                      <span className={sevColors[log.severity]}>{log.action}</span>
                    </td>
                    <td className="p-2 text-foreground max-w-xs truncate">{log.detail}</td>
                    <td className="p-2 text-primary">{log.run}</td>
                    <td className="p-2 text-muted-foreground/60">{log.hash}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
            <Shield className="w-3 h-3" />
            <span>All entries cryptographically hashed. Tamper-evident chain active.</span>
          </div>
        </div>
      )}

      {activeTab === "evidence" && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {attachments.map((att, i) => {
              const Icon = attachIcons[att.type] || FileText;
              return (
                <div key={i} className="rounded-lg border border-border bg-card p-3 hover:border-primary/30 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2 mb-2">
                    {att.type === "screenshot" ? (
                      <Camera className="w-4 h-4 text-primary" />
                    ) : (
                      <Icon className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className="text-xs font-semibold text-foreground truncate">{att.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground">
                    <span>{att.size}</span>
                    <span>{att.run}</span>
                    <span>{att.ts}</span>
                  </div>
                  {att.type === "screenshot" && (
                    <div className="mt-2 h-20 rounded bg-secondary/50 border border-border flex items-center justify-center">
                      <span className="text-[9px] font-mono text-muted-foreground">Preview</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "export" && (
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Export Audit Data</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { format: "CSV", desc: "Spreadsheet-compatible audit log export", icon: FileText },
                { format: "JSON", desc: "Structured data with full metadata", icon: FileText },
                { format: "PDF", desc: "Formatted report for auditor review", icon: FileText },
              ].map((exp) => (
                <button
                  key={exp.format}
                  className="rounded-lg border border-border bg-secondary/30 p-4 hover:border-primary/30 hover:bg-primary/5 transition-colors text-left group"
                >
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
                <span className="text-muted-foreground">Date range:</span>
                <span className="text-foreground">Last 24 hours</span>
                <span className="text-muted-foreground">|</span>
                <span className="text-muted-foreground">Events:</span>
                <span className="text-foreground">{auditLog.length}</span>
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
                ) : ctrl.status === "warning" ? (
                  <AlertTriangle className="w-4 h-4 text-severity-medium" />
                ) : (
                  <Circle className="w-4 h-4 text-muted-foreground" />
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
