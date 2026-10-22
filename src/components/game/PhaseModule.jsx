import { useRef, useState } from "react";
import { phases } from "../../data/phases.js";

const INTERCEPT_FILES = phases[6].files;

/**
 * One component, switched by `phase.moduleKind`, covering every Phase 4-9
 * widget. Each branch mirrors the original buildModule4()...buildModule9()
 * HTML strings and their companion runTcpDump()/runB64Decode()/
 * attemptPortalPing()/attemptSqliBypass()/runHashCrack() handlers exactly —
 * same URLs, same simulated output text, same payload/flag logic.
 *
 * `onAgentLine(text)` pushes a live line into the Agent X pane next to this
 * module. `onAutoComplete()` is only used by Phase 8 (SQLi bypass), which
 * advances the phase directly on success instead of via the flag field.
 */
export default function PhaseModule({ phaseNumber, onAgentLine, onAutoComplete }) {
  const phase = phases[phaseNumber];

  if (phase.moduleKind === "map-link") return <MapLinkModule phase={phase} />;
  if (phase.moduleKind === "tcpdump") return <TcpDumpModule phase={phase} onAgentLine={onAgentLine} />;
  if (phase.moduleKind === "crypto-decoder") return <CryptoDecoderModule onAgentLine={onAgentLine} />;
  if (phase.moduleKind === "c2-fingerprint") return <C2FingerprintModule phase={phase} onAgentLine={onAgentLine} />;
  if (phase.moduleKind === "sqli-bypass") return <SqliBypassModule phase={phase} onAgentLine={onAgentLine} onAutoComplete={onAutoComplete} />;
  if (phase.moduleKind === "hash-crack") return <HashCrackModule phase={phase} onAgentLine={onAgentLine} />;
  return null;
}

// ===== Phase 4: Ground Surveillance (map link) =====
function MapLinkModule({ phase }) {
  const { lat, lng } = phase.mapCoords;
  return (
    <div className="pm-flex">
      <div className="pm-center">
        <div className="pm-tag">[LIVE SATELLITE LINK ESTABLISHED]</div>
        <div className="pm-copy">
          Secure connection to Google Maps is ready. Use the exact coordinates extracted from the terminal{" "}
          <b style={{ color: "#fff" }}>
            ({lat}, {lng})
          </b>{" "}
          to locate the physical meeting point. Inspect Street View for a local cafe/restaurant offering open
          Wi-Fi.
        </div>
        <a className="pm-link-btn" href={`https://maps.google.com/?q=${lat},${lng}`} target="_blank" rel="noopener noreferrer">
          LAUNCH EXTERNAL MAPS ↗
        </a>
        <div className="pm-copy" style={{ marginTop: "4px" }}>
          Report the exact signage name of the cafe (format:{" "}
          <code style={{ background: "#0c0e12", color: "var(--accent-orange)", padding: "2px 6px", borderRadius: "3px" }}>
            Name Cafe-Restaurant
          </code>
          ) in the field below.
        </div>
      </div>
    </div>
  );
}

