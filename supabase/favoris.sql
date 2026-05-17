-- Table des favoris personnalisés par utilisateur
-- À exécuter dans Supabase > SQL Editor

create table if not exists public.user_favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_type text not null,
  item_key text not null,
  item_label text not null,
  created_at timestamptz not null default now(),

  constraint user_favorites_type_check check (
    item_type in ('drug', 'aide', 'protocol')
  ),

  constraint user_favorites_unique unique (user_id, item_type, item_key)
);

alter table public.user_favorites enable row level security;

drop policy if exists "Users can read their own favorites" on public.user_favorites;
create policy "Users can read their own favorites"
on public.user_favorites
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert their own favorites" on public.user_favorites;
create policy "Users can insert their own favorites"
on public.user_favorites
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own favorites" on public.user_favorites;
create policy "Users can delete their own favorites"
on public.user_favorites
for delete
to authenticated
using (auth.uid() = user_id);

create index if not exists user_favorites_user_id_idx
on public.user_favorites (user_id);

create index if not exists user_favorites_user_type_idx
on public.user_favorites (user_id, item_type);
