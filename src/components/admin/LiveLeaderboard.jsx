import { useLeaderboard } from "../../hooks/useLeaderboard.js";
import { MAX_SCORE, TOTAL_PHASES } from "../../data/phases.js";

export default function LiveLeaderboard() {
  const { players, loading } = useLeaderboard();

  return (
    <div className="admin-glass-panel">
      <div className="admin-panel-header">
        <div>
          <h1>OPERATION SHADOW GRID</h1>
          <p>Live Field Operator Leaderboard — Central Command</p>
        </div>
        <div className="admin-live-pill">
          <span className="admin-live-dot" /> LIVE
        </div>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Agent</th>
              <th>Phase</th>
              <th>Status</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="admin-table-empty">Establishing secure link to Firestore...</td>
              </tr>
            )}
            {!loading && players.length === 0 && (
              <tr>
                <td colSpan={5} className="admin-table-empty">No active field operators yet.</td>
              </tr>
            )}
            {players.map((p, i) => (
              <tr key={p.id}>
                <td className="admin-rank">{String(i + 1).padStart(2, "0")}</td>
                <td className="admin-agent-name">{p.agentName}</td>
                <td>
                  <span className="admin-phase-pill">
                    {Math.min(p.currentPhase || 1, TOTAL_PHASES)}/{TOTAL_PHASES}
                  </span>
                </td>
                <td>
                  <span className={`admin-status admin-status-${(p.status || "ACTIVE").toLowerCase()}`}>
                    {p.status === "MISSION_COMPLETE" ? "CASE CLOSED" : "ACTIVE"}
                  </span>
                </td>
                <td className="admin-score-cell">
                  <div className="admin-score-bar-bg">
                    <div
                      className="admin-score-bar-fill"
                      style={{ width: `${Math.min(100, ((p.score || 0) / MAX_SCORE) * 100)}%` }}
                    />
                  </div>
                  <span className="admin-score-val">{p.score || 0} / {MAX_SCORE}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
