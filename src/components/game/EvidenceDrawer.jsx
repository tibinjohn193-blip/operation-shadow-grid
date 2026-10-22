export default function EvidenceDrawer({ mode, isOpen, onClose, intel }) {
  const title = mode === "findings" ? "MISSION FINDINGS // RECON SUMMARY" : "EVIDENCE VAULT // DIGITAL ARTIFACTS";

  const findingsRows = [
    ["TARGET USERNAME", intel.suspectUsername, "var(--accent-orange)"],
    ["SECURITY OVERRIDE KEY", intel.securityKey, "var(--accent-green)"],
    ["TRIANGULATED REGION", intel.triangulatedCity, "#00ccff"],
    ["PHYSICAL ACCESS POINT", intel.rogueCafe, "var(--accent-orange)"],
    ["C2 SERVER IP", intel.targetIP, "var(--accent-green)"],
    ["LINKED BANK", intel.bankName, "#00ccff"],
    ["ONION RELAY", intel.onionLink, "var(--accent-orange)"],
    ["PORTAL ACCESS ID", intel.portalId, "var(--accent-green)"],
    ["KILL-SWITCH PASSPHRASE", intel.killSwitchPassword, "#00ccff"]
  ];

  const vaultLogs = [];
  if (intel.suspectUsername) vaultLogs.push({ b: "FILE:", t: "server_auth.log (Raw Auth Log) | ", b2: "STATUS:", t2: "ANALYZED" });
  if (intel.securityKey) vaultLogs.push({ b: "FILE:", t: "target_evidence.jpg (Disposed Burner Artifact) | ", b2: "STATUS:", t2: "EXTRACTED" });
  if (intel.triangulatedCity) vaultLogs.push({ b: "GEO-TAG:", t: "27.711545° N, 85.308886° E (Kathmandu Region) | ", b2: "STATUS:", t2: "CONFIRMED" });
  if (intel.rogueCafe) vaultLogs.push({ b: "SITE:", t: `${intel.rogueCafe} (Open Wi-Fi Access Point) | `, b2: "STATUS:", t2: "IDENTIFIED" });
  if (intel.targetIP) vaultLogs.push({ b: "FILE:", t: "intercept.pcap (Network Capture) | ", b2: "C2 IP:", t2: intel.targetIP });
  if (intel.bankName) vaultLogs.push({ b: "FILE:", t: "intercept_1.txt / intercept_2.txt (Decrypted) | ", b2: "BANK:", t2: intel.bankName });
  if (intel.onionLink) vaultLogs.push({ b: "RELAY:", t: `${intel.onionLink} | `, b2: "STATUS:", t2: "LIVE" });
  if (intel.portalId) vaultLogs.push({ b: "PORTAL FINGERPRINT:", t: `${intel.portalId} | `, b2: "STATUS:", t2: "CAPTURED" });
  if (intel.killSwitchPassword) vaultLogs.push({ b: "KILL-SWITCH:", t: "cracked | ", b2: "PASSPHRASE:", t2: intel.killSwitchPassword });

  return (
    <div id="drawer-modal" style={{ display: isOpen ? "flex" : "none" }}>
      <div className="drawer-box">
        <div className="term-bar">
          <span id="drawer-title">{title}</span>
          <button
            onClick={onClose}
            style={{ background: "#222934", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer" }}
          >
            CLOSE [X]
          </button>
        </div>
        <div className="drawer-content" id="drawer-content-body">
          {mode === "findings" &&
            findingsRows.map(([label, val, color]) => (
              <div className="evidence-row" key={label}>
                <b style={{ color }}>{label}:</b> {val || "No evidence recorded yet."}
              </div>
            ))}

          {mode === "vault" && vaultLogs.length === 0 && (
            <div className="evidence-row" style={{ color: "var(--text-dim)" }}>
              Evidence vault is empty. Clear investigation phases to register artifacts.
            </div>
          )}
          {mode === "vault" &&
            vaultLogs.map((row, i) => (
              <div className="evidence-row" key={i}>
                <b>{row.b}</b> {row.t}
                <b>{row.b2}</b> {row.t2}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
