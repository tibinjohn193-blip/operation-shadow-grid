import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, doc, getDoc, onSnapshot, orderBy, query } from "firebase/firestore";
import { auth, db } from "../firebase/firebase.js";
import { MAX_SCORE, TOTAL_PHASES } from "../data/phases.js";
import { removePlayer, setPlayerStatus } from "../firebase/playerRepo.js";
import MatrixRain from "../components/admin/MatrixRain.jsx";
import ShadowSilhouette from "../components/admin/ShadowSilhouette.jsx";
import RotatingGlobe from "../components/admin/RotatingGlobe.jsx";

export default function AdminDashboardPage() {
  const [user, setUser] = useState(undefined);
  const [authorized, setAuthorized] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [players, setPlayers] = useState([]);
  const [loadingPlayers, setLoadingPlayers] = useState(true);
  const [busyId, setBusyId] = useState("");

  useEffect(() => onAuthStateChanged(auth, async (currentUser) => {
    setUser(currentUser);
    setAuthorized(false);
    if (!currentUser) { setCheckingRole(false); return; }
    setCheckingRole(true);
    try {
      const roleDoc = await getDoc(doc(db, "admins", currentUser.uid));
      setAuthorized(roleDoc.exists() && roleDoc.data()?.enabled !== false);
      if (!roleDoc.exists()) setError("This account is not registered as an admin. Ask a project owner to authorize its UID in Firestore.");
    } catch (e) { setError(e.message || "Could not verify admin access."); }
    finally { setCheckingRole(false); }
  }), []);

  useEffect(() => {
    if (!user || !authorized) { setPlayers([]); setLoadingPlayers(false); return; }
    setLoadingPlayers(true);
    return onSnapshot(query(collection(db, "players"), orderBy("score", "desc")), (snap) => {
      setPlayers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoadingPlayers(false);
    }, (e) => { setError(e.message || "Could not load players."); setLoadingPlayers(false); });
  }, [user, authorized]);

  const stats = useMemo(() => ({
    total: players.length,
    active: players.filter(p => (p.status || "ACTIVE") === "ACTIVE").length,
    completed: players.filter(p => p.status === "MISSION_COMPLETE").length,
    xp: players.reduce((sum, p) => sum + Math.min(MAX_SCORE, Math.max(0, Number(p.score) || 0)), 0),
    perfect: players.filter(p => Number(p.score) >= MAX_SCORE).length
  }), [players]);

  async function login(e) {
    e.preventDefault(); setError("");
    try { await signInWithEmailAndPassword(auth, email.trim(), password); setPassword(""); }
    catch (e) { setError(e.code === "auth/invalid-credential" ? "Incorrect email or password." : (e.message || "Sign-in failed.")); }
  }

  async function updateStatus(player, status) {
    setBusyId(player.id); setError("");
    try { await setPlayerStatus(player.id, status); }
    catch (e) { setError(e.message || "Could not update player."); }
    finally { setBusyId(""); }
  }
  async function deletePlayer(player) {
    if (!window.confirm(`Permanently remove ${player.agentName || player.id}? This cannot be undone.`)) return;
    setBusyId(player.id); setError("");
    try { await removePlayer(player.id); }
    catch (e) { setError(e.message || "Could not remove player."); }
    finally { setBusyId(""); }
  }

  return <div className="admin-root">
    <MatrixRain /><ShadowSilhouette /><RotatingGlobe /><div className="admin-vignette" aria-hidden="true" />
    <div className="admin-foreground admin-foreground-scroll">
      {(!user || !authorized) ? <section className="admin-glass-panel admin-auth-card">
        <div className="admin-panel-header"><div><h1>OPERATION SHADOW GRID</h1><p>Central Command · Admin Authentication</p></div><span className="admin-live-pill">SECURE LOGIN</span></div>
        {checkingRole ? <p className="admin-note">Verifying account permissions…</p> : user ? <>
          <p className="admin-note">Signed in as <strong>{user.email}</strong>, but this account has no admin permission.</p>
          <p className="admin-note">Firebase UID: <code>{user.uid}</code></p>
          <button className="admin-action" onClick={() => signOut(auth)}>Sign out</button>
        </> : <form className="admin-login-form" onSubmit={login}>
          <label>Email address<input type="email" autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} required /></label>
          <label>Password<input type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required /></label>
          <button className="admin-action" type="submit">Sign in to Admin Panel</button>
        </form>}
        {error && <p className="admin-error" role="alert">{error}</p>}
        <p className="admin-note">Admin accounts must be created in Firebase Authentication and explicitly authorized in the Firestore <code>admins</code> collection.</p>
      </section> : <section className="admin-glass-panel admin-console">
        <div className="admin-panel-header"><div><h1>OPERATION SHADOW GRID</h1><p>Central Command · Live Operations Console</p></div><div className="admin-header-actions"><span className="admin-live-pill"><span className="admin-live-dot"/> LIVE</span><button className="admin-action admin-action-small" onClick={() => signOut(auth)}>Log out</button></div></div>
        {error && <p className="admin-error" role="alert">{error}</p>}
        <div className="admin-stat-grid">
          <Stat label="Total Players" value={stats.total} /><Stat label="Active Players" value={stats.active} /><Stat label="Missions Complete" value={stats.completed} /><Stat label="Perfect Scores" value={stats.perfect} /><Stat label="Total XP Earned" value={stats.xp.toLocaleString()} />
        </div>
        <div className="admin-section-title"><div><h2>Live Leaderboard</h2><p>Score cap: {MAX_SCORE} XP · Phase 10 awards no XP</p></div>{loadingPlayers && <span className="admin-note">Refreshing…</span>}</div>
        <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>#</th><th>Agent</th><th>Phase</th><th>Status</th><th>Score</th><th>Player Management</th></tr></thead><tbody>
          {!loadingPlayers && !players.length && <tr><td colSpan={6} className="admin-table-empty">No player records yet.</td></tr>}
          {players.map((p, i) => <tr key={p.id}><td className="admin-rank">{String(i + 1).padStart(2, "0")}</td><td className="admin-agent-name">{p.agentName || p.id}</td><td><span className="admin-phase-pill">{Math.min(p.currentPhase || 1, TOTAL_PHASES)}/{TOTAL_PHASES}</span><small className="admin-subline">{(p.completedPhases || []).length} phases cleared</small></td><td><span className={`admin-status admin-status-${(p.status || "ACTIVE").toLowerCase()}`}>{p.status === "MISSION_COMPLETE" ? "CASE CLOSED" : p.status === "SUSPENDED" ? "SUSPENDED" : "ACTIVE"}</span></td><td className="admin-score-cell"><div className="admin-score-bar-bg"><div className="admin-score-bar-fill" style={{width: `${Math.min(100, Math.max(0, (Number(p.score) || 0) / MAX_SCORE * 100))}%`}} /></div><span className="admin-score-val">{Math.min(MAX_SCORE, Math.max(0, Number(p.score) || 0))} / {MAX_SCORE} XP</span></td><td><div className="admin-row-actions"><button disabled={busyId === p.id} className="admin-action admin-action-small" onClick={() => updateStatus(p, p.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED")}>{p.status === "SUSPENDED" ? "Reactivate" : "Suspend"}</button><button disabled={busyId === p.id} className="admin-action admin-action-small admin-danger" onClick={() => deletePlayer(p)}>Remove</button></div></td></tr>)}
        </tbody></table></div>
      </section>}
    </div>
  </div>;
}
function Stat({ label, value }) { return <div className="admin-stat"><span>{label}</span><strong>{value}</strong></div>; }
