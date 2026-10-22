import { db } from "./firebase.js";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  collection,
  onSnapshot,
  query,
  orderBy,
  arrayUnion,
  runTransaction,
  deleteDoc
} from "firebase/firestore";

const PLAYERS_COLLECTION = "players";

/** Turns "Agent Nova!!" into "agent-nova" so it's a safe, stable Firestore doc id. */
export function slugifyAgentName(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60) || "agent-unknown";
}

/**
 * Creates the player's Firestore document on first login, or loads the
 * existing one if this Agent Name has already been used on this project.
 * Returns the player's current state: { id, agentName, currentPhase, score, completedPhases, status }.
 */
export async function loginOrCreatePlayer(agentName) {
  const id = slugifyAgentName(agentName);
  const ref = doc(db, PLAYERS_COLLECTION, id);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    return { id, ...snap.data() };
  }

  const initialState = {
    agentName: agentName.trim(),
    currentPhase: 1,
    score: 0,
    completedPhases: [],
    status: "ACTIVE",
    createdAt: serverTimestamp(),
    lastUpdated: serverTimestamp()
  };

  await setDoc(ref, initialState);
  return { id, ...initialState };
}

/**
 * Called every time a player clears one of the 9 actionable phases.
 * Phases 1-9 each award 100 XP (max 900). Phase 10 is the narrative
 * climax only — call markMissionComplete() for that instead, no points.
 */
export async function recordPhaseComplete(playerId, phaseNumber, pointsForPhase = 100) {
  const ref = doc(db, PLAYERS_COLLECTION, playerId);
  if (!Number.isInteger(phaseNumber) || phaseNumber < 1 || phaseNumber > 9) {
    throw new Error("Only phases 1–9 award XP.");
  }
  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(ref);
    if (!snap.exists()) throw new Error("Player record not found.");
    const data = snap.data();
    const completed = Array.isArray(data.completedPhases) ? data.completedPhases : [];
    if (completed.includes(phaseNumber)) throw new Error("This phase has already been scored.");
    const safePoints = Math.max(0, Math.min(100, Number(pointsForPhase) || 0));
    transaction.update(ref, {
      currentPhase: Math.min(10, Math.max(Number(data.currentPhase) || 1, phaseNumber + 1)),
      score: Math.min(900, Math.max(0, Number(data.score) || 0) + safePoints),
      completedPhases: arrayUnion(phaseNumber),
      lastUpdated: serverTimestamp()
    });
  });
}

/** Phase 10: narrative-only climax. No XP, just marks the case closed. */
export async function markMissionComplete(playerId) {
  const ref = doc(db, PLAYERS_COLLECTION, playerId);
  await updateDoc(ref, {
    currentPhase: 10,
    status: "MISSION_COMPLETE",
    lastUpdated: serverTimestamp()
  });
}

/**
 * Live subscription used by the Admin Dashboard leaderboard.
 * Fires `callback(players[])` immediately and on every Firestore change.
 * Returns an unsubscribe function — call it in a useEffect cleanup.
 */
export function subscribeToLeaderboard(callback) {
  const q = query(collection(db, PLAYERS_COLLECTION), orderBy("score", "desc"));
  return onSnapshot(q, (querySnapshot) => {
    const players = querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(players);
  });
}


export async function setPlayerStatus(playerId, status) {
  if (!["ACTIVE", "MISSION_COMPLETE", "SUSPENDED"].includes(status)) throw new Error("Invalid player status.");
  await updateDoc(doc(db, PLAYERS_COLLECTION, playerId), { status, lastUpdated: serverTimestamp() });
}

export async function removePlayer(playerId) {
  await deleteDoc(doc(db, PLAYERS_COLLECTION, playerId));
}
