import { useState } from "react";
import { BarChart3, FileText, Radio, Monitor, ExternalLink } from "lucide-react";

const tabs = [
  { id: "metrics", label: "Metrics", icon: BarChart3 },
  { id: "logs", label: "Logs", icon: FileText },
  { id: "events", label: "Events", icon: Radio },
  { id: "ui-proof", label: "UI Proof", icon: Monitor },
  { id: "external", label: "External", icon: ExternalLink },
];

const mockLogs = [
  { ts: "14:23:07.112", level: "WARN", msg: "Delay z-score exceeded threshold: 4.2σ (threshold: 3.0σ)" },
  { ts: "14:23:07.445", level: "INFO", msg: "Correlation engine: 3 signals matched pattern 'delay_spike_compound'" },
  { ts: "14:23:08.201", level: "CRIT", msg: "SLA breach imminent: 3 shipments at T-12min" },
  { ts: "14:23:09.667", level: "INFO", msg: "Driver availability check: Zone 8 has 5 available, Zone 12 needs 3" },
  { ts: "14:23:10.112", level: "INFO", msg: "Action plan generated: reassign D-441, D-522, D-607 to Zone 12" },
  { ts: "14:23:11.890", level: "ACT", msg: "Nova Act: Navigating to dispatch.internal.co/dashboard" },
  { ts: "14:23:14.334", level: "ACT", msg: "Nova Act: Click #zone-management-tab" },
  { ts: "14:23:16.778", level: "ACT", msg: "Nova Act: Reassigning driver D-441 → Zone 12" },
];

const mockEvents = [
  { ts: "14:22:45", source: "Shipment API", event: "delay_reported", data: "NE-7: +47min avg" },
  { ts: "14:22:51", source: "CRM Webhook", event: "complaint_spike", data: "12 new in 5min" },
  { ts: "14:22:58", source: "Weather API", event: "advisory_issued", data: "NE corridor: ice warning" },
  { ts: "14:23:02", source: "Fleet Mgmt", event: "driver_status", data: "Zone 12: 2/8 available" },
  { ts: "14:23:05", source: "SentinelOS", event: "anomaly_detected", data: "Confidence: 94%" },
];

export function EvidencePanel() {
  const [activeTab, setActiveTab] = useState("logs");

  return (
    <div className="rounded-lg border border-border bg-card flex flex-col h-full">
      <div className="flex border-b border-border overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono whitespace-nowrap transition-colors border-b-2 ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="w-3 h-3" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-3">
        {activeTab === "logs" && (
          <div className="space-y-0.5 font-mono text-[11px]">
            {mockLogs.map((log, i) => (
              <div key={i} className="flex gap-2 py-0.5">
                <span className="text-muted-foreground flex-shrink-0">{log.ts}</span>
                <span className={`flex-shrink-0 w-10 text-right font-bold ${
                  log.level === "CRIT" ? "text-severity-critical" :
                  log.level === "WARN" ? "text-severity-high" :
                  log.level === "ACT" ? "text-primary" :
                  "text-muted-foreground"
                }`}>{log.level}</span>
                <span className="text-foreground">{log.msg}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "events" && (
          <div className="space-y-1">
            {mockEvents.map((evt, i) => (
              <div key={i} className="flex items-start gap-2 py-1 text-xs font-mono">
                <span className="text-muted-foreground flex-shrink-0">{evt.ts}</span>
                <span className="text-primary flex-shrink-0">{evt.source}</span>
                <span className="text-severity-medium flex-shrink-0">{evt.event}</span>
                <span className="text-secondary-foreground">{evt.data}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "metrics" && (
          <div className="flex items-center justify-center h-32 text-xs text-muted-foreground font-mono">
            <div className="text-center space-y-2">
              <BarChart3 className="w-8 h-8 mx-auto text-muted-foreground/40" />
              <p>Delay rate, complaint velocity, SLA countdown charts</p>
            </div>
          </div>
        )}

        {activeTab === "ui-proof" && (
          <div className="space-y-2">
            <div className="rounded bg-secondary/50 p-3 text-xs font-mono">
              <div className="text-muted-foreground mb-2">UI Automation Recording — 5 steps</div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-severity-ok">✓</span>
                  <span className="text-primary">navigate</span>
                  <span className="text-foreground">dispatch.internal.co/dashboard</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-severity-ok">✓</span>
                  <span className="text-primary">click</span>
                  <span className="text-foreground">#zone-management-tab</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-severity-medium">●</span>
                  <span className="text-primary">click</span>
                  <span className="text-foreground">button[data-driver='D-441']</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground/40">○</span>
                  <span className="text-muted-foreground">select</span>
                  <span className="text-muted-foreground">#reassign-zone → Zone 12</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground/40">○</span>
                  <span className="text-muted-foreground">click</span>
                  <span className="text-muted-foreground">#confirm-reassignment</span>
                </div>
              </div>
            </div>
            <div className="h-32 rounded bg-secondary/30 border border-border flex items-center justify-center">
              <span className="text-[10px] font-mono text-muted-foreground">Screenshot: Dispatch Dashboard — Zone Management</span>
            </div>
          </div>
        )}

        {activeTab === "external" && (
          <div className="space-y-2 text-xs font-mono">
            <div className="p-2 rounded bg-secondary/50">
              <span className="text-muted-foreground">CRM Tickets:</span>
              <span className="text-foreground ml-2">12 new complaints (NE corridor)</span>
            </div>
            <div className="p-2 rounded bg-secondary/50">
              <span className="text-muted-foreground">Shipment Status:</span>
              <span className="text-foreground ml-2">47 delayed, 3 at SLA risk</span>
            </div>
            <div className="p-2 rounded bg-secondary/50">
              <span className="text-muted-foreground">Weather:</span>
              <span className="text-severity-medium ml-2">Ice advisory — NE-7 corridor</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
