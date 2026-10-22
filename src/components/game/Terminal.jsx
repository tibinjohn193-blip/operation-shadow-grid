import { useRef, useState } from "react";
import AgentXChat from "./AgentXChat.jsx";

const INITIAL_LOG =
  "Linux recon-node 6.8.0-generic #1 SMP x86_64\nRoot sandbox shell active. Type 'help' for tactical syntax.\n";

/**
 * Phase 2 & 3 interactive shell. Command behavior (wget / ls / strings /
 * exiftool / help / clear / pwd) is ported 1:1 from the original
 * executeSandboxCommand()/handleTerminalKeys() — same URLs, same output text,
 * same flags embedded in the simulated file system.
 */
export default function Terminal({ isOpen, onClose, agentTermHint }) {
  const [log, setLog] = useState(INITIAL_LOG);
  const [cmd, setCmd] = useState("");
  const fileGotRef = useRef(false);
  const logRef = useRef(null);

  const append = (text) => {
    setLog((prev) => {
      const next = prev + text;
      requestAnimationFrame(() => {
        if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
      });
      return next;
    });
  };

  const executeSandboxCommand = (rawCmd) => {
    const c = rawCmd.toLowerCase().trim();

    if (c === "clear") {
      setLog("");
      return;
    }
    if (c === "pwd") {
      append("\n/root");
      return;
    }
    if (c.startsWith("wget")) {
      if (!c.includes("tinyurl.com/target-evidence-04")) {
        append(
          "\nResolving relay node... connected.\nHTTP request sent, awaiting response... 404 Not Found\nThis link is dead or expired. Check Agent X's latest brief for the correct artifact URL."
        );
        return;
      }
      fileGotRef.current = true;
      append(
        "\nResolving relay node... connected.\nHTTP request sent, awaiting response... 200 OK\nLength: 284192 (278K) [image/jpeg]\nSaving to: 'target_evidence.jpg'\ntarget_evidence.jpg 100%[===================>] 277.53K --.-KB/s in 0.04s\nSaved to local buffer."
      );
      return;
    }
    if (c === "ls") {
      append("\n" + (fileGotRef.current ? "target_evidence.jpg" : "(directory empty)"));
      return;
    }
    if (c.includes("strings") && c.includes("target_evidence.jpg")) {
      if (!fileGotRef.current) {
        append("\nstrings: 'target_evidence.jpg': File not found. Fetch it with wget first.");
        return;
      }
      if (c.includes("grep")) {
        append("\nFLAG: cyber_ghost_2026");
      } else {
        append(
          "\nJFIF\nExif\nOnePlus\nIN2021\nshadow_phantom_99\nFLAG: cyber_ghost_2026\n... [output truncated] ..."
        );
      }
      return;
    }
    if (c.includes("exiftool") && c.includes("target_evidence.jpg")) {
      if (!fileGotRef.current) {
        append("\nexiftool: 'target_evidence.jpg': File not found. Run wget first.");
        return;
      }
      if (/-c\s+["']?%f["']?/.test(c)) {
        append(
          '\nExifTool Version Number         : 12.76\nFile Name                       : target_evidence.jpg\nCamera Model Name               : IN2021\nGPS Latitude                    : 27.711545 N\nGPS Longitude                   : 85.308886 E\nGPS Position                    : 27.711545 N, 85.308886 E'
        );
        return;
      }
      append(
        "\nExifTool Version Number         : 12.76\nFile Name                       : target_evidence.jpg\nCamera Model Name               : IN2021\nGPS Latitude                    : 27 deg 42' 42\" N\nGPS Longitude                   : 85 deg 18' 32\" E\n(Tip: coordinates are rounded. Use the -c switch with the \"%f\" format for full decimal precision.)"
      );
      return;
    }
    if (c === "help") {
      append(
        '\nAvailable commands:\n• wget https://tinyurl.com/target-evidence-04\n• strings target_evidence.jpg | grep FLAG\n• exiftool target_evidence.jpg\n• exiftool -c "%f" target_evidence.jpg\n• ls, pwd, clear'
      );
      return;
    }
    if (!c) return;
    append(`\nbash: ${rawCmd.split(" ")[0]}: command not found. Type 'help' for tactical syntax.`);
  };

  const handleKeyDown = (e) => {
    if (e.key !== "Enter") return;
    const trimmed = cmd.trim();
    append("\nroot@recon-node:~# " + trimmed);
    setCmd("");
    executeSandboxCommand(trimmed);
  };

  return (
    <div id="term-modal" style={{ display: isOpen ? "flex" : "none" }}>
      <div className="terminal-duo-wrapper">
        <div className="terminal-cli-pane">
          <div className="term-bar">
            <span>LINUX SANDBOX // ROOT ENVIRONMENT</span>
            <button
              onClick={onClose}
              style={{ background: "#222934", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer" }}
            >
              ESC [X]
            </button>
          </div>
          <div className="term-screen" id="term-logs" ref={logRef}>
            {log}
          </div>
          <div className="term-input-tray">
            <span className="term-prompt" id="term-user-tag">root@recon-node:~#</span>
            <input
              type="text"
              id="term-input-box"
              className="term-cmd-field"
              autoComplete="off"
              value={cmd}
              onChange={(e) => setCmd(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>

        <AgentXChat chatId="term-agent-chat" variant="terminal" messages={[agentTermHint]} />
      </div>
    </div>
  );
}
