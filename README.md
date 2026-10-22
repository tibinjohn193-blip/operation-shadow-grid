# Operation Shadow Grid — React + Firebase

A React (Vite) + Firebase Firestore port of the original single-file
`Operation Shadow Grid` HTML/CSS/JS game, with a live cinematic admin
admin console.

## Routes

- **`/`** — the player game (10-phase investigation, Director/Agent X
  dialogue, terminal, interactive modules, finale).
- **`/admin`** — a cinematic, glassmorphism live leaderboard: matrix rain,
  a shadow-agent silhouette, a rotating globe focused on India, and a
  real-time Firestore-backed player table.

## 1. Setup

```bash
npm install
cp .env.example .env
# fill in your Firebase web app config in .env
npm run dev
```

Open `http://localhost:5173/` for the game and
`http://localhost:5173/admin` for the protected admin login.

## 2. Firebase project setup

1. Create a Firebase project at https://console.firebase.google.com.
2. Enable **Firestore Database**.
3. Firebase Console → Authentication → Sign-in method → enable **Email/Password**.
4. Project Settings → General → "Your apps" → add a **Web app**, copy the
   config values into `.env` (see `.env.example`).
5. Deploy the included Firestore rules:
   ```bash
   firebase deploy --only firestore:rules
   ```
   These rules allow only authorized admin accounts to change player status or delete player records. Review and test them before production use.

No Firebase Auth is used for the player login — "Agent Name" is a simple
display-name login (per the brief), slugified into a stable Firestore
document ID under the `players` collection. Returning players with the same
Agent Name resume their saved progress automatically (the name is cached in
`localStorage`).

## 3. Firestore data model

Collection: **`players`**, one document per Agent:

```jsonc
{
  "agentName": "AGENT_NOVA",
  "currentPhase": 4,            // 1-10
  "score": 300,                 // 0-900, +100 per cleared Phase 1-9
  "completedPhases": [1, 2, 3], // used to rebuild the Findings/Vault drawer
  "status": "ACTIVE",           // or "MISSION_COMPLETE"
  "createdAt": <serverTimestamp>,
  "lastUpdated": <serverTimestamp>
}
```

- `src/firebase/playerRepo.js` — all Firestore reads/writes
  (`loginOrCreatePlayer`, `recordPhaseComplete`, `markMissionComplete`,
  `subscribeToLeaderboard`).
- `src/hooks/usePlayerProgress.js` — player-side React hook wrapping the
  above with local state + localStorage session resume.
- `src/hooks/useLeaderboard.js` — admin-side live `onSnapshot` subscription.


## 4. Admin login and authorization

1. In Firebase Console → Authentication → Users, choose **Add user** and create the admin email/password.
2. Copy that user's **UID** from the Authentication users list.
3. In Firestore Database, create a collection named `admins` if it does not exist. Create a document whose **document ID is exactly the Firebase Auth UID**. Add field `enabled` (boolean) = `true`. Do not use the email address as the document ID.
4. Run the app and open `http://localhost:5173/admin`. Sign in with that Firebase email/password. The page checks the matching `admins/{UID}` record before showing admin tools.
5. To revoke admin access, set `enabled` to `false` or remove that role document. Admin role documents are provisioned in the Firebase Console; client writes to `admins` are denied by the rules.

Admin panel features: live leaderboard, total/active/completed/perfect-score metrics, suspend/reactivate status flag, and remove-player action. The status flag is an administrative record; it does not by itself authenticate player sessions or block a player from starting again, because player login remains display-name based.

## 5. Scoring

Phases 1–9 award 100 XP each; maximum score is **900 XP**. Phase 10 is narrative-only and awards no points. The scoring function rejects duplicate phase awards and caps each award at 100 XP and the total at 900 XP.

## 6. What was ported 1:1 vs. newly added

**Untouched / ported verbatim** (per the brief's "don't change the
hacker-theme CSS, HTML layout, or terminal commands" rule):

- `src/styles/theme.css` is the *exact* original `<style>` block.
- `src/data/radarSvgMarkup.js` is the *exact* original orthographic
  world-map SVG (beacons, paths, gradients) — injected via
  `dangerouslySetInnerHTML` in `RadarMap.jsx` rather than hand-retyped as
  JSX, specifically so no path data could drift.
- All terminal commands (`wget`, `strings`, `exiftool -c "%f"`,
  `tcpdump`), the tinyurl artifact URLs, the simulated command output text,
  and every accepted flag value are copied from the original build.
- Director / Agent X dialogue per phase in `src/data/phases.js` matches the
  latest story pass (Kathmandu → Palakkad, Kerala twist).

**Newly added for the React/Firebase port:**

- `src/styles/game.css` — a few lines of wrapper CSS (`.dashboard-shell`),
  needed only because React mounts into a single `#root` div instead of
  `<body>` owning the flex layout directly. No original selectors changed.
- All component boundaries (`MissionDashboard`, `Terminal`, `AgentXChat`,
  `PhaseModule`, `ConsoleModal`, etc.) — the original was one big inline
  `<script>` block; this splits it into React components with equivalent
  behavior.
- Firestore wiring (`playerRepo.js`, the two hooks) and the entire `/admin`
  cinematic dashboard (`MatrixRain`, `ShadowSilhouette`, `RotatingGlobe`,
  `LiveLeaderboard`) are new.
- One intentional gameplay fix: the original build had Phase 9's narrated
  kill-switch code (`abort_payload_2026`) not match its actually-accepted
  flag (`trigger_omega`). This port makes them match (`abort_payload_2026`)
  so the phase is completable as written.

## 7. Project structure

```
operation-shadow-grid/
├── index.html
├── package.json / vite.config.js
├── .env.example
├── firestore.rules
└── src/
    ├── main.jsx, App.jsx
    ├── firebase/
    │   ├── firebase.js        # Firebase app + Firestore init
    │   └── playerRepo.js      # all Firestore reads/writes
    ├── hooks/
    │   ├── usePlayerProgress.js
    │   └── useLeaderboard.js
    ├── data/
    │   ├── phases.js          # 10-phase config, flags, scoring constants
    │   └── radarSvgMarkup.js  # verbatim original map SVG
    ├── components/
    │   ├── game/               # Sidebar, MetricsRow, RadarMap, Terminal,
    │   │                        # AgentXChat, PhaseModule, ConsoleModal,
    │   │                        # DirectiveStream, FlagSubmitBar,
    │   │                        # EvidenceDrawer, FinaleOverlay, ...
    │   └── admin/               # MatrixRain, ShadowSilhouette,
    │                             # RotatingGlobe, LiveLeaderboard
    ├── pages/
    │   ├── PlayerGamePage.jsx   # route "/"
    │   └── AdminDashboardPage.jsx # route "/admin"
    └── styles/
        ├── theme.css           # original theme, verbatim
        ├── game.css            # minimal additive wrapper CSS
        └── admin.css           # cinematic /admin styling
```
