import { useState } from "react";

export default function AgentLogin({ onLogin, loading, error }) {
  const [input, setInput] = useState("");
  const [showLocalError, setShowLocalError] = useState(false);

  const handleSubmit = () => {
    const trimmed = input.trim().toUpperCase();
    if (!trimmed) {
      setShowLocalError(true);
      return;
    }
    setShowLocalError(false);
    onLogin(trimmed);
  };

  return (
    <div id="auth-overlay">
      <div className="auth-card">
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div className="logo-badge" />
          <span style={{ fontWeight: 800, fontSize: "16px", letterSpacing: "1px" }}>
            OPERATION SHADOW GRID
          </span>
        </div>
        <div style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.6 }}>
          <b>Tactical Cyber Incident Investigation &amp; Threat Tracking Simulator</b>
          <br />
          Professional Competencies Covered in this Operation:
        </div>

        <div className="skills-grid">
          <div className="skill-item">
            <b>• Log Forensics:</b> Parse raw multi-source SSH logs to uncover intrusion patterns.
          </div>
          <div className="skill-item">
            <b>• Linux Binaries:</b> Execute low-level command tools to extract hidden binary strings.
          </div>
          <div className="skill-item">
            <b>• Hardware OSINT:</b> Extract raw GPS sensor metadata embedded inside artifacts.
          </div>
          <div className="skill-item">
            <b>• Ground Triangulation:</b> Correlate street view imagery to pinpoint adversary safehouses.
          </div>
        </div>

        <div style={{ fontSize: "12px", color: "var(--text-dim)", marginTop: "5px" }}>
          ENTER AGENT BADGE IDENTIFIER:
        </div>
        <input
          type="text"
          id="auth-agent-id"
          className="console-input"
          placeholder="e.g. AGENT_NOVA"
          autoComplete="off"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
        <button className="btn-submit" style={{ padding: "12px" }} onClick={handleSubmit} disabled={loading}>
          {loading ? "AUTHENTICATING..." : "INITIALIZE CREDENTIALS ->"}
        </button>
        <div
          id="auth-error"
          className="error-badge"
          style={{ display: showLocalError || error ? "block" : "none" }}
        >
          {error || "BADGE IDENTIFIER REQUIRED TO COMMENCE."}
        </div>
      </div>
    </div>
  );
}
