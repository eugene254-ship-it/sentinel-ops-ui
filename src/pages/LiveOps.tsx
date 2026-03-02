import { mockIncidents, mockKPIs } from "@/data/mockData";
import { IncidentCard } from "@/components/IncidentCard";
import { KPIBar } from "@/components/KPIBar";
import { AutonomySwitch } from "@/components/AutonomySwitch";

const eventStream = [
  { ts: "14:23:16", type: "action", msg: "Nova Act: Reassigning driver D-441 → Zone 12" },
  { ts: "14:23:14", type: "action", msg: "Nova Act: Opened zone management panel" },
  { ts: "14:23:11", type: "action", msg: "Nova Act: Logged into Dispatch Dashboard" },
  { ts: "14:23:09", type: "decision", msg: "Plan selected: Reassign 3 drivers from Zone 8" },
  { ts: "14:23:08", type: "alert", msg: "SLA breach imminent: 3 shipments at T-12min" },
  { ts: "14:23:07", type: "detection", msg: "Anomaly detected: Delay spike NE corridor (4.2σ)" },
  { ts: "14:22:58", type: "event", msg: "Weather advisory issued: NE-7 ice warning" },
  { ts: "14:22:51", type: "event", msg: "Complaint spike: 12 new in 5min (NE corridor)" },
  { ts: "14:22:45", type: "event", msg: "Shipment delay reported: NE-7 avg +47min" },
];

const streamColors: Record<string, string> = {
  action: "text-primary",
  decision: "text-severity-ok",
  alert: "text-severity-critical",
  detection: "text-severity-high",
  event: "text-muted-foreground",
};

const LiveOps = () => {
  return (
    <div className="p-4 space-y-4 ops-grid min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground tracking-tight">Live Operations</h1>
          <p className="text-xs font-mono text-muted-foreground">Real-time detection & execution status</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-severity-ok animate-pulse-dot" />
          <span className="text-xs font-mono text-muted-foreground">STREAMING</span>
        </div>
      </div>

      {/* KPIs */}
      <KPIBar kpis={mockKPIs} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Incidents */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Active Incidents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {mockIncidents.map((inc) => (
              <IncidentCard key={inc.id} incident={inc} />
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <AutonomySwitch />

          {/* Event stream */}
          <div className="rounded-lg border border-border bg-card">
            <div className="p-3 border-b border-border">
              <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">What Changed?</h3>
            </div>
            <div className="p-2 max-h-80 overflow-auto">
              <div className="space-y-0.5">
                {eventStream.map((evt, i) => (
                  <div key={i} className="flex gap-2 py-1 text-[11px] font-mono animate-slide-in" style={{ animationDelay: `${i * 50}ms` }}>
                    <span className="text-muted-foreground flex-shrink-0">{evt.ts}</span>
                    <span className={streamColors[evt.type]}>{evt.msg}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveOps;
