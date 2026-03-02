import { useState } from "react";
import {
  Phone, PhoneIncoming, PhoneOutgoing, Mic, MicOff,
  AlertTriangle, Users, Clock, ChevronRight, MessageSquare,
} from "lucide-react";

const callLog = [
  {
    id: "VC-301",
    direction: "outbound" as const,
    contact: "Mike Chen — Ops Manager",
    time: "14:15:22",
    duration: "2m 22s",
    status: "completed" as const,
    summary: "Notified of NE corridor delay spike. Confirmed driver reassignment authority. No escalation needed.",
    runId: "RUN-1192",
  },
  {
    id: "VC-300",
    direction: "inbound" as const,
    contact: "Sarah Lin — Dispatch Lead",
    time: "13:48:07",
    duration: "1m 27s",
    status: "completed" as const,
    summary: "Reported manual override on zone 4 dispatching. Requested route optimization re-enable.",
    runId: "RUN-1190",
  },
  {
    id: "VC-299",
    direction: "outbound" as const,
    contact: "James Park — Fleet Safety",
    time: "12:30:15",
    duration: "3m 45s",
    status: "completed" as const,
    summary: "Monthly safety audit follow-up. 2 vehicles scheduled for inspection. Compliance confirmed.",
    runId: "RUN-1189",
  },
  {
    id: "VC-298",
    direction: "outbound" as const,
    contact: "Lisa Wang — Customer Success",
    time: "11:22:09",
    duration: "0m 48s",
    status: "failed" as const,
    summary: "Attempted notification of CRM sync issue. Contact unavailable — voicemail left.",
    runId: "RUN-1188",
  },
];

const liveTranscript = [
  { speaker: "SentinelOS", text: "Good afternoon. This is SentinelOS operations intelligence calling regarding incident INC-2847 — a delay spike in the Northeast corridor.", ts: "14:15:23" },
  { speaker: "Mike Chen", text: "Go ahead, what's the situation?", ts: "14:15:28" },
  { speaker: "SentinelOS", text: "We've detected a 47-minute average delay across 12 shipments on route NE-7. Root cause analysis indicates driver shortage in Zone 12 compounded by an ice weather advisory. Complaint velocity is at 340% above baseline.", ts: "14:15:31" },
  { speaker: "Mike Chen", text: "That's significant. What's the recommended action?", ts: "14:15:42" },
  { speaker: "SentinelOS", text: "I recommend reassigning three drivers from Zone 8 — specifically D-441, D-522, and D-607 — to Zone 12. Additionally, we should consider rerouting 12 NE-7 shipments via the NE-9 secondary corridor. This adds approximately 12 minutes but avoids the congestion zone.", ts: "14:15:45" },
  { speaker: "Mike Chen", text: "Approved on the driver reassignment. Hold on the reroute — let me check with dispatch first. Do not reassign driver 12.", ts: "14:16:02" },
  { speaker: "SentinelOS", text: "Understood. I will proceed with the driver reassignment excluding driver 12, and hold the reroute pending your confirmation. I'll update the run with these constraints.", ts: "14:16:10" },
];

const voiceScripts = [
  { id: "VS-01", name: "SLA Breach Notification", type: "SLA", uses: 24 },
  { id: "VS-02", name: "Safety Incident Alert", type: "Safety", uses: 3 },
  { id: "VS-03", name: "Compliance Follow-Up", type: "Compliance", uses: 12 },
  { id: "VS-04", name: "Customer Delay Update", type: "Customer", uses: 47 },
];

const onCallContacts = [
  { name: "Mike Chen", role: "Ops Manager", status: "available", phone: "+1 (555) 234-5678" },
  { name: "Sarah Lin", role: "Dispatch Lead", status: "available", phone: "+1 (555) 345-6789" },
  { name: "James Park", role: "Fleet Safety", status: "busy", phone: "+1 (555) 456-7890" },
  { name: "Lisa Wang", role: "Customer Success", status: "offline", phone: "+1 (555) 567-8901" },
];

const statusDot: Record<string, string> = {
  available: "bg-severity-ok",
  busy: "bg-severity-medium",
  offline: "bg-muted-foreground/40",
};

