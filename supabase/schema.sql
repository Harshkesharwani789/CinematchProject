-- Run this once in Supabase: SQL Editor → New query → Run.
-- Each signed-in user can only read and modify their own saved movies.

create table if not exists public.watchlist_items (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  movie_id integer not null,
  movie jsonb not null,
  created_at timestamptz not null default now(),
  unique (user_id, movie_id)
);

alter table public.watchlist_items enable row level security;

create policy "Users can read their own watchlist"
  on public.watchlist_items for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can add to their own watchlist"
  on public.watchlist_items for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can remove their own watchlist"
  on public.watchlist_items for delete
  to authenticated
  using ((select auth.uid()) = user_id);

create index if not exists watchlist_items_user_created_idx
  on public.watchlist_items (user_id, created_at desc);
