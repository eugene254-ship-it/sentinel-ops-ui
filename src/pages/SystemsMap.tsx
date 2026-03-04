import { useState, useEffect, useMemo } from "react";
import { Network, Database, ExternalLink, AlertTriangle, ChevronRight, Radio } from "lucide-react";

interface SystemNode {
  id: string;
  name: string;
  type: "service" | "datasource" | "external";
  status: "healthy" | "degraded" | "down";
  metrics?: string;
  x: number;
  y: number;
}

interface DependencyEdge {
  from: string;
  to: string;
  label: string;
  health: "healthy" | "degraded" | "down";
}

const systems: SystemNode[] = [
  { id: "sentinel", name: "SentinelOS Core", type: "service", status: "healthy", metrics: "Uptime: 99.97%", x: 400, y: 60 },
  { id: "dispatch", name: "Dispatch Dashboard", type: "service", status: "healthy", metrics: "Latency: 120ms", x: 180, y: 180 },
  { id: "shipment-api", name: "Shipment API", type: "service", status: "degraded", metrics: "Error rate: 2.3%", x: 620, y: 180 },
  { id: "crm", name: "CRM Platform", type: "service", status: "down", metrics: "Last sync: 47min ago", x: 400, y: 300 },
  { id: "fleet", name: "Fleet Management", type: "service", status: "healthy", metrics: "15 vehicles tracked", x: 100, y: 340 },
  { id: "billing", name: "Billing System", type: "service", status: "healthy", metrics: "No issues", x: 620, y: 380 },
  { id: "weather", name: "Weather API", type: "external", status: "healthy", metrics: "Advisory: active", x: 750, y: 60 },
  { id: "shipment-stream", name: "Shipment Events", type: "datasource", status: "degraded", metrics: "847 evt/min", x: 750, y: 280 },
  { id: "complaint-webhook", name: "Complaint Webhook", type: "datasource", status: "healthy", metrics: "12 in 5min", x: 250, y: 430 },
  { id: "driver-telemetry", name: "Driver Telemetry", type: "datasource", status: "healthy", metrics: "Real-time GPS", x: 50, y: 200 },
  { id: "cloudwatch", name: "CloudWatch Logs", type: "datasource", status: "healthy", metrics: "3 log groups", x: 500, y: 460 },
];

const edges: DependencyEdge[] = [
  { from: "sentinel", to: "dispatch", label: "Commands", health: "healthy" },
  { from: "sentinel", to: "shipment-api", label: "Queries", health: "degraded" },
  { from: "sentinel", to: "crm", label: "Sync", health: "down" },
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
  healthy: { dot: "fill-[hsl(var(--severity-ok))]", stroke: "stroke-[hsl(var(--severity-ok))]", text: "text-severity-ok", bg: "bg-severity-ok/10", border: "border-severity-ok/30" },
  degraded: { dot: "fill-[hsl(var(--severity-medium))]", stroke: "stroke-[hsl(var(--severity-medium))]", text: "text-severity-medium", bg: "bg-severity-medium/10", border: "border-severity-medium/30" },
  down: { dot: "fill-[hsl(var(--severity-critical))]", stroke: "stroke-[hsl(var(--severity-critical))]", text: "text-severity-critical", bg: "bg-severity-critical/10", border: "border-severity-critical/30" },
};

const edgeColors: Record<string, string> = {
  healthy: "hsl(142, 71%, 45%)",
  degraded: "hsl(45, 93%, 47%)",
  down: "hsl(0, 72%, 51%)",
};

const typeIcons = { service: Network, datasource: Database, external: ExternalLink };

// Animated SVG edge with flowing particles
function AnimatedEdge({ from, to, health, selected }: { from: SystemNode; to: SystemNode; health: string; selected: boolean }) {
  const color = edgeColors[health] || edgeColors.healthy;
  const opacity = selected ? 1 : 0.3;
  return (
    <g opacity={opacity}>
      <line
        x1={from.x + 50} y1={from.y + 20}
        x2={to.x + 50} y2={to.y + 20}
        stroke={color} strokeWidth={selected ? 2 : 1} strokeDasharray={health === "down" ? "6 4" : "none"}
      />
      {health !== "down" && selected && (
        <>
          <circle r="3" fill={color}>
            <animateMotion dur="2s" repeatCount="indefinite" path={`M${from.x + 50},${from.y + 20} L${to.x + 50},${to.y + 20}`} />
          </circle>
          <circle r="3" fill={color} opacity="0.5">
            <animateMotion dur="2s" begin="1s" repeatCount="indefinite" path={`M${from.x + 50},${from.y + 20} L${to.x + 50},${to.y + 20}`} />
          </circle>
        </>
      )}
    </g>
  );
}

