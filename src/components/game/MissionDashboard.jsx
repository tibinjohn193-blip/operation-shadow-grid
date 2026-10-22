import { useMemo, useState } from "react";
import Sidebar from "./Sidebar.jsx";
import MetricsRow from "./MetricsRow.jsx";
import RadarMap from "./RadarMap.jsx";
import LocationStats from "./LocationStats.jsx";
import PhaseModule from "./PhaseModule.jsx";
import DirectiveStream from "./DirectiveStream.jsx";
import FlagSubmitBar from "./FlagSubmitBar.jsx";
import EvidenceDrawer from "./EvidenceDrawer.jsx";
import Terminal from "./Terminal.jsx";
import ConsoleModal from "./ConsoleModal.jsx";
import FinaleOverlay from "./FinaleOverlay.jsx";
import { phases, checkFlag, POINTS_PER_PHASE } from "../../data/phases.js";

const EMPTY_INTEL = {
  suspectUsername: null,
  securityKey: null,
  triangulatedCity: null,
  rogueCafe: null,
  targetIP: null,
  bankName: null,
  onionLink: null,
  portalId: null,
  killSwitchPassword: null
};

// Phase number -> patch applied to unlockedIntel when that phase is solved.
// Mirrors the original applyPhaseSolve()/onSolve() behavior exactly.
const INTEL_ON_SOLVE = {
  1: { suspectUsername: "shadow_phantom_99" },
  2: { securityKey: "cyber_ghost_2026" },
  3: { triangulatedCity: "Kathmandu, Nepal" },
  4: { rogueCafe: "Mitho Cafe-Restaurant" },
  5: { targetIP: "45.133.22.10" },
  6: { bankName: "Sanima Bank", onionLink: "shadowgridc2x7f9a2b.onion" },
  7: { portalId: "NX-7742" },
  9: { killSwitchPassword: "abort_payload_2026" }
};

function downloadAuthLog() {
  const lines = [];
  let dt = new Date("2026-10-07T14:15:00");
  for (let i = 0; i < 40; i++) {
    dt.setMinutes(dt.getMinutes() + 2);
    const s = dt.toISOString().replace("T", " ").substring(0, 19);
    lines.push(`[${s}] sshd[${12000 + i}]: Failed password for invalid user admin from 192.168.1.${10 + i} port ${51200 + i} ssh2`);
  }
  lines.push(`[2026-10-07 18:29:12] sshd[14514]: Accepted password for shadow_phantom_99 from 192.168.1.104 port 54328 ssh2`);
  lines.push(`[2026-10-07 18:29:13] sshd[14514]: pam_unix(sshd:session): session opened for user shadow_phantom_99 by (uid=0)`);
  lines.push(`[2026-10-07 18:30:19] SYSTEM_ALERT: UNAUTHORIZED EXFILTRATION DETECTED ON PORT 22`);
  for (let i = 0; i < 20; i++) {
    dt.setMinutes(dt.getMinutes() + 3);
    const s = dt.toISOString().replace("T", " ").substring(0, 19);
    lines.push(`[${s}] CRON[${21000 + i}]: pam_unix(cron:session): session closed for user root`);
  }
  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "server_auth.log";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export default function MissionDashboard({ player, onCompletePhase, onCompleteMission }) {
  const activePhase = Math.min(player.currentPhase, 10);
  const phase = phases[activePhase];

  const [terminalOpen, setTerminalOpen] = useState(false);
  const [consoleModalOpen, setConsoleModalOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState(null);
  const [finaleOpen, setFinaleOpen] = useState(false);

  // Replays INTEL_ON_SOLVE for every phase already completed, so the
  // Findings/Evidence Vault drawer is correct even after a page refresh
  // (Firestore only stores phase/score, not this derived narrative state).
  const unlockedIntel = useMemo(() => {
    let intel = { ...EMPTY_INTEL };
    for (const p of player.completedPhases || []) {
      intel = { ...intel, ...(INTEL_ON_SOLVE[p] || {}) };
    }
    return intel;
  }, [player.completedPhases]);

  const nepalBeaconActive = activePhase >= 4 && Boolean(unlockedIntel.triangulatedCity);

  const handleAction = () => {
    if (activePhase === 1) {
      downloadAuthLog();
    } else if (activePhase === 2 || activePhase === 3) {
      setTerminalOpen(true);
    } else if (activePhase >= 5 && activePhase <= 9) {
      setConsoleModalOpen(true);
    } else if (activePhase === 10) {
      setFinaleOpen(true);
    }
  };

  const handleSubmitFlag = (value) => {
    if (!checkFlag(activePhase, value)) return false;
    onCompletePhase(activePhase, POINTS_PER_PHASE);
    return true;
  };

  const handleModuleAutoComplete = () => {
    // Phase 8 (SQLi bypass) completes itself from inside the module.
    setConsoleModalOpen(false);
    onCompletePhase(8, POINTS_PER_PHASE);
  };

  return (
    <div className="dashboard-shell">
      <Sidebar agentName={player.agentName} onOpenDrawer={setDrawerMode} />

      <main className="main-container">
        <MetricsRow
          activePhase={activePhase}
          score={player.score}
          suspectUsername={unlockedIntel.suspectUsername}
          targetConfirmed={Boolean(unlockedIntel.suspectUsername)}
        />

        <section className="dashboard-grid">
          <div className="panel-threat">
            <div className="panel-header">
              <span className="panel-title">Regional Radar // Orthographic Grid</span>
              <span className="panel-filter">Sat-View Projection ▼</span>
            </div>

            {/* Phase 4 is the one exception: the left viewport swaps to the
                external map link. Every other phase keeps the large radar map. */}
            {phase.type === "module" && phase.moduleKind === "map-link" ? (
              <div id="phase-module-extra" style={{ display: "flex" }}>
                <PhaseModule phaseNumber={activePhase} onAgentLine={() => {}} onAutoComplete={() => {}} />
              </div>
            ) : (
              <RadarMap nepalBeaconActive={nepalBeaconActive} />
            )}

            <LocationStats nepalTraceActive={nepalBeaconActive} />
          </div>

          <div className="panel-activity">
            <div className="panel-header">
              <span className="panel-title">Mission Feed &amp; Operational Directives</span>
              <span className="panel-filter" style={{ color: "var(--accent-orange)" }}>● ACTIVE HQ DISPATCH</span>
            </div>

            <DirectiveStream phase={phase} />
            <FlagSubmitBar phase={phase} onAction={handleAction} onSubmitFlag={handleSubmitFlag} />
          </div>
        </section>
      </main>

      <EvidenceDrawer
        mode={drawerMode || "findings"}
        isOpen={Boolean(drawerMode)}
        onClose={() => setDrawerMode(null)}
        intel={unlockedIntel}
      />

      <Terminal
        isOpen={terminalOpen}
        onClose={() => setTerminalOpen(false)}
        agentTermHint={phase.agentTermHint}
      />

      <ConsoleModal
        phaseNumber={activePhase}
        isOpen={consoleModalOpen && activePhase >= 5 && activePhase <= 9}
        onClose={() => setConsoleModalOpen(false)}
        onAutoComplete={handleModuleAutoComplete}
      />

      <FinaleOverlay
        isOpen={finaleOpen}
        agentName={player.agentName}
        score={player.score}
        onMissionComplete={onCompleteMission}
      />
    </div>
  );
}
