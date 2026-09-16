# CineMatch

A polished React Native / Expo movie discovery app powered by TMDB. CineMatch now uses **Supabase Auth** for real email/password accounts and a cloud-synced watchlist protected with Row Level Security (RLS).

## Stack

- React Native + Expo
- React Navigation
- TMDB API for movie data
- Supabase Auth + Postgres for user accounts and saved movies
- Vercel for a free public web demo

## Run it locally

1. Install Node.js 20 LTS and the Expo Go app on your phone.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy `.env.example` to a new `.env` file and add the three values described below. `.env` is ignored by Git.
4. Start the app:

   ```bash
   npx expo start --clear
   ```

   Scan the QR code in Expo Go, or press `w` for the browser version.

## One-time cloud setup (free)

### 1. Create the Supabase project

1. Create a free project at [Supabase](https://supabase.com/dashboard).
2. Open the project’s **Connect** dialog (or **Project Settings → API**) and copy the **Project URL** and **publishable / anon key**.
3. Put them in `.env`:

   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-publishable-or-anon-key
   EXPO_PUBLIC_TMDB_API_KEY=your-tmdb-api-key
   ```

   The Supabase publishable/anon key is designed for a client app; the table’s RLS policies protect user data. Never use a `service_role` key in this project.

4. In Supabase, open **SQL Editor → New query**, paste the complete contents of [`supabase/schema.sql`](./supabase/schema.sql), and click **Run**. This creates `watchlist_items` and access rules so every account can only access its own list.
5. Go to **Authentication → Providers → Email**. Email/password is enabled by default. For quick testing, you may turn **Confirm email** off. For a portfolio deployment, keep it on.

Supabase’s default email service is appropriate for light testing; use a custom SMTP provider before a high-volume public launch.

### 2. Get a TMDB key

1. Create an account at [TMDB](https://www.themoviedb.org/settings/api).
2. Request an API key and set `EXPO_PUBLIC_TMDB_API_KEY` in `.env`.
3. Restrict the key in the TMDB dashboard if you publish the web app.

## Deploy a free web demo with Vercel

This is the strongest résumé-friendly option: one shareable URL that opens in any browser.

1. Create a GitHub repository and push this project:

   ```bash
   git add .
   git commit -m "Add Supabase auth and cloud watchlists"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/cinematch.git
   git push -u origin main
   ```

2. Create a Vercel account, select **Add New → Project**, import the GitHub repository, and use the project root as the root directory.
3. Vercel reads [`vercel.json`](./vercel.json). Confirm the build command is `npm run build:web` and the output directory is `dist`.
4. In **Project Settings → Environment Variables**, add all three `EXPO_PUBLIC_*` values from your local `.env` for **Production**, **Preview**, and **Development**. Do not commit `.env`.
5. Click **Deploy**. Every subsequent push to `main` deploys a new version automatically.
6. Copy the resulting `https://your-project.vercel.app` URL. In Supabase, set it as **Authentication → URL Configuration → Site URL** and add it to **Redirect URLs**. This lets confirmation emails return users to the live app.

To test the production bundle locally before deploying:

```bash
npm run build:web
npx serve dist
```

Expo documents that `npx expo export -p web` produces the static files in `dist`; Vercel serves that directory after its build command. See the [Expo web publishing guide](https://docs.expo.dev/guides/publishing-websites/) and [Vercel build configuration](https://vercel.com/docs/builds/configure-a-build).

## Share a native build

During development, use Expo Go and `npx expo start`. To create installable Android/iOS builds, create an Expo account and follow the [EAS Build guide](https://docs.expo.dev/build/introduction/). Check the current free-tier quota before publishing; Apple App Store and Google Play developer accounts are paid separately.

## Resume-ready project description

> Built CineMatch, a cross-platform React Native movie discovery app with TMDB search, trailers, dark mode, and personalized watchlists. Implemented secure email authentication and per-user cloud data persistence using Supabase Auth, Postgres, and Row Level Security; deployed a production web demo with Expo and Vercel.
