import { Incident } from "@/types/sentinel";
import { AlertTriangle, Clock, ChevronRight, Eye, Zap, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const severityConfig = {
  critical: { bg: "bg-severity-critical/10", border: "border-severity-critical/30", text: "text-severity-critical", dot: "bg-severity-critical" },
  high: { bg: "bg-severity-high/10", border: "border-severity-high/30", text: "text-severity-high", dot: "bg-severity-high" },
  medium: { bg: "bg-severity-medium/10", border: "border-severity-medium/30", text: "text-severity-medium", dot: "bg-severity-medium" },
  low: { bg: "bg-severity-low/10", border: "border-severity-low/30", text: "text-severity-low", dot: "bg-severity-low" },
  ok: { bg: "bg-severity-ok/10", border: "border-severity-ok/30", text: "text-severity-ok", dot: "bg-severity-ok" },
};

const statusIcons = {
  observing: Eye,
  suggesting: Zap,
  acting: Play,
  completed: Zap,
  detecting: Eye,
  diagnosing: Eye,
  planning: Zap,
  communicating: Zap,
  verifying: Eye,
  failed: AlertTriangle,
  running: Play,
};

function useLiveCountdown(deadline: Date) {
  const [text, setText] = useState("");

  useEffect(() => {
    const tick = () => {
      const diff = deadline.getTime() - Date.now();
      if (diff < 0) { setText("BREACHED"); return; }
      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      if (mins < 60) setText(`${mins}m ${secs}s`);
      else setText(`${Math.floor(mins / 60)}h ${mins % 60}m`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [deadline]);

  return text;
}

export function IncidentCard({ incident }: { incident: Incident }) {
  const navigate = useNavigate();
  const sev = severityConfig[incident.severity];
  const slaText = useLiveCountdown(incident.slaDeadline);
  const isBreached = slaText === "BREACHED";
  const StatusIcon = statusIcons[incident.status] || Eye;

  return (
    <div
      className={`rounded-lg border ${sev.border} ${sev.bg} p-4 cursor-pointer hover:brightness-110 transition-all duration-200 group hover:scale-[1.01]`}
      onClick={() => navigate(`/runs/${incident.runId}`)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${sev.dot} ${incident.status === "acting" ? "animate-pulse-dot" : ""}`} />
          <span className={`text-xs font-mono font-bold uppercase ${sev.text}`}>{incident.severity}</span>
          <span className="text-xs font-mono text-muted-foreground">{incident.id}</span>
        </div>
        <div className={`flex items-center gap-1 text-xs font-mono tabular-nums ${isBreached ? "text-severity-critical font-bold animate-pulse-dot" : "text-muted-foreground"}`}>
          <Clock className="w-3 h-3" />
          <span>SLA {slaText}</span>
        </div>
      </div>

      <h3 className="text-sm font-semibold text-foreground mb-2">{incident.title}</h3>

      <div className="space-y-2 mb-3">
        <div className="flex flex-wrap gap-1">
          {incident.symptoms.map((s, i) => (
            <span key={i} className="text-[11px] px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground font-mono">
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <StatusIcon className="w-3 h-3" />
            <span className="capitalize font-mono">{incident.status}</span>
          </div>
          <span className="text-xs font-mono text-muted-foreground">
            {incident.confidence}% conf
          </span>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
      </div>
    </div>
  );
}
