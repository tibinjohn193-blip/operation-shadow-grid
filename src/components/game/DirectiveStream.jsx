export default function DirectiveStream({ phase }) {
  return (
    <div className="activity-stream" id="directive-stream">
      <div className="activity-card">
        <div className="act-icon-wrap">🛡</div>
        <div className="act-details">
          <div className="act-title">{phase.title}</div>
          <div className="act-sub">{phase.desc}</div>
        </div>
      </div>
      <div className="activity-card" style={{ borderLeft: "2px solid var(--accent-orange)" }}>
        <div className="act-icon-wrap" style={{ color: "var(--accent-green)" }}>💬</div>
        <div className="act-details">
          <div className="act-title">Comms Link: Agent X</div>
          <div className="act-sub">{phase.agentNote}</div>
        </div>
      </div>
    </div>
  );
}
