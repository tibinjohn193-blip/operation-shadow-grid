export default function LocationStats({ nepalTraceActive }) {
  return (
    <div className="location-stats" id="location-stats-wrap">
      <div className="loc-row">
        <span className="loc-val" id="nepal-stat-val">
          {nepalTraceActive ? "98" : "--"}
        </span>
        <div className="loc-bar-bg">
          <div
            className="loc-bar-fill"
            id="nepal-stat-bar"
            style={{ width: nepalTraceActive ? "98%" : "0%", background: "#ffaa00" }}
          />
        </div>
        <span className="loc-label" id="nepal-stat-label">
          {nepalTraceActive ? "Nepal Safehouse Trace" : "Foreign Region (Locked)"}
        </span>
      </div>
      <div className="loc-row">
        <span className="loc-val">95</span>
        <div className="loc-bar-bg">
          <div className="loc-bar-fill" style={{ width: "95%", background: "#00ccff" }} />
        </div>
        <span className="loc-label">New Delhi HQ Link</span>
      </div>
      <div className="loc-row">
        <span className="loc-val">84</span>
        <div className="loc-bar-bg">
          <div className="loc-bar-fill" style={{ width: "84%", background: "var(--accent-green)" }} />
        </div>
        <span className="loc-label">Kochi DC, India</span>
      </div>
    </div>
  );
}
