# CineMatch

> A full-stack, cross-platform movie discovery app that turns browsing into a personal, persistent watchlist experience.

CineMatch is a React Native application built with Expo. Users can discover movies, search the TMDB catalogue, watch trailers, explore cast details, and save movies to a private cloud-backed watchlist. It is designed as a portfolio project that demonstrates mobile UI development, real authentication, secure data access, and deployment-ready engineering.

**Project status:** Actively developed · Authentication and cloud persistence are live · Web deployment is configured but **not deployed yet**.

## Why this project stands out

- **Real user accounts:** Email/password sign-up, sign-in, persistent sessions, profile updates, and password changes via Supabase Auth.
- **Secure cloud data:** Every user gets an independent watchlist stored in Postgres. Row Level Security ensures users can only read or change their own records.
- **Polished mobile experience:** Onboarding, animated startup loader, dark mode, responsive navigation, movie details, trailers, cast, reviews, and a dedicated profile area.
- **Production-minded configuration:** Secrets stay out of source control, environment variables are documented, and the project can export a static web build successfully.

## Features

| Area | What it includes |
| --- | --- |
| Discovery | Popular movie browsing, search, movie details, genres, ratings, cast, and reviews |
| Video | In-app YouTube trailer playback with a graceful fallback when no trailer is available |
| Personalisation | Per-account cloud watchlist, profile editing, dark mode, and onboarding state |
| Authentication | Secure sign-up/sign-in, persisted sessions, sign-out, email confirmation support, and password updates |
| User experience | Animated CineMatch loading screen, loading states, error handling, and adaptive navigation |

## Architecture

```text
Expo / React Native client
        │
        ├── TMDB API ───────────────► movie catalogue, images, trailers, cast, reviews
        │
        └── Supabase
              ├── Auth ─────────────► email/password accounts and sessions
              └── Postgres + RLS ───► private watchlist_items per signed-in user
```

The app uses the Supabase publishable key only in the client. It never contains a privileged `service_role` key. The database access rules in [`supabase/schema.sql`](./supabase/schema.sql) enforce data ownership on the server, rather than relying only on frontend checks.

## Tech stack

- **Mobile / web:** React Native, Expo SDK 54, React Navigation
- **Backend as a service:** Supabase Auth and Postgres
- **Data security:** Supabase Row Level Security (RLS)
- **Movie data:** TMDB API
- **Media:** YouTube iframe player
- **Web deployment readiness:** Expo static export + Vercel configuration

## Run locally

### Prerequisites

- Node.js 20 LTS or later
- Expo Go on Android/iOS (optional, for physical-device testing)
- A free Supabase project and TMDB API key

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/cinematch.git
cd cinematch
npm install
cp .env.example .env
```

Add your values to `.env`:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-publishable-key
EXPO_PUBLIC_TMDB_API_KEY=your-tmdb-api-key
```

> `.env` is ignored by Git. Never put a Supabase secret/service-role key in a React Native or web client.

### Configure the database once

1. Create a free project in [Supabase](https://supabase.com/dashboard).
2. In **SQL Editor**, run the complete contents of [`supabase/schema.sql`](./supabase/schema.sql).
3. In **Authentication → Providers → Email**, keep email/password enabled. Email confirmation can be disabled temporarily during local testing.

### Start the app

```bash
npx expo start --clear
```

Scan the QR code with Expo Go, press `a` for Android, `i` for iOS, or `w` for the web version.

## Quality checks

```bash
# Create the production-ready static web bundle
npm run build:web
```

The build exports to `dist/`, which is intentionally excluded from version control. The current web build completes successfully.

## Deployment plan

Deployment has **not** happened yet. The repository is prepared for a free Vercel deployment using [`vercel.json`](./vercel.json):

1. Push this repository to GitHub.
2. Import it into Vercel.
3. Add the same `EXPO_PUBLIC_*` variables in Vercel’s environment settings.
4. Vercel runs `npm run build:web` and publishes `dist/`.
5. Add the final Vercel URL to Supabase Auth’s Site URL and Redirect URLs.

For an installable mobile build, Expo EAS Build is the next step after testing in Expo Go.

## What I learned / engineering decisions

- Chose Supabase instead of a custom Node/MongoDB backend to deliver authentication, database persistence, and authorization with less operational overhead.
- Used RLS policies as the source of truth for authorization, so a malicious client cannot access another user’s saved movies by changing a frontend request.
- Stored full movie snapshots as JSON alongside TMDB IDs, allowing the watchlist to render quickly without re-fetching every movie.
- Kept API configuration in environment variables and added a clear setup screen for missing cloud configuration.
- Added a web build pipeline early, catching a browser-only trailer dependency before deployment.


## Future improvements

- Deploy the Expo web build to Vercel and add a live demo link.
- Add password-reset deep linking and social sign-in.
- Add watchlist categories, sorting, and offline caching.
- Add automated tests and CI checks.

## Attribution

This product uses the TMDB API but is not endorsed or certified by TMDB.
