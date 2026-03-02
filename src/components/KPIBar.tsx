import { KPIData } from "@/types/sentinel";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const severityColors = {
  critical: "text-severity-critical",
  high: "text-severity-high",
  medium: "text-severity-medium",
  low: "text-severity-low",
  ok: "text-severity-ok",
};

export function KPIBar({ kpis }: { kpis: KPIData[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-border rounded-lg overflow-hidden">
      {kpis.map((kpi) => {
        const TrendIcon = kpi.trend === "up" ? TrendingUp : kpi.trend === "down" ? TrendingDown : Minus;
        return (
          <div key={kpi.label} className="bg-card p-3 flex flex-col gap-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground truncate">
              {kpi.label}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-lg font-bold font-mono ${severityColors[kpi.severity]}`}>
                {kpi.value}
              </span>
              <TrendIcon className={`w-3 h-3 ${kpi.trend === "up" ? "text-severity-critical" : kpi.trend === "down" ? "text-severity-medium" : "text-muted-foreground"}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
