import { useState } from "react";
import { Network, Database, Radio, AlertTriangle, ChevronRight, ExternalLink } from "lucide-react";

interface SystemNode {
  id: string;
  name: string;
  type: "service" | "datasource" | "external";
  status: "healthy" | "degraded" | "down";
  metrics?: string;
}

interface DependencyEdge {
  from: string;
  to: string;
  label: string;
  health: "healthy" | "degraded" | "down";
}

const systems: SystemNode[] = [
  { id: "dispatch", name: "Dispatch Dashboard", type: "service", status: "healthy", metrics: "Latency: 120ms" },
  { id: "shipment-api", name: "Shipment API", type: "service", status: "degraded", metrics: "Error rate: 2.3%" },
  { id: "crm", name: "CRM Platform", type: "service", status: "down", metrics: "Last sync: 47min ago" },
  { id: "fleet", name: "Fleet Management", type: "service", status: "healthy", metrics: "15 vehicles tracked" },
  { id: "weather", name: "Weather API", type: "external", status: "healthy", metrics: "Advisory: active" },
  { id: "shipment-stream", name: "Shipment Event Stream", type: "datasource", status: "degraded", metrics: "847 events/min" },
  { id: "complaint-webhook", name: "Complaint Webhook", type: "datasource", status: "healthy", metrics: "12 in last 5min" },
  { id: "driver-telemetry", name: "Driver Telemetry", type: "datasource", status: "healthy", metrics: "Real-time GPS" },
  { id: "cloudwatch", name: "CloudWatch Logs", type: "datasource", status: "healthy", metrics: "3 log groups" },
  { id: "billing", name: "Billing System", type: "service", status: "healthy", metrics: "No issues" },
];

const edges: DependencyEdge[] = [
  { from: "shipment-api", to: "dispatch", label: "Route assignments", health: "degraded" },
  { from: "shipment-stream", to: "shipment-api", label: "Event ingestion", health: "degraded" },
  { from: "crm", to: "complaint-webhook", label: "Complaint sync", health: "down" },
  { from: "driver-telemetry", to: "dispatch", label: "Live positions", health: "healthy" },
  { from: "weather", to: "shipment-api", label: "Route conditions", health: "healthy" },
  { from: "fleet", to: "driver-telemetry", label: "Vehicle data", health: "healthy" },
  { from: "cloudwatch", to: "shipment-api", label: "Metrics & logs", health: "healthy" },
  { from: "dispatch", to: "crm", label: "Status updates", health: "down" },
  { from: "billing", to: "crm", label: "Invoice data", health: "down" },
];

const statusConfig = {
  healthy: { bg: "bg-severity-ok/10", border: "border-severity-ok/30", dot: "bg-severity-ok", text: "text-severity-ok" },
  degraded: { bg: "bg-severity-medium/10", border: "border-severity-medium/30", dot: "bg-severity-medium", text: "text-severity-medium" },
  down: { bg: "bg-severity-critical/10", border: "border-severity-critical/30", dot: "bg-severity-critical", text: "text-severity-critical" },
};

const typeIcons = {
  service: Network,
  datasource: Database,
  external: ExternalLink,
};

