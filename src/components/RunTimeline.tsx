import { RunStep, RunPhase } from "@/types/sentinel";
import {
  Eye, Radio, Search, Map, Play, MessageSquare, CheckCircle, XCircle,
} from "lucide-react";
import { useState } from "react";

const phaseConfig: Record<RunPhase, { icon: typeof Eye; color: string }> = {
  observe: { icon: Eye, color: "text-severity-low" },
  detect: { icon: Radio, color: "text-severity-high" },
  diagnose: { icon: Search, color: "text-severity-medium" },
  plan: { icon: Map, color: "text-primary" },
  act: { icon: Play, color: "text-severity-critical" },
  communicate: { icon: MessageSquare, color: "text-severity-medium" },
  verify: { icon: CheckCircle, color: "text-severity-ok" },
  close: { icon: XCircle, color: "text-muted-foreground" },
};

const statusDot: Record<string, string> = {
  completed: "bg-severity-ok",
  running: "bg-primary animate-pulse-dot",
  pending: "bg-muted-foreground/40",
  failed: "bg-severity-critical",
};

export function RunTimeline({ steps }: { steps: RunStep[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-0">
      {steps.map((step, i) => {
        const config = phaseConfig[step.phase];
        const Icon = config.icon;
        const isExpanded = expanded === step.id;
        const isLast = i === steps.length - 1;

        return (
          <div key={step.id} className="flex gap-3">
            {/* Timeline spine */}
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                step.status === "running" ? "border-primary bg-primary/10" :
                step.status === "completed" ? "border-severity-ok/40 bg-severity-ok/5" :
                "border-border bg-secondary"
              }`}>
                <Icon className={`w-4 h-4 ${config.color}`} />
              </div>
              {!isLast && (
                <div className={`w-px flex-1 min-h-[24px] ${
                  step.status === "completed" ? "bg-severity-ok/30" : "bg-border"
                }`} />
              )}
            </div>

            {/* Content */}
            <div className={`flex-1 pb-4 ${isLast ? "" : ""}`}>
              <button
                onClick={() => setExpanded(isExpanded ? null : step.id)}
                className="w-full text-left"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{step.label}</span>
                  <div className={`w-1.5 h-1.5 rounded-full ${statusDot[step.status]}`} />
                  {step.duration && (
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {(step.duration / 1000).toFixed(1)}s
                    </span>
                  )}
                </div>
                {step.timestamp && (
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {step.timestamp.toLocaleTimeString("en-US", { hour12: false })}
                  </span>
                )}
              </button>

              {isExpanded && (
                <div className="mt-2 space-y-2 animate-slide-in">
                  {step.inputs.length > 0 && (
                    <div className="rounded bg-secondary/50 p-2">
                      <span className="text-[10px] font-mono uppercase text-muted-foreground">Inputs</span>
                      <ul className="mt-1 space-y-0.5">
                        {step.inputs.map((inp, j) => (
                          <li key={j} className="text-xs font-mono text-secondary-foreground">{inp}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {step.outputs.length > 0 && (
                    <div className="rounded bg-primary/5 border border-primary/10 p-2">
                      <span className="text-[10px] font-mono uppercase text-primary">Outputs</span>
                      <ul className="mt-1 space-y-0.5">
                        {step.outputs.map((out, j) => (
                          <li key={j} className="text-xs font-mono text-foreground">{out}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {step.uiSteps && (
                    <div className="rounded bg-severity-critical/5 border border-severity-critical/10 p-2">
                      <span className="text-[10px] font-mono uppercase text-severity-critical">UI Automation Steps</span>
                      <div className="mt-1 space-y-1">
                        {step.uiSteps.map((us, j) => (
                          <div key={j} className="flex items-center gap-2 text-xs font-mono">
                            <span className="text-muted-foreground">{j + 1}.</span>
                            <span className="text-severity-high">{us.action}</span>
                            <span className="text-secondary-foreground truncate">{us.target}</span>
                            {us.value && <span className="text-primary">→ {us.value}</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {step.artifacts && (
                    <div className="flex gap-1">
                      {step.artifacts.map((a, j) => (
                        <span key={j} className="text-[10px] px-1.5 py-0.5 rounded bg-secondary font-mono text-muted-foreground">
                          📎 {a}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
