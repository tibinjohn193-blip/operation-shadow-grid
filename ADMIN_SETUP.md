# Operation Shadow Grid — Admin Setup

## Run locally

1. Install Node.js 18+.
2. Extract the project ZIP and open a terminal in `operation-shadow-grid/`.
3. Run `npm install`.
4. Copy `.env.example` to `.env` and fill in the Firebase Web App config from Firebase Console → Project settings → General → Your apps.
5. In Firebase Console, enable Firestore Database and Authentication → Sign-in method → Email/Password.
6. Deploy `firestore.rules` with Firebase CLI (`firebase login`, `firebase init firestore` if needed, then `firebase deploy --only firestore:rules`).
7. Run `npm run dev` and open `http://localhost:5173/admin`.

## Create an admin account

1. Firebase Console → Authentication → Users → Add user. Create the administrator email and password.
2. Copy the user's UID.
3. Firestore → create collection `admins` → create a document whose document ID is exactly that UID.
4. Add field `enabled` with type Boolean and value `true`.
5. Sign in at `/admin` using that email and password. The app checks `admins/{UID}` before displaying admin functions.

If login succeeds but access is denied, verify the UID document exists, `enabled` is Boolean `true`, and the deployed Firestore rules are current. Never place service-account credentials in a Vite `.env` file or client-side code.

## Admin tools

- Live leaderboard ordered by score.
- Mission statistics: total players, active status, completed missions, perfect scores, and total XP.
- Player Management: suspend/reactivate status flag and remove a player record.
- Logout.

The suspend flag is currently a management/status label; player sessions still use a display name rather than Firebase Auth, so it does not prevent a player from reconnecting with another name. Removing a player record is permanent. Review the Firestore rules and test with a non-admin account before production use.

## Scoring

Phases 1–9 award 100 XP each, for a normal app maximum of 900 XP. Phase 10 awards no XP. Duplicate phase completions are rejected by the transaction-based scoring function. Because player gameplay itself is not authenticated, client-side scoring is not cheat-proof; for a production competition, move score awarding to a trusted backend/Cloud Function and bind player records to authenticated UIDs.
