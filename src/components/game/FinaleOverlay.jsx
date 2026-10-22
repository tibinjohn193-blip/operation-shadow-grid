import { useEffect, useState } from "react";

const LINES = [
  { cls: "tag-trace", text: '<b>Agent X (secure channel):</b> "Authorization received. Standing by — RAW is moving in on both locations now."' },
  { cls: "tag-arrest", text: "[03:40 HRS] RAW TACTICAL UNIT // KATHMANDU SAFEHOUSE" },
  { text: 'Commandos breach the Thamel safehouse. The man operating under the handle "Agent Nova" — identified as local handler Rajiv Thapa — is placed under arrest. His role: regional courier and payment-relay operator, not the architect.' },
  { cls: "tag-trace", text: "[ROUTING OVERRIDE] TRACEROUTE RE-RUN AGAINST shadowgridc2x7f9a2b.onion" },
  { text: "The Kathmandu endpoint was a relay node, not the origin. A fresh correlation of the Tor circuit timing, the Sanima Bank transaction metadata, and the SSH session fingerprints resolves the true origin session." },
  { cls: "tag-arrest", text: "[TWIST CONFIRMED] SHADOW PHANTOM'S ACTUAL LOCATION" },
  { text: 'The mastermind behind the Kochi data center breach was never in Nepal. Session telemetry, device fingerprinting and the recovered kill-switch metadata all converge on a residential block in <b style="color:var(--accent-orange);">Palakkad, Kerala, India</b> — well within domestic jurisdiction.' },
  { text: "Local cyber cell has been dispatched to the confirmed coordinates. Case #2026-SG99 is formally closed pending extradition processing for the Kathmandu handler and domestic charges for the Kerala-based operator." }
];

export default function FinaleOverlay({ isOpen, agentName, score, onMissionComplete }) {
  const [showRestart, setShowRestart] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setShowRestart(false);
      return;
    }
    // Mark the mission complete in Firestore the moment the finale plays.
    onMissionComplete?.();
    const t = setTimeout(() => setShowRestart(true), (LINES.length + 1) * 500 + 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const allLines = [
    ...LINES,
    { cls: "tag-trace", text: `MISSION SUMMARY — Agent ${agentName} // Total Investigation XP: ${score}` }
  ];

  return (
    <div id="finale-overlay" style={{ display: "flex" }}>
      <div className="finale-card" id="finale-card-body">
        <div style={{ fontWeight: 800, letterSpacing: "1px", color: "#fff", borderBottom: "1px solid var(--border-color)", paddingBottom: "10px" }}>
          CASE FILE #2026-SG99 // FINAL REPORT
        </div>
        <div id="finale-lines" style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "4px" }}>
          {allLines.map((l, i) => (
            <div
              key={i}
              className={"finale-line" + (l.cls ? " " + l.cls : "")}
              style={{ animationDelay: `${i * 0.5}s` }}
              dangerouslySetInnerHTML={{ __html: l.text }}
            />
          ))}
        </div>
        {showRestart && (
          <div style={{ marginTop: "10px" }}>
            <button className="btn-submit" style={{ padding: "12px", width: "100%" }} onClick={() => window.location.reload()}>
              RESTART OPERATION
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