const VoiceCenter = () => {
  const [activeTab, setActiveTab] = useState<"calls" | "live" | "scripts" | "contacts">("live");
  const [isMuted, setIsMuted] = useState(false);

  return (
    <div className="p-4 space-y-4">
      <div>
        <h1 className="text-lg font-bold text-foreground">Voice Center</h1>
        <p className="text-xs font-mono text-muted-foreground">Operator communication layer</p>
      </div>

      <div className="flex gap-1 border-b border-border">
        {(["live", "calls", "scripts", "contacts"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-mono capitalize border-b-2 transition-colors ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "live" ? "Live Call" : tab}
          </button>
        ))}
      </div>

      {activeTab === "live" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Live call panel */}
          <div className="lg:col-span-2 space-y-3">
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-severity-ok animate-pulse-dot" />
                  <span className="text-xs font-mono text-severity-ok">CALL ACTIVE</span>
                  <span className="text-xs font-mono text-muted-foreground">VC-301 • 2m 22s</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-muted-foreground">→ Mike Chen, Ops Manager</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono border transition-colors ${
                    isMuted
                      ? "bg-severity-critical/10 text-severity-critical border-severity-critical/20"
                      : "bg-secondary text-foreground border-border"
                  }`}
                >
                  {isMuted ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                  {isMuted ? "Unmute" : "Mute"}
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono bg-severity-critical/10 text-severity-critical border border-severity-critical/20 hover:bg-severity-critical/20 transition-colors">
                  <Phone className="w-3 h-3" />
                  End Call
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono bg-severity-high/10 text-severity-high border border-severity-high/20 hover:bg-severity-high/20 transition-colors">
                  <AlertTriangle className="w-3 h-3" />
                  Page On-Call
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono bg-secondary text-foreground border border-border hover:bg-secondary/80 transition-colors">
                  <Users className="w-3 h-3" />
                  Incident Bridge
                </button>
              </div>

              {/* Transcript */}
              <div className="space-y-3 max-h-96 overflow-auto">
                {liveTranscript.map((line, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="text-[10px] font-mono text-muted-foreground flex-shrink-0 pt-0.5">{line.ts}</span>
                    <div>
                      <span className={`text-xs font-mono font-bold ${
                        line.speaker === "SentinelOS" ? "text-primary" : "text-foreground"
                      }`}>
                        {line.speaker}
                      </span>
                      <p className="text-xs text-secondary-foreground mt-0.5">{line.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary sidebar */}
          <div className="space-y-3">
            <div className="rounded-lg border border-border bg-card p-3">
              <h3 className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2">Structured Summary</h3>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-mono text-muted-foreground">Context:</span>
                  <p className="text-foreground mt-0.5">NE corridor delay spike, INC-2847</p>
                </div>
                <div>
                  <span className="font-mono text-muted-foreground">Commitments:</span>
                  <ul className="mt-0.5 space-y-0.5 text-foreground">
                    <li>✓ Reassign 3 drivers (excl. driver 12)</li>
                    <li>⏳ Hold reroute pending dispatch check</li>
                    <li>✓ Update run constraints</li>
                  </ul>
                </div>
                <div>
                  <span className="font-mono text-muted-foreground">Constraints received:</span>
                  <p className="text-severity-high mt-0.5">"Do not reassign driver 12"</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-3">
              <h3 className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2">Linked Run</h3>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-primary">RUN-1192</span>
                <span className="text-severity-critical">CRITICAL</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">Delay Spike Response — NE Corridor</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "calls" && (
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="bg-secondary/50 text-muted-foreground">
                <th className="text-left p-3 font-medium">Call</th>
                <th className="text-left p-3 font-medium">Contact</th>
                <th className="text-left p-3 font-medium">Time</th>
                <th className="text-left p-3 font-medium">Duration</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">Summary</th>
              </tr>
            </thead>
            <tbody>
              {callLog.map((call) => (
                <tr key={call.id} className="border-t border-border hover:bg-secondary/30 cursor-pointer transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      {call.direction === "outbound" ? (
                        <PhoneOutgoing className="w-3 h-3 text-primary" />
                      ) : (
                        <PhoneIncoming className="w-3 h-3 text-severity-ok" />
                      )}
                      <span className="text-foreground">{call.id}</span>
                    </div>
                  </td>
                  <td className="p-3 text-foreground">{call.contact}</td>
                  <td className="p-3 text-muted-foreground">{call.time}</td>
                  <td className="p-3 text-muted-foreground">{call.duration}</td>
                  <td className="p-3">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                      call.status === "completed" ? "bg-severity-ok/10 text-severity-ok" : "bg-severity-critical/10 text-severity-critical"
                    }`}>
                      {call.status}
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground max-w-xs truncate">{call.summary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "scripts" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {voiceScripts.map((vs) => (
            <div key={vs.id} className="rounded-lg border border-border bg-card p-4 hover:border-primary/30 transition-colors cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">{vs.name}</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground font-mono">{vs.type}</span>
              </div>
              <div className="text-[10px] font-mono text-muted-foreground">
                {vs.uses} uses this month
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "contacts" && (
        <div className="space-y-2">
          {onCallContacts.map((c) => (
            <div key={c.name} className="rounded-lg border border-border bg-card p-3 flex items-center gap-4">
              <div className={`w-2 h-2 rounded-full ${statusDot[c.status]}`} />
              <div className="flex-1">
                <div className="text-sm font-semibold text-foreground">{c.name}</div>
                <div className="text-xs text-muted-foreground">{c.role}</div>
              </div>
              <span className="text-xs font-mono text-muted-foreground">{c.phone}</span>
              <span className={`text-[10px] font-mono capitalize ${
                c.status === "available" ? "text-severity-ok" : c.status === "busy" ? "text-severity-medium" : "text-muted-foreground"
              }`}>
                {c.status}
              </span>
              <button className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-primary transition-colors">
                <Phone className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VoiceCenter;
