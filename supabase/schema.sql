-- VoiceType history storage
-- Run this in the Supabase SQL editor (or via the CLI) once per project.

create table if not exists public.history_entries (
  id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  original_text text not null,
  items jsonb not null default '[]'::jsonb,
  created_at bigint not null
);

create index if not exists history_entries_user_id_created_at_idx
  on public.history_entries (user_id, created_at desc);

-- Row Level Security: each user can only touch their own rows.
alter table public.history_entries enable row level security;

drop policy if exists "Users can read own history" on public.history_entries;
create policy "Users can read own history"
  on public.history_entries for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own history" on public.history_entries;
create policy "Users can insert own history"
  on public.history_entries for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own history" on public.history_entries;
create policy "Users can update own history"
  on public.history_entries for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own history" on public.history_entries;
create policy "Users can delete own history"
  on public.history_entries for delete
  using (auth.uid() = user_id);
