export default function Sidebar({ agentName, onOpenDrawer }) {
  return (
    <aside className="sidebar">
      <div className="logo-wrap">
        <div className="logo-badge" />
        <span className="logo-text">OPERATION SHADOW GRID</span>
      </div>

      <button
        className="btn-new-task"
        onClick={() =>
          alert(
            "Active Incident: Track the adversary from the initial Kochi breach through the Kathmandu relay to the confirmed origin point, then authorize the joint takedown."
          )
        }
      >
        <span>Active Incident</span>
        <span style={{ fontSize: "16px" }}>+</span>
      </button>

      <ul className="nav-list">
        <li className="nav-item active">⊞ Dashboard</li>
        <li className="nav-item" onClick={() => onOpenDrawer("findings")}>
          ⚙ Findings
        </li>
        <li className="nav-item">⚠ Incidents</li>
        <li className="nav-item">🛡 Compliance</li>
        <li className="nav-item" onClick={() => onOpenDrawer("vault")}>
          📁 Evidence Vault
        </li>
        <li className="nav-item">☍ Integrations</li>
      </ul>

      <div className="sidebar-footer">
        🔒 Encrypted Session
        <br />
        <span id="agent-ident-lbl" style={{ color: "var(--text-muted)" }}>
          ID: {agentName || "INITIALIZING"}
        </span>
      </div>
    </aside>
  );
}