// ===== Phase 5: Network Traffic Interception =====
function TcpDumpModule({ phase, onAgentLine }) {
  const [log, setLog] = useState("Initializing interface eth0... OK.\nAwaiting command...");
  const [cmd, setCmd] = useState("");
  const pcapGotRef = useRef(false);
  const consoleRef = useRef(null);

  const append = (text) => {
    setLog((prev) => prev + text);
    requestAnimationFrame(() => {
      if (consoleRef.current) consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    });
  };

  const runTcpDump = () => {
    const val = cmd.trim().toLowerCase();
    setCmd("");
    append(`\nroot@interceptor:~# ${val}`);

    if (val === "clear") {
      setLog("");
    } else if (val.startsWith("wget")) {
      if (!val.includes("tinyurl.com/intercept-pcap-05")) {
        append(
          "\nResolving relay node... connected.\nHTTP request sent, awaiting response... 404 Not Found\nThis link is dead or expired. Check Agent X's latest brief for the correct artifact URL."
        );
        onAgentLine("That URL's wrong — copy it exactly: <code>wget https://tinyurl.com/intercept-pcap-05</code>");
      } else {
        pcapGotRef.current = true;
        append(
          "\nResolving relay node... connected.\nHTTP request sent, awaiting response... 200 OK\nLength: 1248 (1.2K) [application/vnd.tcpdump.pcap]\nSaving to: 'intercept.pcap'\nintercept.pcap 100%[===================>] 1.2K --.-KB/s in 0.01s\nSaved to local buffer."
        );
        onAgentLine("Pcap's down. Now run <code>tcpdump intercept.pcap</code> to replay the capture.");
      }
    } else if (val === "ls") {
      append("\n" + (pcapGotRef.current ? "intercept.pcap" : "(directory empty)"));
    } else if (val.includes("tcpdump") && val.includes("intercept.pcap")) {
      if (!pcapGotRef.current) {
        append("\ntcpdump: 'intercept.pcap': No such file or directory. Run wget first.");
        onAgentLine("Nothing to read yet — pull the pcap with wget before running tcpdump.");
      } else {
        append("\nReading from file intercept.pcap, link-type EN10MB (Ethernet)\n");
        onAgentLine("Replaying the capture now — watch for the handshake with our target's username.");
        setTimeout(() => append("14:22:01 IP 192.168.1.15 > 142.250.192.14: HTTPS [Handshake]\n"), 500);
        setTimeout(() => append("14:22:02 IP 192.168.1.15 > 8.8.8.8: DNS query A\n"), 1000);
        setTimeout(
          () =>
            append(
              "<span style='color:var(--accent-orange); font-weight:bold;'>14:22:04 IP 192.168.1.15 > 45.133.22.10: TCP [SYN] Host: shadow_phantom_99</span>\n"
            ),
          1700
        );
        setTimeout(
          () =>
            append(
              "<span style='color:var(--accent-orange)'>14:22:05 IP 45.133.22.10 > 192.168.1.15: TCP [ACK] Payload Transferring...</span>\n"
            ),
          2300
        );
        setTimeout(() => {
          append("Packet capture complete. 120 packets received.\n");
          onAgentLine("There it is — <b style='color:var(--accent-orange);'>45.133.22.10</b> is our C2. Report that IP in the main console.");
        }, 2900);
      }
    } else if (val === "help") {
      append("\nAvailable commands:\n• wget https://tinyurl.com/intercept-pcap-05\n• tcpdump intercept.pcap\n• ls, clear");
    } else if (val !== "") {
      append(`\nbash: ${val.split(" ")[0]}: command not found`);
    }
  };

  return (
    <div className="pm-flex">
      <div style={{ color: "var(--text-dim)", borderBottom: "1px solid #242a34", paddingBottom: "8px", marginBottom: "10px", fontWeight: "bold", fontSize: "11px", letterSpacing: "1px" }}>
        NETWORK INTERCEPTOR MODULE v2.1
      </div>
      <div id="tcp-console" className="pm-console" ref={consoleRef} dangerouslySetInnerHTML={{ __html: log }} />
      <div className="pm-console-row">
        <span>root@interceptor:~#</span>
        <input
          type="text"
          id="tcp-input"
          autoComplete="off"
          value={cmd}
          onChange={(e) => setCmd(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && runTcpDump()}
        />
      </div>
    </div>
  );
}

// ===== Phase 6: Cryptographic Decryption =====
function CryptoDecoderModule({ onAgentLine }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("// decoded output will appear here");

  const downloadFile = (n) => {
    const blob = new Blob([INTERCEPT_FILES[n]], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `intercept_${n}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    onAgentLine(
      n === 1
        ? "intercept_1.txt saved locally. Paste its contents into the decoder below when you're ready."
        : "intercept_2.txt saved too. Decode this one next — it points at the relay."
    );
  };

  const runDecode = () => {
    try {
      const decoded = atob(input.trim());
      setOutput(decoded);
      if (/SANIMA BANK/i.test(decoded)) {
        onAgentLine("That's the transaction log — <b style='color:var(--accent-green);'>Sanima Bank</b> is the financial institution. Report that in the main console.");
      } else if (/onion/i.test(decoded)) {
        onAgentLine("Relay address confirmed. I've logged the .onion link for Phase 7 — keep decoding the other file for our actual flag.");
      } else {
        onAgentLine("Decoded. Read it carefully — I need the financial institution it names.");
      }
    } catch (e) {
      setOutput("DECODE ERROR: input is not valid Base64.");
      onAgentLine("That didn't decode — make sure you copied the full Base64 string, no line breaks or extra spaces.");
    }
  };

  return (
    <div className="pm-flex" style={{ gap: "12px" }}>
      <div style={{ color: "var(--text-dim)", fontWeight: "bold", fontSize: "11px", letterSpacing: "1px" }}>
        CRYPTOGRAPHIC DECRYPTION MODULE
      </div>
      <div className="pm-file-row">
        <span className="fname">intercept_1.txt (encrypted payload)</span>
        <button className="pm-mini-btn" onClick={() => downloadFile(1)}>[↓] DOWNLOAD</button>
      </div>
      <div className="pm-file-row">
        <span className="fname">intercept_2.txt (encrypted payload)</span>
        <button className="pm-mini-btn" onClick={() => downloadFile(2)}>[↓] DOWNLOAD</button>
      </div>
      <div className="pm-decoder">
        <div className="pm-copy" style={{ marginBottom: "6px" }}>
          Paste a payload's Base64 contents below and decode in-sandbox:
        </div>
        <textarea
          id="b64-input"
          placeholder="Paste Base64 string here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="pm-mini-btn" style={{ marginTop: "8px" }} onClick={runDecode}>
          [▶] DECODE BASE64
        </button>
        <div className="pm-decoded-out" id="b64-output" style={{ marginTop: "10px" }}>
          {output}
        </div>
      </div>
    </div>
  );
}

// ===== Phase 7: Dark Web C2 Login (fingerprint ping) =====
function C2FingerprintModule({ phase, onAgentLine }) {
  const [msg, setMsg] = useState("");

  const ping = () => {
    setMsg(`HANDSHAKE RECEIVED // ACCESS NODE ID: ${phase.nodeId}`);
    onAgentLine(`Node fingerprint captured — <b style='color:var(--accent-green);'>${phase.nodeId}</b>. That's today's flag, report it in the main console.`);
  };

  return (
    <div className="pm-flex pm-center">
      <div className="pm-tag">[DARK WEB RELAY // TOR CIRCUIT ESTABLISHED]</div>
      <div className="c2-portal">
        <div className="c2-url">{phase.onionLink}</div>
        <h3>SHADOW C2 :: ACCESS</h3>
        <input type="text" placeholder="username" />
        <input type="password" placeholder="password" />
        <button onClick={ping}>CONNECT</button>
        <div className="c2-msg" style={{ color: "var(--accent-green)" }}>{msg}</div>
      </div>
    </div>
  );
}

// ===== Phase 8: Authentication Bypass (SQL injection) =====
function SqliBypassModule({ phase, onAgentLine, onAutoComplete }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [msg, setMsg] = useState({ text: "", color: "var(--accent-orange)" });
  const pattern = /'\s*or\s*'?1'?\s*=\s*'?1/i;

  const attempt = () => {
    if (pattern.test(user) || pattern.test(pass)) {
      setMsg({ text: "AUTH BYPASSED // WELCOME, root. SESSION GRANTED.", color: "var(--accent-green)" });
      onAgentLine("Bypass confirmed, you're in as root. Standby — moving you to the kill-switch module.");
      setTimeout(() => onAutoComplete(), 900);
    } else {
      setMsg({ text: "ACCESS DENIED: invalid credentials.", color: "var(--accent-orange)" });
      onAgentLine("No luck. Try the classic bypass again — <code>' OR '1'='1</code> in either field.");
    }
  };

  return (
    <div className="pm-flex pm-center">
      <div className="pm-tag" style={{ color: "var(--accent-orange)" }}>[AUTH BYPASS REQUIRED]</div>
      <div className="pm-copy">
        Standard credentials are rejected. Agent X suspects the login endpoint concatenates input directly into a
        backend query. Try a classic authentication-bypass payload in either field.
      </div>
      <div className="c2-portal">
        <div className="c2-url">shadowgridc2x7f9a2b.onion</div>
        <h3>SHADOW C2 :: ACCESS</h3>
        <input type="text" value={user} onChange={(e) => setUser(e.target.value)} placeholder="username" />
        <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="password" />
        <button onClick={attempt}>LOGIN</button>
        <div className="c2-msg" style={{ color: msg.color }}>{msg.text}</div>
      </div>
    </div>
  );
}

// ===== Phase 9: Malware Kill-Switch (dictionary attack) =====
function HashCrackModule({ phase, onAgentLine }) {
  const [barWidth, setBarWidth] = useState("0%");
  const [log, setLog] = useState("");

  const run = () => {
    setBarWidth("0%");
    setLog("Loading wordlist... 14,902 candidates queued.");
    onAgentLine("Attack's running — give it a few seconds to chew through the wordlist.");
    requestAnimationFrame(() => setBarWidth("100%"));
    setTimeout(() => setLog("Testing candidates... 6,114 / 14,902"), 900);
    setTimeout(() => setLog("Testing candidates... 13,870 / 14,902"), 1800);
    setTimeout(() => {
      setLog("MATCH FOUND // plaintext = abort_payload_2026");
      onAgentLine("Got it — passphrase recovered: <b style='color:var(--accent-green);'>abort_payload_2026</b>. Submit it in the main console to disarm the trigger.");
    }, 2500);
  };

  return (
    <div className="pm-flex pm-center">
      <div className="pm-tag" style={{ color: "#ffaa00" }}>[MALWARE KILL-SWITCH LOCATED]</div>
      <div className="pm-copy">
        The payload's self-destruct trigger is gated behind a hashed passphrase. Run a dictionary attack against
        the extracted hash.
      </div>
      <div className="hash-box">KILL_SWITCH_HASH: {phase.killSwitchHash}</div>
      <button className="pm-link-btn" onClick={run}>[▶] RUN DICTIONARY ATTACK</button>
      <div style={{ width: "100%", maxWidth: "380px" }}>
        <div className="crack-bar-bg">
          <div className="crack-bar-fill" style={{ width: barWidth }} />
        </div>
        <div
          className="crack-log"
          style={log.startsWith("MATCH") ? { color: "var(--accent-green)" } : undefined}
        >
          {log}
        </div>
      </div>
    </div>
  );
}
