export type Severity = "critical" | "high" | "medium" | "low" | "ok";
export type RunStatus = "observing" | "detecting" | "diagnosing" | "planning" | "acting" | "communicating" | "verifying" | "completed" | "failed" | "suggesting" | "running";
export type AutonomyMode = "observe" | "suggest" | "act";
export type RunPhase = "observe" | "detect" | "diagnose" | "plan" | "act" | "communicate" | "verify" | "close";
export type StepStatus = "completed" | "running" | "pending" | "failed";

export interface Incident {
  id: string;
  title: string;
  severity: Severity;
  slaDeadline: Date;
  symptoms: string[];
  confidence: number;
  topSignals: string[];
  suggestedAction: string;
  executedAction?: string;
  status: RunStatus;
  runId: string;
}

export interface UIStep {
  action: string;
  target: string;
  value?: string;
  screenshot: boolean;
}

export interface RunStep {
  id: string;
  phase: RunPhase;
  label: string;
  timestamp?: Date;
  status: StepStatus;
  inputs: string[];
  outputs: string[];
  artifacts?: string[];
  uiSteps?: UIStep[];
  duration?: number;
}

export interface Run {
  id: string;
  incidentId: string;
  title: string;
  status: RunStatus;
  autonomyMode: AutonomyMode;
  startedAt: Date;
  completedAt?: Date;
  steps: RunStep[];
  system: string;
  severity: Severity;
  agent: string;
}

export interface KPIData {
  label: string;
  value: string;
  trend: "up" | "down" | "stable";
  severity: Severity;
}

export interface VoiceCall {
  id: string;
  direction: "inbound" | "outbound";
  contact: string;
  startedAt: Date;
  duration: number;
  status: "active" | "completed" | "failed";
  summary: string;
  runId?: string;
}
