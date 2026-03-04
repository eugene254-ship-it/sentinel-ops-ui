import { useState, useEffect, useRef } from "react";
import { Play, Pause, SkipForward, SkipBack, Monitor, MousePointer, Type, ListChecks } from "lucide-react";
import type { UIStep } from "@/types/sentinel";

const actionIcons: Record<string, typeof Monitor> = {
  navigate: Monitor,
  click: MousePointer,
  select: ListChecks,
  type: Type,
};

const mockScreenshots: Record<number, { title: string; elements: string[] }> = {
  0: { title: "Dispatch Dashboard — Login", elements: ["Login form", "Username field", "Password field", "Sign in button"] },
  1: { title: "Dispatch Dashboard — Zones", elements: ["Zone tabs", "Zone 8 panel", "Zone 12 panel", "Driver list"] },
  2: { title: "Driver Selection — D-441", elements: ["Driver D-441 row highlighted", "Status: Available", "Current zone: 8", "Select button"] },
  3: { title: "Reassignment — Zone 12", elements: ["Zone dropdown open", "Zone 12 selected", "ETA update: 18min", "Confirm button"] },
  4: { title: "Confirmation Dialog", elements: ["Reassignment summary", "Driver: D-441", "From: Zone 8 → Zone 12", "Confirm"] },
};

export function NovaActPlayback({ uiSteps }: { uiSteps: UIStep[] }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= uiSteps.length - 1) {
            setPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2500);
    }
    return () => clearInterval(intervalRef.current);
  }, [playing, uiSteps.length]);

  const step = uiSteps[currentStep];
  const screen = mockScreenshots[currentStep] ?? { title: "Unknown Screen", elements: [] };
  const Icon = actionIcons[step?.action] ?? Monitor;

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="p-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Monitor className="w-4 h-4 text-primary" />
          <span className="text-xs font-mono font-bold text-foreground">Nova Act — UI Playback</span>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground">
          Step {currentStep + 1} / {uiSteps.length}
        </span>
      </div>

      {/* Simulated browser viewport */}
      <div className="relative bg-surface-0 border-b border-border">
        {/* Browser chrome */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-2 border-b border-border">
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-severity-critical/60" />
            <div className="w-2 h-2 rounded-full bg-severity-medium/60" />
            <div className="w-2 h-2 rounded-full bg-severity-ok/60" />
          </div>
          <div className="flex-1 ml-2 px-2 py-0.5 rounded bg-surface-1 text-[10px] font-mono text-muted-foreground truncate">
            https://{step?.target ?? "..."}
          </div>
        </div>

        {/* Screen content */}
        <div className="p-6 min-h-[200px] flex flex-col items-center justify-center animate-fade-in" key={currentStep}>
          <div className="text-sm font-semibold text-foreground mb-4">{screen.title}</div>
          <div className="grid grid-cols-2 gap-2 w-full max-w-xs">
            {screen.elements.map((el, i) => (
              <div
                key={i}
                className={`px-3 py-2 rounded border text-[11px] font-mono transition-all duration-500 ${
                  i === screen.elements.length - 1
                    ? "border-primary/50 bg-primary/10 text-primary ring-1 ring-primary/30"
                    : "border-border bg-surface-1 text-muted-foreground"
                }`}
              >
                {el}
              </div>
            ))}
          </div>

          {/* Action indicator */}
          <div className="mt-4 flex items-center gap-2 text-xs font-mono">
            <Icon className="w-3.5 h-3.5 text-primary" />
            <span className="text-primary font-bold uppercase">{step?.action}</span>
            <span className="text-muted-foreground">→ {step?.target}</span>
            {step?.value && <span className="text-severity-ok">= "{step.value}"</span>}
          </div>
        </div>

        {/* Cursor animation overlay */}
        <div
          className="absolute w-4 h-4 pointer-events-none transition-all duration-700 ease-in-out"
          style={{
            bottom: `${30 + (currentStep * 5)}%`,
            right: `${20 + (currentStep * 8) % 40}%`,
          }}
        >
          <MousePointer className="w-4 h-4 text-primary drop-shadow-lg" />
        </div>
      </div>

      {/* Controls */}
      <div className="p-3 flex items-center gap-2">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
        >
          <SkipBack className="w-4 h-4" />
        </button>
        <button
          onClick={() => setPlaying(!playing)}
          className="p-2 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
        >
          {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button
          onClick={() => setCurrentStep(Math.min(uiSteps.length - 1, currentStep + 1))}
          disabled={currentStep >= uiSteps.length - 1}
          className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
        >
          <SkipForward className="w-4 h-4" />
        </button>

        {/* Step indicators */}
        <div className="flex-1 flex items-center gap-1 ml-2">
          {uiSteps.map((_, i) => (
            <button
              key={i}
              onClick={() => { setCurrentStep(i); setPlaying(false); }}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                i === currentStep ? "bg-primary" : i < currentStep ? "bg-primary/40" : "bg-border"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