const SystemsMap = () => {
  const [selected, setSelected] = useState<string | null>("crm");

  const selectedSystem = systems.find((s) => s.id === selected);
  const relatedEdges = edges.filter((e) => e.from === selected || e.to === selected);
  const affectedSystems = new Set(relatedEdges.flatMap((e) => [e.from, e.to]));

  return (
    <div className="p-4 space-y-4">
      <div>
        <h1 className="text-lg font-bold text-foreground">Systems Map</h1>
        <p className="text-xs font-mono text-muted-foreground">Service dependencies & correlation topology</p>
      </div>

      {/* Status summary */}
      <div className="flex gap-4 text-xs font-mono">
        {(["healthy", "degraded", "down"] as const).map((status) => {
          const count = systems.filter((s) => s.status === status).length;
          const cfg = statusConfig[status];
          return (
            <div key={status} className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
              <span className={cfg.text}>{count} {status}</span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Dependency graph visualization */}
        <div className="lg:col-span-2">
          {/* Visual graph as node cards with connections */}
          <div className="rounded-lg border border-border bg-card p-4 ops-grid min-h-[500px]">
            <div className="grid grid-cols-3 gap-3">
              {/* Services column */}
              <div className="space-y-2">
                <h3 className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2">Services</h3>
                {systems.filter((s) => s.type === "service").map((sys) => {
                  const cfg = statusConfig[sys.status];
                  const Icon = typeIcons[sys.type];
                  const isSelected = selected === sys.id;
                  const isAffected = affectedSystems.has(sys.id);
                  return (
                    <div
                      key={sys.id}
                      onClick={() => setSelected(sys.id)}
                      className={`rounded-lg border p-3 cursor-pointer transition-all ${
                        isSelected
                          ? `${cfg.border} ${cfg.bg} ring-1 ring-primary/30`
                          : isAffected
                          ? `${cfg.border} ${cfg.bg} opacity-90`
                          : "border-border bg-surface-2 opacity-60 hover:opacity-80"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-2 h-2 rounded-full ${cfg.dot} ${sys.status !== "healthy" ? "animate-pulse-dot" : ""}`} />
                        <Icon className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs font-semibold text-foreground truncate">{sys.name}</span>
                      </div>
                      {sys.metrics && (
                        <span className={`text-[10px] font-mono ${cfg.text}`}>{sys.metrics}</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Data sources column */}
              <div className="space-y-2">
                <h3 className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2">Data Sources</h3>
                {systems.filter((s) => s.type === "datasource").map((sys) => {
                  const cfg = statusConfig[sys.status];
                  const Icon = typeIcons[sys.type];
                  const isSelected = selected === sys.id;
                  const isAffected = affectedSystems.has(sys.id);
                  return (
                    <div
                      key={sys.id}
                      onClick={() => setSelected(sys.id)}
                      className={`rounded-lg border p-3 cursor-pointer transition-all ${
                        isSelected
                          ? `${cfg.border} ${cfg.bg} ring-1 ring-primary/30`
                          : isAffected
                          ? `${cfg.border} ${cfg.bg} opacity-90`
                          : "border-border bg-surface-2 opacity-60 hover:opacity-80"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                        <Icon className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs font-semibold text-foreground truncate">{sys.name}</span>
                      </div>
                      {sys.metrics && (
                        <span className={`text-[10px] font-mono ${cfg.text}`}>{sys.metrics}</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* External column */}
              <div className="space-y-2">
                <h3 className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2">External</h3>
                {systems.filter((s) => s.type === "external").map((sys) => {
                  const cfg = statusConfig[sys.status];
                  const Icon = typeIcons[sys.type];
                  const isSelected = selected === sys.id;
                  const isAffected = affectedSystems.has(sys.id);
                  return (
                    <div
                      key={sys.id}
                      onClick={() => setSelected(sys.id)}
                      className={`rounded-lg border p-3 cursor-pointer transition-all ${
                        isSelected
                          ? `${cfg.border} ${cfg.bg} ring-1 ring-primary/30`
                          : isAffected
                          ? `${cfg.border} ${cfg.bg} opacity-90`
                          : "border-border bg-surface-2 opacity-60 hover:opacity-80"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                        <Icon className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs font-semibold text-foreground truncate">{sys.name}</span>
                      </div>
                      {sys.metrics && (
                        <span className={`text-[10px] font-mono ${cfg.text}`}>{sys.metrics}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Detail panel */}
        <div className="space-y-3">
          {selectedSystem && (
            <>
              <div className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-3 h-3 rounded-full ${statusConfig[selectedSystem.status].dot}`} />
                  <h3 className="text-sm font-semibold text-foreground">{selectedSystem.name}</h3>
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span className="text-foreground capitalize">{selectedSystem.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className={statusConfig[selectedSystem.status].text}>{selectedSystem.status}</span>
                  </div>
                  {selectedSystem.metrics && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Metrics</span>
                      <span className="text-foreground">{selectedSystem.metrics}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-4">
                <h3 className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2">
                  Dependencies ({relatedEdges.length})
                </h3>
                <div className="space-y-2">
                  {relatedEdges.map((edge, i) => {
                    const cfg = statusConfig[edge.health];
                    const otherSystem = systems.find((s) => s.id === (edge.from === selected ? edge.to : edge.from));
                    return (
                      <div key={i} className={`rounded p-2 border ${cfg.border} ${cfg.bg}`}>
                        <div className="flex items-center gap-1.5 text-xs font-mono">
                          <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          <span className="text-foreground">{otherSystem?.name}</span>
                          <span className="text-muted-foreground">
                            {edge.from === selected ? "→" : "←"}
                          </span>
                        </div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">{edge.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Active incidents on this system */}
              {selectedSystem.status !== "healthy" && (
                <div className="rounded-lg border border-severity-critical/20 bg-severity-critical/5 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-3 h-3 text-severity-critical" />
                    <span className="text-xs font-mono text-severity-critical">Active Incident</span>
                  </div>
                  <p className="text-xs text-foreground">
                    {selectedSystem.id === "crm"
                      ? "CRM Sync Failure — Portal showing stale data"
                      : "Degraded performance detected"}
                  </p>
                  <button className="flex items-center gap-1 mt-2 text-[10px] font-mono text-primary hover:underline">
                    View Run <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemsMap;
