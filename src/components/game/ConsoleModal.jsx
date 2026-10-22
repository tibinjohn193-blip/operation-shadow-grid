import { useEffect, useState } from "react";
import PhaseModule from "./PhaseModule.jsx";
import AgentXChat from "./AgentXChat.jsx";
import { phases } from "../../data/phases.js";

export default function ConsoleModal({ phaseNumber, isOpen, onClose, onAutoComplete }) {
  const phase = phases[phaseNumber];
  const [agentMessages, setAgentMessages] = useState([]);

  // Reset the comms pane with a fresh intro line every time the modal opens
  // for a (possibly new) phase — mirrors the original openConsoleModal().
  useEffect(() => {
    if (isOpen && phase) {
      setAgentMessages([phase.agentModalIntro || phase.agentTermHint]);
    }
  }, [isOpen, phaseNumber]); // eslint-disable-line react-hooks/exhaustive-deps

  const pushAgentLine = (html) => setAgentMessages((prev) => [...prev, html]);

  if (!phase) return null;

  return (
    <div id="console-modal" style={{ display: isOpen ? "flex" : "none" }}>
      <div className="console-modal-box">
        <div className="term-bar">
          <span id="console-modal-title">{phase.modalTitle || phase.title.toUpperCase()}</span>
          <button
            onClick={onClose}
            style={{ background: "#222934", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer" }}
          >
            CLOSE [X]
          </button>
        </div>
        <div className="console-modal-row">
          <div className="console-modal-body" id="console-modal-body">
            {isOpen && <PhaseModule phaseNumber={phaseNumber} onAgentLine={pushAgentLine} onAutoComplete={onAutoComplete} />}
          </div>
          <AgentXChat chatId="console-agent-chat" variant="console" messages={agentMessages} />
        </div>
      </div>
    </div>
  );
}
