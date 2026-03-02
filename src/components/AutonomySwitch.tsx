import { AutonomyMode } from "@/types/sentinel";
import { Eye, Lightbulb, Zap } from "lucide-react";
import { useState } from "react";

const modes: { mode: AutonomyMode; label: string; icon: typeof Eye; desc: string }[] = [
  { mode: "observe", label: "Observe", icon: Eye, desc: "Detect + explain only" },
  { mode: "suggest", label: "Suggest", icon: Lightbulb, desc: "Propose, human executes" },
  { mode: "act", label: "Act", icon: Zap, desc: "Auto-execute within guardrails" },
];

export function AutonomySwitch() {
  const [active, setActive] = useState<AutonomyMode>("act");

  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2">
        Autonomy Mode
      </div>
      <div className="flex gap-1">
        {modes.map(({ mode, label, icon: Icon, desc }) => (
          <button
            key={mode}
            onClick={() => setActive(mode)}
            className={`flex-1 flex flex-col items-center gap-1 py-2 px-2 rounded text-xs transition-all ${
              active === mode
                ? "bg-primary/15 text-primary border border-primary/30"
                : "text-muted-foreground hover:bg-secondary border border-transparent"
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="font-semibold">{label}</span>
            <span className="text-[9px] text-muted-foreground hidden sm:block">{desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
