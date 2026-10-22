// ===== Operation Shadow Grid — Phase Configuration =====
// Ported 1:1 from the original single-file game. Director lines live in
// `desc` (Mission Directive), Agent X's lines live in `agentNote` /
// `agentTermHint` / `agentModalIntro`. Terminal commands, URLs and the
// accepted flag values are unchanged from the original HTML build.

export const TOTAL_ACTIONABLE_PHASES = 9; // Phases 1-9 are scored
export const POINTS_PER_PHASE = 100;
export const MAX_SCORE = TOTAL_ACTIONABLE_PHASES * POINTS_PER_PHASE; // 900
export const TOTAL_PHASES = 10; // Phase 10 is the narrative climax (0 pts)

// Base64-encoded accepted answers (unchanged from the original build).
export const encodedFlags = {
  1: ["c2hhZG93X3BoYW50b21fOTk="],
  2: ["Y3liZXJfZ2hvc3RfMjAyNg=="],
  3: ["a2F0aG1hbmR1", "bmVwYWw="],
  4: ["bWl0aG8gY2FmZS1yZXN0YXVyYW50", "bWl0aG8tY2FmZS1yZXN0YXVyYW50", "bWl0aG8gY2FmZSByZXN0YXVyYW50"],
  5: ["NDUuMTMzLjIyLjEw"],
  6: ["c2FuaW1hIGJhbms="],
  7: ["bngtNzc0Mg=="],
  9: ["YWJvcnRfcGF5bG9hZF8yMDI2"] // abort_payload_2026
};

export function checkFlag(phaseNumber, rawInput) {
  const normalized = rawInput.trim().toLowerCase();
  const encoded = typeof window !== "undefined" ? btoa(normalized) : Buffer.from(normalized).toString("base64");
  return (encodedFlags[phaseNumber] || []).includes(encoded);
}

