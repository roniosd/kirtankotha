# কীর্তনকথা

A small, single-page Bengali lyrics library built with Next.js App Router, React, MongoDB/Mongoose, bcryptjs, jose and Zod. Search title/lyrics, filter category/type, read complete lyrics in a dialog, sign up/sign in, and submit lyrics without leaving the homepage. Name is optional. No audio uploads, admin panel or extra pages.

## Run

Node.js 20.9+ (Node 22 LTS recommended).

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Edit `.env.local` before running:
- `MONGODB_URI`: local MongoDB URL provided in the example, or your real MongoDB Atlas connection string. The demo URI is a placeholder/local server, not a hosted database.
- `AUTH_SECRET`: generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
- `NEXT_PUBLIC_DEMO_MODE=false`: real backend. Set true and rebuild for read-only design demonstration. Demo never creates accounts or saves submissions.

Visit http://localhost:3000. Register with email/password (8–72 characters); optional name. Submit a title, category, type (কীর্তন/গান), and lyrics. Uploaded lyrics persist in MongoDB and appear before six public-domain sample excerpts. Sample excerpts are intentionally short; replace `lib/songs.js` with your own complete licensed/public-domain lyrics.

## Production

```bash
npm run build
npm start
```

Deploy this project to a Node.js-compatible Next.js host. Add the environment variables in the host settings and allow its network access in Atlas. Never commit `.env.local`. The preview is a static, read-only design demo; the downloadable project includes real server APIs. Do not enable `output: 'export'` for the full project.

## Structure

- `app/page.jsx`: only content page
- `components/Home.jsx`: responsive UI and dialogs
- `app/api/auth/route.js`: registration, login, session, logout
- `app/api/songs/route.js`: public list and authenticated submission
- `lib/DatabaseConnection.js`: cached MongoDB connection
- `lib/auth.js`: signed 7-day HttpOnly cookie sessions and origin checks
- `models/`: User and Song schemas

Only necessary dependencies were retained from the reference e-commerce stack. Passwords are hashed with bcryptjs (no native bcrypt build). JWT sessions use SameSite=Lax and Secure in production. APIs validate input and never return password hashes or public user emails. No email verification or password recovery is included, as requested. Before a public launch add host-level rate limits to authentication/submission endpoints; accounts are not email-verified. Search is client-side and the list endpoint returns the full collection, appropriate for a small lyrics library.

## Verification

Production build checked. Browser UI checked separately on the static demo. A real MongoDB credential was not supplied, so live registration/database persistence must be verified after configuring your database.

## Updated devotional UI

Saffron/ivory theme with a generated temple illustration, lotus/flame motifs, Bengali devotional copy and scrollable category filters. Replace `components/Home.jsx`, `app/globals.css`, `lib/songs.js` and copy `public/images/devotional-temple.webp` into an existing copy to update only the UI/categories. Backend behavior is unchanged.

## Favorites

Each song has a heart button. Signed-in users can add/remove favorites and use the “প্রিয় গান” filter on the homepage. Favorites are stored in the owning User document as string song IDs (including sample song IDs). The authenticated `/api/favorites` endpoint supports GET and idempotent PUT `{ songId, favorite }`; visitors cannot read or change another account’s favorites. The static preview saves demo favorites only in the current browser.

To update an existing project copy `components/Home.jsx`, `app/globals.css`, `lib/songs.js`, `public/images/devotional-temple.webp`, `models/User.js`, and `app/api/favorites/route.js`. Restart the server so Mongoose reloads the User schema. Keep your existing `.env.local`.
