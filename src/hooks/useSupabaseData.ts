import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Incident, Run, RunStep, VoiceCall } from "@/types/sentinel";
import type { Json } from "@/integrations/supabase/types";

function mapIncident(row: any): Incident {
  return {
    id: row.id,
    title: row.title,
    severity: row.severity,
    slaDeadline: new Date(row.sla_deadline),
    symptoms: row.symptoms ?? [],
    confidence: Number(row.confidence ?? 0),
    topSignals: row.top_signals ?? [],
    suggestedAction: row.suggested_action ?? "",
    executedAction: row.executed_action ?? undefined,
    status: row.status,
    runId: row.run_id ?? "",
  };
}

function mapRun(row: any): Run {
  return {
    id: row.id,
    incidentId: row.incident_id ?? "",
    title: row.title,
    status: row.status,
    autonomyMode: row.autonomy_mode as any,
    startedAt: new Date(row.started_at),
    completedAt: row.completed_at ? new Date(row.completed_at) : undefined,
    steps: Array.isArray(row.steps) ? (row.steps as any[]).map(mapStep) : [],
    system: row.system ?? "",
    severity: row.severity ?? "medium",
    agent: row.agent ?? "",
  };
}

function mapStep(s: any): RunStep {
  return {
    id: s.id,
    phase: s.phase,
    label: s.label,
    timestamp: s.timestamp ? new Date(s.timestamp) : undefined,
    status: s.status,
    inputs: s.inputs ?? [],
    outputs: s.outputs ?? [],
    artifacts: s.artifacts,
    uiSteps: s.uiSteps,
    duration: s.duration,
  };
}

export function useIncidents() {
  return useQuery({
    queryKey: ["incidents"],
    queryFn: async () => {
      const { data, error } = await supabase.from("incidents").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapIncident);
    },
  });
}

export function useRuns() {
  return useQuery({
    queryKey: ["runs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("runs").select("*").order("started_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapRun);
    },
  });
}

export function useRun(runId: string | undefined) {
  return useQuery({
    queryKey: ["run", runId],
    enabled: !!runId,
    queryFn: async () => {
      const { data, error } = await supabase.from("runs").select("*").eq("id", runId!).single();
      if (error) throw error;
      return mapRun(data);
    },
  });
}

export function useAuditLogs() {
  return useQuery({
    queryKey: ["audit_logs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("audit_logs").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useVoiceCalls() {
  return useQuery({
    queryKey: ["voice_calls"],
    queryFn: async () => {
      const { data, error } = await supabase.from("voice_calls").select("*").order("started_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}