const SystemsMap = () => {
  const [selected, setSelected] = useState<string | null>("crm");
  const [pulsePhase, setPulsePhase] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setPulsePhase(p => p + 1), 2000);
    return () => clearInterval(id);
  }, []);

  const selectedSystem = systems.find((s) => s.id === selected);
  const relatedEdges = edges.filter((e) => e.from === selected || e.to === selected);
  const affectedIds = new Set(relatedEdges.flatMap((e) => [e.from, e.to]));

  const healthCounts = useMemo(() => ({
    healthy: systems.filter(s => s.status === "healthy").length,
    degraded: systems.filter(s => s.status === "degraded").length,
    down: systems.filter(s => s.status === "down").length,
  }), []);

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">Systems Map</h1>
          <p className="text-xs font-mono text-muted-foreground">Service dependencies & correlation topology</p>
        </div>
        <div className="flex gap-4 text-xs font-mono">
          {(["healthy", "degraded", "down"] as const).map((status) => (
            <div key={status} className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${status === "healthy" ? "bg-severity-ok" : status === "degraded" ? "bg-severity-medium" : "bg-severity-critical"} ${status !== "healthy" ? "animate-pulse-dot" : ""}`} />
              <span className={statusConfig[status].text}>{healthCounts[status]} {status}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Interactive SVG Graph */}
        <div className="lg:col-span-3 rounded-lg border border-border bg-card ops-grid overflow-hidden">
          <svg viewBox="0 0 850 520" className="w-full h-auto" style={{ minHeight: 480 }}>
            {/* Edges */}
            {edges.map((edge) => {
              const fromNode = systems.find(s => s.id === edge.from)!;
              const toNode = systems.find(s => s.id === edge.to)!;
              const isRelated = affectedIds.has(edge.from) && affectedIds.has(edge.to) &&
                relatedEdges.some(re => (re.from === edge.from && re.to === edge.to) || (re.to === edge.from && re.from === edge.to));
              return <AnimatedEdge key={`${edge.from}-${edge.to}`} from={fromNode} to={toNode} health={edge.health} selected={isRelated || !selected} />;
            })}

            {/* Nodes */}
            {systems.map((sys) => {
              const cfg = statusConfig[sys.status];
              const isSelected = selected === sys.id;
              const isAffected = affectedIds.has(sys.id);
              const opacity = !selected ? 1 : isSelected ? 1 : isAffected ? 0.85 : 0.35;
              const _Icon = typeIcons[sys.type];

              return (
                <g key={sys.id} onClick={() => setSelected(sys.id === selected ? null : sys.id)} className="cursor-pointer" opacity={opacity}>
                  {/* Glow for unhealthy */}
                  {sys.status !== "healthy" && (
                    <circle cx={sys.x + 50} cy={sys.y + 20} r={isSelected ? 45 : 35} fill={edgeColors[sys.status]} opacity={0.08 + (pulsePhase % 2) * 0.04} />
                  )}
                  {/* Node box */}
                  <rect
                    x={sys.x} y={sys.y} width={100} height={40} rx={8}
                    fill={isSelected ? "hsl(220, 18%, 14%)" : "hsl(220, 18%, 10%)"}
                    stroke={isSelected ? edgeColors[sys.status] || "hsl(199, 89%, 48%)" : "hsl(220, 13%, 18%)"}
                    strokeWidth={isSelected ? 2 : 1}
                  />
                  {/* Status dot */}
                  <circle cx={sys.x + 14} cy={sys.y + 20} r={4} className={cfg.dot}>
                    {sys.status !== "healthy" && <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />}
                  </circle>
                  {/* Name */}
                  <text x={sys.x + 24} y={sys.y + 17} fill="hsl(210, 20%, 92%)" fontSize="9" fontFamily="'Inter', sans-serif" fontWeight="600">
                    {sys.name.length > 14 ? sys.name.slice(0, 14) + "…" : sys.name}
                  </text>
                  {/* Metric */}
                  <text x={sys.x + 24} y={sys.y + 30} fill="hsl(215, 15%, 52%)" fontSize="7.5" fontFamily="'JetBrains Mono', monospace">
                    {sys.metrics}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Detail panel */}
        <div className="space-y-3">
          {selectedSystem ? (
            <>
              <div className={`rounded-lg border p-4 ${statusConfig[selectedSystem.status].border} ${statusConfig[selectedSystem.status].bg}`}>
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-3 h-3 rounded-full ${selectedSystem.status === "healthy" ? "bg-severity-ok" : selectedSystem.status === "degraded" ? "bg-severity-medium" : "bg-severity-critical"} ${selectedSystem.status !== "healthy" ? "animate-pulse-dot" : ""}`} />
                  <h3 className="text-sm font-semibold text-foreground">{selectedSystem.name}</h3>
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span className="text-foreground capitalize">{selectedSystem.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className={statusConfig[selectedSystem.status].text}>{selectedSystem.status.toUpperCase()}</span>
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
                    const ecfg = statusConfig[edge.health];
                    const other = systems.find((s) => s.id === (edge.from === selected ? edge.to : edge.from));
                    return (
                      <div key={i} className={`rounded p-2 border ${ecfg.border} ${ecfg.bg} cursor-pointer hover:opacity-90`} onClick={() => setSelected(other?.id ?? null)}>
                        <div className="flex items-center gap-1.5 text-xs font-mono">
                          <div className={`w-1.5 h-1.5 rounded-full ${edge.health === "healthy" ? "bg-severity-ok" : edge.health === "degraded" ? "bg-severity-medium" : "bg-severity-critical"}`} />
                          <span className="text-foreground">{other?.name}</span>
                          <span className="text-muted-foreground ml-auto">{edge.from === selected ? "→" : "←"}</span>
                        </div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">{edge.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {selectedSystem.status !== "healthy" && (
                <div className="rounded-lg border border-severity-critical/20 bg-severity-critical/5 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-3 h-3 text-severity-critical" />
                    <span className="text-xs font-mono text-severity-critical">Active Incident</span>
                  </div>
                  <p className="text-xs text-foreground">
                    {selectedSystem.id === "crm" ? "CRM Sync Failure — Portal showing stale data"
                      : selectedSystem.id === "shipment-api" ? "Degraded — Error rate elevated at 2.3%"
                      : "Performance degradation detected"}
                  </p>
                  <button className="flex items-center gap-1 mt-2 text-[10px] font-mono text-primary hover:underline">
                    View Run <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <Radio className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
              <p className="text-xs font-mono text-muted-foreground">Select a node to inspect</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemsMap;
