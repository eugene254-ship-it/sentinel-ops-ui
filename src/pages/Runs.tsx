import { mockRuns } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import { Clock, GitBranch } from "lucide-react";

const statusColors: Record<string, string> = {
  running: "bg-status-running/15 text-status-running",
  suggesting: "bg-status-pending/15 text-status-pending",
  observing: "bg-primary/10 text-primary",
  completed: "bg-status-completed/15 text-status-completed",
  failed: "bg-status-failed/15 text-status-failed",
};

const sevColors: Record<string, string> = {
  critical: "bg-severity-critical/15 text-severity-critical",
  high: "bg-severity-high/15 text-severity-high",
  medium: "bg-severity-medium/15 text-severity-medium",
  low: "bg-severity-low/15 text-severity-low",
};

const Runs = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4 space-y-4">
      <div>
        <h1 className="text-lg font-bold text-foreground">Runs</h1>
        <p className="text-xs font-mono text-muted-foreground">Every autonomous action with permanent audit trail</p>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="bg-secondary/50 text-muted-foreground">
              <th className="text-left p-3 font-medium">Run</th>
              <th className="text-left p-3 font-medium">System</th>
              <th className="text-left p-3 font-medium">Severity</th>
              <th className="text-left p-3 font-medium">Status</th>
              <th className="text-left p-3 font-medium">Mode</th>
              <th className="text-left p-3 font-medium">Agent</th>
              <th className="text-left p-3 font-medium">Started</th>
            </tr>
          </thead>
          <tbody>
            {mockRuns.map((run) => (
              <tr
                key={run.id}
                onClick={() => navigate(`/runs/${run.id}`)}
                className="border-t border-border hover:bg-secondary/30 cursor-pointer transition-colors"
              >
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <GitBranch className="w-3 h-3 text-muted-foreground" />
                    <div>
                      <div className="text-foreground font-medium">{run.id}</div>
                      <div className="text-muted-foreground text-[10px]">{run.title}</div>
                    </div>
                  </div>
                </td>
                <td className="p-3 text-muted-foreground">{run.system}</td>
                <td className="p-3">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${sevColors[run.severity]}`}>
                    {run.severity}
                  </span>
                </td>
                <td className="p-3">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] capitalize ${statusColors[run.status] || "text-muted-foreground"}`}>
                    {run.status}
                  </span>
                </td>
                <td className="p-3 text-muted-foreground uppercase">{run.autonomyMode}</td>
                <td className="p-3 text-muted-foreground">{run.agent}</td>
                <td className="p-3 text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {run.startedAt.toLocaleTimeString("en-US", { hour12: false })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Runs;
