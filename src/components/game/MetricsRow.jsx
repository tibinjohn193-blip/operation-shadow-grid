import { TOTAL_PHASES } from "../../data/phases.js";

export default function MetricsRow({ activePhase, score, suspectUsername, targetConfirmed }) {
  return (
    <section className="metrics-row">
      <div className="metric-card">
        <div className="metric-head">
          <span>Active Targets</span>
          <span className="pill-tag pill-orange" id="target-status-pill">
            {targetConfirmed ? "CONFIRMED" : "UNIDENTIFIED"}
          </span>
        </div>
        <div className="metric-body">
          <div>
            <div className="metric-num">01</div>
            <div className="metric-sub" id="target-name-lbl">
              {suspectUsername || "CLASSIFIED // UNKNOWN"}
            </div>
          </div>
          <div style={{ color: "var(--accent-orange)", fontSize: "20px" }}>⚡</div>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-head">
          <span>Cleared Phases</span>
          <span className="pill-tag pill-green" id="metric-level-pill">
            PHASE {activePhase}/{TOTAL_PHASES}
          </span>
        </div>
        <div className="metric-body">
          <div>
            <div className="metric-num" id="metric-level-val">
              {activePhase}
            </div>
            <div className="metric-sub">4 milestones active</div>
          </div>
          <div style={{ color: "var(--accent-green)", fontSize: "22px" }}>◷</div>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-head">
          <span>Investigation XP</span>
          <span className="pill-tag pill-green">LIVE</span>
        </div>
        <div className="metric-body">
          <div>
            <div className="metric-num" id="metric-xp-val">
              {score}
            </div>
            <div className="metric-sub">points accumulated</div>
          </div>
          <div style={{ fontSize: "22px", color: "#ffaa00" }}>★</div>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-head">
          <span>Incident Countdown</span>
          <span className="pill-tag pill-orange">SEV-1</span>
        </div>
        <div className="metric-body">
          <div>
            <div className="metric-num">02:14h</div>
            <div className="metric-sub">forensic lock pending</div>
          </div>
          <div style={{ color: "var(--text-muted)", fontSize: "18px" }}>⌛</div>
        </div>
      </div>
    </section>
  );
}
