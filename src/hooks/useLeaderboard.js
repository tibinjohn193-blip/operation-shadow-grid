import { useEffect, useState } from "react";
import { subscribeToLeaderboard } from "../firebase/playerRepo.js";

export function useLeaderboard() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToLeaderboard((live) => {
      setPlayers(live);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { players, loading };
}
