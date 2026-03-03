import { KPIData } from "@/types/sentinel";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useState, useEffect } from "react";

const severityColors = {
  critical: "text-severity-critical",
  high: "text-severity-high",
  medium: "text-severity-medium",
  low: "text-severity-low",
  ok: "text-severity-ok",
};

function AnimatedValue({ value, severity }: { value: string; severity: string }) {
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlash(true);
      setTimeout(() => setFlash(false), 600);
    }, 4000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className={`text-lg font-bold font-mono ${severityColors[severity as keyof typeof severityColors]} transition-all duration-300 ${flash ? "scale-110 brightness-150" : ""}`} style={{ display: "inline-block" }}>
      {value}
    </span>
  );
}

export function KPIBar({ kpis }: { kpis: KPIData[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-border rounded-lg overflow-hidden">
      {kpis.map((kpi, idx) => {
        const TrendIcon = kpi.trend === "up" ? TrendingUp : kpi.trend === "down" ? TrendingDown : Minus;
        return (
          <div key={kpi.label} className="bg-card p-3 flex flex-col gap-1 animate-fade-in" style={{ animationDelay: `${idx * 80}ms` }}>
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground truncate">
              {kpi.label}
            </span>
            <div className="flex items-baseline gap-1.5">
              <AnimatedValue value={kpi.value} severity={kpi.severity} />
              <TrendIcon className={`w-3 h-3 ${kpi.trend === "up" ? "text-severity-critical" : kpi.trend === "down" ? "text-severity-medium" : "text-muted-foreground"}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
