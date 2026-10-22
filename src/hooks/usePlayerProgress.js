import { useCallback, useEffect, useState } from "react";
import {
  loginOrCreatePlayer,
  recordPhaseComplete,
  markMissionComplete
} from "../firebase/playerRepo.js";

const STORAGE_KEY = "shadowgrid_agent_name";

export function usePlayerProgress() {
  const [player, setPlayer] = useState(null); // { id, agentName, currentPhase, score, completedPhases, status }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Auto-resume a session if this browser already has an Agent Name saved.
  useEffect(() => {
    const savedName = localStorage.getItem(STORAGE_KEY);
    if (savedName) {
      login(savedName).catch(() => localStorage.removeItem(STORAGE_KEY));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(async (agentName) => {
    setLoading(true);
    setError(null);
    try {
      const state = await loginOrCreatePlayer(agentName);
      localStorage.setItem(STORAGE_KEY, agentName);
      setPlayer(state);
      return state;
    } catch (e) {
      setError(e.message || "Login failed.");
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const completePhase = useCallback(
    async (phaseNumber, pointsForPhase = 100) => {
      if (!player) return;
      await recordPhaseComplete(player.id, phaseNumber, pointsForPhase);
      setPlayer((prev) => ({
        ...prev,
        currentPhase: prev.currentPhase + 1,
        score: prev.score + pointsForPhase,
        completedPhases: [...(prev.completedPhases || []), phaseNumber]
      }));
    },
    [player]
  );

  const completeMission = useCallback(async () => {
    if (!player) return;
    await markMissionComplete(player.id);
    setPlayer((prev) => ({ ...prev, currentPhase: 10, status: "MISSION_COMPLETE" }));
  }, [player]);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setPlayer(null);
  }, []);

  return { player, loading, error, login, completePhase, completeMission, logout };
}
