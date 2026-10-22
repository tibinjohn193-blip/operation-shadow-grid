import { useState } from "react";
import AgentLogin from "../components/game/AgentLogin.jsx";
import IntroStory from "../components/game/IntroStory.jsx";
import MissionDashboard from "../components/game/MissionDashboard.jsx";
import { usePlayerProgress } from "../hooks/usePlayerProgress.js";

export default function PlayerGamePage() {
  const { player, loading, error, login, completePhase, completeMission } = usePlayerProgress();
  const [introSeen, setIntroSeen] = useState(false);

  if (!player) {
    return <AgentLogin onLogin={login} loading={loading} error={error} />;
  }

  // Skip the prologue on returning sessions (player already past Phase 1).
  if (!introSeen && player.currentPhase === 1 && !player.completedPhases?.length) {
    return <IntroStory onCommence={() => setIntroSeen(true)} />;
  }

  return (
    <MissionDashboard
      player={player}
      onCompletePhase={completePhase}
      onCompleteMission={completeMission}
    />
  );
}
