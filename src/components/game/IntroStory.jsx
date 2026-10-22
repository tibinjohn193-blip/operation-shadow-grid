export default function IntroStory({ onCommence }) {
  return (
    <div id="intro-overlay">
      <div className="intro-card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid var(--border-color)",
            paddingBottom: "10px"
          }}
        >
          <span style={{ fontWeight: 800, color: "var(--accent-orange)", fontSize: "13px", letterSpacing: "1px" }}>
            CASE FILE #2026-SG99 // PROLOGUE
          </span>
          <span style={{ fontSize: "11px", color: "var(--text-dim)" }}>TIMELINE: 02:14 HRS</span>
        </div>

        <div style={{ fontSize: "13px", color: "#d2dae4", lineHeight: 1.8 }}>
          <b>The Midnight Breach:</b>
          <br />
          At 02:14 hours, an adversary penetrated peripheral firewalls at our core Kochi data center,
          exfiltrating critical deployment keys and client infrastructure files.
          <br />
          <br />
          Perimeter defenses isolated the primary link, but the adversary escaped through proxy circuits.{" "}
          <b>Director V. Menon</b> from Central Command in New Delhi and field asset <b>Agent X</b> on tactical
          patrol have assigned you to lead the investigation.
          <br />
          <br />
          Your objective is clear: analyze fragmented digital records, identify the adversary, trace their
          physical position across international borders, and shut down the operation before secondary payloads
          execute.
        </div>

        <button
          className="btn-submit"
          style={{ padding: "12px", alignSelf: "flex-end" }}
          onClick={onCommence}
        >
          COMMENCE INVESTIGATION [ENTER HQ] -&gt;
        </button>
      </div>
    </div>
  );
}