// type: "terminal" (Phase 1-3 style shell), "module" (dedicated interactive
// widget rendered via PhaseModule), or "narrative" (Phase 10, no flag row).
export const phases = {
  1: {
    title: "Phase 1: The Breach Vector",
    type: "terminal",
    desc: "Director Mehra, Cyber Command. We have a confirmed breach at the Kochi data node — a hostile actor forced a valid SSH session at 02:14 AM and is still inside. I need this traced immediately. Pull the raw authentication log and identify the username this intruder is operating under.",
    agentNote: "Pull up server_auth.log and compare the failed login attempts against the one that actually succeeded — that's your target username.",
    agentTermHint: "Examine failed versus accepted password entries inside server_auth.log.",
    actionLabel: "[↓] RETRIEVE SERVER_AUTH.LOG"
  },
  2: {
    title: "Phase 2: Forensic Artifact",
    type: "terminal",
    desc: "That username is flagged system-wide now, but a name alone won't hold up in this fight. Field Unit intercepted an image file tied to this actor — I need it recovered and torn apart before the trail goes cold.",
    agentNote: "Use 'wget' inside the shell to fetch the artifact, then extract the key using 'strings'.",
    agentTermHint: "Run: wget https://tinyurl.com/target-evidence-04 then extract strings: strings target_evidence.jpg | grep FLAG",
    actionLabel: "[> LAUNCH LINUX ROOT TERMINAL]"
  },
  3: {
    title: "Phase 3: Geospatial Extraction",
    type: "terminal",
    desc: "That override key confirms this is a trained operator, not some opportunist. I want this actor's physical location — if that image is carrying unscrubbed GPS data, dig it out. Command needs exact coordinates to move ground assets.",
    agentNote: "Use exiftool with the decimal-format switch inside the terminal to read the GPS Coordinates, then search them on the map.",
    agentTermHint: 'Run: exiftool -c "%f" target_evidence.jpg to print the unscrubbed GPS position as high-precision decimal degrees.',
    actionLabel: "[> LAUNCH LINUX ROOT TERMINAL]"
  },
  4: {
    title: "Phase 4: Ground Surveillance",
    type: "module",
    moduleKind: "map-link",
    desc: "Those coordinates put our target in Kathmandu, Nepal. I'm authorizing ground surveillance on that position right now — I need eyes on whatever's physically operating at that location before this actor moves again.",
    agentNote: "Drop those coordinates into Street View and look around — somewhere near that pin is an open Wi-Fi spot our target's been riding.",
    agentTermHint: "Field tip: look for signage reading 'Name Cafe-Restaurant' near the pin.",
    mapCoords: { lat: 27.711545, lng: 85.308886 }
  },
  5: {
    title: "Phase 5: Network Traffic Interception",
    type: "module",
    moduleKind: "tcpdump",
    desc: "RAW commandos hit that cafe within the hour — but the suspect was already gone. Table abandoned, nothing left behind except a dump pulled from the cafe's router. If our target was online there, that dump is our last lead on their infrastructure.",
    agentNote: "I pulled a Wi-Fi dump (intercept.pcap) straight from that router. Launch the interceptor console, use wget to pull it, then tcpdump to tear it apart for the C2 connection.",
    agentTermHint: "Run: wget https://tinyurl.com/intercept-pcap-05 then tcpdump intercept.pcap. Look for the IP tied to 'Host: shadow_phantom_99'.",
    agentModalIntro: "Step 1: type wget https://tinyurl.com/intercept-pcap-05 to pull the capture. Step 2: once it's saved, run tcpdump intercept.pcap and watch for the IP talking to 'shadow_phantom_99'.",
    actionLabel: "[> LAUNCH NETWORK INTERCEPTOR]",
    modalTitle: "NETWORK INTERCEPTOR // PACKET CAPTURE",
    pcapUrl: "https://tinyurl.com/intercept-pcap-05"
  },
  6: {
    title: "Phase 6: Cryptographic Decryption",
    type: "module",
    moduleKind: "crypto-decoder",
    desc: "Field unit recovered two encrypted files from the scene before the trail went cold. I'm pushing them to you now — I need to know exactly what this network was moving, and who's bankrolling it.",
    agentNote: "Two payloads incoming. Run each through base64 -d in the sandbox — one of them bounces back corrupted, ignore it, but the other cracks open clean and names a bank and a live relay address.",
    agentTermHint: "Download both payloads, decode each in the sandbox — one's garbage, the other decodes clean. Report the financial institution named in the decrypted transaction log.",
    agentModalIntro: "Step 1: download both intercept_1.txt and intercept_2.txt. Step 2: run base64 -d on each in the decoder below — one will fail, that's expected, don't waste time on it. The other decodes clean and names both the bank and the relay I need.",
    actionLabel: "[> LAUNCH CRYPTO CONSOLE]",
    modalTitle: "CRYPTOGRAPHIC DECRYPTION CONSOLE",
    files: {
      1: "VFJBTlNBQ1RJT04gTE9HIDo6IEFDUVVJUkVSPVNBTklNQSBCQU5LIDo6IEFDQ1QjNDQ3MS0yMjkwIDo6IEFNT1VOVD1OUFIgNDgsNTAsMDAwIDo6IFNUQVRVUz1QRU5ESU5HX0FVVEg=",
      2: "QzIgUkVMQVkgTk9ERSA6OiBzaGFkb3dncmlkYzJ4N2Y5YTJiLm9uaW9uIDo6IFBPUlQgOTAwMSA6OiBQUk9UT0NPTD1UT1ItSFMtVjM="
    }
  },
  7: {
    title: "Phase 7: Dark Web C2 Login",
    type: "module",
    moduleKind: "c2-fingerprint",
    desc: "That bank name just lit up every watchlist we have — Sanima Bank is a live target. Command believes a malware payload is staged to hit them through a Dark Web channel tied to this network. I need that channel identified and accessed, now.",
    agentNote: "Portal's live at that onion address. Launch it and hit CONNECT with anything — we're not logging in yet, just fingerprinting the node.",
    agentTermHint: "Any login attempt on the portal will leak an ACCESS NODE ID in the response banner — report that ID.",
    agentModalIntro: "The portal's live. Hit CONNECT with any username/password — we're not trying to log in yet, just fingerprinting the node. Watch the response banner for an ACCESS NODE ID and report it back in the main console.",
    actionLabel: "[> ACCESS DARK WEB PORTAL]",
    modalTitle: "SHADOW C2 // DARK WEB PORTAL",
    onionLink: "shadowgridc2x7f9a2b.onion",
    nodeId: "NX-7742"
  },
  8: {
    title: "Phase 8: Authentication Bypass",
    type: "module",
    moduleKind: "sqli-bypass",
    desc: "Confirmed — that's the deployment channel. Command wants it breached before this payload goes live against Sanima Bank. I don't care how you get in, just get in.",
    agentNote: "Real credentials won't work — this form's vulnerable. Feed it a classic SQL injection and it folds. Try ' OR '1'='1 in either field — no need to type anything in the main console for this one.",
    agentTermHint: "Payload hint: ' OR '1'='1",
    agentModalIntro: "Forget real credentials — this form concatenates your input straight into a backend query. Drop a classic bypass payload like ' OR '1'='1 into either field and hit LOGIN. I'll confirm the moment you're in.",
    actionLabel: "[> ATTEMPT AUTH BYPASS]",
    modalTitle: "SHADOW C2 // AUTH BYPASS",
    autoAdvance: true // success inside the module advances the phase directly, no flag box
  },
  9: {
    title: "Phase 9: Malware Kill-Switch",
    type: "module",
    moduleKind: "hash-crack",
    desc: "IT'S LIVE — the malware countdown just started! Sanima Bank's systems are seconds from being hit. Find that kill-switch and cut it, we do NOT have time to waste!",
    agentNote: "Launch the kill-switch analyzer and run the dictionary attack — the code it needs to crack is abort_payload_2026. The second it confirms, report it below.",
    agentTermHint: "Launch the dictionary attack widget — target code: abort_payload_2026. Submit it the moment it's confirmed.",
    agentModalIntro: "Hit RUN DICTIONARY ATTACK now — we're racing the payload timer. Target passphrase: abort_payload_2026. The moment it locks in, report it in the main console to kill the trigger.",
    actionLabel: "[> LAUNCH KILL-SWITCH ANALYZER]",
    modalTitle: "MALWARE KILL-SWITCH ANALYZER",
    killSwitchHash: "7a2f91c4e6b0d3a9f812bb4e0c55da21"
  },
  10: {
    title: "Phase 10: Endgame Protocol",
    type: "narrative",
    desc: "Threat neutralized — Sanima Bank's systems are secure. Border control just confirmed the arrest of the accomplice operating as 'Agent Nova,' caught trying to cross into Nepal. But interrogation already broke something bigger: 'Agent Nova' was never the architect. Every trail — financial, technical, operational — converges on one operator: Shadow Phantom. Confirmed telemetry puts them operating out of Palakkad, Kerala, India. CHAPTER 1 COMPLETED. THE HUNT BEGINS IN KERALA.",
    agentNote: "System secure. Standing by.",
    agentTermHint: "System secure. Standing by.",
    actionLabel: "[⚠] INITIATE FINAL TAKEDOWN"
  }
};
